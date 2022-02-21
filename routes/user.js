"use strict";

const express = 		    require("express");
const auth =                require('../middleware/auth');
const crypt =               require('../services/crypt');
const mail =                require('../services/mail');
const router =              express.Router( { mergeParams: true } );

const Charge =              require('../models/charge');
const Client =              require('../models/client');
const Email =               require('../models/email');
const Invoice =             require('../models/invoice');
const Model =               require('../models/model');
const Payment =             require('../models/payment');
const Plan =                require('../models/plan');
//const User =                require('../models/user');


router.all( '*', auth.userConfirmToken );
router.get( '/', usersCheck );

/**
 * @api {get} http://users.cde.fyi/me Read my profile
 * @apiName readProfile
 * @apiGroup Logged In User
 * @apiDescription Returns the User's profile
 * @apiExample {get} Example:
 * GET http://users.cde.fyi/me HTTP/1.1
 * 
 * @apiSuccess {String} success An action summary message
 * @apiSuccess {String} data The returned profile
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": "Profile retrieved",
 *       "data": 
 *          { 
 *              "displayName": "Joe Bloggs"
 *          }
 *     }
 * 
 */
router.get( '/me', readProfile );


/**
 * @api {patch} http://users.cde.fyi/me Update profile
 * @apiName updateProfile
 * @apiGroup Logged In User
 * @apiDescription Updates the User's profile
 * @apiExample {patch} Example:
 * PATCH http://users.cde.fyi/me HTTP/1.1
 * { 
 *   "name": "Joe 'Danger' Bloggs"
 * }
 *
 * @apiSuccess {String} success An action summary message and next steps
 * @apiSuccess {String} data The account email address
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": "Profile updated",
 *       "data": "joe@bloggs.com"
 *     }
 *
 */
router.patch( '/me', updateProfile );


/**
 * @api {patch} http://users.cde.fyi/me/password Update password
 * @apiName updatePassword
 * @apiGroup Logged In User
 * @apiDescription Updates the User's account password and logs out all their devices
 * @apiExample {patch} Example:
 * PATCH http://users.cde.fyi/me/password HTTP/1.1
 * { 
 *   "password": "password",
 *   "newPassword": "pa55w0rd"
 * }
 *
 * @apiSuccess {String} success An action summary message and next steps
 * @apiSuccess {String} data The account email address
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": "Password updated",
 *       "data": "joe@bloggs.com"
 *     }
 *
 */
router.patch( '/me/password', updatePassword );


/**
 * @api {post} http://users.cde.fyi/me/email Add an email
 * @apiName addEmail
 * @apiGroup Logged In User
 * @apiDescription Adds a secondary user email address and initiates the verification process
 * @apiExample {post} Example:
 * POST http://users.cde.fyi/me/email HTTP/1.1
 * { 
 *   "email": "joe@bloggs.com"
 * }
 *
 * @apiSuccess {String} success An action summary message and next steps
 * @apiSuccess {String} data The newly added email
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": "Check your email and click on the verification link sent",
 *       "data": "joe@bloggs.com"
 *     }
 *
 */
router.post( '/me/email', addEmail );


/**
 * @api {delete} http://users.cde.fyi/me/email Remove an email
 * @apiName removeEmail
 * @apiGroup Logged In User
 * @apiDescription Removes (deletes) a secondary user email address
 * @apiExample {delete} Example:
 * DELETE http://users.cde.fyi/me/email HTTP/1.1
 * { 
 *   "email": "joe@bloggs.com"
 * }
 *
 * @apiSuccess {String} success An action summary message and next steps
 * @apiSuccess {String} data The email that was deleted
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": "The specified email has been removed from our records",
 *       "data": "joe@bloggs.com"
 *     }
 *
 */
router.delete( '/me/email', removeEmail );


/**
 * @api {patch} http://users.cde.fyi/me/email Switch email
 * @apiName switchEmail
 * @apiGroup Logged In User
 * @apiDescription Switches the User's main email with a specified & verified secondary email 
 * @apiExample {patch} Example:
 * PATCH http://users.cde.fyi/me/email HTTP/1.1
 * { 
 *   "email": "joseph@bloggs.com"
 * }
 *
 * @apiSuccess {String} success An action summary message and next steps
 * @apiSuccess {String} data Details of the old and new emails
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": "Main account email has been switched to...",
 *       "data": "joseph@bloggs.com"
 *     }
 *
 */
router.patch( '/me/email', switchEmail );


/**
 * @api {post} http://users.cde.fyi/me/logout Logout here
 * @apiName logout
 * @apiGroup Logged In User
 * @apiDescription Logs the User off their current device
 * @apiExample {post} Example:
 * POST http://users.cde.fyi/me/logout HTTP/1.1
 *
 * @apiSuccess {String} success An action summary message and next steps
 * @apiSuccess {String} data The account email address
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": "You have been logged out on this device",
 *       "data": "joe@bloggs.com"
 *     }
 *
 */
router.post( '/me/logout', logout );


/**
 * @api {post} http://users.cde.fyi/me/logoutall Logout everywhere
 * @apiName logoutAll
 * @apiGroup Logged In User
 * @apiDescription Logs the User off of all their devices
 * @apiExample {post} Example:
 * POST http://users.cde.fyi/me/logoutall HTTP/1.1
 *
 * @apiSuccess {String} success An action summary message and next steps
 * @apiSuccess {String} data The account email address
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": "You have been logged out of all your devices",
 *       "data": "joe@bloggs.com"
 *     }
 *
 */
router.post('/me/logoutall', logoutAll );


/**
 * @api {get} http://users.cde.fyi/:user Read a profile
 * @apiName readGivenProfile
 * @apiGroup Logged In User
 * @apiDescription Returns a given user's profile
 * @apiExample {get} Example:
 * GET http://users.cde.fyi/eWRhpRV HTTP/1.1
 *
 * @apiParam {String} id Users account ID
 * 
 * @apiSuccess {String} success An action summary message
 * @apiSuccess {String} data The returned profile
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": "Profile retrieved",
 *       "data": 
 *          { 
 *              "displayName": "Joe Bloggs"
 *          }
 *     }
 * 
 */
router.get( '/:user', loadGivenUser, readGivenProfile );


/**
 * @api {post} http://users.cde.fyi/c Create a client
 * @apiName clientCreate
 * @apiGroup Logged In User
 * @apiDescription Creates a new client and initiates the new client onboarding process
 * @apiExample {post} Example:
 * POST http://users.cde.fyi/c HTTP/1.1
 * { 
 *   "name": "frugal-design",
 *   "plan": "pro",
 *   "address": {
 *   	"companyName": "Frugal Consultancy + Design Ltd.",
 *   	"companyNumber": "12345678",
 *   	"vatNumber": "GB1234567",
 *   	"address": "63 Hymers Avenue",
 *   	"postCode": "HU3 1LL",
 *   	"faoName": "Tom Hartley",
 *   	"faoPhone": "07852 206 088",
 *   	"faoEmail": "tom@frugaldesign.co.uk"
 *   }
 * }
 *
 * @apiSuccess {String} success An action summary message and next steps
 * @apiSuccess {String} data The new account name
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": "Prospective client account created",
 *       "data": { "name": "acme-ltd", "manager": "WI9vWJ4k" }
 *     }
 *
 */
router.post( '/c', clientCreate );


function usersCheck( req, res ) {
    res.json( { success: 'USERS route is live', user: req.auth.user.email } );
};

function readProfile( req, res ) {
    try
    {
        const user = req.auth.user;
        res.json( { success: 'Extended profile retrieved', profile: user.getProfile( true ) } );
    }
    catch ( err ) { res.json( { error: 'Could not read your user profile', info: err.message } ); }
};

async function updateProfile( req, res ) {
    try
    {
        const user = req.auth.user;
        if ( req.body.name ) user.profile.displayName = req.body.name;
        await user.save();

        res.json( { success: 'User updated', profile: user.getProfile( true ) } ); 
    }
    catch ( err ) { res.json( { error: 'Could not update your user profile', info: err.message } ); }
};

async function addEmail( req, res ) {
    try
    {
        const user = req.auth.user;

        const email = new Email( { _id: req.body.email } );
        await email.grant( user._id );
        await mail.sendEmailChangedConfirmation( email._id, email.token );

        res.json( { success: "Check your email and click on the verification link sent", email: email._id } );
    }
    catch ( err ) { res.json( { error: 'Could not add new email', data: err.message } ); }
};

async function removeEmail( req, res ) {
    try
    {
        const user = req.auth.user;

        const email = await Email.findOne( { _id: req.body.email, verifiedBy: user._id } );
        if ( !email ) throw new Error( 'The specified email is not valid or you have not yet been verified as its owner' );
        if ( email._id === user.email ) throw new Error( 'This is your account main email and so cannot be removed' );

        await email.remove();

        res.json( { success: "The specified email has been removed from our records", email: email._id } );
    }
    catch ( err ) { res.json( { error: 'Could not remove specified email', data: err.message } ); }
};

async function switchEmail( req, res ) {
    try
    {
        const user = req.auth.user;

        const email = await Email.findOne( { _id: req.body.email, verifiedBy: user._id } );
        if ( !email ) throw new Error( 'The specified email is not valid or you have not yet been verified as its owner' );
        if( email._id === user.email ) throw new Error( "This is already your account main email and so doesn't require switching" );

        user.email = email._id;
        await user.save();
        await mail.sendSwitchReceipt( user.email );

        res.json( { success: "Main account email has been switched to...", data: user.email } );
    }
    catch ( err ) { res.json( { error: 'Could not update your user email', info: err.message } ); }
};

async function updatePassword( req, res ) {
    try
    {
        const user = req.auth.user;
        if ( !req.body.newPassword || !req.body.password ) throw new Error( 'One or more body parameters missing (newPassword, password)' );
        if ( !await crypt.checkPassword( req.body.password, user.password ) ) throw new Error( 'The entered (current) password is incorrect' );
        await user.resetPassword( req.body.newPassword );
        res.send( { success: 'Your password has just been changed to the new value entered' } );
    }
    catch ( err ) { res.json( { error: 'Could not update your user password', info: err.message } ); }
};

function logout( req, res ) {
    try
    {
        const user = req.auth.user;
        user.logout( req.auth.login );
        res.send( { success: 'You have been logged out on this device' } );        
    }
    catch ( err ) { throw err; }
};

function logoutAll( req, res ) {
    try
    {
        const user = req.auth.user;
        user.logoutAll();
        res.send( { success: 'You have been logged out on all devices' } );        
    }
    catch ( err ) { throw err; }
};

async function loadGivenUser( req, res, next ) {
    try
    {
        const user = await User.findById( req.params.user );
        if (!user) throw new Error( req.params.user + " not found"); 
        else req.given.user = user;
        next();
    }
    catch ( err ) { res.json( { error: 'Could not load the given user', info: err.message } ); }
};

function readGivenProfile( req, res ) {
    try
    {
        const user = req.given.user;
        res.json( { success: 'Public profile retrieved', profile: user.getProfile() } );
    }
    catch ( err ) { res.json( { error: 'Could not read the given user profile', info: err.message } ); }  
};

async function clientCreate( req, res ) {
    try
    {
        req.body.manager = req.auth.user._id;
        req.body.profile = { displayName: req.body.address.companyName };

        const plan = await Plan.fuzzyFindById( req.body.plan );
        if ( !plan ) throw new Error( 'Could not allocate a suitable plan' );
        req.body.plan = plan._id;
    
        const client = new Client( req.body );
        await client.save();

        const invoice = await client.invoicePlan();
        if ( invoice ) await invoice.issueToClient();
        
        res.json( { success: 'Provisional client created pending initial payment', client: client._id } );
    }
    catch ( err ) { res.json( { error: 'Could not create client', info: err.stack } ); }
};


module.exports = router;