const Promise = require('bluebird')
const merge = require('array-object-merge')

// knex 
const dotenv = require("dotenv").config({ path: '../.env' });
const environment = process.env.NODE_ENV
const knex_config = require('../knexfile');
const database = require('knex')(knex_config[environment]);

const Api_fns = require('../lib/api_fns')

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
  // if (Object.prototype.toString.call(timesheet_clockin) === '[object Date]') {
  //   console.log('timesheet_clockin is a date object' )
  // } else {
  //   console.log('timesheet_clockin is NOTa date object')
  // }
  
  console.log('what type of object is date', Object.prototype.toString.call(timesheet_clockin))

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
            console.log('Successfully created a timesheet ', response)
            res.status(200).json(response);
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

  console.log('req.body is', req.body)
  
  if (true) {
    return Promise.try(() => {
      // (activity_id, clockout_time, latitude, longitude)
      return Api_fns.updateExistingTimesheet_onClockout(req.body.activity_id, req.body.timesheet_clockout, req.body.latitude, req.body.longitude)
    })
    .then((response) => {
      console.log('successfully updated this object ', response)
      res.status(200).json(response);
    })

  } else {
    res.status(500).json({ error: 'sorry, we were unable to fulfill your request for activity data.' });
  }
  
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