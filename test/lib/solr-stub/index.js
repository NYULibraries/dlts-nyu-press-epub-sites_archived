"use strict";

const CONNECTED_YOUTH_RESPONSE = require( './expected-responses/connected-youth.json' );
const OPEN_ACCESS_BOOKS_RESPONSE = require( './expected-responses/open-access-books.json' );

const EXPECTED_SOLR_RESPONSE = {
    'http://discovery.dlib.nyu.edu:8080/solr3_discovery/nyupress/select?wt=json&fl=*&rows=1000&qt=dismax&qf=collection_code&q=connected-youth' : CONNECTED_YOUTH_RESPONSE,
    'http://discovery.dlib.nyu.edu:8080/solr3_discovery/nyupress/select?wt=json&fl=*&rows=1000&qt=dismax&qf=collection_code&q=oa-books' : OPEN_ACCESS_BOOKS_RESPONSE
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