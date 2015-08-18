var webpack = require('webpack'),
  package = require('./package.json'),
  glob = require('glob'),
  path = require('path');

module.exports = function(){ 
  return {
    cache: true,
    devtool: '#source-map',
    entry: { asa: './src/index.js', tests: glob.sync('./test/*.js') },
    output: {
      path: path.join(__dirname, "/dist"),
      filename: "[name].js",
    },
    plugins: [
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
};
