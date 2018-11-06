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

router.post('/test_post', function (req, res, next) {
  var time = new Date()
  console.log('req.body @ time', req.body, time)
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


/* This route is for creating new timesheets, or upating an existing timesheet in order to add its ClockOut Time & Coordinates
  1. Look up the activity ID in timesheets.
    IF: if a timesheet for that activity DOES exists:
      (A timesheet exists for that particular activity ID, and so then we know it has a clocked in value.()
      Therefore, just check if if it has a clockOut value.
      IF: If it does: notify of error: already exists
      ELSE: If not: update the timesheet with clockout data (time, coordinates)
    ELSE:  if a timesheet for that activity DOES NOT exist:
      create a new timesheet, with clockin data
*/
router.post('/timesheets/createOrUpdate_timesheet', (req, res) => {

  /*  Note:
  THE FOLLOWING THINGS NEED TO BE PASSED IN: (they will be are of the req.body 
    (although activity_id passed as req.params))
  
  activity_id_For_Timesheets_Lookup, i.e. activity ID --> from the url's request lookup params (req.params)
  param_emp_id_asInt, --> i.e. employee id --> from user session: server has access
  timesheet_clockin, --> from form = time
  timesheet_clockin_lat, --> from form = coords
  timesheet_clockin_long --> from form = coords
  */

  
  console.log('req.body', req.body)
  
  // console.log('type of req.body.latitude', typeof req.body.latitude)
  // var edited_lat = req.body.latitude.toString().replace(/\d{10}$/, '')
  // console.log('edited_lat', edited_lat)

  // var edited_long = req.body.longitude.toString().replace(/\d{12}$/, '')
  // console.log('edited_long', edited_long)

  const activity_id_For_Timesheets_Lookup = parseInt(req.body.activity_id, 10)
  
  /* first, need to do validation of data: make sure it's ready to go into db
    integer, time, coordinates

    check if: 
    has session employee id 
    make sure the session employee matches activity data's employee id (activity__emp_id_assigned_to)

    if not, redirect them to login page
    if so, continue. (allow access b/c they're logged in-- their session has an employee id)
  */
    

  if (true) {
    return Promise.try(() => {
      return Api_fns.getTimesheet_by_activity_id(activity_id_For_Timesheets_Lookup)
    })
    .then((timesheets_per_activity_id) => {
      console.log('timesheets_per_activity_id', timesheets_per_activity_id)
    
      if (timesheets_per_activity_id.length < 1) {
        console.log('A timesheet for that activity_id does not exist in timesheets table')
        /* ########### Here, we CREATE a new row in timesheets ############# */
        // PRODUCTION FLAG: use this version of this constant in production:
        // const param_emp_id_asInt = parseInt(req.params.emp_id, 10); 
        const mock_employee_id = 2
        const employee_id_asInt = parseInt(mock_employee_id, 10); 

        return Promise.try(() => {
          // This will be an Api_fns call to an insert function,
          // into which we pass current time, coordinates from task clock-in form
          /* 
              Pass the appropriate parameters into this function:

              - activity_id, --> ready to go: activity_id_For_Timesheets_Lookup
              - emp_accepted_by, --> session's employee ID

              ( In production we would use the session's employee id...
              but instead we are mocking it, just so I dont have to login.
              const employee_id_asInt = parseInt(employee_id, 10); )

              - timesheet_clockin, --> from form = time
              - timesheet_clockin_lat, --> from form = coords
              - timesheet_clockin_long --> from form
              (all others are null-- set in DB call fn)
              */

              // FUNCTION TO USE:
          return Api_fns.createNewTimesheet_onClockin(
            // activity_id_For_Timesheets_Lookup,
            // employee_id_asInt,
            /* Just need to add these:
              timesheet_clockin, --> from form = time
              timesheet_clockin_lat, --> from form = coords
              timesheet_clockin_long --> from form
            */
              
            )
        })


      } else {
        console.log('A timesheet for that activity_id already exists')
         /* ########### Here, we UPDATE a new row in timesheets #############
        i.e. now we need to check if ClockOut data exists.  If so, then we do nothing and
        tell the user about an error
        If clockout data does not exist, then we update the row to insert clockout data
        
        */

        for (index in timesheets_per_activity_id) {
          const clockOut_value = timesheets_per_activity_id[index]['timesheet_clockout']
          if (typeof clockOut_value !== 'undefined' && clockOut_value !== '' && clockOut_value !== null) {
            console.log('clockout exists for that timesheet i.e. we do nothing but tell user: error, that timesheet already exists. Contact your mgr for assistance')
          } else {
            console.log('clockOut_value does not exist for that timesheet i.e. we update that timesheet row to add clockout time & coordinates')
          }
        }
         
      }

    })
  } else {
    // res.status(500).json({ error: 'sorry, we were unable to fulfill your request for timesheet data.' });
  }
  

});





/*
  A. Get all activities for this employee, where activities.activity_id does not match any timesheets.activity_id
    getActivities_whichHave_NoTimesheetsYet()

  B. Then, get any timesheets where clockout is null.
    Already created this route
  
  A is activities which have not yet been clocked into (and thereby turned into new timesheets)
  B is timesheets which have not been clocked out of yet. 

  NOTE: THIS RETURNS AN ARRAY OF TWO THINGS:
  0 - Activities
  1 - Timesheets.

  Timesheets which have not been clocked out should be shown on frontend first, so on frontend
  we'll access [1] (i.e. open timesheets) and its data to create task card(s).
      --> ACTUALLY, We'll use these task cards to look up the corresponding activity 
          and display its info
          alongside clockedIn info
  Then, we'll access [0] (i.e. activities) and its data to create task card(s).
  
  Note: if one of the items above is empty, then it's simply an empty array, but the position in object still exists.
  */

router.get('/activities/getPendingTasks/emp/:emp_id', (req, res) => {

  const param_emp_id_asInt = parseInt(req.params.emp_id, 10);

  if (true) {
    return Promise.try(() => {
      return Promise.all([
        Api_fns.getTimesheetsAndActivities_forWhich_Timesheets_haveNullClockOut_forEmployee(param_emp_id_asInt),
        Api_fns.getActivities_forWhich_timesheetsDoNotExist(param_emp_id_asInt)
      ])
      .then((result) => {
        // flatten the nested array which was returned  -- source: https://stackoverflow.com/questions/10865025/merge-flatten-an-array-of-arrays-in-javascript
        const array_task_list = [].concat.apply([], result);
        return array_task_list
        })
      .then((array_task_list) => {

          // Going to leave this Promise.map in here to show a more simplified version of retrieval, where I don't map thru and take project_id to look up more stuff as I do in the next Promise.map function
          // return Promise.map(array_task_list, (task) => {
          //   return Api_fns.getLocation_by_project_id(task.project_id)
          // }).then((resultOfLocationGet) => {
          //   // flatten the nested array which was returned  -- source: https://stackoverflow.com/questions/10865025/merge-flatten-an-array-of-arrays-in-javascript
          //   const mergedLocationList = [].concat.apply([], resultOfLocationGet);
          //   const mergedFinalData = merge(array_task_list, mergedLocationList)
          //   console.log('mergedFinalData', mergedFinalData)
          // })

        return Promise.map(array_task_list, (task) => {
          return Promise.all([
            Api_fns.getLocation_by_project_id(task.project_id),
            Api_fns.getProjectMgr_by_project_id(task.project_id),
            Api_fns.getActivityType_by_activity_code(task.activity_code)
          ]).spread(( locationbyProjectID, projectMgrByProjectID, ActivityType_by_activity_code) => {
            return { locationbyProjectID, projectMgrByProjectID, ActivityType_by_activity_code }
          })
        })
        .then((resultData) => {

          
          const combined_Project_Location_Data = resultData.map((currElement, index) => {  // activity set one
            return {
              // from location object
              location_name: currElement.locationbyProjectID[0].location_name,
              location_address: currElement.locationbyProjectID[0].location_address,
              location_city: currElement.locationbyProjectID[0].location_city,
              location_state: currElement.locationbyProjectID[0].location_state,
              location_zip: currElement.locationbyProjectID[0].location_zip,
              location_type: currElement.locationbyProjectID[0].location_type,
              // from project object
              projectMgr_firstName: currElement.projectMgrByProjectID[0].firstName,
              projectMgr_lastName: currElement.projectMgrByProjectID[0].lastName,
              projectMgr_phone: currElement.projectMgrByProjectID[0].phone,
              projectMgr_email: currElement.projectMgrByProjectID[0].email,
              // from activity type object
              activity_type: currElement.ActivityType_by_activity_code[0].activity_type
            }
          })

          const merged_Task_Project_Location_data = merge(array_task_list, combined_Project_Location_Data )
          // return merged_Task_Project_Location_data
          res.status(200).json(merged_Task_Project_Location_data);
       
    
        })
      })
    })
  }
    else {
      res.status(500).json({ error: 'sorry, we were unable to fulfill your request for activity data.' });
    }
});




/* With this route, first we get all activities for the particular employee ID with Api_fns.getActivitiesBy_employee_assigned_to().
    Now we have access to all the employee's activities.
    With that data, we do other lookups: for employee info, for activity type, location, and project data.
    Then, those other lookups mentioned above are stitched together as 'finalData'.
  Now that we have all the data we want (activity & 'finalData'), we merge
  the data sets into the real final set: perActivity_mergedData and send it to the requestor 
  
  Note: Rather than do lookups on tables of specific fields, I simply return the entire set of fields, and
  then below, when merging data, I use the return statements to specify the particular fields I want to send to the requestor*/
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
