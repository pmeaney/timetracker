import React from "react";
import ComposedMapWrapper from "./MapWithPlaces";
import DataTableTimesheets from './DataTableTimesheets'
import axios from 'axios'

import { connect } from 'react-redux'
import { 
  setup_Initial_Timesheet_Data, 
  concat_Additional_Timesheet_Data, 
  update_ClockedOut_Timesheet_Data } from './redux/actions'

class MapAndTable extends React.Component {

  constructor(props) {
    super(props);

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

   *  --> Ok, now just need to setup DataTableTimesheets with an onClick method 
   * to open corresponding google-map's timesheet infowindow when a row is clicked.

   */
  
  componentWillMount() {
    console.log('[MapAndTable cWM] -- componentWillMount')

    axios.get('http://localhost:3000/admin_api/timesheets')
      .then(response => {
        var dataLength = response.data.length
        var infoWindowObj = {isOpen: false}
        var infoWindowsObjSet = Array(dataLength).fill(infoWindowObj)
        this.props.setup_Initial_Timesheet_Data(response.data, infoWindowsObjSet)
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

        if (es_data.timesheet_sub_type === "new_timesheet") {
          var infoWindowObj = {isOpen: false}
          this.props.concat_Additional_Timesheet_Data(es_data, infoWindowObj)
        }

        if (es_data.timesheet_sub_type === "updated_timesheet") {
          var clockOutData = {
            timesheet_clockout: es_data.timesheet_clockout,
            timesheet_clockout_lat: es_data.timesheet_clockout_lat,
            timesheet_clockout_long: es_data.timesheet_clockout_long,
            timesheet_sub_type: es_data.timesheet_sub_type // this simply overwrites "new_timesheet" with "updated_timesheet"
          }
          
          var timesheet_id = es_data.timesheet_id

          this.props.update_ClockedOut_Timesheet_Data(timesheet_id, clockOutData)
        }

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
            <DataTableTimesheets />
          </div>

          <div className="mapWithplaces">
            <ComposedMapWrapper
              center={{ lat: 37.685246, lng: -122.40277 }}
              zoom={15}
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
  setup_Initial_Timesheet_Data,
  concat_Additional_Timesheet_Data,
  update_ClockedOut_Timesheet_Data
}

export default connect(mapStateToProps, mapDispatchToProps)(MapAndTable);
