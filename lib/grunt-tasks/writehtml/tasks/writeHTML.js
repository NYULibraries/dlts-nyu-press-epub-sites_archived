/*
 * grunt-contrib-writehtml
 * https://github.com/NYULibraries/nyupress-epubs-site
 *
 * Copyright (c) 2014 New York University, contributors
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function ( grunt ) {
	
  function writehtml () {

    var path = require('path') ;
  
    var _ = require('underscore') ;
    
    var fs = require('fs') ; 
    	
    /** @TODO: find if there is a more elegant solution to this */
    var root = path.normalize(__dirname + '/../../../..') ;
  	
  	var transform = require('./transform') ;
  	
    /** force task into asynchronous mode and grab a handle to the "done" function. */
    var done = this.async() ;
    
    try {

      var pages = {} ;  	

      /** load configuration */
      var configFile = grunt.option( 'sourceDir' ) + '/json/conf.json';

      // Override default config file if --config-file specified.
      var configFileOption = grunt.option( 'config-file' );
      if ( configFileOption ) {
        if ( path.isAbsolute( configFileOption ) ) {
          configFile = configFileOption;
        } else {
          configFile = root + '/' + configFileOption;
        }
      }

      var conf = grunt.file.readJSON( configFile )

      var pagesDir = grunt.option( 'sourceDir' ) + '/json/pages';

      if ( grunt.file.isDir( pagesDir ) ) {
        var sources = fs.readdirSync( pagesDir ) ;
        for ( var i = 0; i < sources.length ; i++ ) {
          if ( sources[i].match('.json') ) {
            _.extend ( pages, grunt.file.readJSON ( pagesDir + '/' + sources[i] ) ) ;
          }
        }
      }
        
      /** copy source JavaScript files to build */
      grunt.file.recurse(grunt.option( 'sourceDir' ) + '/js/', function callback ( abspath, rootdir, subdir, filename ) {
        if ( filename.match('.js') ) {
          grunt.file.copy( abspath, grunt.option( 'destinationDir' ) + '/js/' + filename );
        }
      });
        
      /** iterate pages and transform in HTML*/
      _.each ( pages , function ( element, index ) {

        conf.task = index ;
        
        /** if callback is set, we need to load the JS module and call it */
        if ( ! _.isUndefined ( pages[index].callback )  ) {
          /** load JS module */
          var module = require( '../../../' + element.callback ) ;
          /** 
           * call module with parent configuration so that its possible 
           * to overwrite defaults. Our modules accept a Function callback
           * we pass "transform.html" as the default.
           * 
           */
          module[element.callback] ( transform.html, { parent_conf : conf } ) ;
        }
        else {
          /** all we need to construct this HTML page it's in the page Object */
          transform.html ( { route : element.route , template : grunt.option( 'sourceDir' ) + '/views/' + index + '.mustache' , data : element } ) ;
        }
      } ) ;
    }
    catch ( err ) {
      console.log ( err ) ;
      grunt.log.write('Unknown error').error() ;
    }
  }
  
  grunt.registerTask('writehtml', 'Write HTML files from *.json files inside "pages" directory.', writehtml ) ;
  
};
