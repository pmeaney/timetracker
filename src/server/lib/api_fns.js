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
/* #############	users  -- mostly for test purposes	  ################ */
const getUsers_All = () => {
	return Promise.try(() => {
		return database("users");
    })
}
const getUserProfiles_All = () => {
	return Promise.try(() => {
		return database("user_profiles");
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

const getActivityCodes_All = () => {
	return Promise.try(() => {
		return database("activity_codes")
			.select('activity_codes.activity_code_id', 'activity_codes.activity_type')
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

const post_newActivity_employeeSelfAssignedActivity = (newActivity_objectToPost) => {
	return Promise.try(() => {
		return database("activities")
			.returning([
				'activity_id',
				'activity_code_id',
				'project_id',
				'emp_assigned_by',
				'emp_assigned_to',
				'activity_notes',
				'activity_datetime_begin',
				'activity_datetime_end'
			]) // response data to return to user upon insert
			.insert({
				activity_code_id: newActivity_objectToPost.newActivity_type,
				project_id: newActivity_objectToPost.newActivity_project_id,
				emp_assigned_by: newActivity_objectToPost.newActivity_emp_assigned_by,
				emp_assigned_to: newActivity_objectToPost.newActivity_emp_assigned_to,
				activity_notes: newActivity_objectToPost.newActivity_notes_escaped,
				activity_datetime_begin: newActivity_objectToPost.newActivity_begin,
				activity_datetime_end: newActivity_objectToPost.newActivity_end,
			})
	})
}

const AdditionalDataLookup_On_newActivity = (newActivity) => {
	return Promise.try(() => {
		return ForDataItem_LookUp__ActivityType_Location_ProjectMgr(newActivity)
	}).then((newActivity_additionalData) => {
		let merged_activityData_with_newActivity_additionalData = merge(newActivity, newActivity_additionalData)
		return merged_activityData_with_newActivity_additionalData
	})

}

const ForDataItem_LookUp__ActivityType_Location_ProjectMgr = (dataItem) => {
	return Promise.all([
		// console.log('datapoint.final_mergedData.activity_code',datapoint.final_mergedData.activity_code)
		getActivityType_by_activity_code_id(dataItem.activity_code_id),
		getLocation_by_project_id(dataItem.project_id),
		getProjectMgr_by_project_id(dataItem.project_id)
	]).spread((activityType_data, location_data, projMgr_emp_data) => {

		//renaming the keys of projMgr_emp_data to add 'projMgr_' prefix to make it more clear what sort of data it is
		let projMgr_emp_data_updatedKeys =
		{
			projMgr_employee_id: projMgr_emp_data[0].project_manager_employee_id,
			projMgr_firstName: projMgr_emp_data[0].project_manager_firstName,
			projMgr_lastName: projMgr_emp_data[0].project_manager_lastName,
			projMgr_phone: projMgr_emp_data[0].project_manager_phone,
			projMgr_email: projMgr_emp_data[0].project_manager_email
		}

		// Merging each of the three objects into a single array set of the three objects
		let merge1 = merge(activityType_data[0], location_data[0])
		let merge2 = merge(merge1, projMgr_emp_data_updatedKeys)
		return merge2
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
}

/* #############	Activity Codes 	  ################ */

// get distinct activity codes for activities with emp_id
const get_ListOf_ActivityCodes_by_EmployeeID = (emp_id) => {
	console.log('emp id', emp_id)
	return Promise.try(() => {
		return database('activities')
			.where({ emp_assigned_to: emp_id })
			.distinct('activities.activity_code_id')
			.join('activity_codes',
				'activities.activity_code_id',
				'=',
				'activity_codes.activity_code_id')
			.select('activity_codes.activity_type')
			.returning('activity_codes.activity_type')
	})
}


/* #############	Employees 	  ################ */
// getting employee user info by employee ID
const getEmployees_All = () => {
	return Promise.try(() => {
		return database("employees")
			.select(
				'employees.user_id',
			)
			.join('user_profiles',
						'employees.user_id',
						'=',
						'user_profiles.user_id',
			)
			.select(
				'*',
			)
		}).then((res) => {
			return res
		})
		
}

const getEmployee_by_id = (emp_id) => {
	return Promise.try(() => {
		return database("employees")
			.where({ employee_id: emp_id })
			.select(
				'employees.user_id',
				'employees.employee_id',
			)
			.join('user_profiles',
				'employees.user_id',
				'=',
				'user_profiles.user_id',
			)
			.select('user_profiles.user_profile_firstName as firstName',
							'user_profiles.user_profile_lastName as lastName',
							'user_profiles.user_profile_phoneNumber as phone',
							'user_profiles.user_profile_email as email',
							'user_profiles.user_profile_imageFilename as employee_profile_photo',
							)
    })
}

const getProjectMgr_by_project_id = (project_id) => {
	return Promise.try(() => {
		return database('projects')
			.where({ project_id }) // get projects with matching id
			.select('projects.project_mgr_emp_id') // take their project manager employee ID (project_mgr_emp_id)
			.join('employees', // and query employees table with it
				'projects.project_mgr_emp_id',
				'=',
				'employees.employee_id',
				)
			.select('employees.employee_id as project_manager_employee_id', 
							'employees.user_id') // get the user_id from employees table
			.join('user_profiles',	// use it to query user_profiles for user info
				'employees.user_id',
				'=',
				'user_profiles.user_id',
			)
			.select('user_profiles.user_profile_firstName as project_manager_firstName', // select the user info from the user_profile
				'user_profiles.user_profile_lastName as project_manager_lastName',
				'user_profiles.user_profile_phoneNumber as project_manager_phone',
				'user_profiles.user_profile_email as project_manager_email',
				'user_profiles.user_profile_imageFilename as project_manager_profile_photo',
			)
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

// - Project & Location data by activities.employee_id
// 	 this gets recent project & location data based on employee_id
// 1. lookup activities by activities.emp_assigned_to === employee_id
// 2. With those activities, return a set of distinct project_id 
// 3. With that set of unique project_ids, return location data
const get_Locations_byProjID_byEmployeeID = (emp_id) => {
	return Promise.try(() => {
		return database('activities')
			.where({ emp_assigned_to: emp_id })
			.distinct('activities.project_id')
			.join('projects',
						'activities.project_id',
						'=',
						'projects.project_id')
			.select('projects.location_id', 'projects.project_mgr_emp_id')
			.join('locations',
						'projects.location_id',
						'=',
						'locations.location_id')
			.select('locations.location_id',
							'locations.location_name',
							'locations.location_address',
							'locations.location_city',
							'locations.location_state',
							'locations.location_zip',
							'locations.location_type')
			// get query employees with project_mgr_emp_id
			.join('employees',
						'employees.employee_id', // needs to be unique table alias, to keep it separate from next query using 'employee_id'
						'=',
						'projects.project_mgr_emp_id')
			.select(
				'employees.user_id',
				'employees.employee_id',
			)
			.join('user_profiles',
				'employees.user_id',
				'=',
				'user_profiles.user_id',
			)
			.select('user_profiles.user_profile_firstName as project_manager_firstName',
				'user_profiles.user_profile_lastName as project_manager_lastName',
				'user_profiles.user_profile_phoneNumber as project_manager_phone',
				'user_profiles.user_profile_email as project_manager_email',
			)
			// .select({ project_manager_firstName: 'employees.firstName', project_manager_lastName: 'employees.lastName'})
	})
}
// get_Locations_byProjID_byEmployeeID(2)
const get_Locations_byProjID_forAllProjects = () => {
	return Promise.try(() => {
		return database('projects')
			.select('projects.project_id', 'projects.location_id', 'projects.project_mgr_emp_id')
			.join('locations',
				'projects.location_id',
				'=',
				'locations.location_id')
			.select('locations.location_id',
				'locations.location_name',
				'locations.location_address',
				'locations.location_city',
				'locations.location_state',
				'locations.location_zip',
				'locations.location_type')
			// get query employees with project_mgr_emp_id
			.join('employees',
				'employees.employee_id', // needs to be unique table alias, to keep it separate from next query using 'employee_id'
				'=',
				'projects.project_mgr_emp_id')
			.select(
				'employees.user_id',
				'employees.employee_id',
			)
			.join('user_profiles',
				'employees.user_id',
				'=',
				'user_profiles.user_id',
			)
			.select('user_profiles.user_profile_firstName as project_manager_firstName',
				'user_profiles.user_profile_lastName as project_manager_lastName',
				'user_profiles.user_profile_phoneNumber as project_manager_phone',
				'user_profiles.user_profile_email as project_manager_email',
			)
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

			return Promise.try(() => {
				return ForDataItem_LookUp__ActivityType_Location_ProjectMgr(datapoint)
			})
			.then((resultData) => {
				// Now we merge the resulting array item with the timesheet item.
				let merge3 = merge(datapoint, resultData)
				return merge3
			}) // completion of Promise.all chain
		}) // completion of Promise.map chain
	})
}

const postEmployeeProfileFormData = (dataObject) => {
	console.log('[lib/Api_fns.js] data obj posted', dataObject)
	return Promise.try(() => {
		return database("employees")
			.where({ employee_id: dataObject.user_id  })
			.select(
				'employees.user_id',
				'employees.employee_id',
			)
			.join('user_profiles',
				'employees.user_id',
				'=',
				'user_profiles.user_id',
			)
			.update({
				user_profile_phoneNumber: dataObject.phoneNumber,
				user_profile_email: dataObject.email,
				user_profile_address: dataObject.address
			})
			.returning(['employee_id', 'user_profile_phoneNumber', 'user_profile_email', 'user_profile_address']) // response data to return to user upon insert
	})
}


const populateTestUserData = (testUserID_forRepopulation) => {
	return Promise.try(() => {
		return Promise.all([
			// note: UTC is 7 hours ahead of PST
			//  2018-01-01T00:00:00.000Z
			// NEED TO FIX:  Add in 'activity manager', stop using 'emp_assigned_by' as default for activity mgr
			database('activities').insert([
				{ activity_code_id: 1, project_id: 1, emp_assigned_by: 1, emp_assigned_to: testUserID_forRepopulation, activity_notes: 'paint with blue until you run out, then switch to red', activity_datetime_begin: '2018-01-01T16:00:00.000Z', activity_datetime_end: '2018-01-01T21:00:00.000Z' },
				{ activity_code_id: 3, project_id: 2, emp_assigned_by: 1, emp_assigned_to: testUserID_forRepopulation, activity_notes: 'work on building shelf in store', activity_datetime_begin: '2018-02-01T13:00:00.000Z', activity_datetime_end: '2018-02-01T21:00:00.000Z' },
				{ activity_code_id: 8, project_id: 2, emp_assigned_by: 1, emp_assigned_to: testUserID_forRepopulation, activity_notes: 'install drywall in champagne conference room', activity_datetime_begin: '2018-02-04T13:00:00.000Z', activity_datetime_end: '2018-02-08T21:00:00.000Z' },
				{ activity_code_id: 8, project_id: 3, emp_assigned_by: 1, emp_assigned_to: testUserID_forRepopulation, activity_notes: 'Testing...', activity_datetime_begin: '2018-02-04T13:00:00.000Z', activity_datetime_end: '2018-02-08T21:00:00.000Z' },

				{ activity_code_id: 8, project_id: 1, emp_assigned_by: 1, emp_assigned_to: testUserID_forRepopulation, activity_notes: 'Testing 2...', activity_datetime_begin: '2018-02-04T13:00:00.000Z', activity_datetime_end: '2018-02-08T21:00:00.000Z' },
				{ activity_code_id: 8, project_id: 2, emp_assigned_by: 1, emp_assigned_to: testUserID_forRepopulation, activity_notes: 'Testing 3...', activity_datetime_begin: '2018-02-04T13:00:00.000Z', activity_datetime_end: '2018-02-08T21:00:00.000Z' },
				{ activity_code_id: 8, project_id: 2, emp_assigned_by: 1, emp_assigned_to: testUserID_forRepopulation, activity_notes: 'Testing 4...', activity_datetime_begin: '2018-02-04T13:00:00.000Z', activity_datetime_end: '2018-02-08T21:00:00.000Z' },
			])
		])
	})
}



const checkIfNeedToRepopulateTaskQueue = (employee_id_repopTaskQueue) => {

	var interval = 180000

	setInterval(() => {
		console.log('[lib/Api_fns.js] running checkIfNeedToRepopulateTaskQueue with emp id', employee_id_repopTaskQueue)
		return Promise.try(() => {
			return Promise.all([
				getTimesheetsAndActivities_forWhich_Timesheets_haveNullClockOut_forEmployee(employee_id_repopTaskQueue),
				getActivities_forWhich_timesheetsDoNotExist(employee_id_repopTaskQueue)
			])
				.then((result) => {
					// flatten the nested array which was returned  -- source: https://stackoverflow.com/questions/10865025/merge-flatten-an-array-of-arrays-in-javascript
					const array_task_list = [].concat.apply([], result)

					// console.log('array_task_list within empty task queue checker', array_task_list)

					/* Is it empty and needs population? */
					if (array_task_list.length === 0) {
						console.log('[lib/Api_fns.js] task list array is empty for test user-- will re-populate')
						return Promise.try(() => {
							populateTestUserData(employee_id_repopTaskQueue)
						})
					} else {
						console.log('[lib/Api_fns.js] no need to repopulate activities-- the queue is not empty.')
						// if function isnt run, lets make the timer last longer 

					}
				})
		})
	}, interval)
}


const get_Admin_dataFor_DataTable = (tableName) => {
	console.log('tableName received in api fns', tableName)
	return Promise.try(() => {
		return database( tableName )
	})
}

// tableName,
// tableRow_type,
// tableRow_id,
// fieldName,
// newValueToPut
const put_DataForTable_update_Table_Field_withData = (tableName, tableRow_type, tableRow_id, fieldName, newDataValue) => {
	return Promise.try(() => {
		return database(tableName)
			.where(`${tableRow_type}`, `${tableRow_id}`)
			.update(`${fieldName}`, `${newDataValue}`)
			.returning(['*'])
	})
		.then((updatedRow) => {
			console.log('updatedRow is now:', updatedRow)
			return updatedRow
		})
		.catch(function (error) {
			console.error('Error from api_fns.js in function put_DataForTable_update_Table_Field_withData: ', error);
			return error
		});
}


const update_FileName_ProfilePhoto_byUserID = (new_filename, user_id_passedIn, str_to_check) => {

	if (str_to_check === 'profile_photo') {
		return Promise.try(() => {
			return database("user_profiles")
				.where({ user_id: user_id_passedIn })
				.update({ user_profile_imageFilename: new_filename })
				.returning([
					'user_id',
					'user_profile_imageFilename'
				]) // response data to return to user upon insert
		})
	}
	
	if (str_to_check === 'profile_resume') {
		return Promise.try(() => {
			return database("user_profiles")
				.where({ user_id: user_id_passedIn })
				.update({ user_profile_resumeFilename: new_filename })
				.returning([
					'user_id',
					'user_profile_resumeFilename'
				]) // response data to return to user upon insert
		})
	}
} 

const hireUser_toEmployee = (user_id_passedIn) => {
	/* 

	Used to lookup users, and change them to employees
	NOT to update current employees status/info

	1. query employees table for user_id
	2. query users table with user_id (to update user_type to 'employee')
	3. query user_profiles table with user_id (to add in a blank profile image -- user_profile_imageFilename)
	*/
	return Promise.try(() => {
		return database('employees')
			.insert({ user_id: user_id_passedIn, 
								employee_type: 'regular employee' })
			.returning(['user_id'])
	})
	.then((result) => {

		// console.log('result', result)
		console.log('result[0][user_id]', result[0]['user_id'] )
		return Promise.try(() => {
			return database('users')
				.where({ user_id: result[0]['user_id'] })
				.update({ user_type: 'employee' })
				.returning(['user_id'])
			
		})
	})
	.then((result) => {

		console.log('result[0][user_id] ... updating user profile now', result[0]['user_id'])
		return Promise.try(() => {
			return database('user_profiles')
			.where({ user_id: result[0]['user_id'] })
				.insert({ user_profile_imageFilename: 'profilePhoto_user_id__0.png' }) // setting profile image as a blank photo
			.returning('user_id', 'user_profile_imageFilename')
		})
	})
}	

module.exports = {
	getAllActivities,
	getActivity_by_id,
	getActivitiesBy_employee_assigned_to,
	post_newActivity_employeeSelfAssignedActivity,
	getActivityType_by_activity_code_id,
	getActivityCodes_All,
	getActivities_forWhich_timesheetsDoNotExist,
	AdditionalDataLookup_On_newActivity,
	getEmployees_All,
	getEmployee_by_id,
	getAllTimesheets,
	getTimesheet_by_timesheet_id,
	getTimesheet_by_activity_id,
	createNewTimesheet_onClockin,
	updateExistingTimesheet_onClockout,
	getLocation_by_project_id,
	getProjectMgr_by_project_id,
	getTimesheetsAndActivities_forWhich_Timesheets_haveNullClockOut_forEmployee,
	AdditionalDataLookup_On_Timesheets_array,
	postEmployeeProfileFormData,
	populateTestUserData,
	checkIfNeedToRepopulateTaskQueue,
	get_Locations_byProjID_byEmployeeID,
	get_Locations_byProjID_forAllProjects,
	get_ListOf_ActivityCodes_by_EmployeeID,
	get_Admin_dataFor_DataTable,
	put_DataForTable_update_Table_Field_withData,
	update_FileName_ProfilePhoto_byUserID,
	hireUser_toEmployee,
	// for testing
	getUsers_All,
	getUserProfiles_All,
};