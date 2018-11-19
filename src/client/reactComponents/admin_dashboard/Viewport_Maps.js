import React, { Component } from 'react'
import { connect } from 'react-redux'
import { toggle_Visibility_Viewport_Maps } from "./redux/actions"
// import MyMapComponent from './mappingTests/ReactGoogleMap';
// import StyledMapWithAnInfoBox from './mappingTests/ReactGMapInfoBox';
// import DemoApp from './mappingTests/ReactGMapMarkerClusterer';
import MapAndTable from './MapAndTable';
import List from '../../testing_components/EventSource'

class Viewport_Maps extends Component {

  constructor() {
    super();
    
    this.HandleClick_CloseButton_VisibilityToggle_Viewport_Maps = this.HandleClick_CloseButton_VisibilityToggle_Viewport_Maps.bind(this)
  }

  HandleClick_CloseButton_VisibilityToggle_Viewport_Maps(e){
    e.stopPropagation();
    this.props.toggle_Visibility_Viewport_Maps(false) // visibility -> false
  }

  render(){
    return (
      <article className="message is-primary">
        <div className="message-header">
          <p>Timesheet tracker</p>
          <button 
            className="delete" 
            aria-label="delete"
            onClick={e => this.HandleClick_CloseButton_VisibilityToggle_Viewport_Maps(e)}
          >
          </button>
        </div>
        <div className="message-body addHeight">
            <MapAndTable />
            {/* <List /> */}
        </div>
      </article>
    )
  }
}


const mapDispatchToProps = {
  toggle_Visibility_Viewport_Maps
}

export default connect(
  null,
  mapDispatchToProps
)(Viewport_Maps);
