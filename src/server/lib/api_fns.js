const Promise = require('bluebird');

// knex
const dotenv = require("dotenv").config({ path: '../.env'}); // access .env dotfile settings
const knex = require('knex');
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
	return Promise.try(() => {
		return database("activities").where({ emp_assigned_to: emp_id });
    })
}

const getActivity_by_id = (activity_id) => {
	return Promise.try(() => {
		return database("activities").where({ activity_id: activity_id });
    })
}

const getActivityType_by_activity_code = (activity_code) => {
	return Promise.try(() => {
		return database("activity_codes").where({ activity_code: activity_code });
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

const createNewTimesheet_onClockin = (activity_id, emp_accepted_by, timesheet_clockin, timesheet_clockin_lat, timesheet_clockin_long) => {
	return Promise.try(() => {
		return database("timesheets").insert({
			activity_id: activity_id,
			emp_accepted_by: emp_accepted_by,
			timesheet_clockin: timesheet_clockin,
			timesheet_clockin_lat: timesheet_clockin_lat,
			timesheet_clockin_long: timesheet_clockin_long,
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
	getActivityType_by_activity_code,
	getLocation_by_project_id,
	getProjectMgr_by_project_id,
};