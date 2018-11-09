const Promise = require('bluebird');

// knex
const dotenv = require("dotenv").config({ path: '../.env'}); // access .env dotfile settings
const environment = process.env.NODE_ENV;
const knex_config = require('../knexfile');
const database = require('knex')(knex_config[environment]);

/*
''
''  This file defines the functions used in the the main database lookup API for the app
''  This makes the function definitions here very core to the business logic of the app
''  Things such as: looking up activities by employee_id (and verifying that they're either: A. an employee looking at their own activities, or B. a manager looking at their direct reports, or C. an admin looking at everyone)
'' Undefined (or result array length) checks against DB queries are usually a good idea.
'' --> i need to implement it in the near future
''
*/


/* #############	Activities 	  ################ */
const getAllActivities = () => {
	return Promise.try(() => {
		return database("activities");
    })
}

const getActivitiesBy_employee_assigned_to = (emp_id) => {
	/* Here, we are going to get all activities and join them on timesheets where timesheet has null for clockout value
	for matching activity ids
	(on frontend, we'll be returning unstarted or started-but-unfinished timesheets.) */
	return Promise.try(() => {
		return database("activities").where({ emp_assigned_to: emp_id });
    })
}


const getActivity_by_id = (activity_id) => {
	return Promise.try(() => {
		return database("activities").where({ activity_id: activity_id });
    })
}

const getActivityType_by_activity_code_id = (activity_code_id) => {
	return Promise.try(() => {
		return database("activity_codes").where({ activity_code_id: activity_code_id });
    })
}

const getActivities_forWhich_timesheetsDoNotExist = (emp_id) => {
	/* We want to return:
	Activities for which there are no timesheets.
	*/
	let subquery = database('timesheets').select('activity_id').where({ emp_accepted_by: emp_id })
	// subquery returns the following Timesheets format of data: [{"activity_id":1},{"activity_id":2},{"activity_id":5}] 
	// these activity IDs are then used within the .whereNotIn statement below-- So that we only 
	// return activities for which there are no matching timesheets (i.e. timesheets with the same activity_id) -- since timesheets should not exist until one is created upon user clockIn
	return Promise.try(() => {
		return database('activities')
			.select(
							'activity_id',
							'activity_code_id',
							'project_id',
							'emp_assigned_by',
							'emp_assigned_to',
							'activity_notes',
							'activity_datetime_begin',
							'activity_datetime_end'
							)
			.where({ emp_assigned_to: emp_id })
			.whereNotIn('activity_id', subquery)
	})
}

/* #############	Timesheets 	  ################ */
const getAllTimesheets = () => {
	return Promise.try(() => {
		return database("timesheets").select();
    })
}

const getTimesheet_by_activity_id = (activity_id) => {
	return Promise.try(() => {
		return database("timesheets").where({ activity_id: activity_id });
	})
}

const getTimesheetsAndActivities_forWhich_Timesheets_haveNullClockOut_forEmployee = (emp_id) => {
	/* For emp_id, uses activity_id lookup on timesheets to return timesheets with null clockout values
	*/
	return Promise.try(() => {
		return database('timesheets')
			.where({ emp_accepted_by: emp_id, timesheet_clockout: null })
			.join('activities',
						'timesheets.activity_id',
						'=',
						'activities.activity_id'
						)
			.select('activities.activity_code_id',
							'activities.project_id',
							'activities.emp_assigned_by',
							'activities.emp_assigned_to',
							'activities.activity_notes',
							'activities.activity_datetime_begin',
							'activities.activity_datetime_end',
							'timesheets.activity_id',
							'timesheets.timesheet_id',
							'timesheets.emp_accepted_by',
							'timesheets.cost_center_id',
							'timesheets.timesheet_notes',
							'timesheets.timesheet_clockin',
							'timesheets.timesheet_clockout',
							'timesheets.timesheet_clockin_lat',
							'timesheets.timesheet_clockin_long',
							'timesheets.timesheet_clockout_lat',
							'timesheets.timesheet_clockout_long'
							)
	})
}

/* Timesheet - POST - Create new timesheet 
timesheet object: {
	timesheet_id: 3, -> is automatically added
	activity_id: 3, -> add in from form params
	emp_authorized_by: 2, -> leave null(to be updated by mgr or admin)
	emp_accepted_by: 3, -> add in from form params(clockedIn employee ID)
	cost_center_id: 1, -> leave null(to be updated by mgr or admin)
	timesheet_notes: 'we broke a wheelbarrow', -> leave null: update on 'Post TimeSheet Info' -> when the user uploads a photo or notes about timesheet
	timesheet_submitted_datetime: 2018 - 02 - 14T15: 02: 00.000Z, -> leave null
	timesheet_clockin: 2018 - 02 - 01T16: 05: 00.000Z, -> Here, we add info
	timesheet_clockout: 2018 - 02 - 02T00: 05: 00.000Z, -> leave null(updated on Clockout)
	timesheet_clockin_lat: '37.684310', -> Here, we add info
	timesheet_clockin_long: '-122.40293', -> Here, we add info
	timesheet_clockout_lat: '37.684136', -> leave null(updated on Clockout)
	timesheet_clockout_long: '-122.40240', -> leave null(updated on Clockout)
	created_at: 2018 - 10 - 31T21: 42: 51.742Z, -> is automatically added
	updated_at: 2018 - 10 - 31T21: 42: 51.742Z -> is automatically added


	To Insert:
	activity_id: 3, -> add in from form params
	emp_accepted_by: 3, -> add in from form params(clockedIn employee ID)
	timesheet_clockin: 2018 - 02 - 01T16: 05: 00.000Z, -> add in from form params
	timesheet_clockin_lat: '37.684310', -> add in from form params
	timesheet_clockin_long: '-122.40293', -> add in from form params

	NULLS:
	emp_authorized_by: null
	cost_center_id: null
	timesheet_notes: null
	timesheet_submitted_datetime: null
	timesheet_clockout: null
	timesheet_clockout_lat: null
	timesheet_clockout_long: null
}
*/

const createNewTimesheet_onClockin = (employee_id_accepted_by, activity_id, clockin_time, latitude, longitude) => {
	return Promise.try(() => {
		return database("timesheets")
			.returning(['timesheet_id', 'timesheet_clockin']) // response data to return to user upon insert
			.insert({
			activity_id: activity_id,
			emp_accepted_by: employee_id_accepted_by,
			timesheet_clockin: clockin_time,
			timesheet_clockin_lat: latitude,
			timesheet_clockin_long: longitude,
			emp_authorized_by: null,
			cost_center_id: null,
			timesheet_notes: null,
			timesheet_submitted_datetime: null,
			timesheet_clockout: null,
			timesheet_clockout_lat: null,
			timesheet_clockout_long: null
		})
	})
}


/* #############	Employees 	  ################ */
const getAllEmployees = () => {
	return Promise.try(() => {
		return database("employees");
    })
}

const getEmployee_by_id = (emp_id) => {
	return Promise.try(() => {
		return database("employees").where({ employee_id: emp_id });
    })
}


const getProjectMgr_by_project_id = (project_id) => {
	return Promise.try(() => {
		return database('employees')
			.select('employees.*')
			.join('projects',
						'employees.employee_id',
						'=',
						'projects.project_mgr_emp_id')
			.where({project_id})
    })
}


/* #############	Locations 	  ################ */
const getLocation_by_project_id = (project_id) => {
	return Promise.try(() => {
		return database('locations')
			.select('locations.*')
			.join('projects',
						'locations.location_id',
						'=',
						'projects.location_id')
			.where({project_id})
	})
}

module.exports = {
	getAllActivities,
	getActivity_by_id,
	getActivitiesBy_employee_assigned_to,
	getAllEmployees,
	getEmployee_by_id,
	getAllTimesheets,
	getTimesheet_by_activity_id,
	createNewTimesheet_onClockin,
	getActivityType_by_activity_code_id,
	getLocation_by_project_id,
	getProjectMgr_by_project_id,
	getTimesheetsAndActivities_forWhich_Timesheets_haveNullClockOut_forEmployee,
	getActivities_forWhich_timesheetsDoNotExist
};