const express = require('express');
const router = express.Router();
const RenderDashboard_ctrl = require('../route_controllers/RenderDashboard_controllers')
const FileUpload_ctrl = require('../route_controllers/FileUpload_controllers')

// For URL: url.com/dashboard/user/:user_id
// Eventually, will create separate routes so that different employee types 
// are routed to different dashboards 
router.get('/user/:user_id', RenderDashboard_ctrl.get_userDashboard_byUserID )

router.get('/admin_dash', RenderDashboard_ctrl.get_adminDashboard)


// * These are for Multer file uploads
// For URL: url.com/dashboard/profile/photoUpload
router.post('/profile/photoUpload', FileUpload_ctrl.uploadedPhotoConfig, FileUpload_ctrl.post_profilePhotoUpload );

// For URL: url.com/dashboard/profile/resumeUpload
router.post('/profile/resumeUpload', FileUpload_ctrl.uploadedResumeConfig, FileUpload_ctrl.post_profileResumeUpload );


module.exports = router;
