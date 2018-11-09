
/*


  TO DO ON NEXT ROLLBACK/MIGRATION--------- NAMING CONVENTION
	
	- Pick 1 & make DB naming convention consistent:
	  camelCase or use of underscores.  (go with Underscores)

	- Use an app to generate fake data

	- Add an employee_history table, which will have data of hire, title, & hourly-rate history





Table creation order:
locations,
activity_codes,
cost_centers,
employees,
projects,
activities,
timesheets,
users,
user_profiles,
*/
exports.up = function(knex, Promise) {
	return Promise.all([

	knex.schema.createTable('locations', function(table) {
	  table.increments('location_id').primary();
	  table.text('location_name'); 
	  table.text('location_address');
	  table.text('location_city');
	  table.text('location_state');
	  table.text('location_zip');
	  table.enu('location_type', ['residential', 'commercial']);
	  table.timestamps(true, true);// this automatically sets 'created at' and 'updated at' timestamps
	}),

	knex.schema.createTable('activity_codes', function(table) {
	  table.increments('activity_code_id').primary();
	  table.text('activity_type'); 
  	  table.timestamps(true, true);// this automatically sets 'created at' and 'updated at' timestamps
	}),

	knex.schema.createTable('cost_centers', function(table) {
	  table.increments('cost_center_id').primary();
	  table.text('cost_center_name'); 
  	  table.timestamps(true, true);// this automatically sets 'created at' and 'updated at' timestamps
	}),

	knex.schema.createTable('employees', function(table) {
	  table.increments('employee_id').primary();
	  table.text('firstName'); 
	  table.text('lastName'); 
	  table.text('phone'); 
	  table.text('email'); 
	  table.integer('pay'); 
	  table.timestamps(true, true);// this automatically sets 'created at' and 'updated at' timestamps
	}),

	knex.schema.createTable('projects', function(table) {
	  table.increments('project_id').primary();
	  table.integer('location_id').references('locations.location_id');
	  table.integer('project_mgr_emp_id').references('employees.employee_id'); 
	  table.date('project_date_begin');
	  table.date('project_date_end');
	  table.timestamps(true, true);// this automatically sets 'created at' and 'updated at' timestamps
	}),


	// 1:M activities:timesheets --> can have several timesheets per activity
	// ==> allows for multiple employees per pactivity
	knex.schema.createTable('activities', function(table) {
	  table.increments('activity_id').primary();
	  table.integer('activity_code_id').references('activity_codes.activity_code_id'); 

		// emp_assigned_to = the employee it is assigned to. if blank, it's unassigned and multiple employees can view it (based on the activity codes they can view)
	  table.integer('emp_assigned_to').references('employees.employee_id'); 

		// i.e. the employee who assigned it. might be manager. could even be a regular employee
	  table.integer('emp_assigned_by').references('employees.employee_id');
	  table.integer('project_id').references('projects.project_id'); 
	  table.text('activity_notes');
	  table.timestamp('activity_datetime_begin');
	  table.timestamp('activity_datetime_end');


	  table.timestamps(true, true);// this automatically sets 'created at' and 'updated at' timestamps
	}),

	// get all timesheets by activity_id and order descending by date
	// to, for example, get list of timesheets
	knex.schema.createTable('timesheets', function(table) {
	  table.increments('timesheet_id').primary();
	  table.integer('activity_id').references('activities.activity_id'); 
	  table.integer('emp_authorized_by').references('employees.employee_id');  // i.e the employee who reviewed it and accepted it as accurate
	  table.integer('emp_accepted_by').references('employees.employee_id');  // i.e. the employee who accepted it-- the one who clocked in
	  table.integer('cost_center_id').references('cost_centers.cost_center_id'); 
	  table.text('timesheet_notes');
	  table.timestamp('timesheet_submitted_datetime');
	  table.timestamp('timesheet_clockin');
	  table.timestamp('timesheet_clockout');

		// info on GPS precision: https://en.wikipedia.org/wiki/Decimal_degrees
		// DECIMAL offers an insane amount of digits before and after decimal: https://www.postgresql.org/docs/9.1/static/datatype-numeric.html
	  table.specificType('timesheet_clockin_lat', 'DECIMAL'); //.defaultTo(knex.raw('POINT (37.3875, -122.0575)'))
	  table.specificType('timesheet_clockin_long', 'DECIMAL'); //.defaultTo(knex.raw('POINT (37.3875, -122.0575)'))
	  table.specificType('timesheet_clockout_lat', 'DECIMAL'); //.defaultTo(knex.raw('POINT (37.3875, -122.0575)'))
	  table.specificType('timesheet_clockout_long', 'DECIMAL'); //.defaultTo(knex.raw('POINT (37.3875, -122.0575)'))

	  table.timestamps(true, true);// this automatically sets 'created at' and 'updated at' timestamps
	}),

	knex.schema.createTable('users', function(table) {
		table.increments('user_id').primary();
		// has employee_id or not ==> used to test for applicants vs employees
		// 
		// for example, if has employee_id && user_type === 'regular' => send them to employee/:employee_id with regular config
		// for example, if has employee_id && user_type === 'manager' => send them to employee/:employee_id with manager config
			// however, have their employee_id checked at that point to see if they're on the list of managers
			// if so, show them their page as a manager page
			
		// else, send them to users/:user_id
		table.integer('employee_id').references('employees.employee_id'); 
		table.text('user_email');
		table.text('hashed_password');
		// this can be used to track whether employee is mgr, admin, or regular
		table.text('user_type'); // this should be of type ENUM or ENU once i figure out all categories
		// so, ill be able to access this info within the 'employees' viewport
		// --> edit user_type for example, or hire/fire/restrict employees
		table.timestamps(true, true);// this automatically sets 'created at' and 'updated at' timestamps
	}),

		knex.schema.createTable('user_profiles', function(table) {
		table.increments('user_profile_id').primary();
		table.integer('user_id').references('users.user_id'); 
		table.text('user_profile_imageFilename');
		table.text('user_profile_resumeFilename');
		table.text('user_profile_firstName');
		table.text('user_profile_lastName');
		table.text('user_profile_address1');
		table.text('user_profile_address2');
		table.text('user_profile_city');
		table.text('user_profile_state');
		table.text('user_profile_zipcode');

		table.timestamps(true, true);// this automatically sets 'created at' and 'updated at' timestamps

	})
	

	])
};

exports.down = function(knex, Promise) {

/*
Table creation order:
locations,
activity_codes,
cost_centers,
employees,
projects,
activities,
timesheets,
users,
user_profiles,
*/
	return Promise.all([
	    knex.schema.dropTable('user_profiles'),
	    knex.schema.dropTable('users'),
	    knex.schema.dropTable('timesheets'),
	    knex.schema.dropTable('activities'),
	    knex.schema.dropTable('projects'),
	    knex.schema.dropTable('employees'),
	    knex.schema.dropTable('cost_centers'),
	    knex.schema.dropTable('activity_codes'),
	    knex.schema.dropTable('locations'),
	  ]);
  
};
