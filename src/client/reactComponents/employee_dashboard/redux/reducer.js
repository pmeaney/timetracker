import { 
  TOGGLE_VISIBILITY_VIEWPORT_TASK_LIST,
  TOGGLE_VISIBILITY_VIEWPORT_PROFILE,
  TOGGLE_VISIBILITY_MODAL_CREATE_ACTIVITY } from "./actions";

const initialState = {
  visibility_viewport_taskList: false,
  visibility_viewport_profile: false,
  visibility_modal_createActivity: false

}

const reducer = (state = initialState, action) => {
  console.log("Reduce: ", action);

  switch (action.type) {
    case "TOGGLE_VISIBILITY_VIEWPORT_TASK_LIST":
      return (state = {
        ...state,
        visibility_viewport_taskList: action.payload
      })
    case "TOGGLE_VISIBILITY_VIEWPORT_PROFILE":
      return (state = {
        ...state,
        visibility_viewport_profile: action.payload
      })
    case "TOGGLE_VISIBILITY_MODAL_CREATE_ACTIVITY":
      return (state = {
        ...state,
        visibility_modal_createActivity: action.payload
      })
    default:
      return state
  }
};

export default reducer