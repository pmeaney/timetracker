import React from 'react'
import Viewport_Maps from "./Viewport_Maps"
import NavigationBar from "./NavigationBar"
import { connect } from 'react-redux'

import "../../scss/bulma_sass/bulma.sass"


const AdminDashboard = (props) => {
  return (
    <div className="container topSpacing">
      <NavigationBar />
      {props.visibility_viewport_maps ? 
        <Viewport_Maps /> :
        null
       }
      
    </div>
  )
}

const mapStateToProps = store => ({
  visibility_viewport_maps: store.visibility_viewport_maps
})

export default connect(
  mapStateToProps,
  {},
)(AdminDashboard);

