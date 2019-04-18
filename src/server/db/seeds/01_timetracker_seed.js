/*
Table creation order:
locations,
activity_codes,
cost_centers,
employees,
projects,
activities,
timesheets,
users, --> user instantiated
user_profiles, --> user instantiated

*/

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('timesheets').del()
    .then(() => knex('activities').del())
    .then(() => knex('projects').del())
    .then(() => knex('employment_histories').del())
    .then(() => knex('employees').del())
    .then(() => knex('cost_centers').del())
    .then(() => knex('activity_codes').del())
    .then(() => knex('locations').del())

    .then(() => {  // Using promises allows to catch errors during process
      return Promise.all([

      // mock users, just so we can link mock employee & user profiles accounts to them

      // NOTE: Below, 'users' contains user_email, as does user_profile.
      // To keep things simple, I am leaving user_email in the users table-- this is the email they use to register with.
      // To update their email, they will have a separate option (at least a separate put request within the serverside API), 
      // rather than updating it with/along with their other "profile" info.
      // => user_email will be account related, will eventually remove it from.
      knex('users').insert([
        { user_email: 'mock_employee@email.com', user_type: 'employee' }, //hashed_password is also a field, but we'll skip it since we'll never log in with these users, they're just for display to admin dashboard
        { user_email: 'mock_employee@email.com', user_type: 'employee' }, //hashed_password is also a field, but we'll skip it since we'll never log in with these users, they're just for display to admin dashboard
        { user_email: 'mock_employee@email.com', user_type: 'general-hasNot-applied' }, //hashed_password is also a field, but we'll skip it since we'll never log in with these users, they're just for display to admin dashboard
        { user_email: 'mock_employee@email.com', user_type: 'general-hasNot-applied' }, //hashed_password is also a field, but we'll skip it since we'll never log in with these users, they're just for display to admin dashboard
      ]),
    
      // mock user profiles, so we have some fake employee photos to display to admin on map
      knex('user_profiles').insert([ 
                                                                                // note: new users will start with: not-yet-completed.pdf as resume, then on the frontend, react will check the first 17 characters, if they match 'not-yet-completed' then it won't link to the resume, it will just be plain text in the data table or whatever UI element is presenting the text.
        { user_id: 1, user_profile_imageFilename: 'profilePhoto_user_id__1.png', user_profile_resumeFilename: 'Resume_user_id__1.pdf', user_profile_firstName: 'James', user_profile_lastName: 'Bond', user_profile_phoneNumber: "123-456-7890", user_profile_email: "email@gmail.com", user_profile_address: "testingUser default address", user_profile_city: '', user_profile_state: '' },
        { user_id: 2, user_profile_imageFilename: 'profilePhoto_user_id__2.png', user_profile_resumeFilename: 'Resume_user_id__2.pdf', user_profile_firstName: 'Austin', user_profile_lastName: 'Powers', user_profile_phoneNumber: "123-456-7890", user_profile_email: "email@gmail.com", user_profile_address: "testingUser default address", user_profile_city: '', user_profile_state: '' },
        { user_id: 3, user_profile_imageFilename: 'profilePhoto_user_id__3.png', user_profile_resumeFilename: 'Resume_user_id__3.pdf', user_profile_firstName: 'Jack', user_profile_lastName: 'Ryan', user_profile_phoneNumber: "123-456-7890", user_profile_email: "email@gmail.com", user_profile_address: "testingUser default address", user_profile_city: '', user_profile_state: '' },
        { user_id: 4, user_profile_imageFilename: 'profilePhoto_user_id__4.png', user_profile_resumeFilename: 'Resume_user_id__4.pdf', user_profile_firstName: 'Jason', user_profile_lastName: 'Bourne', user_profile_phoneNumber: "123-456-7890", user_profile_email: "email@gmail.com", user_profile_address: "testingUser default address", user_profile_city: '', user_profile_state: '' },
      ]),

      knex('locations').insert([
        { location_name: 'Brisbane post office', location_address: "280 Old County Rd", location_city: "brisbane", location_state: "ca", location_zip: "94005", location_type: "commercial", location_latitude: "37.6852468", location_longitude: "-122.402772",},
        { location_name: 'Brisbane Hardware & Sply Inc', location_address: "1 Visitacion Ave", location_city: "brisbane", location_state: "ca", location_zip: "94005", location_type: "commercial", location_latitude: "37.6844807", location_longitude: "-122.4023486", }, 
        { location_name: 'Artichoke Joe&apos;s Casino', location_address: "659 Huntington Ave", location_city: "San Bruno", location_state: "ca", location_zip: "94066", location_type: "commercial", location_latitude: "37.6279224", location_longitude: "-122.4110658",},
        { location_name: 'Artichoke Joe&apos;s Hotel', location_address: "639 Huntington Ave", location_city: "San Bruno", location_state: "ca", location_zip: "94066", location_type: "commercial", location_latitude: "37.6807661", location_longitude: "-122.3999715",},
      ]),

      knex('activity_codes').insert([
/* 1  */  { activity_type: 'indoor painting'},
/* 2  */  { activity_type: 'outdoor painting'},
/* 3  */  { activity_type: 'indoor carpentry'},
/* 4  */  { activity_type: 'electrical'},
/* 5  */  { activity_type: 'plumbing'},
/* 6  */  { activity_type: 'landscaping'},
/* 7  */  { activity_type: 'irrigation'},
/* 8  */  { activity_type: 'dry wall installation'},
/* 9  */  { activity_type: 'framing'},
/* 10 */  { activity_type: 'bull dozer driving'},
/* 11 */  { activity_type: 'demolition and cleanup'},
/* 12 */  { activity_type: 'project setup'},

      ]),

      /* 
        cost centers allow me to create different timesheet categories per department
        more info on cost center info design: http://www.doa.la.gov/OTS/ERP/blueprint/finance/FI-CO-003%20Presentation.pdf
      */

      knex('cost_centers').insert([
        { cost_center_name: 'operations payroll' }
      ]),

      knex('employees').insert([
        { user_id: 1, employee_type: 'regular_employee' },
        { user_id: 2, employee_type: 'regular_employee' },
        { user_id: 3, employee_type: 'regular_employee' },
        { user_id: 4, employee_type: 'regular_employee' }
      ])
    ]) // end first promise.all
    .then(() => {
      return Promise.all([
        
        knex('employment_histories').insert([                                                                // this IS a "date" datatype (simple date), not timestamp
          { employee_id: 1, employee_type: 'regular_employee', employment_change_reason: 'hired', employment_change_notes: '', employment_pay_rate: 20 },
          { employee_id: 2, employee_type: 'regular_employee', employment_change_reason: 'hired', employment_change_notes: '', employment_pay_rate: 20 },
          { employee_id: 3, employee_type: 'regular_employee', employment_change_reason: 'hired', employment_change_notes: '', employment_pay_rate: 20 },
          { employee_id: 4, employee_type: 'regular_employee', employment_change_reason: 'hired', employment_change_notes: '', employment_pay_rate: 20 },
        ]),
      
        knex('projects').insert([                                                                // this IS a "date" datatype (simple date), not timestamp
          { location_id: 1, project_mgr_emp_id: 1, project_date_begin: '2019-03-01', project_date_end: '2019-03-04', project_description: 'We will demolish old shelving and build new shelving'},
          { location_id: 2, project_mgr_emp_id: 3, project_date_begin: '2019-03-01', project_date_end: '2019-03-04', project_description: 'Setting up solar panel system and a scaffold to hold them'},
          { location_id: 3, project_mgr_emp_id: 4, project_date_begin: '2019-03-04', project_date_end: '2019-03-05', project_description: 'Landscaping and interior work'},
          { location_id: 4, project_mgr_emp_id: 2, project_date_begin: '2019-03-07', project_date_end: '2019-03-09', project_description: ''},
        ])
      ])
    })
    .then(() => {
      return Promise.all([
          // note: UTC is 7 hours ahead of PST
          //  2019-01-01T00:00:00.000Z
          // NEED TO FIX:  Add in 'activity manager', stop using 'emp_assigned_by' as default for activity mgr
          knex('activities').insert([
            { activity_code_id: 11, project_id: 1, emp_assigned_by: 1, emp_assigned_to: 2, activity_notes: 'Demolish the current shelves and wall behind them.', activity_datetime_begin: '2019-03-01T16:00:00.000Z', activity_datetime_end: '2019-03-01T21:00:00.000Z'},
            { activity_code_id: 11, project_id: 1, emp_assigned_by: 1, emp_assigned_to: 4, activity_notes: 'Clean up', activity_datetime_begin: '2019-03-03T13:00:00.000Z', activity_datetime_end: '2019-03-03T21:00:00.000Z'},
            { activity_code_id: 12, project_id: 1, emp_assigned_by: 1, emp_assigned_to: 2, activity_notes: 'Bring the bundle of materials for new shelving at post office', activity_datetime_begin: '2019-04-07T16:00:00.000Z', activity_datetime_end: '2019-03-04T21:00:00.000Z'},

            { activity_code_id: 12, project_id: 2, emp_assigned_by: 1, emp_assigned_to: 2, activity_notes: 'Set up electrical equipment for solar panel installation, bring metal framing equipment', activity_datetime_begin: '2019-03-01T13:00:00.000Z', activity_datetime_end: '2019-03-01T21:00:00.000Z'},
            { activity_code_id: 9, project_id: 2, emp_assigned_by: 1, emp_assigned_to: 2, activity_notes: 'Build a metal scaffold for solar panels', activity_datetime_begin: '2019-03-02T13:00:00.000Z', activity_datetime_end: '2019-03-02T21:00:00.000Z'},
            { activity_code_id: 4, project_id: 2, emp_assigned_by: 1, emp_assigned_to: 2, activity_notes: 'Assemble solar panel system', activity_datetime_begin: '2019-03-03T15:00:00.000Z', activity_datetime_end: '2019-03-03T21:00:00.000Z'},
            { activity_code_id: 4, project_id: 2, emp_assigned_by: 1, emp_assigned_to: 2, activity_notes: 'Assemble solar panel system', activity_datetime_begin: '2019-03-04T15:00:00.000Z', activity_datetime_end: '2019-03-04T21:00:00.000Z'},
            // { activity_code_id: 4, project_id: 2, emp_assigned_by: 1, emp_assigned_to: 2, activity_notes: 'Testing 4...', activity_datetime_begin: '2019-03-05T14:00:00.000Z', activity_datetime_end: '2019-03-08T21:00:00.000Z'},

            { activity_code_id: 6, project_id: 3, emp_assigned_by: 1, emp_assigned_to: 2, activity_notes: 'Lanscape in the pool area.', activity_datetime_begin: '2019-03-04T13:00:00.000Z', activity_datetime_end: '2019-03-04T21:00:00.000Z'},
            { activity_code_id: 11, project_id: 3, emp_assigned_by: 1, emp_assigned_to: 3, activity_notes: 'Demolish and clean up the flagged separating wall in vip suite', activity_datetime_begin: '2019-03-05T16:05:00.000Z', activity_datetime_end: '2019-03-05T21:00:00.000Z'},
          ])
        ])
    })
    .then(() => {
      return Promise.all([
          // note: emp_authorized_by means 'employee ID of employee who approved this timesheet for payroll'
          // note: emp_accepted_by in the future, will be able to differ from activities.emp_assigned_to, because
          // a manager can change activities.emp_assigned_to for an activity, at which point the value would be updated to the new
          // employee's ID.  then, that new employee will create a 'clockin' which is actually one of these timesheet rows, using that ID.
          // but for now, I will leave emp_accepted_by === activities.emp_assigned_to even though it is redunant
          knex('timesheets').insert([
            { activity_id: 1, emp_authorized_by: 1, emp_accepted_by: 2, cost_center_id: 1,  timesheet_notes: 'ran 15 minutes late', timesheet_submitted_datetime: '2019-01-01T12:00:00.000Z', timesheet_clockin: '2019-01-01T16:15:00.000Z', timesheet_clockout: '2019-01-02T23:00:00.000Z',   timesheet_clockin_lat: '37.685246', timesheet_clockin_long: '-122.40277', timesheet_clockout_lat: '37.685116', timesheet_clockout_long: '-122.40140'},
            { activity_id: 2, emp_authorized_by: 1, emp_accepted_by: 2, cost_center_id: 1,  timesheet_notes: 'all good', timesheet_submitted_datetime: '2019-02-01T13:00:00.000Z', timesheet_clockin: '2019-02-01T13:00:00.000Z', timesheet_clockout: '2019-02-02T23:05:00.000Z',              timesheet_clockin_lat: '37.684378', timesheet_clockin_long: '-122.40413', timesheet_clockout_lat: '37.684126', timesheet_clockout_long: '-122.40240'},
            { activity_id: 3, emp_authorized_by: 2, emp_accepted_by: 3, cost_center_id: 1,  timesheet_notes: 'we broke a wheelbarrow', timesheet_submitted_datetime: '2019-02-14T15:02:00.000Z', timesheet_clockin: '2019-03-30T13:05:00.000Z', timesheet_clockout: '2019-03-30T23:05:00.000Z',timesheet_clockin_lat: '37.684310', timesheet_clockin_long: '-122.40293', timesheet_clockout_lat: '37.684136', timesheet_clockout_long: '-122.40240'},
            { activity_id: 4, emp_authorized_by: 3, emp_accepted_by: 4, cost_center_id: 1, timesheet_notes: 'nothing to report', timesheet_submitted_datetime: '2019-02-14T15:02:00.000Z', timesheet_clockin: '2019-04-04T12:56:27.477Z', timesheet_clockout: '2019-04-04T17:56:27.477Z',     timesheet_clockin_lat: '37.684678', timesheet_clockin_long: '-122.40333', timesheet_clockout_lat: '37.684146', timesheet_clockout_long: '-122.40240'},
            { activity_id: 5, emp_authorized_by: 2, emp_accepted_by: 2, cost_center_id: 1, timesheet_notes: 'drywall done. sealant needs 48 hours to dry', timesheet_submitted_datetime: '2019-04-09T13:05:00.000Z', timesheet_clockin: '2019-04-08T13:05:00.000Z', timesheet_clockout: '2019-04-08T23:05:00.000Z', timesheet_clockin_lat: '37.84518', timesheet_clockin_long: '-122.20103', timesheet_clockout_lat: '37.484146', timesheet_clockout_long: '-122.10240' },
          ])

        ])
    })

    .catch(reason => { 
        console.log('inner error: ',  reason); 
    })

  }) // end main .then
  .catch(reason => { 
      console.log('outer error:', reason); 
  }); // last .then
};
