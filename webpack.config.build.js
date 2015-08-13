var webpack = require('webpack'),
  package = require('./package.json'),
  path = require('path');

module.exports = {
  cache: true,
  devtool: '#source-map',
  entry: { main: './src/index.js' },
  output: {
    path: path.join(__dirname, "/dist"),
    filename: "[name].js",
  },
  plugins: [
    // new webpack.optimize.DedupePlugin(),
    // new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      mangle: {
        except: ['$super', '$', 'exports', 'require']
      }
    })
  ],
  resolve: {
    alias: package.browser,
    root: [
      path.join(__dirname, 'src'),
      path.join(__dirname, 'node_modules')
    ]
  },
  module: {
    loaders: [
      { test: /\.coffee?$/, loaders: ['coffee-loader'], exclude: /node_modules/ },
      { test: /\.json?$/, loaders: ['json-loader'] }
    ]
  }
};
