const Promise = require('bluebird')
const merge = require('array-object-merge')

// knex 
// const dotenv = require("dotenv").config({ path: '../.env' });
// const environment = process.env.NODE_ENV
// const knex_config = require('../knexfile');
// const database = require('knex')(knex_config[environment]);

const Api_fns = require('../lib/api_fns')
const General_fns = require('../lib/general_fns')

/*//*###########################################
//*###          Event emitters & Admin API related lookups
//*##########################################*/

const internal_EmployeeAPI_EventsEmitter = require('./EmployeeAPI_controllers').internal_EmployeeAPI_EventsEmitter;

internal_EmployeeAPI_EventsEmitter.on('message', data => {
  console.log('received message in internal_EmployeeAPI_EventsEmitter, with data: ', data)
  console.log('received message in internal_EmployeeAPI_EventsEmitter, with data.timesheet.timesheet_id: ', data.timesheet.timesheet_id)
  // res.write(`event: message\n`);
  // res.write(`data: ${JSON.stringify(data)}\n\n`);
  // res.status(200).json(data) ;
});

/*//*###########################################
//*###          Route controllers
//*##########################################*/

/*##########################################
##            Timesheets
##########################################*/
const get_Timesheets_All = (req, res) => {

  if (true /* need to do some sort of security check */) {
    return Promise.try(() => {
      return Api_fns.getAllTimesheets();
    }).then((timesheets) => {

      /* Convert into a function:
      'AdditionalDataLookup_On_Timesheets_array' */
      
      return Promise.map(timesheets, (timesheet) => {
        return Promise.all([
          Api_fns.getEmployee_by_id(timesheet['emp_accepted_by']), /*  emp completing the task */
          Api_fns.getActivity_by_id(timesheet['activity_id']),
        ]).spread((employee_acceptedBy, timesheet_activityData) => {

          let first_mergedData = merge(employee_acceptedBy[0], timesheet_activityData[0])
          let mergedData = merge(first_mergedData, timesheet)
          // console.log('mergedData', mergedData)
          return { mergedData }
        });
      })
    })
    .then((resultData) => {

      let itemArray = []
      resultData.map((item) => { 
        itemArray.push(item.mergedData)
      })
      return itemArray
    })
    .then((resultData) => {
      // console.log('resultData', resultData)
      return Promise.map(resultData, (datapoint) => {
        // console.log('datapoint is', datapoint)

        return Promise.all([
          // console.log('datapoint.final_mergedData.activity_code',datapoint.final_mergedData.activity_code)
          Api_fns.getActivityType_by_activity_code_id(datapoint.activity_code_id),
          Api_fns.getLocation_by_project_id(datapoint.project_id),
          Api_fns.getProjectMgr_by_project_id(datapoint.project_id)
        ]).spread((activityType_data, location_data, projMgr_emp_data) => {

          //renaming the keys of projMgr_emp_data to add 'projMgr_' prefix to make it more clear what sort of data it is
          let projMgr_emp_data_updatedKeys = 
            {
              projMgr_employee_id: projMgr_emp_data[0].employee_id,
              projMgr_firstName: projMgr_emp_data[0].firstName,
              projMgr_lastName: projMgr_emp_data[0].lastName,
              projMgr_phone: projMgr_emp_data[0].phone,
              projMgr_email: projMgr_emp_data[0].email
            }

          // Merging each of the three objects into a single array set of the three objects
          let merge1 = merge(activityType_data[0], location_data[0])
          let merge2 = merge(merge1, projMgr_emp_data_updatedKeys)
          return merge2

        })
        .then((resultData) => {
          // Now we merge the resulting array item with the timesheet item.
          let merge3 = merge(datapoint, resultData)
          return merge3
          }) // completion of Promise.all chain

      }) // completion of Promise.map
      .then((resultData) => {
        // console.log('resultData', resultData)
        res.status(200).json(resultData);
      })


      
    })
  } else {
    res.status(500).json({ error: 'sorry, we were unable to fulfill your request for activity data.' });
  }
}


/*##########################################
##            Activities
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
  get_Timesheets_All,
  get_Activities_All
}