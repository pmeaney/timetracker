import '../scss/bulma_sass/bulma.sass'
import React from 'react';
import TaskList from './employee_dashboard/TaskList'
import NavigationBar from './employee_dashboard/NavigationBar'
import { connect } from 'react-redux'

const EmployeeDashboard = (props) => {
  return (
    <div>
      <NavigationBar />
      <div className="container topSpacing">
        { props.visibility_viewport_a 
          ? <TaskList />
          : null }
        
      </div>
    </div>
  )
}

const mapStateToProps = store => ({
  visibility_viewport_a: store.visibility_viewport_a
})

export default connect(
  mapStateToProps,
  {},
)(EmployeeDashboard);