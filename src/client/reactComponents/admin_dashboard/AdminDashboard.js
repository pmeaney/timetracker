import React from 'react'
import Viewport_Maps from "./Viewport_Maps"
import Viewport_NewItemDashboard from './Viewport_NewItemDashboard';
import Viewport_AdminDataTable from "./Viewport_AdminDataTable"
import Viewport_ResumeReview_Hiring from "./Viewport_ResumeReview_Hiring"
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
        {props.visibility_viewport_newItemDashboard
          ? <Viewport_NewItemDashboard />
          : null}
        {props.visibility_viewport_adminDataTable
          ? <Viewport_AdminDataTable />
          : null}
        {props.visibility_viewport_resumeReview_Hiring
          ? <Viewport_ResumeReview_Hiring />
          : null}
      </div>
    </div>
  )
}

const mapStateToProps = store => ({
  visibility_viewport_maps: store.visibility_viewport_maps,
  visibility_viewport_adminDataTable: store.visibility_viewport_adminDataTable,
  visibility_viewport_newItemDashboard: store.visibility_viewport_newItemDashboard,
  visibility_viewport_resumeReview_Hiring: store.visibility_viewport_resumeReview_Hiring
})

export default connect(
  mapStateToProps,
  {},
)(AdminDashboard);

