import React from "react"
import ReactDOM from "react-dom"

import EmployeeDashboard from "./reactComponents/index_employeeDashboard"
import visibilityToggler from "./reactComponents/employee_dashboard/redux/visibilityReducer"

import { Provider } from 'react-redux'
import { createStore } from 'redux'

const store = createStore(visibilityToggler)

/* Here we want to take the session and based on the user type, deliver the appropriate dashboard */
ReactDOM.render(
  <Provider store={store}>
    <EmployeeDashboard />
  </Provider>,
  document.getElementById("react-root")
)


// _________________________________ REDUX TESTING ______________
// import { createStore } from "redux"

// const initialState = {
//   result: 1,
//   lastValues: []
// }
// const firstReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case "ADD":
//       state = {
//         ...state,
//         result: state.result + action.payload
//       }
//       break;
//     case "SUBTRACT":
//       state = state - action.payload
//       break;
//     // default:
//     //   break;
//   }
//   return state
// }

// const store = createStore(firstReducer)

// store.subscribe(() => {
//   console.log("Store updated!", store.getState())
// })


// store.dispatch({
//   type: "ADD",
//   payload: 10
// })

// store.dispatch({
//   type: "ADD",
//   payload: 100
// })

// store.dispatch({
//   type: "ADD",
//   payload: 25
// })

// function addValue(value) {
//   return {
//     type: "ADD",
//     payload: value
//   }
// }

// store.dispatch(addValue(39))
// // const boundAdditionMaker = somePayload => dispatch()

// const boundAddValue = (value) => { store.dispatch(addValue(value))}
// boundAddValue(333)