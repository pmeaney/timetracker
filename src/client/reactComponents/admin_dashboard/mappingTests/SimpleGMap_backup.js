import React, { Component } from 'react'

import axios from 'axios'

class SimpleGMap extends Component {


  state = {
    timesheetData: []
  }

  componentDidMount() {
    console.log('componentDidMount called')
    this.getLocationData()
  }

  renderMap = () => {
    console.log('renderMap called')
    const apiKey = process.env.GMAPS_API.toString()
    loadScript("https://maps.googleapis.com/maps/api/js?key=" + apiKey + "&callback=initMap")
    window.initMap = this.initMap
  }

  getLocationData = () => {
    console.log('getLocationData called')

    axios.get('http://localhost:3000/admin_api/timesheets')
      .then(response => {
        console.log('response.data', response.data)
        this.setState({
          timesheetData: response.data
        }, this.renderMap())
      })
      .catch(error => {
        console.log("Error during http get request for timesheet coordinate data: " + error)
      })

  }

  initMap = () => {
    console.log('initMap called')
    // Create A Map
    var map = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8
    })

    // Create An InfoWindow
    var infowindow = new window.google.maps.InfoWindow()

    // Display Dynamic Markers
    this.state.timesheetData.map(timesheet => {

      console.log('setting up marker...')
      var lat_as_num = parseInt(timesheet.timesheet_clockin_lat, 10)
      var lng_as_num = parseInt(timesheet.timesheet_clockin_long, 10)


      var contentString = `${timesheet.activity_notes}`

      // Create A Marker
      var marker = new window.google.maps.Marker({
        position: { lat: lat_as_num, lng: lng_as_num },
        map: map,
        title: timesheet.firstName
      })

      // Click on A Marker!
      marker.addListener('click', function () {

        // Change the content
        infowindow.setContent(contentString)

        // Open An InfoWindow
        infowindow.open(map, marker)
      })

    })
  }

  render() {
    return (
      <main>
        <div id="map"></div>
      </main>
    )
  }
}

function loadScript(url) {
  var index = window.document.getElementsByTagName("script")[0]
  var script = window.document.createElement("script")
  script.src = url
  script.async = true
  script.defer = true
  index.parentNode.insertBefore(script, index)
}

export default SimpleGMap;