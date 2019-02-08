import React, { Component }  from 'react';
import { toggle_Visibility_Viewport_TaskList } from "./redux/actions"
import { connect } from 'react-redux'
import axios from "axios"
import { getLuxon_local_DateTime, make_FirstLetter_UpperCase } from "../lib/general_fns"
import ModalAddNewActivity from './ModalAddNewActivity'

// import { library } from '@fortawesome/fontawesome-svg-core';
// import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// library.add(faPlusCircle);


class Viewport_TaskList extends Component {
  constructor() {
    super();
    this.state = {
      employee_data_newTasks_forClockIn: [], // loaded in from first task get call
      employee_data_existingTasks_forClockOut: [], // loaded in as above, but also added to on ClockIn of timesheets
      employee_data_recentlyCompletedTasks_clockedOut: [], // tasks which have been completed, for temporary retrieval for editing, current browser state
      loading: false,
      clicked_activity_id: 0
    }

    this.HandleClick_CloseButton_VisibilityToggle_Viewort_TaskList = this.HandleClick_CloseButton_VisibilityToggle_Viewort_TaskList.bind(
      this
    );
    this.HandleClick_Task_ClockIn_or_ClockOut = this.HandleClick_Task_ClockIn_or_ClockOut.bind(
      this
    );
    this.HandleClick_Create_UnscheduledTimesheet = this.HandleClick_Create_UnscheduledTimesheet.bind(
      this
    );
  }
  
  componentWillMount() {
    console.log('TaskList has mounted.')
    const existingTimesheets = []
    const newTasks = []

      // Going to be working with employee_id 2, as the test employee user account
    axios.get('/emp_api/activities/getPendingTasks/')
      .then((response) => {
        response.data.map((obj,i) => {
          if (Object.keys(obj).includes("timesheet_id")) {
            // console.log('We have an existing timesheet for this task -- it is this object:', obj)
            existingTimesheets.push(obj)
          } else {
            // console.log('We have a new task -- it is this object:', obj)
            newTasks.push(obj)
          }
        })
      })
      .then(() => {
        console.log('existingTimesheets', existingTimesheets)
        console.log('newTasks', newTasks)
        this.setState({
          employee_data_existingTasks_forClockOut: existingTimesheets,
          employee_data_newTasks_forClockIn: newTasks
        })
      })
      .then(() => {
        console.log('state was updated after get call, it is now: ', this.state)
        console.log('############################')
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  componentDidMount() {
    const es = new EventSource('/emp_api/eventstream', { withCredentials: true })

    es.onmessage = (e) => {
      console.log('on message e', e)
      const es_data = JSON.parse(e.data)
      console.log('[Viewport_tasklist cDM] employee event stream data', es_data)


      /* 
      Currently the object looks like this-- NOTE: We need to run an additional lookup on this before sending it through stream,
      so ill go fix that.

      newActivity: {
        activity_code_id: 1
        activity_datetime_begin: "2019-02-04T06:04:04.145Z"
        activity_datetime_end: "2019-02-11T06:01:04.145Z"
        activity_id: 20
        activity_notes: "blah paint %2422 .. ##"
        emp_assigned_by: 2
        emp_assigned_to: 2
        project_id: 1
      }
      newActivity_type: "employeeSelfAssignedActivity"
      title: "newActivity"

      => Here's how the object needs to look in order to push it into the new tasks within state:
        activity_code_id: 8
        activity_datetime_begin: "2018-02-04T13:00:00.000Z"
        activity_datetime_end: "2018-02-08T21:00:00.000Z"
        activity_id: 15
        activity_notes: "Testing 3..."
        activity_type: "dry wall installation"
        emp_assigned_by: 1
        emp_assigned_to: 2
        location_address: "1 Visitacion Ave"
        location_city: "brisbane"
        location_name: "Brisbane Hardware & Sply Inc"
        location_state: "ca"
        location_type: "commercial"
        location_zip: "94005"
        projectMgr_email: "email@gmail.com"
        projectMgr_firstName: "James"
        projectMgr_lastName: "Bond"
        projectMgr_phone: "123-456-7890"
        project_id: 2
 */
      
      // if (es_data.newActivity_type === "employeeSelfAssignedActivity") {

      // Here, we add it to the new tasks array within state.
      // So, take state, and append a new activity
      //   var infoWindowObj = { isOpen: false }
      //   this.props.concat_Additional_Timesheet_Data(es_data, infoWindowObj)
      // }

      // if (es_data.timesheet_sub_type === "updated_timesheet") {
      //   var clockOutData = {
      //     timesheet_clockout: es_data.timesheet_clockout,
      //     timesheet_clockout_lat: es_data.timesheet_clockout_lat,
      //     timesheet_clockout_long: es_data.timesheet_clockout_long,
      //     timesheet_sub_type: es_data.timesheet_sub_type // this simply overwrites "new_timesheet" with "updated_timesheet"
      //   }

      //   var timesheet_id = es_data.timesheet_id

      //   this.props.update_ClockedOut_Timesheet_Data(timesheet_id, clockOutData)
      // }
      // es.close()
    }

    es.onerror = function (e) {
      console.log("Error: EventSource failed for url: /emp_api/eventstream (Viewport_tasklist component, componentDidMount)");
    };


  }
  

  HandleClick_CloseButton_VisibilityToggle_Viewort_TaskList(e) {
    e.stopPropagation(); // stop bubbling up to parent div
    this.props.toggle_Visibility_Viewport_TaskList(false); // visibility -> false
  }

  HandleClick_Create_UnscheduledTimesheet(e) {
    // e.stopPropagation(); // stop bubbling up to parent div
    console.log('clicked HandleClick_Create_UnscheduledTimesheet')
  }


  HandleClick_Task_ClockIn_or_ClockOut(isActiveTimesheet, activity_id, e) {
    this.setState({
      loading: true,
      clicked_activity_id: activity_id
    })

    e.stopPropagation(); // stop bubbling up to parent div
    
    const SuccessCallback_submitData_ClockIn_newTimesheet = (latitude, longitude) => {

      var clockInTime = new Date()
      console.log('Clocking In... at time: ', clockInTime, ' and location: ', latitude, ', ', longitude)

      // this.setState({
      //   loading: true,
      //   clicked_activity_id: activity_id }, () => {
      axios.post('/emp_api/timesheets/create', {
        activity_id: activity_id,
        timesheet_clockin: clockInTime,
        latitude: latitude,
        longitude: longitude
      })
      .then((response) => {
        if (response.status == 200) {
          console.log('post (create) response for activity_id: ', response.data[0].activity_id);
          // console.log('response.data[0].timesheet_clockin', response.data[0].timesheet_clockin)
          // * Add new timesheetDataItem to employee_data_existingTasks_forClockOut
          const arrayToFilter = this.state.employee_data_newTasks_forClockIn

          // first, we filter the array by the one we just created, so we can pull it out and add it to the exitingTasks array
          const item_addTo_existingTasks = arrayToFilter.filter(item => item.activity_id === response.data[0].activity_id)
          // console.log('Item to add to existing tasks : ', item_addTo_existingTasks[0])

          // updated item... i.e. the item (aka Task) we "updated" by clocking into it.  Basically, we took an activity and turned it into a timesheet
          const updated_item_ToAdd = {
            ...item_addTo_existingTasks[0],
            timesheet_clockin: response.data[0].timesheet_clockin
          }
          console.log('updated_item_ToAdd to existing tasks:', updated_item_ToAdd)
          const joined_existingTasks_withNewTask = this.state.employee_data_existingTasks_forClockOut.concat(updated_item_ToAdd)

          // * Remove timesheetDataItem from employee_data_newTasks_forClockIn
          const arrayToFilter_removeItem = this.state.employee_data_newTasks_forClockIn
          const itemsToKeep_inNewTasks = arrayToFilter_removeItem.filter(item => item.activity_id !== response.data[0].activity_id)
          console.log('Items to keep in new task (all but the one clicked) :', itemsToKeep_inNewTasks)

          this.setState({
            loading: false,
            employee_data_existingTasks_forClockOut: joined_existingTasks_withNewTask,
            employee_data_newTasks_forClockIn: itemsToKeep_inNewTasks
          })

          console.log('[ClockIn] State is now ', this.state)
        }
      })
      .catch((error) => {
        console.log(error);
      })
    // })

    }

    const SuccessCallback_submitData_ClockOut_ActiveTimesheet = (latitude, longitude) => {
      
      var clockOutTime = new Date()
      console.log('Clocking Out... at time: ', clockOutTime, ' and location: ', latitude, ', ', longitude)

      axios.put('/emp_api/timesheets/update', {
        activity_id: activity_id,
        timesheet_clockout: clockOutTime,
        latitude: latitude,
        longitude: longitude
      })
        .then((response) => {
          if (response.status == 200) {
            console.log('put (update) response for activity_id: ', response.data[0].activity_id);
            
          // * Add timesheetDataItem to employee_data_recentlyCompletedTasks_clockedOut
            const arrayToFilter = this.state.employee_data_existingTasks_forClockOut
            const item_addTo_RecentlyCompletedTasks = arrayToFilter.filter(item => item.activity_id === response.data[0].activity_id)
            const updated_item_ToAdd = { // adding on clockout data before we update state
              ...item_addTo_RecentlyCompletedTasks[0],
              timesheet_clockout: response.data[0].timesheet_clockout
            }
            console.log('Updated Item to add to recently completed tasks : ', updated_item_ToAdd)

            const joined_completedTasks_withRecentlyCompletedTask = this.state.employee_data_recentlyCompletedTasks_clockedOut.concat(updated_item_ToAdd)

          // * Remove timesheetDataItem from employee_data_existingTasks_forClockOut
            const arrayToFilter_removeItem = this.state.employee_data_existingTasks_forClockOut
            const itemsToKeep_inExistingTasks_forClockout = arrayToFilter_removeItem.filter(item => item.activity_id !== response.data[0].activity_id)
            console.log('Items to keep in existing, unclocked-out-of tasks (all but the one clicked-- because it was clocked out of) :', itemsToKeep_inExistingTasks_forClockout)

            this.setState({
                loading: false,
                employee_data_recentlyCompletedTasks_clockedOut: joined_completedTasks_withRecentlyCompletedTask,
                employee_data_existingTasks_forClockOut: itemsToKeep_inExistingTasks_forClockout
            })

            console.log('[ClockOut] State is now ', this.state)
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }

    const geoFindMe = () => {
      if (!navigator.geolocation) {
        console.log("Geolocation is not supported by your browser")
        return;
      }
      function success(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        if (isActiveTimesheet) {
  
          SuccessCallback_submitData_ClockOut_ActiveTimesheet(latitude, longitude)
        } else {
          SuccessCallback_submitData_ClockIn_newTimesheet(latitude, longitude)
        }
      }
      function error() {
        console.log("Unable to retrieve your location")
      }
      console.log('############################')
      console.log("Locating... for activity_id: ", activity_id)
      
      navigator.geolocation.getCurrentPosition(success, error);
    }
     
      geoFindMe()

  }

  render() {

    const existingTaskCards = this.state.employee_data_existingTasks_forClockOut.map((obj, i) => {

      let activity_begin_date = getLuxon_local_DateTime(obj.activity_datetime_begin, 'date')
      let activity_begin_time = getLuxon_local_DateTime(obj.activity_datetime_begin, 'time')

      let activity_end_date = getLuxon_local_DateTime(obj.activity_datetime_end, 'date')
      let activity_end_time = getLuxon_local_DateTime(obj.activity_datetime_end, 'time')

      let clockedIn_date = getLuxon_local_DateTime(obj.timesheet_clockin, 'date')
      let clockedIn_time = getLuxon_local_DateTime(obj.timesheet_clockin, 'time')

      return( 
        <div key={i} className="column makeFixedColumnWidth">
          <div className="card">
            <header className="card-header">
              <p className="card-header-title">
                {obj.activity_type.replace(/^\w/, function (chr) {
                  return chr.toUpperCase();
                })} A_ID: { obj.activity_id }
              </p>
            </header>
            <div className="card-content smallSpacing">
              <div className="content">
                <p>
                  Begin: { activity_begin_date} at {activity_begin_time }
                  <br />
                  End: {activity_end_date} at {activity_end_time}
                  <br />
                  ClockedIn: {clockedIn_date} at {clockedIn_time}
                  <br />
                  &diams;&nbsp;
                  {obj.activity_notes}
                </p>
              </div>
            </div>
            <footer className="card-footer">

              {this.state.loading && this.state.clicked_activity_id == obj.activity_id ?
                <a
                  href="#"
                  className="card-footer-item"><b>LOADING</b>
                </a>
                :
                <a
                  href="#"
                  className="card-footer-item"
                  onClick=
                  {e => this.HandleClick_Task_ClockIn_or_ClockOut(true, obj.activity_id, e)}
                >Clock Out</a>
              }

              <a href="#" className="card-footer-item">More Info</a>
            </footer>
          </div>
        </div>
      )
    })

    const newTaskCards = this.state.employee_data_newTasks_forClockIn.map((obj, i) => {

      let activity_begin_date = getLuxon_local_DateTime(obj.activity_datetime_begin, 'date')
      let activity_begin_time = getLuxon_local_DateTime(obj.activity_datetime_begin, 'time')

      let activity_end_date = getLuxon_local_DateTime(obj.activity_datetime_end, 'date')
      let activity_end_time = getLuxon_local_DateTime(obj.activity_datetime_end, 'time')

      return (
        <div key={i} className="column makeFixedColumnWidth">
          <div className="card">
            <header className="card-header">
              <p className="card-header-title">
                {obj.activity_type.replace(/^\w/, function (chr) {
                  return chr.toUpperCase();
                })} A_ID: {obj.activity_id}
              </p>
            </header>
            <div className="card-content smallSpacing">
              <div className="content">
                <p>
                  Begin: {activity_begin_date} at {activity_begin_time}
                  <br />
                  End: {activity_end_date} at {activity_end_time}
                  <br />
                  &diams;&nbsp;
                  {obj.activity_notes}
                  
                </p>
              </div>
            </div>
            <footer className="card-footer">

            {this.state.loading && this.state.clicked_activity_id == obj.activity_id ?
                <a
                  href="#"
                  className="card-footer-item"><b>LOADING</b>
                </a>
                 :
                <a
                  href="#"
                  className="card-footer-item"
                  onClick=
                  {e => this.HandleClick_Task_ClockIn_or_ClockOut(false, obj.activity_id, e)}
                >Clock In</a>
            }
             

              <a href="#" className="card-footer-item">More Info</a>
            </footer>
          </div>
        </div>
      )
    })

    return (
      <article className="message topSpacing">
        <div className="message-header">
          <span className="customPaddingForText">Task List</span>
          <span className="customSpan">
          {/* New feature idea: Add a button which is a gears icon.  It has dropdown content dropdown showing recently clocked out timesheets, allowing the user to re-open a clockedout timesheet to add a new clockedout time */}
            <ModalAddNewActivity />
          </span>
          <button 
            className="delete" 
            aria-label="close_viewport"
            onClick={
              e => this.HandleClick_CloseButton_VisibilityToggle_Viewort_TaskList(e)
            }
          ></button>
        </div>
        <div className="message-body">
          <div className="columns overflowXYScroll makeFixedColumnHeight">
            { existingTaskCards }
            { newTaskCards }
          </div>
        </div>
      </article>
    )
  }
}

// const mapStateToProps = store => ({
//   visibility_viewport_taskList: store.visibility_viewport_taskList
// })

const mapDispatchToProps = {
  toggle_Visibility_Viewport_TaskList
}

export default connect(
  // mapStateToProps,
  null,
  mapDispatchToProps
)(Viewport_TaskList);