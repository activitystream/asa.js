var webpack = require('webpack'),
  package = require('./package.json'),
  glob = require('glob'),
  path = require('path');

module.exports = {
  cache: true,
  devtool: '#source-map',
  entry: { asa: './src/index.js', tests: glob.sync('./test/*.js') },
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
      path.join(__dirname, 'test'),
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
