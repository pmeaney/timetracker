import React from "react";
import getLuxon_local_DateTime from "../lib/general_fns"
import { connect } from 'react-redux'

const DataTableTimesheets = (props) => {
  
  const list = props.timesheetData.map((item, i) => {

  const activity_begin_time = getLuxon_local_DateTime(item.activity_datetime_begin, 'time')
  const activity_begin_date = getLuxon_local_DateTime(item.activity_datetime_begin, 'date')

  const timesheet_begin_time = getLuxon_local_DateTime(item.timesheet_clockin, 'time')
  const timesheet_begin_date = getLuxon_local_DateTime(item.timesheet_clockin, 'date')

  const timesheet_end_time = item.timesheet_clockout ? getLuxon_local_DateTime(item.timesheet_clockout, 'time') : null
  const timesheet_end_date = item.timesheet_clockout ? getLuxon_local_DateTime(item.timesheet_clockout, 'date') : null

    return (
      <tr key={item.timesheet_id}>
        <td>{item.timesheet_id}</td>
        <td>{item.firstName} {item.lastName}</td>
        <td>{activity_begin_time} {activity_begin_date}</td>
        <td>{timesheet_begin_time} {timesheet_begin_date}</td>
        <td>{timesheet_end_time} {timesheet_end_date}</td>
      </tr>
    )
  })


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

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(DataTableTimesheets);
