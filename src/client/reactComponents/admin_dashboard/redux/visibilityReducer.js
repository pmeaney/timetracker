import { TOGGLE_VISIBILITY_VIEWPORT_MAPS } from "./actions"

const initialState = {
  visibility_viewport_maps: false,
  timesheetData: [],
  infoWindows: []
}

const visibilityToggler = (state = initialState, action) => {
  console.log("Reduce: ", action);

  switch (action.type) {
    case "TOGGLE_VISIBILITY_VIEWPORT_MAPS":
      return (state = {
        ...state,
        visibility_viewport_maps: action.payload
      })

      /* Receiving two arrays of multiple objects: Timesheet data, and infoWindows  */
    case "LOAD_INITIAL_MAP_DATA":
      return (state = {
        ...state,
        timesheetData: action.payload1,
        infoWindows: action.payload2,
      })

      /* Concatenating two objects: Timesheet data, and infoWindows, onto their respective arrays  
      */
    case "CONCAT_ADDITIONAL_MAP_DATA":
      return (state = {
        ...state,
        timesheetData: timesheetData.concat(action.payload1),
        infoWindows: infoWindows.concat(action.payload2)
      })

    case "TOGGLE_INFOWINDOW_IS_OPEN_STATE":
      return (state = { 
        ...state,
        infoWindows: state.infoWindows.map((infoWindow, index) => {
        if (index === action.payload) {
          return Object.assign({}, infoWindow, {
            isOpen: !infoWindow[index].isOpen
          })
        }
        return infoWindow
      }) 
    })
    default:
      return state
  }
}

export default visibilityToggler