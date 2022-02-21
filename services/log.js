"use strict";

const path =                                            require('path');
const winston =                                         require('winston');

const { format, loggers, transports } =                 winston;
const { combine, splat, timestamp, printf, json } =     format;

const defaultFormat = combine( 
    splat(), 
    timestamp(),
    json()
);

const direct = printf( ({message}) => { return `${message}`; });

function getTransports( name ) {

    const logFile = path.resolve('./logs/' + name + '.log' );

    return process.env.NODE_ENV === 'production'
    ? [ new transports.File({ filename: logFile, options: { flags: 'w' } }) ]
    : [ new transports.File({ filename: logFile, options: { flags: 'w' } }) ];  // , new transports.Console()
}

function getLogger( name, format ) {
    return loggers.has( name )
    ? loggers.get( name )
    : loggers.add( name, { 
        format: format || defaultFormat, 
        transports: getTransports( name )
    });
}

function removeLogger( name ) {
    if ( loggers.has( name ) ) loggers.close( name );
}



module.exports = {
    getLogger,
    removeLogger,
    direct
};