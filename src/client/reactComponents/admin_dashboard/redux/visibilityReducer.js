import { TOGGLE_VISIBILITY_VIEWPORT_MAPS } from "./actions"

const initialState = {
  visibility_viewport_maps: false
}

const visibilityToggler = (state = initialState, action) => {
  console.log("Reduce: ", action);

  switch (action.type) {
    case "TOGGLE_VISIBILITY_VIEWPORT_MAPS":
      return (state = {
        ...state,
        visibility_viewport_maps: action.payload
      })
    default:
      return state
  }
}

export default visibilityToggler