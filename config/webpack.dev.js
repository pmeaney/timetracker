const path = require("path")
const webpack = require("webpack")
const HTMLWebpackPlugin = require("html-webpack-plugin")
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")

module.exports = {
  entry: {
    main: [
      // "react-hot-loader/patch",
      "babel-runtime/regenerator",
      "babel-register",
      "webpack-hot-middleware/client?reload=true",
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
    contentBase: "dist",
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
        test: /\.css$/,
        use: [
          {
            loader: "style-loader"
          },
          { loader: "css-loader" }
        ]
      },
      {
        test: /\.jpg$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "images/[name].[ext]"
            }
          }
        ]
      },
      {
        test: /\.md$/,
        use: [
          {
            loader: "markdown-with-front-matter-loader"
          }
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
