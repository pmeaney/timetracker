export const toggle_Visibility_Viewport_Maps = (value) => ({
  type: "TOGGLE_VISIBILITY_VIEWPORT_MAPS",
  payload: value
})

export const setup_Initial_Timesheet_Data = (value1, value2) => ({
  type: "SETUP_INITIAL_TIMESHEET_DATA",
  payload1: value1,
  payload2: value2
})

export const concat_Additional_Timesheet_Data = (value1, value2) => ({
  type: "CONCAT_ADDITIONAL_TIMESHEET_DATA",
  payload1: value1,
  payload2: value2
})

export const toggle_InfoWindow_isOpen_State = (value) => ({
  type: "TOGGLE_INFOWINDOW_IS_OPEN_STATE",
  payload: value,
})

export const update_ClockedOut_Timesheet_Data = (value1, value2) => ({
  type: "UPDATE_CLOCKED_OUT_TIMESHEET_DATA",
  payload1: value1,
  payload2: value2
})

