import React from "react";
import MapWithPlaces from "./MapWithPlaces";
import DataTableTimesheets from './DataTableTimesheets'
// import places from "./Map_1c.json";
import axios from 'axios'

class MapAndTable extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      timesheetData: [],
      infoWindows: []
    }
  }
  
  componentWillMount() {
    console.log('[MapAndTable cWM] -- componentWillMount')

    axios.get('http://localhost:3000/admin_api/timesheets')
      .then(response => {
        // console.log('response.data', response.data)
        // console.log('timesheet date received', response.data)
        // console.log('timesheet date length', response.data.length)

        var dataLength = response.data.length
        var infoWindowObj = {isOpen: false}
        var infoWindowsObjSet = fillArray(infoWindowObj, dataLength)
        
          function fillArray(value, len) {
            var arr = [];
            for (var i = 0; i < len; i++) {
              arr.push(value);
            }
            return arr;
          }
        this.setState({
          timesheetData: response.data,
          infoWindows: infoWindowsObjSet
        })

        console.log('state is now', this.state)
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

        console.log()
        var concat_timesheet = this.state.timesheetData.concat(es_data)
        console.log('concat_timesheet', concat_timesheet)

        var infoWindowObj = { isOpen: false }
        var concat_infoWindowObj = this.state.infoWindows.concat(infoWindowObj)

        this.setState({
          timesheetData: concat_timesheet,
          infoWindows: concat_infoWindowObj
        })

        console.log('Event received -- state is now:', this.state)
      
      }

      es.onerror = function (e) {
        console.log("Error: EventSource failed for url: /eventstream (MapAndTable component, ComponentWillMount)");
      };
    
  }

  render(){
    return (
      this.state.timesheetData.length ? 
        <div >
          <div className="overflowXYScroll box dataTableBox">
            <DataTableTimesheets 
              timesheets={this.state.timesheetData}
            />
          </div>
          <div className="mapWithplaces">
            <MapWithPlaces
              center={{ lat: 37.685246, lng: -122.40277 }}
              zoom={15}
              places={this.state.timesheetData}
              infoWindows={this.state.infoWindows}
            />
          </div>
        </div> : null
    )
  }
}

export default MapAndTable