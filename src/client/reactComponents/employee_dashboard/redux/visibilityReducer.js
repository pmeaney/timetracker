const initialState = {
  visibility_viewport_a: false
}

const visibilityToggler = (state = initialState, action) => {
  switch (action.type) {
    case 'TOGGLE_ON_VISIBILITY_VIEWPORT_A':
      return state = {
        ...state,
        visibility_viewport_a: action.payload
      }
    case 'TOGGLE_OFF_VISIBILITY_VIEWPORT_A':
      return state = {
        ...state,
        visibility_viewport_a: action.payload
      }
  }
}

export default visibilityToggler