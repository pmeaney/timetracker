import React, { Component } from 'react'
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';



/*  then create a variable which represents a data map through the datapoints
  inside the data map, set <Marker> with the appropriate properties as the current data point's properties
   */
  // const mapMarkers = ``

  /* 
  test array
  const markerArray = [
      {
        lat: 39.648209,
        long: 75.711185,
        name: 'First location'
      },
      {
      lat: 39.678000,
      long: 75.751000,
      name: 'Second location'
    }
  ]
   */
class GoogleMapsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {}
    }
    // binding this to event-handler functions
    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.onMapClick = this.onMapClick.bind(this);
  }

  onMarkerClick = (props, marker, e) => {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
  }
  onMapClick = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  }
  render() {
    const style = {
      width: '95%',
      height: '85%'
    }

    return (
      <Map
        item
        xs={12}
        style={style}
        google={this.props.google}
        onClick={this.onMapClick}
        zoom={14}
        initialCenter={{ lat: 39.648209, lng: -75.711185 }}
      >
          <Marker
            onClick={this.onMarkerClick}
            title={'Changing Colors Garage'}
            position={{ lat: 39.648209, lng: -75.711185 }}
            name={'Changing Colors Garage'}
          />
          <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingInfoWindow}
          >
            <div>
              <p>
                Changing Colors Garage
              </p>
                98G Albe Dr Newark, DE 19702 <br />
                302-293-8627
            </div>
          </InfoWindow>
      </Map>
    );
  }
}

const apiKey = process.env.GMAPS_API.toString()
console.log(apiKey)

export default GoogleApiWrapper({
  apiKey: (apiKey)
})(GoogleMapsContainer)