var express = require('express');
var router = express.Router();
const Promise = require('bluebird')
var WebpageContent_ctrl = require('../route_controllers/RegularWebpageContent_controllers')

var Api_fns = require('./../lib/api_fns')

/* GET home page. */
router.get('/', WebpageContent_ctrl.get_indexPage)

// this was just to test & try to catch 500 error
// router.get('/make_error_500', function (req, res, next) {
//   res.status(500).send()
// })

router.get('/timetracker', WebpageContent_ctrl.get_timetrackerLandingPage)

router.get('/stats_data/assault', WebpageContent_ctrl.local_data_statsProject)
router.get('/stats_data_remote/assault', WebpageContent_ctrl.remote_data_statsProject)

/* 
manual url tests
 */
router.get('/test_getEmployees_All', function(req, res, next) {
  return Promise.try(() => {
    return Api_fns.getEmployees_All()
  }).then((result) => {
    res.json(result)
  })
})

router.get('/test_getUsers_All', function (req, res, next) {
  return Promise.try(() => {
    return Api_fns.getUsers_All()
  }).then((result) => {
    res.json(result)
  })
})

router.get('/test_getUserProfiles_All', function (req, res, next) {
  return Promise.try(() => {
    return Api_fns.getUserProfiles_All()
  }).then((result) => {
    res.json(result)
  })
})


router.get('/test_EmpByID/:emp_id', function (req, res, next) {
  const emp_id = req.params.emp_id
  return Promise.try(() => {
    return Api_fns.getEmployee_by_id(emp_id)
  }).then((result) => {
    res.json(result)
  })
})

router.get('/test_ProjMgrBy_ProjID/:proj_id', function (req, res, next) {
  const proj_id = req.params.proj_id
  return Promise.try(() => {
    return Api_fns.getProjectMgr_by_project_id(proj_id)
  }).then((result) => {
    res.json(result)
  })
})



router.get('/test__get_Locations_byProjID_byEmployeeID/:emp_id', function (req, res, next) {
  const emp_id = req.params.emp_id
  return Promise.try(() => {
    return Api_fns.get_Locations_byProjID_byEmployeeID(emp_id)
  }).then((result) => {
    res.json(result)
  })
})

router.get('/get_Locations_byProjID_forAllProjects', function (req, res, next) {
  return Promise.try(() => {
    return Api_fns.get_Locations_byProjID_forAllProjects()
  }).then((result) => {
    res.json(result)
  })
})


router.get('/hireUser_toEmployee/:user_id', function (req, res, next) {
   const user_id = req.params.user_id
  return Promise.try(() => {
    return Api_fns.hireUser_toEmployee(user_id)
  }).then((result) => {
    res.json(result)
  })
})


// router.get('/eventstream', (req, res, next) => {
//   // Sends out messages as they're emitted.  Is subscribed to.
//   res.set({
//     'Content-Type': 'text/event-stream',
//     'Cache-Control': 'no-cache',
//     'Connection': 'keep-alive'
//   });

//   myEmitter.on('message', data => {
//     res.write(`event: message\n`);
//     res.write(`data: ${JSON.stringify(data)}\n\n`);
//     // res.status(200).json(data) ;
//   });

// });

// router.get('/test_time', function (req, res, next) {
//   // Emits a message
//   myEmitter.emit('message', {
//     title: 'New message!',
//     timestamp: new Date()
//   });
  
//   res.render('testing/luxon/basicLuxon');
// });

// router.get('/test_sse', function (req, res, next) {

//   myEmitter.emit('message', {
//       title: 'New message!',
//       message,
//       timestamp: new Date()
//     });

//   // res.render('testing/test_sse');
// });

module.exports = router;