'use strict' ;

var grunt = require('grunt') ;

function project () {

  var projectConfiguration ;

  var projectConfigurationFile = grunt.option( 'source' ) + '/json/conf.json' ;

  if ( grunt.file.isFile ( projectConfigurationFile ) ) {
    projectConfiguration = grunt.file.readJSON ( projectConfigurationFile ) ;
  }

  return projectConfiguration ;

}

function gitclone () {

  var projectConfiguration = project () ;	
  
  var readiumDirectory =  ( projectConfiguration.readiumDirectory !== '' ) ? projectConfiguration.readiumDirectory : __dirname + '/build' ;

  return { 
    clone : {
      options : {
        repository : projectConfiguration.readiumRepositoryURL,
        branch : projectConfiguration.readiumRepositoryBranch,
        directory: readiumDirectory ,
        directoryName: projectConfiguration.readiumDirectoryName,
        booksDirectory: projectConfiguration.readiumBooksDirectory,
        clone : projectConfiguration.readiumCloneFromSource
      }
    }
  }
  
}

/** merge with compass */
function sass () {
  
  var sass_conf;
  
  if ( grunt.file.isFile( grunt.option( 'source' ) + '/json/sass.json' ) ) {
    sass_conf = grunt.file.readJSON( grunt.option( 'source' ) + '/json/sass.json' ) ;
  }
  
  else {
	// default SASS configuration
    sass_conf = {
      sass : {
        build : "external", // options: inline,  external
	    // build : "external", // options: inline,  external
	    // for options; see: https://github.com/gruntjs/grunt-contrib-sass
	    options : {
          style : "expanded", // options: nested, compact, compressed, expanded
          debugInfo : false,
          lineNumbers : true,
          trace: false
        }
      }
    };  
  }

  var styleCssFile = grunt.option( 'destination' ) + '/css/style.css';

  return {
    dist: {
      options: sass_conf.sass.options,
      files: { styleCssFile: grunt.option( 'source' ) + '/sass/style.scss' },
      build : sass_conf.sass.build
    }
  } ;

}

function js () {

  var js_conf;

  if ( grunt.file.isFile( grunt.option( 'source' ) + '/json/js.json' ) ) {
	js_conf = grunt.file.readJSON( grunt.option( 'source' ) + '/json/js.json' ) ;
  }
	  
  else {
    // default JS configuration
    js_conf = {
      js : {
        build : "external", // options: inline,  external
        style : "expanded" // options: compressed, expanded
	  }
    };  
  }
  
  return js_conf ;

}

function copy () {
  return {
    main: {
      files: [
        { expand: true, cwd: grunt.option( 'source' ) + '/images', src: '**/*', dest: grunt.option( 'destination' ) + '/images' },
        { expand: true, cwd: grunt.option( 'source' ) + '/css', src: '**/*', dest: grunt.option( 'destination' ) + '/css' }
      ]
    }
  } ;
}

function clean () {
  return [ 
    grunt.option( 'destination' )
  ] ;
}

function uglify () {
  function targetsCallback() {
    var targets = {};
    grunt.file.recurse(grunt.option( 'source' ) + '/js/', function callback (abspath, rootdir, subdir, filename) {
      if ( filename.match('.js') ) {
        targets[grunt.option( 'destination' ) + '/js/' + filename] = abspath ;
      }
    });
    return targets ;
  }
  return {
    options: {
      banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
      compress: {}, // https://github.com/gruntjs/grunt-contrib-uglify/issues/298#issuecomment-74161370
      preserveComments: false
    },
    my_target: {
      files: targetsCallback()
    }
  };
}

function htmlminify () {

  var htmlminifyConfiguration = {} ;
		  
  var htmlminifyConfigurationFile = grunt.option( 'source' ) + '/json/htmlminify.json' ;
		  
  if ( grunt.file.isFile ( htmlminifyConfigurationFile ) ) {

    htmlminifyConfiguration = grunt.file.readJSON ( htmlminifyConfigurationFile ) ;
	    
    htmlminifyConfiguration = htmlminifyConfiguration.htmlminify
	    
  }
		  
  return htmlminifyConfiguration ;

}

exports.copy = copy ;
exports.clean = clean ;
exports.uglify = uglify ;
exports.js = js ;
exports.project = project ;
exports.sass = sass ;
exports.htmlminify = htmlminify ;
exports.gitclone = gitclone ;
