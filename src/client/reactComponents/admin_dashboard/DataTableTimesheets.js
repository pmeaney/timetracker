import React from "react";
import getLuxon_local_DateTime from "../lib/general_fns"
import { connect } from 'react-redux'
import { toggle_InfoWindow_isOpen_State } from './redux/actions'

const DataTableTimesheets = (props) => {
  
  const list = props.timesheetData.map((item, i) => {

  // if timesheet's scheduled activity has a start time, display that scheduled start time in a readable format.  otherwise, display null
  const activity_begin_time = item.activity_datetime_begin ? getLuxon_local_DateTime(item.activity_datetime_begin, 'time') : null
  const activity_begin_date = item.activity_datetime_begin ? getLuxon_local_DateTime(item.activity_datetime_begin, 'date') : null

  // timesheet must have a start time, so no conditional check is necessary
  const timesheet_begin_time = getLuxon_local_DateTime(item.timesheet_clockin, 'time')
  const timesheet_begin_date = getLuxon_local_DateTime(item.timesheet_clockin, 'date')

  // if timesheet's has an end time (in which case it is clocked out), display that end time in a readable format.  otherwise, display null
  const timesheet_end_time = item.timesheet_clockout ? getLuxon_local_DateTime(item.timesheet_clockout, 'time') : null
  const timesheet_end_date = item.timesheet_clockout ? getLuxon_local_DateTime(item.timesheet_clockout, 'date') : null

    return (
      <tr 
        key={item.timesheet_id}
        onClick={props.toggle_InfoWindow_isOpen_State.bind(this, i)}
      >
        <td>{item.timesheet_id}</td>
        <td>{item.firstName} {item.lastName}</td>
        <td>{activity_begin_time} {activity_begin_date}</td>
        <td>{timesheet_begin_time} {timesheet_begin_date}</td>
        <td>{timesheet_end_time} {timesheet_end_date}</td>
      </tr>
    )
  })

  // onClick = { props.toggle_InfoWindow_isOpen_State.bind(this, i) } 


  return (
    <div>
      <table className="table is-striped is-narrow tableCustom">
        <thead>
          <tr>
            <th>T</th>
            <th>Name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
            <th>Time Begin</th>
            <th>Clocked In</th>
            <th>Clocked out</th>
          </tr>
        </thead>
        <tbody>
          { list }
        </tbody>
      </table>
    </div>
  )
}

const mapStateToProps = (store) => ({
  timesheetData: store.timesheetData,
  infoWindows: store.infoWindows
})

const mapDispatchToProps = {
  toggle_InfoWindow_isOpen_State
}

export default connect(mapStateToProps, mapDispatchToProps)(DataTableTimesheets);
