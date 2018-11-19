// const dotenv = require("dotenv").config({ path: '../.env' });

const get_adminDashboard = function (req, res, next) {
  res.render('pages/adminDashboard')
  // , {
  //   errors: {},
  //   env: process.env.NODE_ENV
  // })

}

const get_userDashboard_byUserID = function (req, res, next) {

  // if there's no user session
  // if (!req.session.user_id) {
  //   console.log(' there is no req.session.user_id')
  //      res.redirect('/inaccessible');
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
      req.flash('infoMessage', 'Thanks for registering.')
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
      req.flash('infoMessage', req.session.msg_bad_image_mimetype)
      delete req.session.msg_bad_image_mimetype;

    }
    if (req.session.msg_bad_doc_mimetype) {
      console.log(req.session.msg_bad_doc_mimetype)
      req.flash('infoMessage', req.session.msg_bad_doc_mimetype)
      delete req.session.msg_bad_doc_mimetype;
    }


    res.render('pages/employeeDashboard', {
      data: { user_id: req.session.user_id, user_type: req.session.user_type, user_email: req.session.user_email },
      errors: {}
      // ,
      // env: process.env.NODE_ENV
    })

  } else {
    // session ID does not equal the one passed
    res.redirect('/inaccessible');
  }

}

module.exports = {
  get_userDashboard_byUserID,
  get_adminDashboard
}