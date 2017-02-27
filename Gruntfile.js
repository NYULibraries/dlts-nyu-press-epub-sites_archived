/* jshint laxcomma: true, laxbreak: true, unused: false */

const child_process = require( 'child_process' );
const fs = require( 'fs' );

module.exports = function ( grunt ) {

  'use strict' ;

  const COMMON_DIR  = '_common';
  const TEST_SCRIPT = 'test/test.sh';
  const VALID_ENVIRONMENTS = [ 'local', 'test', 'dev', 'stage', 'prod', ];

  var _ = require('underscore') ;

  var pkg = grunt.file.readJSON('package.json') ;
  
  var configuration = require('./Gruntconfigurations') ;

  var taskConfiguration = { pkg : pkg } ;

  /** task to run */
  var npmTasks = [ 'clean', 'copy', 'uglify' ];
  var localTasks = [ 'writehtml' ];
  var tasks = npmTasks.concat( localTasks );

  function configureGruntTasks( site ) {
      grunt.option( 'commonDir', __dirname + '/source/' + COMMON_DIR );
      grunt.option( 'sourceDir', __dirname + '/source/' + site );
      grunt.option( 'destinationDir', __dirname + '/build/' + site );

      var environment = grunt.task.current.args[ 0 ];
      if ( ! VALID_ENVIRONMENTS.includes( environment ) ) {
        grunt.fail.fatal( '"' + environment + '" is not a valid environment.' +
          '  Please specify one of the following:\n\t' +
          site + ':' + VALID_ENVIRONMENTS.join( '\n\t' + site + ':' ) );
      }

      if ( environment === 'test' ) {
          grunt.option(
              'config-file',
              __dirname + '/test/sites/' + site + '/test.json'
          );
          grunt.option( 'request', require( './test/lib/solr-stub' ).request );
      } else {
          grunt.option(
              'config-file',
              __dirname + '/source/' + site + '/json/conf/' + environment + '.json'
          );
      }

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
  var sites = fs.readdirSync( 'source/' )
      .filter( function( directory ) {
        return directory !== COMMON_DIR;
      } );

  sites.forEach( function( site ) {
      grunt.registerTask( site,
                          function() {
                              configureGruntTasks( site );

                              grunt.task.run( tasks );
                          }
      );
  } );

  // For convenience, add a grunt task for running the test script.
  grunt.registerTask( 'test', function() {
    var testResults;

    try {
        testResults = child_process.execSync( TEST_SCRIPT );
        console.log( testResults.toString() );
    } catch( error ) {
        console.log( error.stdout.toString() );
        return false;
    }

  } );

  // This doesn't work, only "connected-youth" task runs.  Might not be able to
  // configure a task that runs all site builds in one grunt task without a major
  // rewrite.
  // grunt.registerTask( 'default' , sites ) ;

} ;
