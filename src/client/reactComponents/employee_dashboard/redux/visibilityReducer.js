import { 
  TOGGLE_VISIBILITY_VIEWPORT_TASK_LIST,
  TOGGLE_VISIBILITY_VIEWPORT_PROFILE, } from "./actions";

const initialState = {
  visibility_viewport_taskList: false,
  visibility_viewport_profile: false
}

const visibilityToggler = (state = initialState, action) => {
  console.log("Reduce: ", action);

  switch (action.type) {
    case "TOGGLE_VISIBILITY_VIEWPORT_TASK_LIST":
      return (state = {
        ...state,
        visibility_viewport_taskList: action.payload
      });
    case "TOGGLE_VISIBILITY_VIEWPORT_PROFILE":
      return (state = {
        ...state,
        visibility_viewport_profile: action.payload
      });
    default:
      return state;
  }
};

export default visibilityToggler