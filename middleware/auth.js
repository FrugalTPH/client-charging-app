"use strict";

const crypt =               require('../services/crypt');
const Client =              require('../models/client');
const User =                require('../models/user');
const Email =               require('../models/email');


async function userEmailAndPassword( req, res, next ) {
    try
    {
        const user = await User.findOne( { 'email': req.body.email } );
        
        if ( !user || !await crypt.checkPassword( req.body.password, user.password ) ) throw new Error('Check the entered user credentials');

        req.unauth.user = user;
        next();
    }
    catch ( err ) { res.status(401).json( { error: "Could not authenticate email and password", data: err.message } ); }
}

async function emailConfirmToken( req, res, next ) {
    try
    {
        const payload = crypt.getPayload( req.query.token );

        const email = await Email.findOne( { _id: payload.email, token: req.query.token } );
        if ( !email ) throw new Error( 'This email link is invalid, corrupt, or has expired' );

        let user;
        if ( payload.user ) user = await User.findById( payload.user );
        if ( !user ) throw new Error( 'There is no user associated with this email link' );

        req.auth.email = email;
        req.unauth.user = user;
        next();
    }
    catch ( err ) { res.status(401).send( { error: "Could not authenticate email confirm token", data: err.message } ); }
}

async function userConfirmToken( req, res, next ) {
    try
    {
        const bearerToken = req.header('Authorization').replace('Bearer ', '');
        const payload = crypt.getPayload( bearerToken );

        let user;
        if ( payload.user ) user = await User.findOne( { '_id': payload.user, 'logins': bearerToken } );
        if ( !user ) throw new Error( "You are not currently logged in, so can't perform the requested action" );
        
        if ( crypt.isPayloadExpired( payload ) )
        {
            user.logout( bearerToken );
            throw new Error( 'Your current login has expired, please login and try again' )
        }

        req.auth.user = user;
        req.auth.login = bearerToken;
        next();
    }
    catch ( err ) { res.status(401).send( { error: "Could not authenticate bearer token", data: err.message } ); }
}

async function userResetPassword( req, res, next ) {
    try
    {
        var user = await User.findOne( { 'email': req.body.email } );
        if (!user) throw new Error( 'This email is not registered' );

        req.unauth.user = user;
        next();
    }
    catch ( err ) { res.status(401).send( { error: "Could not authenticate password reset request", data: err.message } ); }
}

async function clientSubdomain( req, res, next ) {
    try
    {
        const client = await Client.findById( req.subDomainRoute );
        if ( !client ) throw new Error( 'There is no client listed under that subdomain' );

        req.auth.client = client;
        // req.auth.client.state = await client.getState();
        console.log("client.state: " + req.auth.client.state );
        next();
    }
    catch ( err ) { res.status(401).send({ error: "Could not authenticate client subdomain", data: err.message }); }
}

function client_notOnHold( req, res, next ) {
    if ( req.auth.client.state === 'hold' ) res.status(401).send( { error: "Access denied", data: 'Client is on hold' } );
    else next();
}

async function user_isAdmin( req, res, next ) {
    try
    {
        const user = req.auth.user;
        if ( !user || !user.isAdmin ) throw new Error( 'User is not an admin' );

        next();
    }
    catch ( err ) { res.status(401).send( { error: "Access denied", data: err.message } ); }
}

module.exports = { 
    userEmailAndPassword,
    emailConfirmToken,
    userConfirmToken,
    userResetPassword,
    user_isAdmin,
    clientSubdomain,
    client_notOnHold
};