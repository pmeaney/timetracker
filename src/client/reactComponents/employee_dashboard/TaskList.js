import React, { Component }  from 'react';
import { toggle_Visibility_Viewport_A } from "./redux/actions"
import { connect } from 'react-redux'
import axios from "axios"


class TaskList extends Component {
  constructor() {
    super();
    this.state = {
      employee_data_newTasks_forClockIn: [], // loaded in from first task get call
      employee_data_existingTasks_forClockOut: [], // loaded in as above, but also added to on ClockIn of timesheets
      employee_data_recentlyCompletedTasks_clockedOut: [] // tasks which have been completed, for temporary retrieval for editing, current browser state
    }

    this.HandleClick_VisibilityToggle_Viewort_A = this.HandleClick_VisibilityToggle_Viewort_A.bind(
      this
    );
    this.HandleClick_Task_ClockIn_or_ClockOut = this.HandleClick_Task_ClockIn_or_ClockOut.bind(
      this
    );
  }
  
  componentWillMount() {
    console.log('TaskList has mounted.')
    const existingTimesheets = []
    const newTasks = []

    axios.get('http://localhost:3000/emp_api/activities/getPendingTasks/emp/2')
      .then((response) => {
        response.data.map((obj,i) => {
          if (Object.keys(obj).includes("timesheet_id")) {
            console.log('We have a timesheet for this task')
            existingTimesheets.push(obj)
          } else {
            console.log('We have a new task')
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
        console.log('state is', this.state)
        console.log('first obj employee_data_existingTasks_forClockOut', this.state.employee_data_existingTasks_forClockOut[0])
      })
      .catch(function (error) {
        console.log(error);
      });
       /* To Do:
           Conditionally display timesheet cards first (if they exist), then activity cards next
           unclosed Tasks (i.e. timesheet exists but has no clockOut info) -> onClick fn: clockOut of timesheet
           new tasks (i.e. activity exists but timesheet does not) -> OnClick fn: create new timesheet
        */
  }

  componentWillUnmount() {
    console.log('TaskList is about to unmount.')
  }

  HandleClick_VisibilityToggle_Viewort_A(toggleValue, e) {
    e.stopPropagation(); // stop bubbling up to parent div
    this.props.toggle_Visibility_Viewport_A(toggleValue);
  }


  HandleClick_Task_ClockIn_or_ClockOut(isActiveTimesheet, activity_id, e) {
    e.stopPropagation(); // stop bubbling up to parent div

    const SuccessCallback_submitData_ClockIn_newTimesheet = (latitude, longitude) => {
      console.log('Clocking in...')
      /* This will contain an http post request with:
        activity_id
        time
        latitude
        longitude

        to: /timesheets/create
      */
      console.log('Latitude is ' + latitude + '° Longitude is ' + longitude + '...')
      console.log('TYPE OF Latitude is ' + typeof latitude + '° Longitude is ' + typeof longitude + '...')

      var clockInTime = new Date()
      axios.post('http://localhost:3000/emp_api/timesheets/create', {
        activity_id: activity_id,
        timesheet_clockin: clockInTime,
        latitude: latitude,
        longitude: longitude
      })
      .then((response) => {
        if (response.status == 200) {
          console.log('post (create) response for activity_id: ', response.data[0].activity_id);

          // ? Add new thing to employee_data_existingTasks_forClockOut
          const arrayToFilter = this.state.employee_data_newTasks_forClockIn
          const item_addTo_existingTasks = arrayToFilter.filter(item => item.activity_id === response.data[0].activity_id)
          console.log('Item to add to existing tasks : ', item_addTo_existingTasks[0])
          const joined_existingTasks_withNewTask = this.state.employee_data_existingTasks_forClockOut.concat(item_addTo_existingTasks[0])

          // ? Remove thing from employee_data_newTasks_forClockIn
          const arrayToFilter_removeItem = this.state.employee_data_newTasks_forClockIn
          const itemsToKeep_inNewTasks = arrayToFilter_removeItem.filter(item => item.activity_id !== response.data[0].activity_id)
          console.log('Items to keep in new task (all but the one clicked) :', itemsToKeep_inNewTasks)
          /* 
          employee_data_newTasks_forClockIn
            -> update it to contain the newly clocked in thing.
            */

          this.setState({
            employee_data_existingTasks_forClockOut: joined_existingTasks_withNewTask,
            employee_data_newTasks_forClockIn: itemsToKeep_inNewTasks
          })

          console.log('[ClockIn] State is now ', this.state)
        }
      })
      .catch((error) => {
        console.log(error);
      });

    }

    const SuccessCallback_submitData_ClockOut_ActiveTimesheet = (latitude, longitude) => {
      console.log('Clocking Out...')
      /* This will contain an http put request with:
        timesheet_id (could just use activity_id, but I'd rather be explicit)
        time
        latitude
        longitude
      */

      var clockOutTime = new Date()
      axios.put('http://localhost:3000/emp_api/timesheets/update', {
        activity_id: activity_id,
        timesheet_clockout: clockOutTime,
        latitude: latitude,
        longitude: longitude
      })
        .then((response) => {
          if (response.status == 200) {
            console.log('put (update) response for activity_id: ', response.data[0].activity_id);
          // ! Add thing to employee_data_recentlyCompletedTasks_clockedOut
            const arrayToFilter = this.state.employee_data_existingTasks_forClockOut
            const item_addTo_RecentlyCompletedTasks = arrayToFilter.filter(item => item.activity_id === response.data[0].activity_id)
            console.log('Item to add to recently completed tasks : ', item_addTo_RecentlyCompletedTasks[0])
            const joined_completedTasks_withRecentlyCompletedTask = this.state.employee_data_recentlyCompletedTasks_clockedOut.concat(item_addTo_RecentlyCompletedTasks[0])

          // ! Remove thing from employee_data_existingTasks_forClockOut
            const arrayToFilter_removeItem = this.state.employee_data_existingTasks_forClockOut
            const itemsToKeep_inExistingTasks_forClockout = arrayToFilter_removeItem.filter(item => item.activity_id !== response.data[0].activity_id)
            console.log('Items to keep in new task (all but the one clicked) :', itemsToKeep_inExistingTasks_forClockout)

            this.setState({
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
      console.log("Locating...")
      navigator.geolocation.getCurrentPosition(success, error);
    }
    geoFindMe()

  }


  // HandleClick_Task_ClockIn_or_ClockOut(activity_id, e) {
  //   e.stopPropagation(); // stop bubbling up to parent div

  //   console.log('clicked clockin of card with activity_id of ', activity_id)
    
  //   const SuccessCallback_submitData_ClockIn = (latitude, longitude) => {
  //     console.log('Latitude is ' + latitude + '° Longitude is ' + longitude + '...')
  //     console.log('TYPE OF Latitude is ' + typeof latitude + '° Longitude is ' + typeof longitude + '...')

  //     var clockInTime = new Date()
  //     axios.post('http://localhost:3000/emp_api/timesheets/createOrUpdate_timesheet', {
  //       activity_id: activity_id,
  //       timesheet_clockin: clockInTime,
  //       latitude: latitude,
  //       longitude: longitude
  //     })
  //       .then(function (response) {
  //         console.log(response);
  //       })
  //       .catch(function (error) {
  //         console.log(error);
  //       });

  //   }

  //   const geoFindMe = () => {
  //     if (!navigator.geolocation) {
  //       console.log("Geolocation is not supported by your browser")
  //       return;
  //     }
  //     function success(position) {
  //       var latitude = position.coords.latitude;
  //       var longitude = position.coords.longitude;
  //       SuccessCallback_submitData_ClockIn(latitude, longitude)
  //     }
  //     function error() {
  //       console.log("Unable to retrieve your location")
  //     }
  //     console.log("Locating...")
  //     navigator.geolocation.getCurrentPosition(success, error);
  //   }
  //   geoFindMe()
  // }


  render() {

    // This needs to be setup for Clocking out (change text & create a new onClick function for clockout)
    const existingTaskCards = this.state.employee_data_existingTasks_forClockOut.map((obj, i) => {
      return( 
        <div key={i} className="column makeFixedColumnWidth">
          <div className="card">
            <header className="card-header">
              <p className="card-header-title">
                {obj.activity_type} A_ID: { obj.activity_id }
              </p>
            </header>
            <div className="card-content smallSpacing">
              <div className="content">
                <p>
                  Date: Need to format date
                  {/* Date: {obj.activity_readable_date_begin} */}
                  <br />
                  Time: {obj.activity_datetime_begin }&nbsp;&ndash;&nbsp;
                        { obj.activity_datetime_end }
                  <br />
                  ClockedIn: { obj.timesheet_clockin }
                  <br />
                  &diams;&nbsp;
                  {obj.activity_notes}
                </p>
              </div>
            </div>
            <footer className="card-footer">

                <a
                  href="#"
                  className="card-footer-item"
                  onClick=
                  {e => this.HandleClick_Task_ClockIn_or_ClockOut(true, obj.activity_id, e)}
                >Clock Out</a>

              <a href="#" className="card-footer-item">More Info</a>
            </footer>
          </div>
        </div>
      )
    })

    const newTaskCards = this.state.employee_data_newTasks_forClockIn.map((obj, i) => {
      return (
        <div key={i} className="column makeFixedColumnWidth">
          <div className="card">
            <header className="card-header">
              <p className="card-header-title">
                {obj.activity_type} A_ID: {obj.activity_id}
              </p>
            </header>
            <div className="card-content smallSpacing">
              <div className="content">
                <p>
                  Date: Need to format date
                  {/* Date: {obj.activity_readable_date_begin} */}
                  <br />
                  Time: {obj.activity_datetime_begin}&nbsp;&ndash;&nbsp;
                        {obj.activity_datetime_end}
                  <br />
                  &diams;&nbsp;
                  {obj.activity_notes}
                </p>
              </div>
            </div>
            <footer className="card-footer">

              <a
                href="#"
                className="card-footer-item"
                onClick=
                {e => this.HandleClick_Task_ClockIn_or_ClockOut(false, obj.activity_id, e)}
              >Clock In</a>

              <a href="#" className="card-footer-item">More Info</a>
            </footer>
          </div>
        </div>
      )
    })

    return (
      <article className="message topSpacing">
        <div className="message-header">
          <p>Task List</p>
          <button 
            className="delete" 
            aria-label="delete"
            onClick={
              e => this.HandleClick_VisibilityToggle_Viewort_A(false, e)
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

const mapStateToProps = store => ({
  visibility_viewport_a: store.visibility_viewport_a
})

const mapDispatchToProps = {
  toggle_Visibility_Viewport_A
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskList);