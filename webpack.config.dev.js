var webpackConf = require('./webpack.config')();

webpackConf.devtool = '#cheap-module-source-map';

module.exports = webpackConf;