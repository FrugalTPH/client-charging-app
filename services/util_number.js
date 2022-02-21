"use strict";

function ndp0(x) { return Number.parseFloat(x).toFixed(0); };

function ndp2(x) { return Number.parseFloat(x).toFixed(2); };

function ndp3(x) { return Number.parseFloat(x).toFixed(3); };

function calcNet( qty, rate ) { return Number.parseFloat( qty * rate ).toFixed(2); };

function calcVat( qty, rate, vat ) { return Number.parseFloat( calcNet( qty, rate ) * vat ).toFixed(2); };


module.exports = { 
    ndp0,
    ndp2,
    ndp3,
    calcNet,
    calcVat
};