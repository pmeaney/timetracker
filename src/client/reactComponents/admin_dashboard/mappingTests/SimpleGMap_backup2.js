import React, { Component } from 'react'


class SimpleGMap extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
      locations: []
    }
  }
  
  componentDidMount() {
    console.log('componentDidMount called')
    this.getLocations()
  }

  renderMap = () => {
    console.log('renderMap called')
    const apiKey = process.env.GMAPS_API.toString()
    loadScript("https://maps.googleapis.com/maps/api/js?key=" + apiKey + "&callback=initMap")
    window.initMap = this.initMap
  }

  getLocations = () => {
    console.log('getLocations called')
    var venueMockData = [
      {

            location: { lat: -34.317, lng: 150.614 },
            name: "Bobs house"
      },
      {
          location: { lat: -34.357, lng: 150.694 },
          name: "Jims house"
      },
    ]
    
        this.setState({
          locations: venueMockData
        }, this.renderMap())

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
    this.state.locations.map(currentItem => {

      var contentString = `${currentItem.name}`

      // Create A Marker
      var marker = new window.google.maps.Marker({
        position: { lat: currentItem.location.lat, lng: currentItem.location.lng },
        map: map,
        title: currentItem.name
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

