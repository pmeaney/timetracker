const Promise = require('bluebird')
const merge = require('array-object-merge')
var axios = require('axios')

// knex 
const dotenv = require("dotenv").config({ path: '../.env' });
const environment = process.env.NODE_ENV
const knex_config = require('../knexfile');
const database = require('knex')(knex_config[environment]);

const Api_fns = require('../lib/api_fns')
const General_fns = require('../lib/general_fns')

/*//=>###########################################
//=>###   Event emitters (for Admin viewport(s))
//=>##########################################*/
const EventEmitter = require('events');
class AdminAPI_EventEmitterClass extends EventEmitter { }
const AdminAPI_EventStream_EventEmitter = new AdminAPI_EventEmitterClass();

const EmployeeAPI_EventsEmitter = require('./EmployeeAPI_controllers').EmployeeAPI_EventsEmitter;

    /*//=>###########################################
    //=>###   Admin view, listening to Employee Event emitter, in order to update MapAndTable within Viewport_Maps
    //=>##########################################*/
    // => EmployeeAPI_EventsEmitter is imported here, because we listen to it in order to real-time update
    // => the Admin's viewport: MapAndTable (at: src/client/reactComponents/admin_dashboard/MapAndTable.js )
    // => Therefore, the end result is an update of the admin view, based on an employee's action. Hence this is in the AdminAPI_controllers.js file

    // => SECTION FOR: Timesheet clockin/clockout listener.  Listens to Employee Timesheet clockin/clockout
  EmployeeAPI_EventsEmitter.on('message', data => {
    // console.log('received message in EmployeeAPI_EventsEmitter, with data: ', data)
    if (data.title === 'timesheet') {

      console.log('[Emitting event: new timesheet clockin] Step 2 - Clockin data received.  Now going to do some additional lookups on this timesheet, # ', data.timesheet.timesheet_id)

      return Promise.try(() => {
        return Api_fns.getTimesheet_by_timesheet_id(data.timesheet.timesheet_id);
      }).then((timesheets) => {
        return Api_fns.AdditionalDataLookup_On_Timesheets_array(timesheets)
      }) 
      .then((resultDataFromLookup) => {
        console.log('[Emitting event: new timesheet -- clockin] Step 3 - Additional lookups successful, now we will emit the final data to Admin API event stream')

        console.log('resultDataFromLookup for sending to thru event stream', resultDataFromLookup[0])

        

        if (data.timesheet_type === 'new_timesheet') {
          console.log('new_timesheet received')
          AdminAPI_EventStream_EventEmitter.emit('message', {
            ...resultDataFromLookup[0],
            timesheet_main_type: 'livestream_timesheet',
            timesheet_sub_type: 'new_timesheet',
          })
        }

        if (data.timesheet_type === 'updated_timesheet') {
          console.log('updated_timesheet received')

          AdminAPI_EventStream_EventEmitter.emit('message', {
            ...resultDataFromLookup[0],
            timesheet_main_type: 'livestream_timesheet',
            timesheet_sub_type: 'updated_timesheet',
          })
        }
      })
    } 
    // console.log('received message in EmployeeAPI_EventsEmitter, with data.timesheet.timesheet_id: ', data.timesheet.timesheet_id)
    // do lookup
    // after lookup, emit message with lookup data to AdminAPI_EventStream_EventEmitter
  });


/*//=>###########################################
//=>###     Event stream -- Emitting to Client
//=>##########################################*/

const AdminEventStream = (req, res) => { 

  // res.status(200).set({
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  AdminAPI_EventStream_EventEmitter.on('message', data => {
    console.log('[Emitting event: new timesheet clockin] Step 4 - Final data received in Admin API event stream.  Sending it into the data stream where the client will find it.')
    console.log('data in step 4 is', data)
    if (data.timesheet_main_type === 'livestream_timesheet') {
      console.log('writing data to stream now')
      // The string-type data to send to admin eventstream:
      res.write(`event: message\n`);
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    }
  });
}

/*//*###########################################
//*###          REGULAR (non-stream) Route controllers
//*##########################################*/

/*##########################################
##            Data for Data Table -- Receives url parameter as the table name to query
##########################################*/

const get_DataForTable = (req, res) => {

  console.log('params received for db lookup: table name: ', req.params.tableName)
  // note on regex character escape:  \W is the equivalent of [^0-9a-zA-Z_] -- so, we keep only those characters and discard anything else such as strange characters
  const escaped_tableName = req.params.tableName.replace(/\W/g, '')

  // need to change if (true) to check session for user_type of admin, once an admin account registration system is set up.
  if (true) {
    return Promise.try(() => {
      return Api_fns.get_Admin_dataFor_DataTable(escaped_tableName);
    })
    .then((dataResponse) => {
      // console.log('dataResponse is ', dataResponse)

      /* Here, after receiving the data, we submit this array of the properties of datetime data to convert 
        which might be in the object returned.  We then sort by primary key & format the date time
        before sending the data object to the frontend
      */

      const DateTimes_need_converting_toBeReadable = [
        'activity_datetime_begin',
        'activity_datetime_end',
        'timesheet_submitted_datetime',
        'timesheet_clockin',
        'timesheet_clockout',
        'created_at',
        'updated_at' ]

      var SortedAndFormattedData = General_fns.SortData_ByPrimaryKey_And_Format_DateTimes(dataResponse, DateTimes_need_converting_toBeReadable)

    res.status(200).json(SortedAndFormattedData)
    })
  }
}

const put_DataForTable_update = (req, res) => {
  console.log('req received for db table update', req.body)
  /* 
  besides tablename, fieldname, and newValue, we also need the ID of the row.
  */
  // need to change if (true) to check session for user_type of admin, once an admin account registration system is set up.
  if (true) {
    return Promise.try(() => {
      return Api_fns.put_DataForTable_update_Table_Field_withData(
        req.body.tableName,
        req.body.tableRow_type,
        req.body.tableRow_id,
        req.body.fieldName,
        req.body.newValueToPut
      )
    })
      .then((resultData) => {
        // console.log('resultData', resultData)

        res.status(200).json(resultData);
      })
  } else {
    res.status(500).json({ error: 'sorry, we were unable to fulfill your request for to update the table data.' });
  }

}

/*##########################################
##            Timesheets
##########################################*/
const get_Timesheets_All = (req, res) => {

  console.log('checking req.query', req.query)
  console.log('req.query.begin_timestamp', req.query.begin_timestamp)
  console.log('typeof req.query.begin_timestamp', typeof req.query.begin_timestamp)
  
  // reference: stack overflow comment w/ good info: https://stackoverflow.com/a/21045779
  var escaped_begin_timestamp = req.query.begin_timestamp.replace(/^([^0-9a-zA-Z_:.]+)$/g, '') 
  var escaped_end_timestamp = req.query.end_timestamp.replace(/^([^0-9a-zA-Z_:.]+)$/g, '')

// need to change if (true) to check session for user_type of admin, once an admin account registration system is set up.
  if (true) {
    return Promise.try(() => {
      return Api_fns.get_AllTimesheets_WithinRange(escaped_begin_timestamp, escaped_end_timestamp);
    }).then((timesheets) => {
        return Api_fns.AdditionalDataLookup_On_Timesheets_array(timesheets)
      })
      .then((resultData) => {
        console.log('get_AllTimesheets_WithinRange resultData', resultData)
        res.status(200).json(resultData);
      })
  } else {
    res.status(500).json({ error: 'sorry, we were unable to fulfill your request for timesheet data.' });
  }
}

/*##########################################
##            Projects
##########################################*/
const get_locationsByProjects_All = (req, res) => {
  
  return Promise.try(() => {
    return Api_fns.get_Locations_byProjID_forAllProjects()
  }).then((response) => {
    // console.log('get_RecentWorkActivityInfo_ByEmpID response is ', response)
    res.status(200).json(response);
  })
}

const get_Locations_All = (req, res) => {

  return Promise.try(() => {
    return Api_fns.getLocations_All()
  }).then((response) => {
    // console.log('get_RecentWorkActivityInfo_ByEmpID response is ', response)
    res.status(200).json(response);
  })
}


/*##########################################
##            Activity codes
##########################################*/
const get_activityCodes_All = (req, res) => {
  
  return Promise.try(() => {
    return Api_fns.getActivityCodes_All()
  }).then((response) => {
    // console.log('get_activityCodes_All response is ', response)
    res.status(200).json(response);
  })
}

/*##########################################
##            Employees
##########################################*/
const get_Employees_All = (req, res)  => {
  
  return Promise.try(() => {
    return Api_fns.getEmployees_All()
  }).then((response) => {
    // console.log('get_activityCodes_All response is ', response)
    res.status(200).json(response);
  })
} 

const get_Projects_WithLocation_and_ProjectMgr = (req, res) => {
  return Promise.try(() => {
    return Api_fns.get_retrieve_Projects_WithLocation_and_ProjectMgr()
  }).then((results) => {
    res.status(200).json(results);
  })
}

const get_User_applicantData = (req, res) => {
  return Promise.try(() => {
    return Api_fns.getUserApplicantData(req.body)
  }).then((results) => {
    res.status(200).json(results);
  })
}

const post_createTableRow = (req, res) => { 
  console.log('/createRow/:tableName -- request received for table name: ', req.params.tableName)
  // note on regex character escape:  \W is the equivalent of [^0-9a-zA-Z_] -- so, we keep only those characters and discard anything else such as strange characters
  const escaped_tableName = req.params.tableName.replace(/\W/g, '')
  // TODO: This needs frontend validation in the Admin form (check employee version too).

  /* Currently, admin user can add new rows to four tables:
  activities, activity_codes, projects, locations.
  For each of them, escape the posted object values,
  and then insert them into DB
  */

  const tables_available = ['activities', 'activity_codes', 'projects', 'locations']

  if (!tables_available.includes(escaped_tableName)){
    res.status(500).json({ error: 'Sorry, that table does not exist or is not available for editing.' });
  }

  if (escaped_tableName === 'activities') {
    console.log('Request for "activities" table update received-- req.body', req.body)
    // TODO: Once admin user is incorporated into registration system, provide their user ID in "newActivity_objectToPost" object a few lines below

    req.body.newActivity_employee_ids_selected.map((emp_id) => {
      console.log('newActivity_employee_ids_selected emp_id', emp_id)
      console.log('will insert data for this employee.')


      var newActivity_objectToPost = {
        newActivity_emp_assigned_by: null, // TODO: Once admin user is incorporated into registration system, provide their user ID here.
        newActivity_emp_assigned_to: emp_id,

        newActivity_notes: req.body.newActivity_notes,
        newActivity_type: req.body.newActivity_type,
        newActivity_project_id: req.body.newActivity_project_id,
        newActivity_begin_dateTime: req.body.newActivity_begin_dateTime,
        newActivity_end_dateTime: req.body.newActivity_end_dateTime,
      }

      return Promise.try(() => {
        return Api_fns.post_createRow_Activities(newActivity_objectToPost)
      })
      .then((results) => {
        console.log('post_createTableRow -- results', results)
        // res.status(200).json(results)
      })

    })
  }

  if (escaped_tableName === 'activity_codes') {
    console.log('Request for "activity_codes" table update received-- req.body', req.body)
    // TODO: This needs frontend validation in the form.
    return Promise.try(() => {
      return Api_fns.post_createRow_ActivityCodes(req.body)
    }).then((results) => {
      res.status(200).json(results);
    })
  }

  if (escaped_tableName === 'projects') {
    console.log('Request for "projects" table update received-- req.body', req.body)
    // TODO: This needs frontend validation in the form.
    return Promise.try(() => {
      return Api_fns.post_createRow_Projects(req.body)
    }).then((results) => {
      res.status(200).json(results);
    })
  }

  if (escaped_tableName === 'locations') {
    console.log('Request for "locations" table update received-- req.body', req.body)

    // TODO: This needs frontend validation in the form.
    // Here, we need to do a gps lookup.  Add the coordinates into this DB insert function below (post_createRow_Locations)
    // info: https://developers.google.com/maps/documentation/geocoding/start?csw=1
    // example: https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY
    const gmaps_key = process.env.GMAPS_API.toString()

    // replace all spaces with plus signs, so we can put each piece of address data into the url string
    const formattedAddress = []
    Object.values(req.body).map((currentElement) => {
      formattedAddress.push(currentElement.replace(/ /g, "+"))
    })

    const gmaps_api_url = 'https://maps.googleapis.com/maps/api/geocode/json?key=' + gmaps_key 
    const url_query_addressLine = gmaps_api_url + '&address=' + formattedAddress[0] + ',' // address
                                              + formattedAddress[1] + ',' // city
                                              + formattedAddress[2]       // state
    /* 
    req.body { 
  location_address
  location_city
  location_state
  location_name
  location_type
   */
    axios
      .get(url_query_addressLine)
      .then((response) => {
        // console.log('response from gmaps coordinates lookup are: response.data', response.data)
        // console.log('response from gmaps coordinates lookup are:  response.data[0]', response.data.results[0])
        // console.log('response response.data.geometry ', response.data.results[0].geometry)
        // console.log('response response.data.geometry ', response.data.results[0].geometry.location.lat)
        // console.log('response response.data.geometry ', response.data.results[0].geometry.location.lng)
        // console.log('results lng: ', results.data.geometry.location.lng)
        const location_latitude = response.data.results[0].geometry.location.lat
        const location_longitude = response.data.results[0].geometry.location.lng
        // const loc_lat = location_latitude.toString().substr(0,10)
        // const loc_lng = location_longitude.toString().substr(0, 10)
        console.log('location_latitude', location_latitude)
        console.log('location_longitude', location_longitude)

        var loc_lat = location_latitude.toString()
        var loc_lng = location_longitude.toString()

        var loc_lat_trimmed = loc_lat.substr(0, 9)
        var loc_lng_trimmed = loc_lng.substr(0, 9)

        // If negative coordinate, override by taking an extra character, so that we get 9 digits.
         if (loc_lat.charAt(0) === '-') {
          console.log('begins with negative: ', loc_lat)
          loc_lat_trimmed = loc_lat.substr(0, 10)
           console.log('loc_lat_trimmed @ 10', loc_lat_trimmed, loc_lat_trimmed.length)
        }
        if (loc_lng.charAt(0) === '-') {
          console.log('begins with negative: ', loc_lng)
          loc_lng_trimmed = loc_lng.substr(0, 10)
          console.log('loc_lng_trimmed @ 10', loc_lat_trimmed, loc_lat_trimmed.length)
        }

        console.log('loc_lat_trimmed', loc_lat_trimmed, loc_lat_trimmed.length)
        console.log('loc_lng_trimmed', loc_lng_trimmed, loc_lng_trimmed.length)

        return { location_latitude, location_longitude }
      })
      .then((objectReturned) => {
        return Promise.try(() => {
          return Api_fns.post_createRow_Locations({ ...req.body, ...objectReturned}) // just add in lat, lng
        })
      })
      .then((results) => {
        res.status(200).json(results);
      })
      .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log(error.config);
      })

 
  }
}


module.exports = { 
  AdminEventStream,
  get_Timesheets_All,
  get_locationsByProjects_All,
  get_Locations_All,
  get_activityCodes_All,
  get_Employees_All,
  get_DataForTable,
  put_DataForTable_update,
  get_Projects_WithLocation_and_ProjectMgr,
  get_User_applicantData,
  post_createTableRow
}