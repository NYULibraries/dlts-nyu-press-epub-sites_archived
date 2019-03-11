"use strict";

const CONNECTED_YOUTH_RESPONSE = require( './expected-responses/connected-youth.json' );
const OPEN_ACCESS_BOOKS_RESPONSE = require( './expected-responses/open-access-books.json' );

const EXPECTED_SOLR_RESPONSE = {
    'http://discovery1.dlib.nyu.edu/solr/open-square-metadata/select?wt=json&fl=*&rows=1000&q=collection_code%3Aconnected-youth' : CONNECTED_YOUTH_RESPONSE,
    'http://discovery1.dlib.nyu.edu/solr/open-square-metadata/select?wt=json&fl=*&rows=1000&q=collection_code%3Aoa-books' : OPEN_ACCESS_BOOKS_RESPONSE
};

var request = function( uri, callback ) {
    var expectedResponse = EXPECTED_SOLR_RESPONSE[ uri ];

    if ( expectedResponse ) {
        callback( null, { statusCode : 200 }, JSON.stringify( expectedResponse ) );
    } else {
        callback( null, { statusCode : 404 }, null );
    }
};

module.exports.request = request;