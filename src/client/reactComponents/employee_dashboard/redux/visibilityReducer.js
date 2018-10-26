import { TOGGLE_VISIBILITY_VIEWPORT_A } from "./actions";

const initialState = {
  visibility_viewport_a: false
}

const visibilityToggler = (state = initialState, action) => {
  console.log("Reduce: ", action);

  switch (action.type) {
    case "TOGGLE_VISIBILITY_VIEWPORT_A":
      return (state = {
        ...state,
        visibility_viewport_a: action.payload
      });
    default:
      return state;
  }
};

export default visibilityToggler