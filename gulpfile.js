/*global process, console*/
'use strict';
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
// var merge = require('merge-stream');

var del = require('del');
var webpack = require( 'webpack' );

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
            port: 8080,
            https: false,
            open: false
        }));
});

gulp.task( 'pack', function ( callback ) {
    var devWebpack = require( './webpack.config.dev.js' );
    var myConfig = Object.create( devWebpack );
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

gulp.task( 'prod-pack', function ( callback ) {
    var prodWebpack = require( './webpack.config.prod.js' );
    var myConfig = Object.create( prodWebpack );

    // run webpack
    webpack( myConfig, function ( err, stats ) {
        if ( err ) throw new $.util.PluginError( "webpack:build", err );
        
        $.util.log( "[webpack:build]", stats.toString( {
            colors: true
        } ) );
        callback();
    } );
} );

gulp.task('serve', function() {
    $.livereload({start: true});
    runSequence(['clean:dist', 'clean:dev'],['pack', 'pages'], 'webserver');

    gulp.watch(['src/**/*.js', 'test/**/*.js'], ['pack']);
    gulp.watch(['test/*.html'], ['pages']);
});

gulp.task('clean', function(){
    runSequence(['clean:dist', 'clean:dev']);    
})
gulp.task('package', function(){
    runSequence(['clean'],['prod-pack', 'pages']);    
})