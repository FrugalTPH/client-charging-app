"use strict";

function sumProp( arr, prop ) { 
    return arr.reduce( function ( tot, obj ) { return tot + parseFloat( obj[ prop ]) ; }, 0 );
};


module.exports = { 
    sumProp
};