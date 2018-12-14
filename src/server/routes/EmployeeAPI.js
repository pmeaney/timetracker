var express = require('express');
var router = express.Router();
var EmployeeAPI_ctrl = require('../route_controllers/EmployeeAPI_controllers')

/*
  #########   NEED TO FIX:
    1. All uses of functions which themselves are Promise.try()... need to be run within a Promiste.try()
      --> such as any knex table data lookup functions

*/
router.get('/', function (req, res, next) {
  res.send('this is the regular /emp_api route');
});

// router.post('/test_post', EmployeeAPI_ctrl.test_post);

router.post('/timesheets/create', EmployeeAPI_ctrl.post_create_timesheet_toClockIn);
router.post('/activities/create/selfAssignedTask', EmployeeAPI_ctrl.post_create_timesheet_toClockIn);

router.put('/timesheets/update', EmployeeAPI_ctrl.put_update_timesheet_toClockOut);

router.get('/activities/getPendingTasks/', EmployeeAPI_ctrl.get_PendingTasks_by_EmployeeID );
router.get('/activities/getRecentWorkInfo/', EmployeeAPI_ctrl.get_RecentWorkActivityInfo_ByEmpID );
router.get('/activity_codes/', EmployeeAPI_ctrl.get_ListOf_activity_codes );

router.post('/profile/uploadContactInfo', EmployeeAPI_ctrl.post_Profile_ContactInfo_by_EmployeeID);

module.exports = router;
