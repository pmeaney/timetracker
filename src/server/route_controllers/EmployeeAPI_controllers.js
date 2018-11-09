const Promise = require('bluebird')
const merge = require('array-object-merge')

// knex 
const dotenv = require("dotenv").config({ path: '../.env' });
const environment = process.env.NODE_ENV
const knex_config = require('../knexfile');
const database = require('knex')(knex_config[environment]);

const Api_fns = require('../lib/api_fns')
const General_fns = require('../lib/general_fns')

// ********************************************************
// ***   TIMESHEETS
// ********************************************************

const post_create_timesheet_toClockIn = (req, res) => {

  console.log('req.body', req.body)
  console.log('req.session', req.session)
  console.log('req.session.mock_employee_id', req.session.mock_employee_id)

  // ! Getting a Mocked employee ID from session -- In production, change to actual employee ID from session

  const employee_id_asInt = parseInt(req.session.mock_employee_id, 10)
  const activity_id_For_Timesheets_Lookup = parseInt(req.body.activity_id, 10)
  const timesheet_clockin = req.body.timesheet_clockin
  const latitude = req.body.latitude
  const longitude = req.body.longitude

  // ! first, need to do validation of data: make sure it's ready to go into db
  // datetime validation:
  // check if (Object.prototype.toString.call(date) === '[object Date]')
  //   integer, time, coordinates

  //   check if: 
  //   has session employee id 
  //   make sure the session employee matches activity data's employee id (activity__emp_id_assigned_to)

  //   if not, redirect them to login page
  //   if so, continue. (allow access b/c they're logged in-- their session has an employee id)

  // ! For now, bypassing validation to prototype the route
  if (true) {
    return Promise.try(() => {
      return Api_fns.getTimesheet_by_activity_id(activity_id_For_Timesheets_Lookup)
    })
      .then((timesheets_per_activity_id) => {
        console.log('timesheets_per_activity_id', timesheets_per_activity_id)

        if (timesheets_per_activity_id.length < 1) {
          console.log('A timesheet for that activity_id does not exist in timesheets table')
          /* ########### Here, we CREATE a new row in timesheets ############# */
          // ! PRODUCTION FLAG: use something like this  version of this constant in production:
          // const param_emp_id_asInt = parseInt(req.params.emp_id, 10); 
          const mock_employee_id = 2
          const employee_id_asInt = parseInt(mock_employee_id, 10);

          return Promise.try(() => {

            // (employee_id_accepted_by, activity_id, clockin_time, latitude, longitude)
            return Api_fns.createNewTimesheet_onClockin(
              employee_id_asInt,
              activity_id_For_Timesheets_Lookup,
              timesheet_clockin,
              latitude,
              longitude
            )
          }).then((response) => {
            console.log('create timesheet response', response)
            // Todo: should flash a temporary message to user showing their new timesheet ID & clock in timestamp
          })

        } else {
          console.log('Error: Cannot create a new timesheet because a timesheet for that activity_id already exists.')
        }
      })
  } else {
    // res.status(500).json({ error: 'sorry, we were unable to fulfill your request for timesheet data.' });
  }
}

const put_update_timesheet_toClockOut = (req, res) => {

}

// ********************************************************
// ***   GET PENDING TASKS
// ********************************************************

const get_PendingTasks_by_EmployeeID = (req, res) => {

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

          return Promise.map(array_task_list, (task) => {
            return Promise.all([
              Api_fns.getLocation_by_project_id(task.project_id),
              Api_fns.getProjectMgr_by_project_id(task.project_id),
              Api_fns.getActivityType_by_activity_code_id(task.activity_code_id)
            ]).spread((locationbyProjectID, projectMgrByProjectID, ActivityType_by_activity_code_id) => {
              return { locationbyProjectID, projectMgrByProjectID, ActivityType_by_activity_code_id }
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
                  activity_type: currElement.ActivityType_by_activity_code_id[0].activity_type
                }
              })

              const merged_Task_Project_Location_data = merge(array_task_list, combined_Project_Location_Data)
              // return merged_Task_Project_Location_data
              res.status(200).json(merged_Task_Project_Location_data);

            })
        })
    })
  }
  else {
    res.status(500).json({ error: 'sorry, we were unable to fulfill your request for activity data.' });
  }
}



// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!  FOR DEMO PURPOSES ONLY -- This is an old, simplified version of 'get all tasks by employee ID' which did not take into account unClocked-out timesheets
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
/* With this route, first we get all activities for the particular employee ID with Api_fns.getActivitiesBy_employee_assigned_to().
    Now we have access to all the employee's activities.
    With that data, we do other lookups: for employee info, for activity type, location, and project data.
    Then, those other lookups mentioned above are stitched together as 'finalData'.
  Now that we have all the data we want (activity & 'finalData'), we merge
  the data sets into the real final set: perActivity_mergedData and send it to the requestor 
  
  Note: Rather than do lookups on tables of specific fields, I simply return the entire set of fields, and
  then below, when merging data, I use the return statements to specify the particular fields I want to send to the requestor*/

const get_activities_by_EmployeeID = (req, res) => {
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
          Api_fns.getActivityType_by_activity_code_id(activity['activity_code_id']), /* activity type info: such as 'painting', by code (i.e. activity_code_id is basically activity type's uniqueID)*/
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

}


// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!! FOR DEMO PURPOSES ONLY -- Super basic version of DB access (without promises)
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

const test_get_project_byID = (req, res) => {
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
}

const test_get_Timesheets_All = (req, res) => {

  database('timesheets').select()
    .then((item_set) => {
      res.status(200).json(item_set);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
}

const test_post = function (req, res, next) {
  var time = new Date()
  console.log('req.body @ time', req.body, time)
}


module.exports = {
  post_create_timesheet_toClockIn,
  put_update_timesheet_toClockOut,
  get_PendingTasks_by_EmployeeID,
  // get_activities_by_EmployeeID,
  // test_get_project_byID,
  // test_get_Timesheets_All,
  // test_post
}