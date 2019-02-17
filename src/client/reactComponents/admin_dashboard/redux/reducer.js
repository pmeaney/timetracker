
const initialState = {
  visibility_viewport_maps: false,
  visibility_viewport_newItemDashboard: false,
  visibility_viewport_adminDataTable: false,
  timesheetData: [],
  infoWindows: []
}

const reducer = (state = initialState, action) => {
  console.log("Reduce: ", action);

  switch (action.type) {

    case "TOGGLE_VISIBILITY_VIEWPORT_MAPS":
      return (state = {
        ...state,
        visibility_viewport_maps: action.payload
      })
      
    case "TOGGLE_VISIBILITY_VIEWPORT_ADMIN_DATA_TABLE":
      return (state = {
        ...state,
        visibility_viewport_adminDataTable: action.payload
      })
      
    case "TOGGLE_VISIBILITY_VIEWPORT_NEW_ITEM_DASHBOARD":
      return (state = {
        ...state,
        visibility_viewport_newItemDashboard: action.payload
      })

    case "SETUP_INITIAL_TIMESHEET_DATA":
      return (state = {
        ...state,
        timesheetData: action.payload1,
        infoWindows: action.payload2,
      })

    case "CONCAT_ADDITIONAL_TIMESHEET_DATA":
      return (state = {
        ...state,
        timesheetData: state.timesheetData.concat(action.payload1),
        infoWindows: state.infoWindows.concat(action.payload2)
      })

    case "TOGGLE_INFOWINDOW_IS_OPEN_STATE":
      return (state = { 
        ...state,
        infoWindows: state.infoWindows.map((infoWindow, index) => {
          if (index === action.payload) {
            console.log('Click received, will toggle corresponding InfoWindow', index, action.payload)
            return { isOpen: !state.infoWindows[index].isOpen }
          }
          return infoWindow
        })
      })
    
    case "UPDATE_CLOCKED_OUT_TIMESHEET_DATA":
      return (state = {
        ...state,
        timesheetData: state.timesheetData.map((timesheet, index) => {

          if (timesheet.timesheet_id === action.payload1) {
            return {
              ...timesheet,
              timesheet_clockout:  action.payload2.timesheet_clockout,
              timesheet_clockout_lat:  action.payload2.timesheet_clockout_lat,
              timesheet_clockout_long:  action.payload2.timesheet_clockout_long,
              timesheet_sub_type: action.payload2.timesheet_sub_type
            }
          }
          return timesheet
        })
      })

    default:
      return state
  }
}

export default reducer