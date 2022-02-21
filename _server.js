"use strict";

const express =             require("express");

const dotenv =              require('dotenv');
dotenv.config();

const util =                require('./middleware/server');
const jobRunner =           require('./services/jobRunner');

const mongoose =            require('mongoose');


mongoose.connect( process.env.DATA_SERVER, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    bufferCommands: false
});

const server = express();

server.disable('etag');
server.disable('x-powered-by');

server.set('json spaces', 4)

server.use( express.urlencoded( { extended: true } ), express.json() );

server.use( util.getNullProps, util.getSubdomain, util.getRouteBySubdomain );

server.use( function( err, req, res, next ) {
    if( err ) res.json( { error: "Fall through error", info: err.stack } );
    else next( err );
});

server.listen( process.env.PORT, () => { console.log("Server running on port " + process.env.PORT); });