'use strict' ;

var grunt = require('grunt') ;

/** merge with compass */
function sass () {
  
  var sass_conf;

  const sourceDir = grunt.option( 'sourceDir' );

  if ( grunt.file.isFile( sourceDir + '/json/sass.json' ) ) {
    sass_conf = grunt.file.readJSON( sourceDir + '/json/sass.json' ) ;
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

  var styleCssFile = grunt.option( 'destinationDir' ) + '/css/style.css';

  return {
    dist: {
      options: sass_conf.sass.options,
      files: { styleCssFile: sourceDir + '/sass/style.scss' },
      build : sass_conf.sass.build
    }
  } ;

}

function js () {

  var js_conf;

    const sourceDir = grunt.option( 'sourceDir' );
    if ( grunt.file.isFile( sourceDir + '/json/js.json' ) ) {
	js_conf = grunt.file.readJSON( sourceDir + '/json/js.json' ) ;
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
    const sourceDir = grunt.option( 'sourceDir' );
    const destinationDir = grunt.option( 'destinationDir' );
    return {
    main: {
      files: [
        { expand: true, cwd: sourceDir + '/images', src: '**/*', dest: destinationDir + '/images' },
        { expand: true, cwd: sourceDir + '/css', src: '**/*', dest: destinationDir + '/css' }
      ]
    }
  } ;
}

function clean () {
  return [ 
    grunt.option( 'destinationDir' )
  ] ;
}

function uglify () {
  function targetsCallback() {
    var targets = {};
    grunt.file.recurse(grunt.option( 'commonDir' ) + '/js/', function callback (abspath, rootdir, subdir, filename) {
      if ( filename.match('.js') ) {
        targets[grunt.option( 'destinationDir' ) + '/js/' + filename] = abspath ;
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
		  
  var htmlminifyConfigurationFile = grunt.option( 'sourceDir' ) + '/json/htmlminify.json' ;
		  
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
exports.sass = sass ;
exports.htmlminify = htmlminify ;
