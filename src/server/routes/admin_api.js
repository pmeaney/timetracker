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


router.get('/', function (req, res, next) {
  res.send('this is the regular /admin_api route');
});



router.get('/timesheets', (req, res) => {

  if (true /* need to do some sort of security check */) {
    return Promise.try(() => {
      return Api_fns.getAllTimesheets();
    }).then((timesheets) => {

      return Promise.map(timesheets, (timesheet) => {
        return Promise.all([
          Api_fns.getEmployee_by_id(timesheet['emp_accepted_by']), /*  emp completing the task */
          Api_fns.getActivity_by_id(timesheet['activity_id']),
        ]).spread((employee_acceptedBy, timesheet_activityData) => {

          let first_mergedData = merge(employee_acceptedBy[0], timesheet_activityData[0])
          let final_mergedData = merge(first_mergedData, timesheet)

          return { final_mergedData }
        });
      })
    }).then((data) => {
      return Promise.map(data, (datapoint) => {
        return Promise.all([
          // console.log('datapoint.final_mergedData.activity_code',datapoint.final_mergedData.activity_code)
          Api_fns.getActivityType_by_activity_code(datapoint.final_mergedData.activity_code),
          Api_fns.getLocation_by_project_id(datapoint.final_mergedData.project_id),
          Api_fns.getProjectMgr_by_project_id(datapoint.final_mergedData.project_id)
          // next steps:
          // - Get location by Proj ID (so we can show location name, address, etc. 
          // - Get Proj Mgr by Proj ID. (so we can show proj mgr name)

          // Api_fns.getLocation_by_project_id(timesheet['project_id']), /* work-activity location info by for employee (activity's project id) */
          // Api_fns.getProjectMgr_by_project_id(timesheet['project_id'])
        ]).spread((activityType_data, location_data, projMgr_emp_data) => {

          /*    next, add into the merged data: the additional data sets )location, projectMgr)  */
          // console.log('location_data[0]', location_data[0])

          // console.log('projMgr_emp_data[0]',projMgr_emp_data[0])
          // console.log('activityType_data[0]', activityType_data[0])
          // console.log('datapoint.final_mergedData', datapoint.final_mergedData)

          // console.log(projMgr_emp_data[0].employee_id)


          /*  #############   Set proj mgr data (basically just excluding salary 
            **--> really need to refactor: simply make the query in Knex at the beginning of the lookup function).  
            it'll be less code and cleaner   */

          let projMgr_emp_data_set = {
            employee_id: projMgr_emp_data[0].employee_id,
            firstName: projMgr_emp_data[0].firstName,
            lastName: projMgr_emp_data[0].lastName,
            phone: projMgr_emp_data[0].phone,
            email: projMgr_emp_data[0].email
          }
          // console.log('projMgr_emp_data_set',projMgr_emp_data_set)


          let location_data_set = {
            location_id: location_data[0].location_id,
            location_name: location_data[0].location_name,
            location_address: location_data[0].location_address,
            location_city: location_data[0].location_city,
            location_state: location_data[0].location_state,
            location_zip: location_data[0].location_zip,
            location_type: location_data[0].location_type,
          }

          let activityType_data_set = {
            activity_type: activityType_data[0].activity_type
          }



          let timesheet_clockin_time_readable = General_fns.get_readable_time(datapoint.final_mergedData.timesheet_clockin)
          let timesheet_clockin_date_readable = General_fns.get_readable_date(datapoint.final_mergedData.timesheet_clockin)
          let timesheet_notes_summary = General_fns.summarize_string(datapoint.final_mergedData.timesheet_notes)

          let ts_activity_notes_summary = General_fns.summarize_string(datapoint.final_mergedData.activity_notes)

          let ts_activity_begin_time_readable = General_fns.get_readable_time(datapoint.final_mergedData.activity_datetime_begin)
          let ts_activity_begin_date_readable = General_fns.get_readable_date(datapoint.final_mergedData.activity_datetime_begin)

          let ts_activity_end_time_readable = General_fns.get_readable_time(datapoint.final_mergedData.activity_datetime_end)
          let ts_activity_end_date_readable = General_fns.get_readable_date(datapoint.final_mergedData.activity_datetime_end)



          let combo_data_set = {
            employee_id: datapoint.final_mergedData.employee_id,
            firstName: datapoint.final_mergedData.firstName,
            lastName: datapoint.final_mergedData.lastName,
            phone: datapoint.final_mergedData.phone,
            email: datapoint.final_mergedData.email,
            activity_id: datapoint.final_mergedData.activity_id,
            emp_assigned_to: datapoint.final_mergedData.emp_assigned_to,
            emp_assigned_by: datapoint.final_mergedData.emp_assigned_by,
            project_id: datapoint.final_mergedData.project_id,
            activity_notes: datapoint.final_mergedData.activity_notes,

            ts_activity_notes_summary: ts_activity_notes_summary,
            ts_activity_begin_time_readable: ts_activity_begin_time_readable,
            ts_activity_begin_date_readable: ts_activity_begin_date_readable,
            ts_activity_end_time_readable: ts_activity_end_time_readable,
            ts_activity_end_date_readable: ts_activity_end_date_readable,

            timesheet_id: datapoint.final_mergedData.timesheet_id,
            emp_authorized_by: datapoint.final_mergedData.emp_authorized_by,
            emp_accepted_by: datapoint.final_mergedData.emp_accepted_by,
            cost_center_id: datapoint.final_mergedData.cost_center_id,
            timesheet_notes: datapoint.final_mergedData.timesheet_notes,


            timesheet_clockin_time_readable: timesheet_clockin_time_readable,
            timesheet_clockin_date_readable: timesheet_clockin_date_readable,
            timesheet_summary: timesheet_notes_summary,

            timesheet_clockin_lat: datapoint.final_mergedData.timesheet_clockin_lat,
            timesheet_clockin_long: datapoint.final_mergedData.timesheet_clockin_long,
            timesheet_clockout_lat: datapoint.final_mergedData.timesheet_clockout_lat,
            timesheet_clockout_long: datapoint.final_mergedData.timesheet_clockout_long
          }


          let mergedData_LocationAndProjMgr_data = merge(location_data_set, projMgr_emp_data_set)
          let mergedData_ActivityAndTimesheet_data = merge(activityType_data_set, combo_data_set) // combined activity sets

          return { mergedData_ActivityAndTimesheet_data, mergedData_LocationAndProjMgr_data }
        });
      })
    }).then((data) => {
      console.log('data', data)
      res.status(200).json(data);
    })
  } else {
    res.status(500).json({ error: 'sorry, we were unable to fulfill your request for activity data.' });
  }
});


router.get('/activities/all', (req, res) => {

  if (true /* need to do some sort of security check */) {
    return Promise.try(() => {
      return Api_fns.getAllActivities();
    }).then((activities) => {
      return Promise.map(activities, (activity) => {
        return Promise.all([
          Api_fns.getEmployee_by_id(req.session.mock_employee_id), /*  emp completing the task */
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
