
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
import { compose, withProps, withStateHandlers } from "recompose";

const apiKey = process.env.GMAPS_API.toString()

const MapWithPlaces = compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=" + apiKey + "&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: "56vh", width: "100%" }} />,
    mapElement: <div style={{ height: "100%" }} />
  }),
  withStateHandlers(
    // stateHandlers allows us to add on additional props and prop-updating functions. 
    // as a result of the below statements, infoWindows becomes a prop, and onToggleOpen is the corresponding updater function
    props => ({
      infoWindows: props.places.map(p => {
        // for each item in the places array, create a corresponding 'isOpen' state
        return { isOpen: false };
      })
    }),
    {
      onToggleOpen: ({ infoWindows }) => selectedIndex => ({
        infoWindows: infoWindows.map((iw, i) => {
          // if the thing selected (the marker = selectedIndex = the 'this' passed in.. I think) has an index which matches the infoWindows item we're currently on, then we have a match for toggling open.
          // the match's value is true.  So, we set the current info window item to 'true', and return it so that that single item which was clicked is now updated.
          iw.isOpen = selectedIndex === i;
          return iw;
        })
      })
    }
  ),
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap defaultZoom={props.zoom} defaultCenter={props.center}>
    {
      props.places &&
      props.places.map((place, i) => {

      let lat = parseFloat(place.timesheet_clockin_lat, 10);
      let lng = parseFloat(place.timesheet_clockin_long, 10);

      // console.log('place is', place)
      // console.log('lat is', lat)
      // console.log('lng is', lng)
        return (
          <Marker
            id={place.timesheet_id}
            key={place.timesheet_id}
            position={{ lat: lat, lng: lng }}
            title="Click to zoom"
            onClick={props.onToggleOpen.bind(this, i)}
          >
            {props.infoWindows[i].isOpen && (
              <InfoWindow onCloseClick={props.onToggleOpen.bind(i)}>
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
));

export default MapWithPlaces;
