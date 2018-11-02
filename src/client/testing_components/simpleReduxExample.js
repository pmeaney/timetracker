
import { createStore } from "redux"

const initialState = {
  result: 1,
  lastValues: []
}
const firstReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD":
      state = {
        ...state,
        result: state.result + action.payload
      }
      break;
    case "SUBTRACT":
      state = state - action.payload
      break;
    // default:
    //   break;
  }
  return state
}

const store = createStore(firstReducer)

store.subscribe(() => {
  console.log("Store updated!", store.getState())
})


store.dispatch({
  type: "ADD",
  payload: 10
})

store.dispatch({
  type: "ADD",
  payload: 100
})

store.dispatch({
  type: "ADD",
  payload: 25
})

function addValue(value) {
  return {
    type: "ADD",
    payload: value
  }
}

store.dispatch(addValue(39))
// const boundAdditionMaker = somePayload => dispatch()

const boundAddValue = (value) => { store.dispatch(addValue(value))}
boundAddValue(333)