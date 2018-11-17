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
    console.log('componentWillMount')

    axios.get('http://localhost:3000/admin_api/timesheets')
      .then(response => {
        // console.log('response.data', response.data)
        this.setState({
          timesheetData: response.data
        })
      })
      .catch(error => {
        console.log("Error during http get request for timesheet coordinate data: " + error)
      })
  }

  componentDidMount() {
    console.log('componentDidMount')
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