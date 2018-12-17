import React from "react"
import axios from 'axios'

/* 
current notes: ==> dropdown selector: chooses the table to display.

previous notes:
This is for the dropdown selector in ../admin_dashboard/Viewport_AdminDataTable.js
it gets pre-population data for admin data table-- so it taps endpooints which provide info on several main tables

These perform get calls for data, and return it to the function which called them.
There, within a react component, the data is passed into state and rendered into a data grid.

*/
export const run_getData = (selectedOption) => {
  switch (selectedOption.value) {
    case 'timesheets':
      getData_timesheets()
      break;
    case 'activities':
      getData_activities()
      break;
    default:
      console.log('[src/client/reactComponents/lib/adminDataTable_getData_fns.js]: unknown value received in data lookup for AdminDataTable. -- ', selectedOption.value)
  }
}

const getData_timesheets = () => {
  console.log('ran timesheets get')
}

const getData_activities = () => {
  console.log('ran activities get')
}
