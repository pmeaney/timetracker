var express = require('express');
var router = express.Router();
var AdminAPI_ctrl = require('../route_controllers/AdminAPI_controllers')

router.get('/', function (req, res, next) {
  res.send('this is the regular /admin_api route');
});

router.get('/getDataForTable/:tableName', AdminAPI_ctrl.get_DataForTable);

router.get('/get_ProjectData_Readable', AdminAPI_ctrl.get_Projects_WithLocation_and_ProjectMgr);
router.post('/projects/create', AdminAPI_ctrl.post_createNewProject);

router.put('/updateDataForTable', AdminAPI_ctrl.put_DataForTable_update);

router.get('/timesheets', AdminAPI_ctrl.get_Timesheets_All);

// router.get('/activities', AdminAPI_ctrl.get_Activities_All)

router.get('/employees', AdminAPI_ctrl.get_Employees_All)

router.get('/locationsByProjects', AdminAPI_ctrl.get_locationsByProjects_All)

router.get('/activity_codes', AdminAPI_ctrl.get_activityCodes_All)

router.get('/eventstream', AdminAPI_ctrl.AdminEventStream)

module.exports = router;
