import React from 'react';
import { connect } from 'react-redux'

import NavigationBar from './NavigationBar'

import Viewport_TaskList from './Viewport_TaskList'
import Viewport_Profile from './Viewport_Profile'

const EmployeeDashboard = (props) => {
  return (
    <div>
      <NavigationBar />
      <div className="container topSpacing">
        { props.visibility_viewport_taskList 
          ? <Viewport_TaskList />
          : null }
        {props.visibility_viewport_profile
          ? <Viewport_Profile />
          : null}
          
      </div>
    </div>
  )
}

const mapStateToProps = store => ({
  visibility_viewport_taskList: store.visibility_viewport_taskList,
  visibility_viewport_profile: store.visibility_viewport_profile
})

export default connect(
  mapStateToProps,
  {},
)(EmployeeDashboard);