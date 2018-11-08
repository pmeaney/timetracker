var express = require('express');
var router = express.Router();
var AdminAPI_ctrl = require('../route_controllers/AdminAPI_controllers')

router.get('/', function (req, res, next) {
  res.send('this is the regular /admin_api route');
});

router.get('/timesheets', AdminAPI_ctrl.get_Timesheets_All);

router.get('/activities/all', AdminAPI_ctrl.get_Activities_All)

module.exports = router;
