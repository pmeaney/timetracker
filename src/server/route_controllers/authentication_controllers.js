const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
const Promise = require('bluebird')

const Auth_fns = require('../lib/api_fns_authentication')

// knex 
const dotenv = require("dotenv").config({ path: '../.env' });
const environment = process.env.NODE_ENV
const knex_config = require('../knexfile');
const database = require('knex')(knex_config[environment]);


// ****************************************
// ***            Registration
// ****************************************

const get_RegistrationPage = function (req, res) {
  console.log('req.body is:', req.body)
  console.log('req.session is:', req.session)
  res.render('pages/register', {
    data: {},
    errors: {},
    env: process.env.NODE_ENV,
    csrfToken: req.csrfToken()
  })
}

const post_RegistrationPage_formValidationRequirements = [
  check('email')
    .isEmail()
    .withMessage('Please ensure that your email address is properly formatted')
    .trim()
    .normalizeEmail(),
    check('password')
      .isLength({ min: 4 })
      .withMessage('Please provide a password of at least four characters.'),
    check('passwordconfirmation', 'Password confirmation field must have the same value as the password field')
      .exists()
      .custom((value, { req }) => value === req.body.password)
  ]

const post_RegistrationPage_createNewUser = (req, res) => {
  console.log('req.session is:', req.session)
  console.log('req.body is:', req.body)

  const errors = validationResult(req)
  const mappedErrors = errors.mapped()
  console.log('mappedErrors obj is:', mappedErrors)
  const mapErrors_noErrors = Object.keys(mappedErrors).length === 0
  console.log('is mappedErrors an empty object (b/c there are no errors)?', mapErrors_noErrors)

  console.log('req body is', req.body)


  validationResult(req);

  // If there are no registration form validation errors we can move on to:
  // A - looking up registration request's user info by email to see if this account exists already.
  // B - if user obj does not exist, we can safely create one
  // C - if it does exist, let the visitor know so they can correct their actions
  if (mapErrors_noErrors == true) {
    console.log('post_RegistrationPage_createNewUser: there are no errors from validation result');
    // A - Try to get user by email.  If its possible, we know that one is taken, so cant use it
    return Promise.try(() => {
      return Auth_fns.getUserByEmail(req.body.email);
    }).then((user) => {
      // B - if user obj does not exist, we can safely create one
      // an empty user object appears as empty array: []
      if (user === undefined || user.length == 0) {
        // array empty or does not exist
        console.log('post_RegistrationPage_createNewUser: user obj is empty or does not exist');
        // safe to create user, b/c this one we searched for does not exist.
        // - B1. hash pw. 
        console.log('post_RegistrationPage_createNewUser: pw avail?', req.body.password);
        var password = req.body.password;

        return Promise.try(() => {
          // Here, we return the result of calling our own function. That return value is a Promise.
          console.log('post_RegistrationPage_createNewUser: check pw', password)
          return Auth_fns.hashPassword(password);
        }).then((hashed_password) => {

          console.log('post_RegistrationPage_createNewUser: check hashed pw', hashed_password)

          return Promise.try(() => {
            return Auth_fns.createUser(req.body.email, hashed_password)
          }).then(() => {

            // Here is where we set user info into the session and redirect.
            console.log('post_RegistrationPage_createNewUser: check request body', req.body)

            return Promise.try(() => {
              console.log('post_RegistrationPage_createNewUser: Auth_fns.getUserByEmail on', req.body.email)
              return Auth_fns.getUserByEmail(req.body.email);
            }).then((user) => {

              console.log('post_RegistrationPage_createNewUser: is there a user?', user)
              // putting user info into session
              req.session.user_id = user[0]['user_id']
              req.session.user_email = user[0]['user_email']
              req.session.user_type = user[0]['user_type']
              req.session.new_user = true
              req.session.mock_employee_id = 2
              req.session.is_authorized = true
              // console.log(req.session)

              // here I should add user info to session and redirect them to the page a new user would see:
              // their user profile, where they can apply from
              // (in the future, i can redirect using user info this way, such as by reading a user's employment status or rank)
              // ... actually, lets read the status/rank/ID when we send that person over.

              // console.log('users info from db on newly created user', user)

              // req.flash('infoMessage', 'Thanks for registering.')  
              req.session.save(function (err) {
                // session updated
                console.log('post_RegistrationPage_createNewUser: Session info updated: + (error if exists)', req.session, err)
                res.redirect('/dashboard/user/' + req.session.user_id)
              })
            })
          })
        })

        // - B2. insert user into users table.
        // passing in the request objects from form, and hashed_password
        // should even pass in some of their info, such as username, so its clear that it worked
        // - B3. flash confirmation
      } else {
        console.log('User object exists already, so we will notify visitor', user)
        // the user object based on the email already exists
        req.flash('infoMessage', 'Sorry, a user with that email address already exists.  You may already have an account, or perhaps you mistyped your email address.')
        // flash some error message to the user.
        res.render('pages/register', {
          data: req.body, // { message, email }
          errors: errors.mapped(),
          env: process.env.NODE_ENV,
          csrfToken: req.csrfToken(),
        })
      }
    });
  } else {
    // This will push data to the template to make it highlight the error fields
    console.log('notice: there ARE errors from validation result');
    res.render('pages/register', {
      data: req.body, // { message, email }
      errors: errors.mapped(),
      env: process.env.NODE_ENV,
      csrfToken: req.csrfToken(),
    })
  }
  // The matchedData function returns the output of the sanitizers on our input.
  // i.e. this is the sanitized req.body  
  const data = matchedData(req)
  console.log('Sanitized:', data)
}

// ****************************************
// ***            Login
// ****************************************

const get_LoginPage = function (req, res) {

  console.log('req.session is:', req.session)
  console.log('req.body is:', req.body)
  console.log('req.csrfToken() is', req.csrfToken())

  // if user has a session already, redirect them to their profile page.
  // else, render the login page.

  // here, we're just rendering the login page, with a flash message if there has been a validation error in login
  if (req.session.bad_user_login_attempt) {
    req.flash('infoMessage', req.session.bad_user_login_attempt)
    delete req.session.bad_user_login_attempt;
  }

  res.render('pages/login',
    {
      // errors: '',
      env: process.env.NODE_ENV,
      csrfToken: req.csrfToken(),
    });

}

const post_LoginPage = function (req, res) {
  
  console.log('req.body is:', req.body)
  console.log('req.session is:', req.session)
  return Promise.try(() => {
    return Auth_fns.checkPasswordForEmail(req.body.password, req.body.email)
  }).then((response) => {
    console.log('[Response received from authentication_fns.js API] -- result of comparison is', response)

    if (response.is_authorized === true) {
    //   Next step: Check what type of user the user is, on the result data.
    //   Control with appropriate conditional statement: Based on whether its employee, manager, or admin, 
    //   redirect to the appropriate dashboard 
      req.session.user_id = response.user_id

      // ! Mocking the employee ID
      req.session.mock_employee_id = 2
      req.session.user_type = response.user_type
      req.session.is_authorized = response.is_authorized
      req.session.save(function (err) {
        console.log('post_LoginPage: Session info updated:: + (error if exists)', req.session, err)
        res.redirect('/dashboard/user/' + req.session.user_id)
      })
      // res.redirect('/dashboard/user/' + req.session.user_id, { csrfToken: req.csrfToken()})
      
    } else {
      // req.session.bad_user_login_attempt = 'Sorry, your login credentials were incorrect. Please try again.'
      req.flash('infoMessage', 'Sorry, your login credentials were incorrect. Please try again.')  
      // console.log('session info updated:: + (error if exists)', req.session, err)
      res.redirect('/auth/login')
      
    }
  })
}

const get_Logout = function (req, res) {

  if (req.session.is_authorized === true) {
  // If they're logged in,
  //    regenerate the session to show that they've been logged out
  //    then send them to the logout page.
  // const session_user_type = req.session.user_type
  // ! Mocking the employee ID
  // const session_mock_employee_id = req.session.mock_employee_id
  // const session_mock_user_id = req.session.user_id

  req.session.destroy()
  
  req.session.regenerate(
    function () {
      req.session.is_authorized = false
      req.session.has_loggedOut = true
      // req.session.user_type = session_user_type
      // req.session.mock_employee_id = session_mock_employee_id
      // req.session.user_id = session_mock_user_id

      console.log('req.session after logout is', req.session)

      req.flash('infoMessage', 'Thanks for your visit.')  
      res.render('pages/logout', {
        env: process.env.NODE_ENV,
      })

    }
  )
  } else {
    // Otherwise, they are not logged in... but apparently are trying to 
    // visit the logout page... so we'll just send them to it.
    res.render('pages/logout', {
      env: process.env.NODE_ENV,
    })
  }

  // req.logout()
  // res.redirect('pages/logout')
  // res.render('pages/logout', {
  //   env: process.env.NODE_ENV,
  // })
}

module.exports = {
  get_RegistrationPage,
  post_RegistrationPage_formValidationRequirements,
  post_RegistrationPage_createNewUser,
  get_LoginPage,
  post_LoginPage,
  get_Logout
};