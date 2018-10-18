import React from "react"
import ReactDOM from "react-dom"
// import AppRoot from "./components/AppRoot"
// import MyComponent from "./components/visToggle"
import Example from "./components/bootstrapTest"

/* Here we want to take the session and based on the user type, deliver the appropriate dashboard */
ReactDOM.render(
  <Example />,
  document.getElementById("react-root")
)

//

// I dont think we need this anymore with hot loader v4
// if (module.hot && process.env.NODE_ENV == "development") {
//   module.hot.accept("./components/AppRoot.js", () => {
//     const NewAppRoot = require("./components/AppRoot.js").default
//     render(NewAppRoot)
//   })
// }
