
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

// import { connect } from 'react-redux'
// import { toggle_InfoWindow_isOpen_State } from '../redux/actions'
import { GMAPS_API } from "babel-dotenv"

// const apiKey = process.env.GMAPS_API.toString()
const apiKey = GMAPS_API.toString()

const Map_Modal_MoreInfo = (props) => {
  console.log('props is', props)
  return(
    <GoogleMap defaultZoom={props.zoom} defaultCenter={props.center} style={{ maxHeight: '5rem', maxWidth: '5rem' }}>
      {props.timesheetData.timesheetData &&

        props.timesheetData.timesheetData.map((timesheet, i) => {

          let employee_photo = 'http://localhost:3000/profilePhoto-storage/' + timesheet.employee_profile_photo
          let lat = parseFloat(timesheet.timesheet_clockin_lat, 10);
          let lng = parseFloat(timesheet.timesheet_clockin_long, 10);

          return (

            <Marker
              id={timesheet.timesheet_id}
              key={timesheet.timesheet_id}
              position={{ lat: lat, lng: lng }}
              title="Click to zoom"
              onClick={props.toggle_InfoWindow_isOpen_State.bind(this,i)} 
            >

            { props.infoWindows[i].isOpen && (
                <InfoWindow 
                  onCloseClick={props.toggle_InfoWindow_isOpen_State.bind(i)} 
                >
                  <div style={{ width: '10rem' }}><img style={{ float: 'left' }} src={employee_photo} alt=""/>
                    <div style={{ float: 'right', margin: '0 0 0 1rem'}}>{timesheet.firstName} {timesheet.lastName}</div>
                  </div>
                </InfoWindow>
            )}

            </Marker>

          );

        })

      }
    </GoogleMap>
  )
};

// const mapStateToProps = (store) => ({
//   timesheetData: store.timesheetData,
//   infoWindows: store.infoWindows
// })

// const mapDispatchToProps = {
//   toggle_InfoWindow_isOpen_State
// }

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
  // connect(mapStateToProps, mapDispatchToProps),
)

export default ComposedMapWrapper(Map_Modal_MoreInfo)