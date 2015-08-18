var webpack = require('webpack');
var webpackConf = require('./webpack.config')();

webpackConf.devtool = '#source-map';
webpackConf.plugins.push(    new webpack.optimize.UglifyJsPlugin({
      mangle: {
        except: ['$super', '$', 'exports', 'require']
      }
    })
);

module.exports = webpackConf;
