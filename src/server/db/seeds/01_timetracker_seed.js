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
    .then(() => knex('employees').del())
    .then(() => knex('cost_centers').del())
    .then(() => knex('activity_codes').del())
    .then(() => knex('locations').del())

    .then(() => {  // Using promises allows to catch errors during process
      return Promise.all([
      
      knex('locations').insert([
        { location_name: 'Brisbane post office', location_address: "280 Old County Rd", location_city: "brisbane", location_state: "ca", location_zip: "94005", location_type: "commercial"},
        { location_name: 'Brisbane Hardware & Sply Inc', location_address: "1 Visitacion Ave", location_city: "brisbane", location_state: "ca", location_zip: "94005", location_type: "commercial"},
        { location_name: 'Artichoke Joe&apos;s Casino', location_address: "659 Huntington Ave", location_city: "San Bruno", location_state: "ca", location_zip: "94066", location_type: "commercial"},
      ]),

      knex('activity_codes').insert([
        { activity_type: 'indoor painting'},
        { activity_type: 'outdoor painting'},
        { activity_type: 'indoor carpentry'},
        { activity_type: 'electrical'},
        { activity_type: 'plumbing'},
        { activity_type: 'landscaping'},
        { activity_type: 'irrigation'},
        { activity_type: 'dry wall installation'},
        { activity_type: 'framing'},
        { activity_type: 'bull dozer driving'},
        { activity_type: 'demolition &amp; cleanup'},
      ]),

      /* 
        cost centers allow me to create different timesheet categories per department
        more info on cost center info design: http://www.doa.la.gov/OTS/ERP/blueprint/finance/FI-CO-003%20Presentation.pdf
      */

      knex('cost_centers').insert([
        { cost_center_name: 'operations payroll' }
      ]),

      knex('employees').insert([
        { firstName: 'George', lastName: 'Jefferson', phone: "123-456-7890", email: "email@gmail.com", pay: "20", address: "testingUser default address" },
        { firstName: 'Bill', lastName: 'Smith', phone: "123-456-7890", email: "email@gmail.com", pay: "20", address: "testingUser default address" },
        { firstName: 'James', lastName: 'Bond', phone: "123-456-7890", email: "email@gmail.com", pay: "20", address: "testingUser default address" },
        { firstName: 'Sam', lastName: 'Anderson', phone: "123-456-7890", email: "email@gmail.com", pay: "20", address: "testingUser default address" },
      ])
    ]) // end first promise.all
    .then(() => {
      return Promise.all([
          knex('projects').insert([                                                                // this IS a "date" datatype (simple date), not timestamp
            { location_id: 1, project_mgr_emp_id: 1, project_date_begin: '2018-01-01', project_date_end: '2018-01-20'},
            { location_id: 2, project_mgr_emp_id: 3, project_date_begin: '2018-01-15', project_date_end: '2018-01-30'},
            { location_id: 3, project_mgr_emp_id: 4, project_date_begin: '2018-02-02', project_date_end: '2018-02-09'},
          ])
        ])
    })
    .then(() => {
      return Promise.all([
          // note: UTC is 7 hours ahead of PST
          //  2018-01-01T00:00:00.000Z
          // NEED TO FIX:  Add in 'activity manager', stop using 'emp_assigned_by' as default for activity mgr
          knex('activities').insert([
            { activity_code_id: 1, project_id: 1, emp_assigned_by: 1, emp_assigned_to: 2, activity_notes: 'paint with blue until you run out, then switch to red', activity_datetime_begin: '2018-01-01T16:00:00.000Z', activity_datetime_end: '2018-01-01T21:00:00.000Z'},
            { activity_code_id: 3, project_id: 2, emp_assigned_by: 1, emp_assigned_to: 2, activity_notes: 'work on building shelf in store', activity_datetime_begin: '2018-02-01T13:00:00.000Z', activity_datetime_end: '2018-02-01T21:00:00.000Z'},
            { activity_code_id: 11, project_id: 3, emp_assigned_by: 1, emp_assigned_to: 3, activity_notes: 'demolish and clean up the flagged separating wall in champagne conference room', activity_datetime_begin: '2018-02-01T16:05:00.000Z', activity_datetime_end: '2018-02-08T21:00:00.000Z'},
         
            { activity_code_id: 11, project_id: 1, emp_assigned_by: 1, emp_assigned_to: 4, activity_notes: 'demolish and clean up the flagged separating wall in champagne conference room', activity_datetime_begin: '2018-02-03T13:00:00.000Z', activity_datetime_end: '2018-02-08T21:00:00.000Z'},
            { activity_code_id: 8, project_id: 2, emp_assigned_by: 1, emp_assigned_to: 2, activity_notes: 'install drywall in champagne conference room', activity_datetime_begin: '2018-02-04T13:00:00.000Z', activity_datetime_end: '2018-02-08T21:00:00.000Z'},
            { activity_code_id: 8, project_id: 3, emp_assigned_by: 1, emp_assigned_to: 2, activity_notes: 'Testing...', activity_datetime_begin: '2018-02-04T13:00:00.000Z', activity_datetime_end: '2018-02-08T21:00:00.000Z'},
         
            { activity_code_id: 8, project_id: 1, emp_assigned_by: 1, emp_assigned_to: 2, activity_notes: 'Testing 2...', activity_datetime_begin: '2018-03-07T16:00:00.000Z', activity_datetime_end: '2018-02-08T21:00:00.000Z'},
            { activity_code_id: 8, project_id: 2, emp_assigned_by: 1, emp_assigned_to: 2, activity_notes: 'Testing 3...', activity_datetime_begin: '2018-03-06T15:00:00.000Z', activity_datetime_end: '2018-02-08T21:00:00.000Z'},
            { activity_code_id: 8, project_id: 2, emp_assigned_by: 1, emp_assigned_to: 2, activity_notes: 'Testing 4...', activity_datetime_begin: '2018-03-05T14:00:00.000Z', activity_datetime_end: '2018-02-08T21:00:00.000Z'},
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
            { activity_id: 1, emp_authorized_by: 1, emp_accepted_by: 2, cost_center_id: 1,  timesheet_notes: 'ran 15 minutes late', timesheet_submitted_datetime: '2018-01-01T12:00:00.000Z', timesheet_clockin: '2018-01-01T16:15:00.000Z', timesheet_clockout: '2018-01-02T00:00:00.000Z',   timesheet_clockin_lat: '37.685246', timesheet_clockin_long: '-122.40277', timesheet_clockout_lat: '37.685116', timesheet_clockout_long: '-122.40140'},
            { activity_id: 2, emp_authorized_by: 1, emp_accepted_by: 2, cost_center_id: 1,  timesheet_notes: 'all good', timesheet_submitted_datetime: '2018-02-01T13:00:00.000Z', timesheet_clockin: '2018-02-01T13:00:00.000Z', timesheet_clockout: '2018-02-02T00:05:00.000Z',              timesheet_clockin_lat: '37.684378', timesheet_clockin_long: '-122.40413', timesheet_clockout_lat: '37.684126', timesheet_clockout_long: '-122.40240'},
            { activity_id: 3, emp_authorized_by: 2, emp_accepted_by: 3, cost_center_id: 1,  timesheet_notes: 'we broke a wheelbarrow', timesheet_submitted_datetime: '2018-02-14T15:02:00.000Z', timesheet_clockin: '2018-02-01T16:05:00.000Z', timesheet_clockout: '2018-02-02T00:05:00.000Z',timesheet_clockin_lat: '37.684310', timesheet_clockin_long: '-122.40293', timesheet_clockout_lat: '37.684136', timesheet_clockout_long: '-122.40240'},
            { activity_id: 4, emp_authorized_by: 3, emp_accepted_by: 4, cost_center_id: 1,  timesheet_notes: 'nothing to report', timesheet_submitted_datetime: '2018-02-14T15:02:00.000Z', timesheet_clockin: '2018-02-03T13:00:00.000Z', timesheet_clockout: '2018-02-02T00:05:00.000Z',     timesheet_clockin_lat: '37.684678', timesheet_clockin_long: '-122.40333', timesheet_clockout_lat: '37.684146', timesheet_clockout_long: '-122.40240'},
            // { activity_id: 5, emp_authorized_by: 2, emp_accepted_by: 2, cost_center_id: 1,  timesheet_notes: 'drywall done. sealant needs 48 hours to dry', timesheet_submitted_datetime: '2018-02-04T13:05:00.000Z', timesheet_clockin: '2018-02-04T13:05:00.000Z', timesheet_clockout: null, timesheet_clockin_lat: '37.684518', timesheet_clockin_long: '-122.40103', timesheet_clockout_lat: null, timesheet_clockout_long: null},
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
