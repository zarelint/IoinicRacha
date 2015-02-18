'use strict';

// directorio actual
var applicationRoot = __dirname,

//Web framework
    express = require( 'express' ),
    _ = require('underscore'),


//Utilities for dealing with file paths
    path = require( 'path');

var resul = require('./actual')();
var api2 = require('./getRacha')();

var rachas = api2(_,38).GetRachasCalendario(resul.resultados);

var lista  = [rachas,resul.resultados];

//Create server
var app = express();
// Configure server
//var bodyParser = require('body-parser');var methodOverride = require('method-override');
//parses request body and populates request.body
    //app.use( express.bodyParser() );
//checks request.body for HTTP method overrides
    //app.use( express.methodOverride() );
//perform route lookup based on URL and HTTP method
   // app.use( app.router );
//Where to serve static content
    app.use( express.static( path.join( applicationRoot, '.') ) );

//Show all errors in development
    //app.use( express.errorHandler({ dumpExceptions: true, showStack: true }));


var port = 8080;
app.listen( port, function() {
    console.log( 'Express server listening on port %d in %s mode',
        port, app.settings.env );
});


// Routes
app.get( '/api', function( request, response ) {
    response.send( ' API is running' );
});

//Get lista de rachas de todas la ligas
app.get( '/DatosRachas', function( request, response ) {
    return response.send(JSON.stringify(lista));
});


//Get una racha por id
app.get( '/DatosRachas/:id', function( request, response ) {
    var _racha = _.findWhere(lista, {id: parseInt(request.params.id)});
    return response.send( JSON.stringify(_racha) );
});

