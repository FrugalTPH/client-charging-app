"use strict";

const mongoose =                require('mongoose');
const options =                 { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, bufferCommands: false };


module.exports = async function ( connectString ) {
        let conn;
        let models;
        try 
        {
            if( !conn )
            {
                conn = await mongoose.createConnection( connectString, options );
                conn.model( 'Current', require('./model') );
                console.log( 'Connected: ' + connectString );
            }
            if( !models )
            {
                models = {
                    Current: conn.model( 'Current' )
                };
                console.log( 'Models complied: Current, History' );
            }
            return models;
        }
        catch ( err )
        {
            throw err;
        }
    };