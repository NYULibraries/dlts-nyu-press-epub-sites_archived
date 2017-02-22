/* jshint laxcomma: true, laxbreak: true, unused: false */

const fs = require( 'fs' );

module.exports = function ( grunt ) {

  'use strict' ;

  var _ = require('underscore') ;

  var pkg = grunt.file.readJSON('package.json') ;
  
  var configuration = require('./Gruntconfigurations') ;

  var taskConfiguration = { pkg : pkg } ;

  // TODO: Need to get cloneReadium working again
  /** task to run */
  var npmTasks = [ 'clean', 'copy', 'uglify' ];
  var localTasks = [ 'writehtml' ];
  var tasks = npmTasks.concat( localTasks );

  function configureGruntTasks( site ) {
      grunt.option( 'sourceDir', __dirname + '/source/' + site );
      grunt.option( 'destinationDir', __dirname + '/build/' + site );

      _.each ( npmTasks , function ( task ) {

          var gruntTask = 'grunt-contrib-' + task ;

          /** configure task */
          if ( _.isFunction ( configuration[task] ) ) {
              taskConfiguration[task] = configuration[task]() ;
          }

          /** load modules and task */
          grunt.loadNpmTasks ( gruntTask ) ;

      } ) ;

      _.each ( localTasks , function ( task ) {

          /** configure task */
          if ( _.isFunction ( configuration[task] ) ) {
              taskConfiguration[task] = configuration[task]() ;
          }

          /** load modules and task */
          grunt.loadTasks ( 'lib/grunt-tasks/' + task ) ;

      } ) ;

      /** init Grunt */
      grunt.initConfig ( taskConfiguration )
  }

  /** register Grunt tasks */
  var sites = fs.readdirSync( 'source/' );

  sites.forEach( function( site ) {
      grunt.registerTask( site,
                          function() {
                              configureGruntTasks( site );

                              grunt.task.run( tasks );
                          }
      );
  } );

  grunt.registerTask( 'default' , tasks ) ;

} ;
