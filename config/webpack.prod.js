const path = require("path")
const webpack = require("webpack")
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const CompressionPlugin = require("compression-webpack-plugin")
const BrotliPlugin = require("brotli-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

module.exports = env => {
  return {
    entry: {
      // 'component_modules/employee_dashboard/mainExample': [
      //   "./src/client/mainExample.js"
      // ],
      'component_modules/employee_dashboard/testCardArray': [
        "./src/client/ViewportApp.js"
      ]
    },
    mode: "production",
    output: {
      filename: "[name].js",
      path: path.resolve(__dirname, "../src/server/public/reactBundles"),
      publicPath: "/"
    },
    optimization: {
      splitChunks: {
        automaticNameDelimiter: "-",
        cacheGroups: {
          vendor: {
            name: "vendor",
            test: /[\\/]node_modules[\\/]/,
            chunks: "initial",
            minChunks: 2
          }
        }
      },
      minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
      }),
      // new OptimizeCssAssetsPlugin({})
    ]
    },
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
        test: /\.s?[ac]ss$/,
        // this lets us set up an array of loaders
        use: [
          'style-loader', // dumps css file into style tag
          MiniCssExtractPlugin.loader,
          'css-loader', // reads css files in
          'sass-loader' // reads sass files in
        ]
      }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: "[name].css",
      }),
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.s?ass$/g,
        cssProcessor: require("cssnano"),
        cssProcessorOptions: { discardComments: { removeAll: true } },
        canPrint: true
      }),
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify(env.NODE_ENV)
        }
      }),
      // new UglifyJsPlugin(),
      new CompressionPlugin({
        algorithm: "gzip"
      }),
      new BrotliPlugin()
    ]
  }
}
