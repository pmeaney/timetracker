import '../scss/bulma_sass/bulma.sass'
import React from 'react';
import TaskList from './employee_dashboard/TaskList'
import NavigationBar from './employee_dashboard/NavigationBar'

/*  
The thing that controls the viewports is the HoverDropdown */
const EmployeeDashboard = (props) => {
  return (
    <div>
      <NavigationBar />
      <div className="container topSpacing">
        <TaskList />
      </div>
    </div>
  )
}

export default EmployeeDashboard