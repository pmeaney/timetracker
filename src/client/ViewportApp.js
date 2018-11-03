import React from "react"
import ReactDOM from "react-dom"

import visibilityToggler from "./reactComponents/employee_dashboard/redux/visibilityReducer"
import { Provider } from 'react-redux'
import { createStore } from 'redux'

const store = createStore(visibilityToggler)


import ViewportController from "./reactComponents/ViewportController"


/* Here we want to take the session and based on the user type, deliver the appropriate dashboard */
ReactDOM.render(
  <Provider store={store}>
    <ViewportController />
  </Provider>,
  document.getElementById("react-root")
)
