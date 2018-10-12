var express = require('express');
var router = express.Router();
const Promise = require('bluebird')
const merge = require('array-object-merge')

// knex 
const dotenv = require("dotenv").config({ path: '../.env' });
const environment = process.env.NODE_ENV
const knex_config = require('../knexfile');
const database = require('knex')(knex_config[environment]);

const Api_fns = require('../lib/api_fns')
const General_fns = require('../lib/general_fns')

/*
  #########   NEED TO FIX:
    1. All uses of functions which themselves are Promise.try()... need to be run within a Promiste.try()
      --> such as any knex table data lookup functions

      
*/
router.get('/', function (req, res, next) {
  res.send('this is the regular /emp_api route');
});


// ############ PROJECTS ##############
// Get ALL PROJECTS
// router.get('/projects', (req, res) => {

//  // this needs Promse.try() of a lookup function-- a 'Lookup all' function, passing in the table name.
//   database('projects').select()
//     .then((projects) => {
//       res.status(200).json(projects);
//     })
//     .catch((error) => {
//       res.status(500).json({ error });
//     });

// });

// // Get 1 PROJECT by ID
// /* What is the use case for this? */

// // this needs Promse.try() of a lookup function-- a 'Lookup by id' function, passing in the table and ID.
router.get('/projects/:id', (req, res) => {

  database('projects').where('project_id', req.params.id).select()
    .then(project => {
      if (project.length) {
        // if it exists, send: 200 Status, and JSON data
        res.status(200).json(project)
      } else {
        res.status(404).json({
          error: `Could not find project with project_id ${req.params.id}`
        })
      }
    })
    .catch(error => {
      res.status(500).json({ error })
    })
})

// ############ TIMESHEETS #############

router.get('/timesheets', (req, res) => {

  database('timesheets').select()
    .then((item_set) => {
      res.status(200).json(item_set);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
});


router.get('/activities/emp/:emp_id', (req, res) => {
    // Previously I was passing in the mocked employee ID of 2, from the session (set on login)
  const param_emp_id_asInt = parseInt(req.params.emp_id, 10);
  // if (req.session.mock_employee_id === param_emp_id_asInt) {  // <-- Previously I was passing in the mocked employee ID of 2, from the session (set on login)
  if (true) {
    return Promise.try(() => {
      // return Api_fns.getActivitiesBy_employee_assigned_to(req.session.mock_employee_id); // <-- Previously I was passing in the mocked employee ID of 2, from the session (set on login)
      return Api_fns.getActivitiesBy_employee_assigned_to(req.params.emp_id);
    }).then((activities) => {
      return Promise.map(activities, (activity) => {
        return Promise.all([
          Api_fns.getEmployee_by_id(req.params.emp_id), /*  emp completing the task */
          Api_fns.getEmployee_by_id(activity['emp_assigned_by']), /*  emp who assigned the task (activity mgr -- above them is project mgr.  We can always add that on later (involved small DB model update) but let's focus on basic activity info for now) */
          Api_fns.getActivityType_by_activity_code(activity['activity_code']), /* activity type info: such as 'painting', by code (i.e. activity_code is basically activity type's uniqueID)*/
          Api_fns.getLocation_by_project_id(activity['project_id']), /* work-activity location info by for employee (activity's project id) */
          Api_fns.getProjectMgr_by_project_id(activity['project_id'])
        ]).spread((employee_assignedTo_activity, employee_whoIs_activityMgr, activity_type, location, employee_WhoIs_projectMgr) => {
          return { employee_assignedTo_activity, employee_whoIs_activityMgr, activity_type, location, employee_WhoIs_projectMgr }
        });
      }).then((finalData) => {

        var perActivity_mainData = activities.map((currElement, index) => {  // activity set one

          var activity_readable_date_begin = General_fns.get_readable_date(currElement.activity_datetime_begin)
          var activity_readable_date_end = General_fns.get_readable_date(currElement.activity_datetime_end)
          var activity_readable_time_begin = General_fns.get_readable_time(currElement.activity_datetime_begin)
          var activity_readable_time_end = General_fns.get_readable_time(currElement.activity_datetime_end)
          var activity_notes_summary = General_fns.summarize_string(currElement.activity_notes)

          return {
            activity__activity_id: currElement.activity_id,
            activity__emp_id_assigned_to: currElement.emp_assigned_to,
            activity__emp_id_assigned_by: currElement.emp_assigned_by,
            activity__project_id: currElement.project_id,
            activity__activity_notes: currElement.activity_notes,
            activity__activity_datetime_begin: currElement.activity_datetime_begin,
            activity__activity_datetime_end: currElement.activity_datetime_end,
            // processed items
            activity__activity_notes_summary: activity_notes_summary,
            activity__activity_readable_date_begin: activity_readable_date_begin,
            activity__activity_readable_date_end: activity_readable_date_end,
            activity__activity_readable_time_begin: activity_readable_time_begin,
            activity__activity_readable_time_end: activity_readable_time_end,
          }
        })

        var perActivity_additionalData = finalData.map((currElement, index) => { // activity set two

          return {
            activity__activity_type: currElement.activity_type[0]['activity_type'],

            activity__location_id: currElement.location[0]['location_id'],
            activity__location_type: currElement.location[0]['location_type'],
            activity__location_address: currElement.location[0]['location_address'],
            activity__location_city: currElement.location[0]['location_city'],
            activity__location_state: currElement.location[0]['location_state'],
            activity__location_zip: currElement.location[0]['location_zip'],

            activity__employee_firstName: currElement.employee_assignedTo_activity[0]['firstName'],
            activity__employee_lastName: currElement.employee_assignedTo_activity[0]['lastName'],
            activity__mgr_firstName: currElement.employee_whoIs_activityMgr[0]['firstName'],
            activity__mgr_lastName: currElement.employee_whoIs_activityMgr[0]['lastName'],
            activity__projMgr_firstName: currElement.employee_WhoIs_projectMgr[0]['firstName'],
            activity__projMgr_lastName: currElement.employee_WhoIs_projectMgr[0]['lastName'],
          }

        })

        const perActivity_mergedData = merge(perActivity_mainData, perActivity_additionalData) // combined activity sets

        console.log('perActivity_mergedData', perActivity_mergedData)

        return { perActivity_mergedData }

      }).then((perActivity_mergedData) => {
        res.status(200).json(perActivity_mergedData);
      })
    })
  }
  else {
    res.status(500).json({ error: 'sorry, we were unable to fulfill your request for activity data.' });
  }

})


module.exports = router;
