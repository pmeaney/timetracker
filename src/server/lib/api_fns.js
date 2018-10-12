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
	getActivityType_by_activity_code,
	getLocation_by_project_id,
	getProjectMgr_by_project_id
};