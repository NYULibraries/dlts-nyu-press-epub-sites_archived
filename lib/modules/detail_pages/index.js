function detail_pages ( callback , options ) {

  var _ = require('underscore') ;

  var request = require('request') ;
  
  var getSlug = require('speakingurl');

  var fs = require('fs') ;
  
  var Entities = require('html-entities').AllHtmlEntities;
  
  var entities = new Entities();

  var collection_code = options.conf.collectionCode;

  var x = '?wt=json&fl=*&rows=1000&qt=dismax&qf=collection_code&q=' + collection_code;

  var template = __dirname + '/detail_pages.mustache' ;

  var src = options.conf.discovery + '/select' + x;

  request ( src , function ( error, response, body ) {

    if ( ! error && response.statusCode == 200 ) {

      var books = JSON.parse( body ) ;

      _.each ( books.response.docs , function ( doc ) {
        callback ( { route: '/details/' + doc.id + '/index.html', template: template, data: doc } ) ;
      } ) ;

    }
  });

}

exports.detail_pages = detail_pages ;
