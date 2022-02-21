"use strict";

const _escape = require('lodash').escapeRegExp;

function like( field, searchValue ) {
    const regex = { };
    regex[ field ] = { '$regex': searchValue, '$options': 'i' };
    return regex;
}

function escape( string ) { return _escape( string ); };

module.exports = { 
    like,
    escape
};