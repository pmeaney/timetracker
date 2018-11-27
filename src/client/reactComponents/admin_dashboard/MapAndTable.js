import React from "react";
import ComposedMapWrapper from "./MapWithPlaces";
import DataTableTimesheets from './DataTableTimesheets'
import axios from 'axios'

import { connect } from 'react-redux'
import { setup_Initial_Map_Data, concat_Additional_Map_Data } from './redux/actions'

class MapAndTable extends React.Component {

  constructor(props) {
    super(props);
    
    // this.state = {
    //   timesheetData: [],
    //   infoWindows: []
    // }
  }


  /* 
  MapAndTable ------
    I dont need props here, just the dispatch functions
  cWM --
    load the state into redux.
    This means we pass redux two types of data in an action:
      - timesheet array
      - infoWindow array

    reducers then create a new state with the data passed in.

  cWM --
    pretty much the same: pass two arrays in the action,
    but in the reducer, the arrays are concatenated to state

  MapWithPlaces  ------ AND  DataTableTimesheets  ---
  (needs props & dispatch)

  Needs to be able to select & set infoWindows[i] onClick of marker (MapWithPlaces) / datatable row (DataTableTimesheets)
    i.e. toggle open 

    For this one, payload is the index to toggle.

    in Reducer, select that object with index, and flip its boolean.

   */
  
  componentWillMount() {
    console.log('[MapAndTable cWM] -- componentWillMount')

    axios.get('http://localhost:3000/admin_api/timesheets')
      .then(response => {
        var dataLength = response.data.length
        var infoWindowObj = {isOpen: false}
        var infoWindowsObjSet = Array(dataLength).fill(infoWindowObj)
        this.props.setup_Initial_Map_Data(response.data, infoWindowsObjSet)
      })
      .catch(error => {
        console.log("Error during http get request for timesheet coordinate data: " + error)
      })
  }

  componentDidMount() {
    console.log('[MapAndTable cDM] -- componentDidMount')

    var es = new EventSource('http://localhost:3000/admin_api/eventstream')
      es.onmessage = (e) => {
        const es_data = JSON.parse(e.data)
        console.log('[MapAndTable cDM] admin event stream data', es_data)
        var infoWindowObj = {isOpen: false}
        this.props.concat_Additional_Map_Data(es_data, infoWindowObj)
      }

      es.onerror = function (e) {
        console.log("Error: EventSource failed for url: /eventstream (MapAndTable component, ComponentWillMount)");
      };
    
  }

  render(){
    
    return (
      this.props.timesheetData.length ? 
        <div >
          <div className="overflowXYScroll box dataTableBox">
            <DataTableTimesheets 
              timesheets={this.props.timesheetData}
            />
          </div>

          <div className="mapWithplaces">
            <ComposedMapWrapper

              center={{ lat: 37.685246, lng: -122.40277 }}
              zoom={15}
              places={this.props.timesheetData}
              infoWindows={this.props.infoWindows}
            />
          </div>
          
        </div> : null
    )
  }
}


const mapStateToProps = (store) => ({
  timesheetData: store.timesheetData,
  infoWindows: store.infoWindows
})

const mapDispatchToProps = {
  setup_Initial_Map_Data,
  concat_Additional_Map_Data
}

export default connect(mapStateToProps, mapDispatchToProps)(MapAndTable);
