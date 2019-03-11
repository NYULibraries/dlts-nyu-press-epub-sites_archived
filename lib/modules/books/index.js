function books ( callback , options ) {

  var _ = require('underscore') ;

  // Dependency injection
  var request = options.injectedRequest || require('request') ;

  var getSlug = require('speakingurl');

  var fs = require('fs') ;
  
  var Entities = require('html-entities').AllHtmlEntities;
  
  var entities = new Entities();

  var collection_code = options.conf.collectionCode;

  var query_string = 'wt=json&fl=*&rows=1000&q=collection_code%3A' + collection_code;

  var template = __dirname + '/' + options.template ;

  var src = options.conf.discovery + '/select?' + query_string;

  request ( src , function ( error, response, body ) {

    if ( ! error && response.statusCode == 200 ) {

      var books = JSON.parse( body ) ;

      _.each ( books.response.docs , function ( doc ) {
        callback ( { route: '/' + options.route + '/' + doc.id + '/index.html', template: template, data: doc } ) ;
      } ) ;

    }
  });

}

exports.books = books ;
