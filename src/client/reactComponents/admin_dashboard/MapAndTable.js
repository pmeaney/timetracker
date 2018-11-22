import React from "react";
import MapWithPlaces from "./MapWithPlaces";
import DataTableTimesheets from './DataTableTimesheets'
// import places from "./Map_1c.json";
import axios from 'axios'

class MapAndTable extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      timesheetData: []
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

    var es = new EventSource('http://localhost:3000/admin_api/eventstream')
      es.onmessage = (e) => {
        const es_data = JSON.parse(e.data)
        console.log('[MapAndTable cDM] admin event stream data', es_data)

        console.log()
        var concattedState = this.state.timesheetData.concat(es_data)
        console.log('concattedState', concattedState)

        this.setState({
          timesheetData: concattedState
        })
      

      
        // if (es_data.timesheet_sub_type === 'new_timesheet') {
        //   console.log('timesheet of type:', es_data.timesheet_sub_type, 'found.')
          
        // }

        // if (es_data.timesheet_sub_type === 'updated_timesheet') {
        //   console.log('timesheet of type:', es_data.timesheet_sub_type, 'found.')
        // }
        /* 
        
        if new timesheet, add it to new timesheets array.
        if it's a clocking out timesheet, remove it from 'existingTimesheets' and add it to recently clockedout timesheets

        So, we're already pulling existing timesheets (within a specific timezone => todo).
        To this array (timesheet data we pulled), we'll concatenate the new timesheets from event stream.

        And from this array (timesheet data we pulled), we'll filter out the timeshets which match 'updated timesheets',
        so we can override them with the new timeshet data for that timesheet_id which will have their clocked out data. 

        Then, we can have a 'view currently clocked in only' checkbox which removes all clocked out timesheets from view (i.e. if map thru state.timesheets and only show current item where current item does not have clockout data)
        */

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