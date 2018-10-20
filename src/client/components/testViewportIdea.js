import '../scss/bulma_sass/bulma.sass'
import React from 'react';
import TaskList from './employee_dashboard/TaskList'
import NavigationBar from './employee_dashboard/NavigationBar'

const Example = (props) => {
  return (
    <div>
      <NavigationBar />
      <div class="container topSpacing">
        <TaskList />
      </div>
    </div>
  )
}

export default Example