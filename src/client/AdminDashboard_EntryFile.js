import React from "react"
import ReactDOM from "react-dom"

import reducer from "./reactComponents/admin_dashboard/redux/reducer"
import { Provider } from 'react-redux'
import { createStore } from 'redux'

const store = createStore(reducer)

import AdminDashboard from "./reactComponents/admin_dashboard/AdminDashboard"

/* Here we want to take the session and based on the user type, deliver the appropriate dashboard */
ReactDOM.render(
  <Provider store={store}>
    <AdminDashboard />
  </Provider>,
  document.getElementById("react-root")
)
