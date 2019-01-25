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

// Instead of the previous idea, I'll just handle everything on the server.
export const getData_forDataTable = (selectedOption) => {

  /* 
  { value: 'activities', label: 'activities' },
  { value: 'employees', label: 'employees' },
  { value: 'timesheets', label: 'timesheets' },
  { value: 'projects', label: 'projects' },
  { value: 'locations', label: 'locations' }
   */

  // console.log('selectedOption.value', selectedOption.value)

  const nameOfDataTable = selectedOption.value

    return axios.get('/admin_api/getDataForTable/' + nameOfDataTable)
      // .then(response => {
      //   var responseData = response.data
      //   console.log('for selectedOption', selectedOption, 'responseData is:',responseData)
      //   // this.setState({ dataForTable: responseData })
      //   return responseData
      //   // console.log('this.state.dataForTable is', this.state.dataForTable)
      // })
      // .catch(error => {
      //   console.log("Error during http get request for timesheet coordinate data: " + error)
      // })
}