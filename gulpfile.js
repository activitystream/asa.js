/*global process, console*/
'use strict';
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
// var merge = require('merge-stream');

var del = require('del');
var webpack = require( 'webpack' );

var prodWebpackConfig = require( './webpack.config.build.js' );


gulp.task('clean:dev', function() {
    del.sync(['.tmp']);
});

gulp.task('clean:dist', function() {
    del.sync(['dist']);
});

gulp.task('pages', function(){
  return gulp.src('test/*.html')
    .pipe($.injectReload())
    .pipe(gulp.dest('.tmp'))
    .pipe($.livereload());
});

gulp.task('webserver', function() {
    return gulp.src(['dist','.tmp'])
        .pipe($.webserver({
            host: 'localhost', //change to 'localhost' to disable outside connections
            livereload: false,
            port: 80,
            https: false,
            open: false
        }));
});

gulp.task( 'pack', function ( callback ) {
    var myConfig = Object.create( prodWebpackConfig );
    // myConfig.devtool = "#source-map";

    // run webpack
    webpack( myConfig, function ( err, stats ) {
        if ( err ) throw new $.util.PluginError( "webpack:build", err );
        
        $.util.log( "[webpack:build]", stats.toString( {
            colors: true
        } ) );
        $.livereload('asa.js');
        $.livereload.reload('test.html');
        callback();
    } );
} );

gulp.task('serve', function() {
    $.livereload({start: true});
    runSequence(['clean:dist', 'clean:dev'],['pack', 'pages'], 'webserver');

    gulp.watch(['src/**/*.js', 'test/**/*.js'], ['pack']);
    gulp.watch(['test/*.html'], ['pages']);
});
