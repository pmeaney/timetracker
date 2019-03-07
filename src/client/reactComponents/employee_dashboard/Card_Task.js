import React, { Component } from 'react'
import { getLuxon_local_DateTime } from "../lib/general_fns"
import Modal_MoreInfo from './Modal_MoreInfo'

class Card_Task extends Component {
    constructor(props){
      super(props)
      this.state = { 
        visible: false,
        activity_begin_date: '',
        activity_begin_time: '',
        activity_end_date: '',
        activity_end_time: ''
      }
      this.Toggle_modal_visibility = this.Toggle_modal_visibility.bind(this)
    }
  
    componentWillMount() {
      console.log('props are...', this.props)
      this.setState({
        activity_begin_date: getLuxon_local_DateTime(this.props.activity_obj.activity_datetime_begin, 'date'),
        activity_begin_time: getLuxon_local_DateTime(this.props.activity_obj.activity_datetime_begin, 'date'),
        activity_end_date: getLuxon_local_DateTime(this.props.activity_obj.activity_datetime_begin, 'date'),
        activity_end_time: getLuxon_local_DateTime(this.props.activity_obj.activity_datetime_begin, 'date'),
        loading: false,
        clicked_activity_id: 0,
      })

      this.HandleClick_Task_ClockIn_or_ClockOut = this.HandleClick_Task_ClockIn_or_ClockOut.bind(this)
      this.Toggle_modal_visibility = this.Toggle_modal_visibility.bind(this)

    }
    
    Toggle_modal_visibility(){
      this.setState({
        visible: !this.state.visible
      })
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
      var token = document.querySelector("[name=csrf-param][content]").content // token is on meta tag

      // this.setState({
      //   loading: true,
      //   clicked_activity_id: activity_id }, () => {
      axios.post('/emp_api/timesheets/create', {
        activity_id: activity_id,
        timesheet_clockin: clockInTime,
        latitude: latitude,
        longitude: longitude
      },
        {
          headers:
          {
            'CSRF-Token': token,
          }
        })
        .then((response) => {
          console.log('response.status from clockin:', response.status)
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
  }

    render() {
    
      var activity_obj = this.props.activity_obj


    return (

      <div key={activity_obj.activity_id} className="column makeFixedColumnWidth">
        <div className="card">
          <header className="card-header">
            <p className="card-header-title">
              {activity_obj.activity_type.replace(/^\w/, function (chr) {
                return chr.toUpperCase();
              })} A_ID: {activity_obj.activity_id}
            </p>
          </header>
          <div className="card-content smallSpacing">
            <div className="content">
              <p>
                Begin: {activity_obj.activity_begin_date} at {activity_obj.activity_begin_time}
                <br />
                End: {activity_obj.activity_end_date} at {activity_obj.activity_end_time}
                <br />
                {/* {
                  this.props.card_type === 'new_task' ?
                    <span><br />
                      ClockedIn: {activity_obj.clockedIn_date} at {activity_obj.clockedIn_time}
                    </span>
                  :
                  null
                } */}
                &diams;&nbsp;
                  {activity_obj.activity_notes}
              </p>
            </div>
          </div>
            {this.state.loading && this.state.clicked_activity_id === activity_obj.activity_id ?
            <footer className="card-footer">
              <a
                href="#"
                className="card-footer-item"><b>LOADING</b>
              </a>
              <Modal_MoreInfo
                className="card-footer-item"
                // FnFor_OnClick={ e => this.HandleClick_MoreInfo_Modal(obj, e)}
                activity_obj={obj}
              />
            </footer>
              :
            <footer className="card-footer">
              <a
                href="#"
                className="card-footer-item"
                onClick=
                {e => this.HandleClick_Task_ClockIn_or_ClockOut(true, activity_obj.activity_id, e)}
              >Clock Out</a>
              <Modal_MoreInfo
                className="card-footer-item"
                // FnFor_OnClick={ e => this.HandleClick_MoreInfo_Modal(obj, e)}
                activity_obj={activity_obj}
              />
              </footer>
        }
        </div>
      </div>
    )
  }
}


export default Card_Task