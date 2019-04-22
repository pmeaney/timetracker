// const dotenv = require("dotenv").config({ path: '../.env' });

const get_demonstrationDashboard = (req, res) => {
  req.session.mock_employee_id = 2
  req.session.user_type = 'employee'
  req.session.is_authorized = true

  res.render('pages/employeeDashboard', {
      // data: { user_id: req.session.user_id, user_type: req.session.user_type, user_email: req.session.user_email },
      errors: {},
      env: process.env.NODE_ENV,
      gmaps_api_key: process.env.GMAPS_API.toString(),
      csrfToken: req.csrfToken(),
      user_type: req.session.user_type
  })
}

const get_adminDashboard = (req, res) => {
  res.render('pages/adminDashboard', {
    errors: {},
    csrfToken: req.csrfToken(),
    user_type: req.session.user_type,
    gmaps_api_key: process.env.GMAPS_API.toString(),
  }) 
}

const get_userDashboard_byUserID = (req, res) =>  {

  // if there's no user session
  // if (!req.session.user_id) {
  //   console.log(' there is no req.session.user_id')
  //      res.redirect('/inaccessible');
  // }

  // if the user session has the same user_id as the one they're trying to access
  
  const param_user_id_asInt = parseInt(req.params.user_id, 10);
  console.log('for render dashboard, param_user_id_asInt is', param_user_id_asInt)
  // console.log('req.body is', req.body)
  console.log('req.session is ', req.session)
  console.log('Running condition check (True = render dashboard, False = fail): req.session.is_authorized === true && req.session.user_id === param_user_id_asInt, is true?', req.session.is_authorized === true && req.session.user_id === param_user_id_asInt)

  // Check that the session's user is the same as the user_id we were directed here with from login
  if (req.session.is_authorized === true && req.session.user_id === param_user_id_asInt) {

    /* on this page a place for them to create a profile.
  
    1. Do a profile look up.
     if there is no profile assoc. w/ user_id, makes this display in css
          'hey make a profile -- click this button'
          -- Show a 'general info' viewport, relevant to their employment status
          (i.e. non-employee? tell them about job opps)
  
     else, show the profile
       -- Show a 'general info' viewport, relevant to their employment status
          (i.e. is employee? tell them about recent company news and things relevant to them/their team)

    2. when the click the profile creation button, it accordions out into a form.
    then they click save, the profile data is created, and it re-directs them back to the page.
    have a place for photo upload as well
  
    3. If there is a profile, but no photos, ask them to upload a photo
  
    4.  If there is a profile but their status is 'has not applied yet', ask them to apply
      when they click the apply button, it shows them an application form and lets them upload their resume.
  
    4.  If there is a profile but their status is 'not hired', display a condolences message and ask them to apply for future <projects/campaigns/etc.>
  
     */

    // res.send('hello and welcome to your page, user #' + req.session.user_id + '.  Soon this will display a page asking you to create a profile.')

    // check user's creation date.  if it has been created within the last minute, send a new user infobox of various info

    res.render('pages/employeeDashboard', {
      // data: { user_id: req.session.user_id, user_type: req.session.user_type, user_email: req.session.user_email },
      errors: {},
      env: process.env.NODE_ENV,
      gmaps_api_key: process.env.GMAPS_API.toString(),
      csrfToken: req.csrfToken(),
      user_type: req.session.user_type
       })

  } else {
    // session ID does not equal the one passed
    console.log('rendering else-- cannot route to dashboard user page')
    req.flash('infoMessage', 'It appears you may need to login.')
    res.redirect('/inaccessible');
  }

}

module.exports = {
  get_demonstrationDashboard,
  get_userDashboard_byUserID,
  get_adminDashboard
}