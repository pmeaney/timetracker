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

// router.post('/logout', Auth_ctrl.post_Logout)
router.get('/logout', Auth_ctrl.get_Logout)

module.exports = router;
