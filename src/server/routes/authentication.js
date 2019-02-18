const express = require('express');
const router = express.Router();

const Auth_ctrl = require('../route_controllers/authentication_controllers')

/*##########################################
##            Registration
##########################################*/

router.get('/register', Auth_ctrl.get_RegistrationPage);

router.post('/register', Auth_ctrl.post_RegistrationPage_formValidationRequirements, Auth_ctrl.post_RegistrationPage_createNewUser);

/*##########################################
##            Login
##########################################*/

router.get('/login', Auth_ctrl.get_LoginPage)

router.post('/login', Auth_ctrl.post_LoginPage)

/* 
To avoid this error: Error: req.flash() requires sessions
I moved flash from mounting on the app, to only mounting on this router, and I pass it into only the routes
which use it.  So, I do not pass it to the logout page.

Here's what the route controller contained:

req.session.destroy(
    function() {
      res.render('pages/logout', {
        env: process.env.NODE_ENV,
      })
    }
  )

An alternative solution though, is simply to regenerate a new session, rather than destroy the session. 

... Ok, I am going to use the regenerated session solution instead. This way I get to preserve the session data.
But ill leave this comment here as a note to self */
router.get('/logout', Auth_ctrl.get_Logout)

module.exports = router;
