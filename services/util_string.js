"use strict";

const shortid =             require('shortid32');

function reverseEmail(str) {
    return !str ? str : str.split("@").reverse().join("@");
}

function shortId() {
    return shortid.generate().toLowerCase();
}

function jsonSorted( obj, space )
{
    var allKeys = [];
    JSON.stringify( obj, function( key, value ){ allKeys.push( key ); return value; } )
    allKeys.sort();
    return JSON.stringify( obj, allKeys, space );
};

module.exports = { 
    reverseEmail,
    shortId,
    jsonSorted
};