"use strict";

const jobRunner =           require('node-schedule');
const _ =                   require('lodash');

const Client =              require('../models/client');
const Model =               require('../models/model');
const Charge =         require('../models/charge');

const _d =                  require('./util_date');
const mail =                require('../services/mail');

const logProvider =         require('./log');

let runningJobs = [ ];


if ( process.env.NODE_ENV === 'production' ) {
    jobRunner.scheduleJob( '* * 1 * *', modelUsage_monthly );
    jobRunner.scheduleJob( '* 1 1 1 *', emails_removeUnverified );
    jobRunner.scheduleJob( '* 2 1 1 *', users_removeUnverified );
    jobRunner.scheduleJob( '* 3 1 1 *', users_removeVeryOldLogins );
}
else
{
    //jobRunner.scheduleJob( { second: [ 0, 10, 20, 30, 40, 50, ] }, planRenewal_daily );
    //jobRunner.scheduleJob( { minute: [ 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55 ] }, modelUsage_monthly );
}

async function planRenewal_daily() {
    console.log( "plan renewal" );
};


async function modelUsage_monthly() {

    let chargeDate = _d.startOfMonth();
    let isQuarterEnd = _d.startOfQuarter( chargeDate ) === chargeDate;
    let jobName = 'modelUsage_' + _d.formatYYYYMMDD( chargeDate );
    
    if ( process.env.NODE_ENV === 'development' ) {
        chargeDate = _d.startOf5minPeriod();
        isQuarterEnd = _d.startOf15minPeriod( chargeDate ) === chargeDate;
        isYearEnd = _d.startOfHour( chargeDate ) === chargeDate;
        jobName = 'modelUsage_' + _d.formatYYYYMMDDHHmm( chargeDate );
    }
    
    if ( !runningJobs.includes( jobName ) )
    {
        runningJobs.push( jobName );

        const logger = logProvider.getLogger( jobName, logProvider.direct );
        try
        {
            logger.info( _d.ts() + ', USAGE, REASON, CLIENT, MODEL' );

            let cursor = Model.find().sort( { owner: 1, _id: 1 } ).cursor();
            await cursor.eachAsync( async function( model ) {
                try { await model.createCharge( chargeDate, logger ); }
                catch ( err ) {  }
            });
            
            logger.info( _d.ts() + ', FINISH, FINISH, FINISH, FINISH' );
        }
        catch ( err ) { logger.info( _d.ts() + ', CRASH, CRASH, CRASH, CRASH, CRASH' ); }

        logProvider.removeLogger( jobName );
        //await mail.sendLogFile( jobName );

        runningJobs = runningJobs.filter( item => item !== jobName );

        if ( isQuarterEnd ) invoices();
    }
    else console.log( "ABORT: '%s' is already running", jobName );
};


// async function invoices() {
    
//     let invoiceDate = _d.startOfQuarter();
//     let isYearEnd = _d.startOfYear( invoiceDate ) === invoiceDate;
//     let jobName = 'invoices_' + _d.formatYYYYMMDD( invoiceDate );
    
//     if ( process.env.NODE_ENV === 'development' ) {
//         invoiceDate = _d.startOf15minPeriod();
//         isYearEnd = _d.startOfHour( invoiceDate ) === invoiceDate;
//         jobName = 'invoices_' + _d.formatYYYYMMDDHHmm( invoiceDate );
//     }

//     if ( !runningJobs.includes( jobName ) )
//     {
//         runningJobs.push( jobName );

//         const logger = logProvider.getLogger( jobName, logProvider.direct );
//         try
//         {
//             logger.info( _d.ts() + ', GROSS, CLIENT, NOTE' );

//             let cursor = Client.find().sort( { _id: 1 } ).cursor();
//             await cursor.eachAsync( async function( client ) {
//                 try { await Invoice.modelCharges( { client: client, invoiceDate: invoiceDate, logger: logger } ); }
//                 catch ( err ) {  }
//             });

//             logger.info( _d.ts() + ', FINISH, FINISH, FINISH, FINISH' );
//         }
//         catch ( err ) { logger.info( _d.ts() + ', CRASH, CRASH, CRASH, CRASH, CRASH' ); }

//         logProvider.removeLogger( jobName );
//         //await mail.sendLogFile( jobName );

//         runningJobs = runningJobs.filter( item => item !== jobName );
//     }
//     else console.log( "ABORT: '%s' is already running", jobName );
// }


async function emails_removeUnverified() {
    try
    {
        console.log("emails_removeUnverified - NOT YET IMPLEMENTED" );
    }
    catch ( err ) { throw err; }
};


async function users_removeUnverified() {
    try
    { 
        console.log("users_removeUnverified - NOT YET IMPLEMENTED" );
    }
    catch ( err ) { throw err; }
};


async function users_removeVeryOldLogins() {
    try
    { 
        console.log("users_removeVeryOldLogins - NOT YET IMPLEMENTED" );
    }
    catch ( err ) { throw err; }
};
