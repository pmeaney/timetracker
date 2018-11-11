import React from "react"
import ReactDOM from "react-dom"

import visibilityToggler from "./reactComponents/admin_dashboard/redux/visibilityReducer"
import { Provider } from 'react-redux'
import { createStore } from 'redux'

const store = createStore(visibilityToggler)

import AdminDashboard from "./reactComponents/admin_dashboard/AdminDashboard"

/* Here we want to take the session and based on the user type, deliver the appropriate dashboard */
ReactDOM.render(
  <Provider store={store}>
    <AdminDashboard />
  </Provider>,
  document.getElementById("react-root")
)
