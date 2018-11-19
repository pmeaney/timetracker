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
      eventStream_logged_timesheetData: []
    }
  }
  
  componentWillMount() {
    console.log('[MapAndTable cWM] -- componentWillMount')

    axios.get('http://localhost:3000/admin_api/timesheets')
      .then(response => {
        // console.log('response.data', response.data)
        console.log('timesheet date received', response.data)
        this.setState({
          timesheetData: response.data
        })
      })
      .catch(error => {
        console.log("Error during http get request for timesheet coordinate data: " + error)
      })
  }

  componentDidMount() {
    console.log('[MapAndTable cDM] -- componentDidMount')

    var es = new EventSource('http://localhost:3000/emp_api/eventstream')
      es.onmessage = (e) => {
        console.log('[MapAndTable cDM] e.data', JSON.parse(e.data))
        // console.log('[MapAndTable cDM] data e.data with JSON.parse', JSON.parse(e.data))
        // note: what we'd do here concat e.data 
        // onto the eventStream_logged_timesheetData array
        // const newItemFromEventStream = e.data
        // const concatenatedArray_withNewItem = this.state.eventStream_logged_timesheetData.concat(newItemFromEventStream)
        // this.setState({ eventStream_logged_timesheetData: concatenatedArray_withNewItem})
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
            />
          </div>
        </div> : null
    )
  }
}

export default MapAndTable