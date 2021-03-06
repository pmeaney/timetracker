const Promise = require('bluebird')
const merge = require('array-object-merge')

// knex 
const dotenv = require("dotenv").config({ path: '../.env' });
const environment = process.env.NODE_ENV
const knex_config = require('../knexfile');
const database = require('knex')(knex_config[environment]);

const Api_fns = require('../lib/api_fns')

/*//=>###########################################
//=>###   Event emitters 
//=>##########################################*/

/*//=>###########################################
//=>###   Employee view, listening to Employee Event emitter ( EmployeeAPI_EventsEmitter )
//=>##########################################*/

//=> SECTION FOR: Instantiation.  This instantiates event emitter, which is imported to AdminAPI_controller.js so that it can listen for specific employee actions (Such as clockin/clockout to update admin view)
const EventEmitter = require('events');
class EmployeeAPI_EventEmitterClass extends EventEmitter {}
const EmployeeAPI_EventsEmitter = new EmployeeAPI_EventEmitterClass();

//=> SECTION FOR: Employee Viewport -- NewActivity Creation listener. (Listens for when employee creates new self assigned activity)
//=> This eventstream is listened to, on frontend, (at: src/client/reactComponents/employee_dashboard/Viewport_TaskList.js )


/*//=>###########################################
//=>###     Event stream -- Emitting to Client
//=>##########################################*/

const EmployeeEventStream = (req, res) => {

  // res.status(200).set({
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  EmployeeAPI_EventsEmitter.on('message', data => {
    console.log('[Emitting event: EmployeeEventStream] - Final data received--> data to write to stream is ', data)
    
    if (data.title === 'newActivity') {
      console.log('newActivity writing newActivity data to stream now')
      // The string-type data to send to admin eventstream:
      res.write(`event: message\n`);
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    }
  });
}

// ********************************************************
// ***   TIMESHEETS
// ********************************************************

const post_create_timesheet_toClockIn = (req, res) => {

  console.log('post_create_timesheet_toClockIn -- req.body', req.body)
  console.log('post_create_timesheet_toClockIn -- req.session', req.session)
  console.log('post_create_timesheet_toClockIn -- req.session.mock_employee_id', req.session.mock_employee_id)

  // ! Using a Mocked employee ID from session -- In production, change to actual employee ID from session

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
      console.log('going to get activity ID for', activity_id_For_Timesheets_Lookup)
      return Api_fns.getTimesheet_by_activity_id(activity_id_For_Timesheets_Lookup)
    })
      .then((timesheets_per_activity_id) => {
        console.log('timesheets_per_activity_id', timesheets_per_activity_id)

        if (timesheets_per_activity_id.length < 1) {
          console.log('A timesheet for that activity_id does not exist in timesheets table')
          /* ########### Here, we CREATE a new row in timesheets, since one does not yet exist for the specified activity_id  ############# */
          
          return Promise.try(() => {

            // (employee_id_accepted_by, activity_id, clockin_time, latitude, longitude)
            return Api_fns.post_createNewTimesheet_onClockin(
              employee_id_asInt,
              activity_id_For_Timesheets_Lookup,
              timesheet_clockin,
              latitude,
              longitude
            )
          }).then((response) => {
            console.log('Successfully created a timesheet ', response)
            
            console.log('[Emitting event: new timesheet clockin] Step 1 - An employee just Clocked in, notifying Admin API')
            EmployeeAPI_EventsEmitter.emit('message', {
              title: 'timesheet',
              timesheet_type: 'new_timesheet',
              timesheet: response[0]
            })
          
            res.status(200).json(response);
            // Todo: should flash a temporary message to user showing their new timesheet ID & clock in timestamp
          return response

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

      console.log('[Emitting event: updated timesheet -- clockout] Step 1 - An employee just Clocked in, notifying Admin API')
      EmployeeAPI_EventsEmitter.emit('message', {
        title: 'timesheet',
        timesheet_type: 'updated_timesheet',
        timesheet: response[0]
      })

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

  // ! Using a Mocked employee ID from session -- In production, change to actual employee ID from session
  // console.log('req.session.mock_employee_id', req.session.mock_employee_id)
  const employee_id_asInt = parseInt(req.session.mock_employee_id, 10)


  // console.log('getting pending tasks for employee_id', employee_id_asInt)

  if (true) {

    return Promise.try(() => {
      return Promise.all([
        Api_fns.getTimesheetsAndActivities_forWhich_Timesheets_haveNullClockOut_forEmployee(employee_id_asInt),
        Api_fns.getActivities_forWhich_timesheetsDoNotExist(employee_id_asInt),
      ])
        .then((result) => {
          // flatten the nested array which was returned  -- source: https://stackoverflow.com/questions/10865025/merge-flatten-an-array-of-arrays-in-javascript
          const array_task_list = [].concat.apply([], result);
          return array_task_list
        })
        .then((array_task_list) => {

            return Promise.try(() => {
               return Api_fns.LookupInfo_Location_Project_ActivityType(array_task_list)
            }).then((result) => {

            res.status(200).json(result);

            /* //*: This is to repopulate the test user's timesheet/activity queue. */
            // the numeric value is the new interval, which gets set if the check runs as false
            Api_fns.checkIfNeedToRepopulateTaskQueue(employee_id_asInt)

          // console.log('get_PendingTasks_by_EmployeeID -- array_task_list', array_task_list)
              // return merged_Task_Project_Location_data
          })
      })
    })





  }
  else {
    res.status(500).json({ error: 'sorry, we were unable to fulfill your request for activity data.' });
  }
}

// ********************************************************
// ***   POST PROFILE CONTACT INFO
// ***   Note: Profile form module is unlocked once user type reflects that they are hired
// ********************************************************

const post_Profile_ContactInfo_by_EmployeeID = (req, res) => {
  
  // TODO: Needs update

  // - Call up user profiles, based on user_id
  // - If user profile exists, then run an update (Api_fn).
  // - If it doesnt exist then run an insert (Api_fn).


  /*  Either update this route (post_Profile_ContactInfo_by_EmployeeID)
  or the DB API function: postUserProfileFormData
  
  Why?  I need to differentiate:
  Check:
  if User
    - Has profile info already? -> update ELSE -> insert 
  if Employee: 
    - Has profile info already? -> update ELSE -> insert

    OR Rather...
  since user_profile references user_id, 
  check session:
  if it has employee_ID,
    check if:
      - (query db) -> Has profile info  already? -> update ELSE -> insert  
  */

  console.log('request body is', req.body)

  const phoneNumber_escaped = escape(req.body.phoneNumber)
  const email_escaped = escape(req.body.email)
  const address_escaped = escape(req.body.address)
  const city_escaped = escape(req.body.city)
  const state_escaped = escape(req.body.state)
  const user_id = req.session.user_id
  // // ** Once we're into production mode, we need to check for proper user type in order to receive form data
  // // const user_type = req.session.user_type  

  const address_fix1 = address_escaped.replace(/%20/g, " ") // fix spaces
  const address_fix2 = address_fix1.replace(/%2C/g, ",")    // fix commas
  const address_fix3 = address_fix2.replace(/%23/g, "#")    // fix pound sign
  const address_fix4 = address_fix3.replace(/%2E/g, ".")    // fix period


  const dataToPost = {
    phoneNumber: phoneNumber_escaped,
    email: email_escaped,
    city: city_escaped,
    state: state_escaped,
    address: address_fix4,
    user_id: user_id
  }

  // Check if user has a user_profile.
  // If they do (response array has more than 0 objects), we will update.
  // Else they do not, so we will insert a new row.
  // getEmployeeProfileFormData_byUserID
  
// insert the data into user profiles
return Promise.try(() => {
  return Api_fns.post_updateOrInsert_UserProfileFormData_byUserID(dataToPost)
}).then((response) => {
  console.log('response is ', response)
})
  
}

const get_RecentWorkActivityInfo_ByEmpID = (req, res) => {
  // ! Using a Mocked employee ID from session -- In production, change to actual employee ID from session
  // console.log('req.session.mock_employee_id', req.session.mock_employee_id)
  const employee_id_asInt = parseInt(req.session.mock_employee_id, 10)
  // console.log('get_RecentWorkActivityInfo_ByEmpID for employee_id', employee_id_asInt)
  if (true) {
  return Promise.try(() => {
    return Api_fns.get_Locations_byProjID_byEmployeeID(employee_id_asInt)
    }).then((response) => {
      // console.log('get_RecentWorkActivityInfo_ByEmpID response is ', response)
      res.status(200).json(response);
    })  
  }
}

const get_ListOf_activity_codes = (req, res) => {
  // IMPORTANT__CHANGE_IN_PRODUCTION: 
  // ! Using a Mocked employee ID from session -- In production, change to actual employee ID from session
  // console.log('req.session.mock_employee_id', req.session.mock_employee_id)
  const employee_id_asInt = parseInt(req.session.mock_employee_id, 10)


  if (true) {
    return Promise.try(() => {
      return Api_fns.get_ListOf_ActivityCodes_by_EmployeeID(employee_id_asInt)
    }).then((response) => {
      // console.log('get_RecentWorkActivityInfo_ByEmpID response is ', response)
      res.status(200).json(response);
    })
  }
  
}

// /emp_api/activities/createSelfAssignedTask
const post_createSelfAssignedTask = (req, res) => {
  console.log('post_createSelfAssignedTask -- req.body', req.body)
  console.log('post_createSelfAssignedTask -- req.session', req.session)
   // IMPORTANT__CHANGE_IN_PRODUCTION: 
   // ! (Using a Mocked employee ID from session (set on login auth) -- In production, change to actual employee ID from session)
  const employee_id_asInt = parseInt(req.session.mock_employee_id, 10)
  
  // -> validation
  

  const newActivity_notes_initialEscape = escape(req.body.newActivity_notes)

  const newActivity_notes_escaped_fix1 = newActivity_notes_initialEscape.replace(/%20/g, " ") // fix spaces
  const newActivity_notes_escaped_fix2 = newActivity_notes_escaped_fix1.replace(/%2C/g, ",") // fix commas
  const newActivity_notes_escaped_fix3 = newActivity_notes_escaped_fix2.replace(/%23/g, "#") // fix pound sign
  const newActivity_notes_escaped_fix4 = newActivity_notes_escaped_fix3.replace(/%24/g, "$") // fix dollar sign
  const newActivity_notes = newActivity_notes_escaped_fix4.replace(/%2E/g, ".") // fix period


  const newActivity_project_id = req.body.newActivity_project_id
  const newActivity_type = req.body.newActivity_type
  const newActivity_begin = req.body.newActivity_begin
  const newActivity_end = req.body.newActivity_end
  const newActivity_emp_assigned_by = employee_id_asInt
  const newActivity_emp_assigned_to = employee_id_asInt
  
  const newActivity_objectToPost = {
    newActivity_notes,
    newActivity_project_id,
    newActivity_type,
    newActivity_begin,
    newActivity_end,
    newActivity_emp_assigned_by,
    newActivity_emp_assigned_to
  }

  // post the new activity via DB api function...
  return Promise.try(() => {
    return Api_fns.post_createRow_Activities(newActivity_objectToPost)
  }).then((newActivity) => {
    console.log('post_createRow_Activities newActivity response is ', newActivity)
    return Api_fns.AdditionalDataLookup_On_newActivity(newActivity[0])
  }).then((newActivity_plus_AdditionalActivityData) => {

    console.log('Response received from AdditionalDataLookup_On_newActivity is', newActivity_plus_AdditionalActivityData)

    // Need to emit to an employee task event stream-- Any new activities from Employee, Mgr, or Admin will ultimately go into event stream
    console.log('[Emitting event: new activity -- employeeSelfAssignedActivity ] Step 1 - An employee just assigned themselves an activity. Emitting message to emitter.')
    EmployeeAPI_EventsEmitter.emit('message', {
      title: 'newActivity',
      newActivity_type: 'employeeSelfAssignedActivity',
      newActivity: newActivity_plus_AdditionalActivityData
    })
    res.status(200).json(newActivity_plus_AdditionalActivityData);
  })

}

module.exports = {
  post_create_timesheet_toClockIn,
  put_update_timesheet_toClockOut,
  get_PendingTasks_by_EmployeeID,
  EmployeeAPI_EventsEmitter,
  post_Profile_ContactInfo_by_EmployeeID,
  get_RecentWorkActivityInfo_ByEmpID,
  get_ListOf_activity_codes, 
  post_createSelfAssignedTask,
  EmployeeEventStream
}