
/* 
Source: https://stackoverflow.com/questions/52647325/how-to-load-multiple-markers-on-map-react-google-maps
 Original Demo : https://codesandbox.io/s/lljj57zn9q
*/
import React from "react";
import {
  withGoogleMap,
  GoogleMap,
  withScriptjs,
  Marker,
  InfoWindow
} from "react-google-maps";
import { compose, withProps } from "recompose";

import { connect } from 'react-redux'

const apiKey = process.env.GMAPS_API.toString()


const MapWithPlaces = Component => (props) => {

  <GoogleMap defaultZoom={props.zoom} defaultCenter={props.center}>

    {
      props.places &&
      props.places.map((place, i) => {

      let lat = parseFloat(place.timesheet_clockin_lat, 10);
      let lng = parseFloat(place.timesheet_clockin_long, 10);

        return (
          <Marker
            id={place.timesheet_id}
            key={place.timesheet_id}
            position={{ lat: lat, lng: lng }}
            title="Click to zoom"
            // onClick={props.onToggleOpen.bind(this, i)}  <-- Need to replace with our toggle method
          >
            {props.infoWindows[i].isOpen && (
              <InfoWindow 
                // onCloseClick={props.onToggleOpen.bind(i)} <-- Need to replace with our toggle method
              >
                <div style={{ width: '10rem' }}><img style={{float: 'left'}} src="https://placekitten.com/56/56" alt=""/>
                  <div style={{ float: 'right', margin: '0 0 0 1rem'}}>{place.firstName} {place.lastName}</div>
                </div>
              </InfoWindow>
            )}
          </Marker>
        );
      }
      )

      }
  </GoogleMap>
  
};

const mapStateToProps = (store) => ({
  timesheetData: store.timesheetData,
  infoWindows: store.infoWindows
})

const mapDispatchToProps = {}

// export default MapWithPlaces;
const ComposedMapWrapper = compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=" + apiKey + "&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: "56vh", width: "100%" }} />,
    mapElement: <div style={{ height: "100%" }} />
  }),
  withScriptjs,
  withGoogleMap,
  connect(mapStateToProps, mapDispatchToProps),
  MapWithPlaces
)

export default ComposedMapWrapper