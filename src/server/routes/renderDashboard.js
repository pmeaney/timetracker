const express = require('express');
const router = express.Router();
const RenderDashboard_ctrl = require('../route_controllers/RenderDashboard_controllers')
const FileUpload_ctrl = require('../route_controllers/FileUpload_controllers')

// For URL: url.com/dashboard/user/:user_id
router.get('/user/:user_id', RenderDashboard_ctrl.get_userDashboard_byUserID )

// For URL: url.com/dashboard/profile/photoUpload
router.post('/profile/photoUpload', FileUpload_ctrl.uploadedPhotoConfig, FileUpload_ctrl.post_profilePhotoUpload );

// For URL: url.com/dashboard/profile/resumeUpload
router.post('/profile/resumeUpload', FileUpload_ctrl.uploadedResumeConfig, FileUpload_ctrl.post_profileResumeUpload );

router.get('/admin_dash', RenderDashboard_ctrl.get_adminDashboard)

module.exports = router;
