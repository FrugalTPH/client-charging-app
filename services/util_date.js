"use strict";

const moment =              require('moment');
const ndp3 =                require('./util_number').ndp3;

function daysUsage( startDate, endDate ) { 
    const start = new moment( startDate );
    const end = new moment( endDate );
    let diff = end.diff( start, 'minutes' );
    return ndp3( diff / 1440 );
};

function dateAdd( startDate, noOfDays ) {
    return new moment( startDate ).add( noOfDays, 'd' ).toDate();
};

function formatYYYYMMDD( date ) { 
    return moment( date || new Date() ).format('YYYYMMDD');
};

function formatYYYYMMDDHHmm( date ) { 
    return moment( date || new Date() ).format('YYYYMMDDHHmm');
};

function ts( date ) { 
    return moment( date || new Date() ).toISOString();
};

function startOfMonth( date ) { 
    const thisDate = date || new Date();
    return new Date( thisDate.getFullYear(), thisDate.getMonth(), 1, 0, 0, 0 );
};

function startOfQuarter( date ) { 
    const thisDate = date || new Date();
    return new Date( thisDate.getFullYear(), Math.floor( thisDate.getMonth() / 3 ) * 3, 1, 0, 0, 0 );
};

function startOfYear( date ) { 
    const thisDate = date || new Date();
    return new Date( thisDate.getFullYear(), 0, 1, 0, 0, 0 );
};

function startOf5minPeriod( date ) { 
    const thisDate = date || new Date();
    return new Date( thisDate.getFullYear(), thisDate.getMonth(), thisDate.getDate(), thisDate.getHours(), Math.floor( thisDate.getMinutes() / 5 ) * 5, 0 );
};

function startOf15minPeriod( date ) { 
    const thisDate = date || new Date();
    return new Date( thisDate.getFullYear(), thisDate.getMonth(), thisDate.getDate(), thisDate.getHours(), Math.floor( thisDate.getMinutes() / 15 ) * 15, 0 );
};

function startOfHour( date ) { 
    const thisDate = date || new Date();
    return new Date( thisDate.getFullYear(), thisDate.getMonth(), thisDate.getDate(), thisDate.getHours(), 0, 0 );
};

function getDate( strDate ) { return moment( strDate ).toDate(); }




module.exports = { 
    daysUsage,
    dateAdd,
    formatYYYYMMDD,
    formatYYYYMMDDHHmm,
    getDate,
    ts,
    startOfYear,
    startOfQuarter,
    startOfMonth,
    startOfHour,
    startOf15minPeriod,
    startOf5minPeriod
};