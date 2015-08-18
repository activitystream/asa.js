var webpackConf = require('./webpack.config')();

webpackConf.devtool = '#eval-source-map';

module.exports = webpackConf;