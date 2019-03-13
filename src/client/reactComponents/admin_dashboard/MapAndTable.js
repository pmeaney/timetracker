import React from "react";
import ComposedMapWrapper from "./MapWithPlaces";
import DataTableTimesheets from './DataTableTimesheets'
// import CollapseVisualComponent from './testing/CollapseVisualComponent'
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
  
  componentWillMount() {
    console.log('[MapAndTable cWM] -- componentWillMount')

    axios.get('/admin_api/timesheets')
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

    const es = new EventSource('/admin_api/eventstream', {withCredentials: true})

    es.onmessage = (e) => {
      console.log('on message e', e)
      const es_data = JSON.parse(e.data)
      console.log('[MapAndTable cDM] admin event stream data', es_data)
      if (es_data.timesheet_sub_type === "new_timesheet") {
        // creates a new info window on the map, with default isOpen as false (meaning that its closed)
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
      // es.close()
    }

    es.onerror = function (e) {
      console.log("Error: EventSource failed for url: /admin_api/eventstream (MapAndTable component, componentDidMount)");
    };
  }



  render(){

    var slider_leftViewport_percentageString = this.props.slider_leftViewport.toString() + '%'
    var slider_rightViewport_percentageString = this.props.slider_rightViewport.toString() + '%'

    return (
      this.props.timesheetData.length 
        ? 
          
          <div >
          <div className="overflowXYScroll dataTableBox myBox" style={{ width: slider_leftViewport_percentageString, padding: slider_leftViewport_percentageString === '0%'? 0 : '1.25rem' }}>
            <DataTableTimesheets />
            </div>
            <div className="mapWithplaces" style={{ width: slider_rightViewport_percentageString, }}>
              <ComposedMapWrapper
                center={{ lat: 37.685246, lng: -122.40277 }}
                zoom={15}
              />
            </div>
          </div> 
        : 
          null
    )
  }
}  

const mapStateToProps = (store) => ({
  timesheetData: store.timesheetData,
  infoWindows: store.infoWindows,
  slider_leftViewport: store.slider_leftViewport,
  slider_rightViewport: store.slider_rightViewport
})

const mapDispatchToProps = {
  setup_Initial_Timesheet_Data,
  concat_Additional_Timesheet_Data,
  update_ClockedOut_Timesheet_Data
}

export default connect(mapStateToProps, mapDispatchToProps)(MapAndTable);
