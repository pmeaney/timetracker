const path = require("path")
const webpack = require("webpack")

module.exports = {
  entry: {
    main: [
      // "react-hot-loader/patch",
      "babel-runtime/regenerator",
      "babel-register",
      "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000",
      "./src/client/app.js"
    ]
  },
  mode: "development",
  output: {
    filename: "[name]-bundle.js",
    path: path.resolve(__dirname, "../src/server/public/reactBundles"),
    publicPath: "/"
  },
  devServer: {
    contentBase: "../src/server/public/reactBundles",
    overlay: true,
    stats: {
      colors: true
    }
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader"
          }
        ]
      },
      {
        // this is to find css files
        test: /\.s?css$/,
        // this lets us set up an array of loaders
        use: [
          'style-loader', // dumps css file into style tag
          'css-loader', // reads css files in
          'sass-loader' // reads sass files in
        ]
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("development")
      }
    })
    // ,
    // new BundleAnalyzerPlugin({
    //   generateStatsFile: true
    // })
  ]
}
