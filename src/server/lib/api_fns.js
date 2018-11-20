const Promise = require('bluebird');
const merge = require('array-object-merge')

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
		return database("activities")
			.where({ activity_id: activity_id })
			.select('activities.activity_id',
							'activities.activity_code_id',
							'activities.emp_assigned_to',
							'activities.emp_assigned_by',
							'activities.project_id',
							'activities.activity_notes',
							'activities.activity_datetime_begin',
							'activities.activity_datetime_end',
			)
    })
}

const getActivityType_by_activity_code_id = (activity_code_id) => {
	return Promise.try(() => {
		return database("activity_codes")
			.select('activity_codes.activity_type')
			.where({ activity_code_id: activity_code_id });
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
		return database("timesheets")
			.select('timesheets.activity_id',
				'timesheets.timesheet_id',
				'timesheets.emp_accepted_by',
				'timesheets.cost_center_id',
				'timesheets.timesheet_notes',
				'timesheets.timesheet_clockin',
				'timesheets.timesheet_clockout',
				'timesheets.timesheet_clockin_lat',
				'timesheets.timesheet_clockin_long',
				'timesheets.timesheet_clockout_lat',
				'timesheets.timesheet_clockout_long');
    })
}

const getTimesheet_by_timesheet_id = (timesheet_id) => {
	return Promise.try(() => {
		return database("timesheets")
			.select('timesheets.activity_id',
				'timesheets.timesheet_id',
				'timesheets.emp_accepted_by',
				'timesheets.cost_center_id',
				'timesheets.timesheet_notes',
				'timesheets.timesheet_clockin',
				'timesheets.timesheet_clockout',
				'timesheets.timesheet_clockin_lat',
				'timesheets.timesheet_clockin_long',
				'timesheets.timesheet_clockout_lat',
				'timesheets.timesheet_clockout_long')
			.where({ timesheet_id: timesheet_id });
			
	})
}

const getTimesheet_by_activity_id = (activity_id) => {
	return Promise.try(() => {
		return database("timesheets")
			.select('timesheets.activity_id',
				'timesheets.timesheet_id',
				'timesheets.emp_accepted_by',
				'timesheets.cost_center_id',
				'timesheets.timesheet_notes',
				'timesheets.timesheet_clockin',
				'timesheets.timesheet_clockout',
				'timesheets.timesheet_clockin_lat',
				'timesheets.timesheet_clockin_long',
				'timesheets.timesheet_clockout_lat',
				'timesheets.timesheet_clockout_long')
			.where({ activity_id: activity_id });
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

const createNewTimesheet_onClockin = (employee_id_accepted_by, activity_id, clockin_time, latitude, longitude) => {
	return Promise.try(() => {
		return database("timesheets")
			.returning(['activity_id', 'timesheet_id', 'timesheet_clockin']) // response data to return to user upon insert
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

const updateExistingTimesheet_onClockout = (activity_id, clockout_time, latitude, longitude) => {
	return Promise.try(() => {
		return database("timesheets")
			.where({ activity_id: activity_id })
			.returning(['activity_id', 'timesheet_id', 'timesheet_clockin', 'timesheet_clockout']) // response data to return to user upon insert
			.update({
				timesheet_clockout: clockout_time,
				timesheet_clockout_lat: latitude,
				timesheet_clockout_long: longitude
			})
	})

	// 	return database("timesheets")
	// 		.returning(['timesheet_id', 'timesheet_clockout']) // response data to return to user upon insert
	// 		.insert({
	// 			activity_id: activity_id,
	// 			emp_accepted_by: employee_id_accepted_by,
	// 			timesheet_clockin: clockin_time,
	// 			timesheet_clockin_lat: latitude,
	// 			timesheet_clockin_long: longitude,
	// 			emp_authorized_by: null,
	// 			cost_center_id: null,
	// 			timesheet_notes: null,
	// 			timesheet_submitted_datetime: null,
	// 			timesheet_clockout: null,
	// 			timesheet_clockout_lat: null,
	// 			timesheet_clockout_long: null
	// 		})
	// })
}



/* #############	Employees 	  ################ */
const getAllEmployees = () => {
	return Promise.try(() => {
		return database("employees");
    })
}

const getEmployee_by_id = (emp_id) => {
	return Promise.try(() => {
		return database("employees")
			.where({ employee_id: emp_id })
			.select('employees.employee_id',
							'employees.firstName',
							'employees.lastName',
							'employees.phone',
							'employees.email',
							)
    })
}


const getProjectMgr_by_project_id = (project_id) => {
	return Promise.try(() => {
		return database('employees')
			.select('employees.employee_id',
							'employees.firstName',
							'employees.lastName',
							'employees.phone',
							'employees.email')
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
			.select('locations.location_id',
							'locations.location_name',
							'locations.location_address',
							'locations.location_city',
							'locations.location_state',
							'locations.location_zip',
							'locations.location_type')
			.join('projects',
						'locations.location_id',
						'=',
						'projects.location_id')
			.where({project_id})
	})
}

const AdditionalDataLookup_On_Timesheets_array = (timesheets) => {
	
	return Promise.map(timesheets, (timesheet) => {
		return Promise.all([
			getEmployee_by_id(timesheet['emp_accepted_by']), /*  emp completing the task */
			getActivity_by_id(timesheet['activity_id']),
		]).spread((employee_acceptedBy, timesheet_activityData) => {

			let first_mergedData = merge(employee_acceptedBy[0], timesheet_activityData[0])
			let mergedData = merge(first_mergedData, timesheet)
			// console.log('mergedData', mergedData)
			return { mergedData }
		});
	})

// }) <-- imported when pasting code, maybe can delete
	.then((resultData) => {

		let itemArray = []
		resultData.map((item) => {
			itemArray.push(item.mergedData)
		})
		return itemArray
	})
	.then((resultData) => {
		return Promise.map(resultData, (datapoint) => {
			// console.log('datapoint is', datapoint)

			return Promise.all([
				// console.log('datapoint.final_mergedData.activity_code',datapoint.final_mergedData.activity_code)
				getActivityType_by_activity_code_id(datapoint.activity_code_id),
				getLocation_by_project_id(datapoint.project_id),
				getProjectMgr_by_project_id(datapoint.project_id)
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
		}) // completion of Promise.map chain
	})
}

module.exports = {
	getAllActivities,
	getActivity_by_id,
	getActivitiesBy_employee_assigned_to,
	getAllEmployees,
	getEmployee_by_id,
	getAllTimesheets,
	getTimesheet_by_timesheet_id,
	getTimesheet_by_activity_id,
	createNewTimesheet_onClockin,
	updateExistingTimesheet_onClockout,
	getActivityType_by_activity_code_id,
	getLocation_by_project_id,
	getProjectMgr_by_project_id,
	getTimesheetsAndActivities_forWhich_Timesheets_haveNullClockOut_forEmployee,
	getActivities_forWhich_timesheetsDoNotExist,
	AdditionalDataLookup_On_Timesheets_array
};