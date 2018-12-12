import React from 'react'
import Viewport_Maps from "./Viewport_Maps"
import Viewport_AdminDataTable from "./Viewport_AdminDataTable"
import NavigationBar from "./NavigationBar"
import { connect } from 'react-redux'

import "../../scss/bulma_sass/bulma.sass"


const AdminDashboard = (props) => {
  return (
    <div>
      <NavigationBar />
      <div className="container topSpacing">
        { props.visibility_viewport_maps 
          ? <Viewport_Maps /> 
          : null }
        {props.visibility_viewport_adminDataTable
          ? <Viewport_AdminDataTable />
          : null}
      </div>
    </div>
  )
}

const mapStateToProps = store => ({
  visibility_viewport_maps: store.visibility_viewport_maps,
  visibility_viewport_adminDataTable: store.visibility_viewport_adminDataTable
})

export default connect(
  mapStateToProps,
  {},
)(AdminDashboard);

