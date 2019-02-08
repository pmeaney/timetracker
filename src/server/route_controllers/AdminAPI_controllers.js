const Promise = require('bluebird')
const merge = require('array-object-merge')

// knex 
const dotenv = require("dotenv").config({ path: '../.env' });
const environment = process.env.NODE_ENV
const knex_config = require('../knexfile');
const database = require('knex')(knex_config[environment]);

const Api_fns = require('../lib/api_fns')
const General_fns = require('../lib/general_fns')

/*//=>###########################################
//=>###   Event emitters (for Admin viewport(s))
//=>##########################################*/
const EventEmitter = require('events');
class AdminAPI_EventEmitterClass extends EventEmitter { }
const AdminAPI_EventStream_EventEmitter = new AdminAPI_EventEmitterClass();

const EmployeeAPI_EventsEmitter = require('./EmployeeAPI_controllers').EmployeeAPI_EventsEmitter;

    /*//=>###########################################
    //=>###   Admin view, listening to Employee Event emitter, in order to update MapAndTable within Viewport_Maps
    //=>##########################################*/
    // => EmployeeAPI_EventsEmitter is imported here, because we listen to it in order to real-time update
    // => the Admin's viewport: MapAndTable (at: src/client/reactComponents/admin_dashboard/MapAndTable.js )
    // => Therefore, the end result is an update of the admin view, based on an employee's action. Hence this is in the AdminAPI_controllers.js file

    // => SECTION FOR: Timesheet clockin/clockout listener.  Listens to Employee Timesheet clockin/clockout
  EmployeeAPI_EventsEmitter.on('message', data => {
    // console.log('received message in EmployeeAPI_EventsEmitter, with data: ', data)
    if (data.title === 'timesheet') {

      console.log('[Emitting event: new timesheet clockin] Step 2 - Clockin data received.  Now going to do some additional lookups on this timesheet, # ', data.timesheet.timesheet_id)

      return Promise.try(() => {
        return Api_fns.getTimesheet_by_timesheet_id(data.timesheet.timesheet_id);
      }).then((timesheets) => {
        return Api_fns.AdditionalDataLookup_On_Timesheets_array(timesheets)
      }) 
      .then((resultDataFromLookup) => {
        console.log('[Emitting event: new timesheet -- clockin] Step 3 - Additional lookups successful, now we will emit the final data to Admin API event stream')

        console.log('resultDataFromLookup for sending to thru event stream', resultDataFromLookup[0])

        

        if (data.timesheet_type === 'new_timesheet') {
          console.log('new_timesheet received')
          AdminAPI_EventStream_EventEmitter.emit('message', {
            ...resultDataFromLookup[0],
            timesheet_main_type: 'livestream_timesheet',
            timesheet_sub_type: 'new_timesheet',
          })
        }

        if (data.timesheet_type === 'updated_timesheet') {
          console.log('updated_timesheet received')

          AdminAPI_EventStream_EventEmitter.emit('message', {
            ...resultDataFromLookup[0],
            timesheet_main_type: 'livestream_timesheet',
            timesheet_sub_type: 'updated_timesheet',
          })
        }
      })
    } 
    // console.log('received message in EmployeeAPI_EventsEmitter, with data.timesheet.timesheet_id: ', data.timesheet.timesheet_id)
    // do lookup
    // after lookup, emit message with lookup data to AdminAPI_EventStream_EventEmitter
  });


/*//=>###########################################
//=>###     EVENT STREAM -- Route controllers
//=>##########################################*/

const AdminEventStream = (req, res) => { 

  // res.status(200).set({
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  AdminAPI_EventStream_EventEmitter.on('message', data => {
    console.log('[Emitting event: new timesheet clockin] Step 4 - Final data received in Admin API event stream.  Sending it into the data stream where the client will find it.')

    console.log('data in step 4 is', data)
    if (data.timesheet_main_type === 'livestream_timesheet') {
      console.log('writing data to stream now')
      // The string-type data to send to admin eventstream:
      res.write(`event: message\n`);
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    }
  });
}

/*//*###########################################
//*###          REGULAR (non-stream) Route controllers
//*##########################################*/

/*##########################################
##            Data for Data Table -- Receives url parameter as the table name to query
##########################################*/

const get_DataForTable = (req, res) => {

  console.log('params received for db lookup: table name: ', req.params.tableName)

  // note on regex character escape:  \W is the equivalent of [^0-9a-zA-Z_]
  const escaped_tableName = req.params.tableName.replace(/\W/g, '')

  if (true /* need to do some sort of security check */) {
    return Promise.try(() => {
      return Api_fns.get_Admin_dataFor_DataTable(escaped_tableName);
    })
    .then((dataResponse) => {
      console.log('dataResponse is ', dataResponse)
      res.status(200).json(dataResponse)
    })
  }
}

/*##########################################
##            Timesheets
##########################################*/
const get_Timesheets_All = (req, res) => {

  if (true /* need to do some sort of security check */) {
    return Promise.try(() => {
      return Api_fns.getAllTimesheets();
    }).then((timesheets) => {
        return Api_fns.AdditionalDataLookup_On_Timesheets_array(timesheets)
      }) // completion of Promise.map
      .then((resultData) => {
        // console.log('resultData', resultData)
        res.status(200).json(resultData);
      })
  } else {
    res.status(500).json({ error: 'sorry, we were unable to fulfill your request for timesheet data.' });
  }
}


/*##########################################
##            Activities //! Unused. This is just for reference
##########################################*/
const get_Activities_All = (req, res) => {

  if (true /* need to do some sort of security check */) {
    return Promise.try(() => {
      return Api_fns.getAllActivities();
    }).then((activities) => {
      return Promise.map(activities, (activity) => {
        return Promise.all([
          Api_fns.getEmployee_by_id(req.session.mock_employee_id), /*  emp completing the task */
          Api_fns.getEmployee_by_id(activity['emp_assigned_by']), /*  emp who assigned the task (activity mgr -- above them is project mgr.  We can always add that on later (involved small DB model update) but let's focus on basic activity info for now) */
          Api_fns.getActivityType_by_activity_code_id(activity['activity_code']), /* activity type info: such as 'painting', by code (i.e. activity_code is basically activity type's uniqueID)*/
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

module.exports = { 
  AdminEventStream,
  get_Timesheets_All,
  get_Activities_All,
  get_DataForTable,
}