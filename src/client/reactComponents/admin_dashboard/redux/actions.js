export const toggle_Visibility_Viewport_Maps = (value) => ({
  type: "TOGGLE_VISIBILITY_VIEWPORT_MAPS",
  payload: value
})

export const setup_Initial_Map_Data = (value1, value2) => ({
  type: "LOAD_INITIAL_MAP_DATA",
  payload1: value1,
  payload2: value2
})

export const concat_Additional_Map_Data = (value1, value2) => ({
  type: "CONCAT_ADDITIONAL_MAP_DATA",
  payload1: value1,
  payload2: value2
})

// export const toggle_InfoWindow_isOpen_State = (value) => ({
//   type: "TOGGLE_INFOWINDOW_IS_OPEN_STATE",
//   payload: value,
// })

