require("babel-register")
require("./app")

if (module.hot) {
  module.hot.accept();
}