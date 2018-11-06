import React from "react"
import ReactDOM from "react-dom"

import visibilityToggler from "./reactComponents/employee_dashboard/redux/visibilityReducer"
import { Provider } from 'react-redux'
import { createStore } from 'redux'

const store = createStore(visibilityToggler)


import EmployeeDashboardController from "./reactComponents/employee_dashboard/EmployeeDashboardController"


/* Here we want to take the session and based on the user type, deliver the appropriate dashboard */
ReactDOM.render(
  <Provider store={store}>
    <EmployeeDashboardController />
  </Provider>,
  document.getElementById("react-root")
)
