const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
const User_fns = require('../lib/user_fns')
const Promise = require('bluebird')
const dotenv = require("dotenv").config({ path: '../.env' });
const multer = require('multer');


// need to make a config for pdf and .doc/.docx files
//MULTER CONFIG: to get file photos to temp server storage
const multerConfig_images = {

  storage: multer.diskStorage({
    //Setup where the user's file will go
    destination: function (req, file, next) {
      next(null, './public/profilePhoto-storage');
    },

    //Then give the file a unique name
    filename: function (req, file, next) {
      // can view file info: console.log(file);
      // including this: file.fieldname

      console.log('file.mimetype is ', file.mimetype);
      const fileType_extension = file.mimetype.split('/')[1];

      const fileName_prefix = 'profilePhoto_user_id__' + req.session.user_id;
      const fileName_saved = fileName_prefix + '.' + fileType_extension;
      console.log('fileName_saved is', fileName_saved);
      next(null, fileName_saved);
    }
  }),
  //A means of ensuring only images are uploaded. 
  fileFilter: function (req, file, next) {
    if (!file) {
      next();
    }
    const image = file.mimetype.startsWith('image/');
    if (image) {
      console.log('photo uploaded');
      next(null, true);
    } else {
      req.session.msg_bad_image_mimetype = 'Sorry, that file type is not supported for image uploads.'
      //TODO:  A better message response to user on failure.
      return next();
    }
  },
  // limits: { fileSize: 1000000, files: 1 },
};

const multerConfig_docs = {

  storage: multer.diskStorage({
    //Setup where the user's file will go
    destination: function (req, file, next) {
      next(null, './public/resume-storage');
    },

    //Then give the file a unique name
    filename: function (req, file, next) {
      // can view file info: console.log(file);
      // including this: file.fieldname

      console.log('file.mimetype is ', file.mimetype);
      const fileType_extension = file.mimetype.split('/')[1];

      const fileName_prefix = 'profilePhoto_user_id__' + req.session.user_id;
      const fileName_saved = fileName_prefix + '.' + fileType_extension;
      console.log('fileName_saved is', fileName_saved);
      next(null, fileName_saved);
    }
  }),
  //A means of ensuring only images are uploaded. 
  fileFilter: function (req, file, next) {
    if (!file) {
      next();
    }

    const fileMimetype = file.mimetype;
    const acceptableMimetypeArray = ['application/pdf', 'application/msword', ' application/vnd.openxmlformats-officedocument.wordprocessingml.document']

    if (acceptableMimetypeArray.includes(fileMimetype)) {
      console.log('photo uploaded');
      next(null, true);
    } else {
      console.log("file not supported"); // need to report this as an error to the user
      // TODO: redirect with flash
      // save message to session:
      req.session.msg_bad_doc_mimetype = 'Sorry, only .pdf, .doc, and .docx filetypes are supported'
      // req.flash('success', 'Sorry, a user with that email address already exists.  You may already have an account, or perhaps you mistyped your email address.')  
      return next();
    }
  },
  // limits: { fileSize: 1000000, files: 1 },
};


/* GET users listing. */

router.get('/register', function (req, res, next) {
  // res.send('you found users/register');
  res.render('pages/register', {
    data: {},
    errors: {},
    env: process.env.NODE_ENV
  })
});

router.get('/profile/:user_id', function (req, res, next) {

  // if there's no user session
  // if (!req.session.user_id) {
  //   console.log(' there is no req.session.user_id')
  //     // res.redirect('/inaccessible');
  // }

  // if the user session has the same user_id as the one they're trying to access

  console.log('req.session.user_id is ', req.session.user_id, 'type of is', typeof req.session.user_id)
  console.log('req.params.user_id is ', req.params.user_id, 'type of is', typeof req.params.user_id)

  const param_user_id_asInt = parseInt(req.params.user_id, 10);

  console.log('req.params.user_id after conversion is type of', typeof param_user_id_asInt)

  console.log('req.session is ', req.session)
  if (req.session.user_id === param_user_id_asInt) {

    /* on this page a place for them to create a profile.
  
    1. Do a profile look up.
     if there is no profile assoc. w/ user_id, makes this display in css
          'hey make a profile -- click this button'
  
     else, show the profile
  
    2. when the click the profile creation button, it accordions out into a form.
    then they click save, the profile data is created, and it re-directs them back to the page.
    have a place for photo upload as well
  
    3. If there is a profile, but no photos, ask them to upload a photo
  
    4.  If there is a profile but their status is 'has not applied yet', ask them to apply
      when they click the apply button, it shows them an application form and lets them upload their resume.
  
  
    4.  If there is a profile but their status is 'not hired', display a condolences message and ask them to apply for future <projects/campaigns/etc.>
  
     */

    // res.send('hello and welcome to your page, user #' + req.session.user_id + '.  Soon this will display a page asking you to create a profile.')

    // check user's creation date.  if it has been created within the last minute, send this:

    if (req.session.new_user === true) {
      req.flash('success', 'Thanks for registering.')
      delete req.session.new_user
      // Since they're a new user, instantiate their profile data as blank, but with some defaults:
      // profile_completion_status_contactInfo: incomplete
      // profile_completion_status_photo: incomplete
      // profile_completion_status_application: incomplete
      //######--> NEXT: nested outside of this if statement, check the status of these things
      //######--> FIGURE OUT: either send status through, or based on status provide data?
    }

    if (req.session.msg_bad_image_mimetype) {
      console.log(req.session.msg_bad_image_mimetype)
      req.flash('success', req.session.msg_bad_image_mimetype)
      delete req.session.msg_bad_image_mimetype;

    }
    if (req.session.msg_bad_doc_mimetype) {
      console.log(req.session.msg_bad_doc_mimetype)
      req.flash('success', req.session.msg_bad_doc_mimetype)
      delete req.session.msg_bad_doc_mimetype;
    }


    res.render('pages/user_profile', {
      data: { user_id: req.session.user_id, user_type: req.session.user_type, user_email: req.session.user_email },
      errors: {},
      env: process.env.NODE_ENV
    })

  } else {
    // session ID does not equal the one passed
    res.redirect('/inaccessible');
  }

})


// this will be posted to (in html action), from /register
router.post('/register', [

  check('email')
    .isEmail()
    .withMessage('Please ensure that your email address is properly formatted')
    .trim()
    .normalizeEmail(),
  check('password')
    .isLength({ min: 1 })
    .withMessage('Please provide a password.'),
  check('passwordconfirmation', 'Password confirmation field must have the same value as the password field')
    .exists()
    .custom((value, { req }) => value === req.body.password)
], (req, res, next) => {
  const errors = validationResult(req)
  const mappedErrors = errors.mapped()
  console.log('mappedErrors obj is:', mappedErrors)
  const mapErrors_noErrors = Object.keys(mappedErrors).length === 0
  console.log('is mappedErrors an empty object (b/c there are no errors)?', mapErrors_noErrors)



  validationResult(req);

  // If there are no registration form validation errors we can move on to:
  // A - looking up registration request's user info by email to see if this account exists already.
  // B - if user obj does not exist, we can safely create one
  // C - if it does exist, let the visitor know so they can correct their actions

  if (mapErrors_noErrors == true) {
    console.log('notice: there are no errors from validation result');


    // A - Try to get user by email.  If its possible, we know that one is taken, so cant use it
    return Promise.try(() => {
      return User_fns.getUserByEmail(req.body.email);
    }).then((user) => {
      // B - if user obj does not exist, we can safely create one
      // an empty user object appears as empty array: []
      if (user === undefined || user.length == 0) {
        // array empty or does not exist
        console.log('user obj is empty or does not exist');
        // safe to create user, b/c this one we searched for does not exist.
        // - B1. hash pw. 
        console.log('pw avail?', req.body.password);
        var password = req.body.password;

        return Promise.try(() => {
          // Here, we return the result of calling our own function. That return value is a Promise.
          console.log('check pw', password)
          return User_fns.hashPassword(password);
        }).then((hashed_password) => {

          console.log('check hashed pw', hashed_password)

          return Promise.try(() => {
            return User_fns.createUser(req.body.email, hashed_password)
          }).then(() => {

            // Here is where we set user info into the session and redirect.
            console.log('check request body', req.body)

            return Promise.try(() => {
              // Here, we return the result of calling our own function. That return value is a Promise.
              return User_fns.getUserByEmail(req.body.email);
            }).then((user) => {

              console.log('is there a user?', user)
              // putting user info into session
              req.session.user_id = user[0]['user_id']
              req.session.user_email = user[0]['user_email']
              req.session.user_type = user[0]['user_type']
              req.session.new_user = true
              req.session.mock_employee_id = 2
              // console.log(req.session)


              // here I should add user info to session and redirect them to the page a new user would see:
              // their user profile, where they can apply from
              // (in the future, i can redirect using user info this way, such as by reading a user's employment status or rank)
              // ... actually, lets read the status/rank/ID when we send that person over.

              // console.log('users info from db on newly created user', user)

              // req.flash('success', 'Thanks for registering.')  
              req.session.save(function (err) {
                // session updated
                console.log("Session Before Redirect: ", req.session);
                res.redirect('/users/profile/' + req.session.user_id)

              });




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
        req.flash('success', 'Sorry, a user with that email address already exists.  You may already have an account, or perhaps you mistyped your email address.')
        // flash some error message to the user.

        res.render('pages/register', {
          data: req.body, // { message, email }
          errors: errors.mapped(),
          env: process.env.NODE_ENV
        })
      }

    });

  } else {
    // This will push data to the template to make it highlight the error fields
    console.log('notice: there ARE errors from validation result');
    res.render('pages/register', {
      data: req.body, // { message, email }
      errors: errors.mapped(),
      env: process.env.NODE_ENV
    })
  }

  // The matchedData function returns the output of the sanitizers on our input.
  // i.e. this is the sanitized req.body  
  const data = matchedData(req)
  console.log('Sanitized:', data)

});


/* em_dash is employee dashboard
or perhaps it should be users?
i.e. all users have a dash.
if they're an employee, they have an enmployee dash (profile + employee functions such as timesheets & info & messaging from mgr).
if they're a user, they get redirected to their user dash (i.e. user profile).

previous notes:
note: eventually, it will be /em_dash/:emp_name 
and we'll set :emp_name on session login?
then, after login, we send them to /em_dash/:emp_name
(redirect them there, but only after we first do a database
lookup for the info that we'll provide into their dash
(stuff about the projects, tasks, & manager 
they're associated with)
*/


const uploadedPhoto = multer(multerConfig_images).single('_profilePhoto');
router.post('/profile/photoUpload', uploadedPhoto, function (req, res, next) {

  // return Promise.try(() => {
  //     return uploadProfilePhoto_filename(request.file.filename);
  // }).then(()=>{

  if (req.session.user_id) {
    res.redirect('/users/profile/' + req.session.user_id)
  } else {
    // if they try this without being logged in:
    res.redirect('/inaccessible')

  }
  // })

});

const uploadedResume = multer(multerConfig_docs).single('_profileResume');
router.post('/profile/resumeUpload', uploadedResume, function (req, res, next) {

  // return Promise.try(() => {
  //     return uploadProfilePhoto_filename(request.file.filename);
  // }).then(()=>{

  if (req.session.user_id) {
    res.redirect('/users/profile/' + req.session.user_id)
  } else {
    // if they try this without being logged in:
    res.redirect('/inaccessible')
  }
  // })

});




router.get('/login', function (req, res, next) {
  // ### NOTE:
  // ### Need to fix frontend of both pages/register.ejs and pages/login.ejs
  // ### -- both are pulling in jquery for employee pages.
  // ###    -> there needs to be a jquery file for just general pages/components (rather than employee or admin, etc.)

  // if user has a session already, redirect them to their profile page.

  // else, render the login page.

  if (req.session.bad_user_login_attempt) {
    req.flash('success', req.session.bad_user_login_attempt)
    delete req.session.bad_user_login_attempt;
  }

  if (req.session.good_user_login_attempt) {
    req.flash('success', req.session.good_user_login_attempt)
    delete req.session.good_user_login_attempt;
  }

  res.render('pages/login',
    {
      errors: '',
      env: process.env.NODE_ENV
    });

})

router.post('/login', function (req, res, next) {
  return Promise.try(() => {
    return User_fns.checkPasswordForEmail(req.body.password, req.body.email)
  }).then((result) => {
    console.log('[Msg from users.js API] result of comparison is', result)
    if (result === true) {
      req.session.good_user_login_attempt = 'Hey there.  Welcome.'
      res.redirect('/users/profile/' + req.session.user_id)
    } else {
      req.session.bad_user_login_attempt = 'Sorry, your login credentials were incorrect. Please try again.'
      res.redirect('/users/login')
    }

  })

})

module.exports = router;
