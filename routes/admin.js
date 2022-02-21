"use strict";

const express = 		    require("express");
const auth =                require('../middleware/auth');
const router =              express.Router( { mergeParams: true } );

const Client =              require('../models/client');
const Invoice =             require('../models/invoice');
const Model =               require('../models/model');
const Payment =             require('../models/payment');
const Plan =                require('../models/plan');
const Charge =              require('../models/charge');
const User =                require('../models/user');

const _s =                  require('../services/util_string');

router.all( '*', auth.userConfirmToken );
router.get( '/', adminCheck );
router.all( '*', auth.user_isAdmin );

/**
 * @api {post} http://admin.cde.fyi/p Create a plan
 * @apiName createPlan
 * @apiGroup Logged In Admin
 * @apiDescription Creates a new subscription (product) plan
 * @apiExample {post} Example:
 * POST http://admin.cde.fyi/c HTTP/1.1
 * { 
 *   "_id": "2019-starter",
 *   "currency": "£"
 *   "archive": 1.64,
 *   "client": 1.37,
 *   "vat": 0.2,
 *   "wip": 1.64,
 * }
 *
 * @apiSuccess {String} success An action summary message and next steps
 * @apiSuccess {String} data The new product plan name
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": "Client account created",
 *       "data": "2019-starter"
 *     }
 *
 */
router.post( '/p', createPlan );


/**
 * @api {get} http://admin.cde.fyi/c List clients
 * @apiName listClients
 * @apiGroup Logged In Admin
 * @apiDescription Lists all clients
 * @apiExample {get} Example:
 * GET http://admin.cde.fyi/c HTTP/1.1
 *
 * @apiSuccess {String} success An action summary message
 * @apiSuccess {String} data An array of all client profiles with ids
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": "Profiles retrieved",
 *       "data": [
 *          { "name": "acme-ltd", "website": "http://acme-ltd.co.uk", "_id": "eWRhpRV" }, 
 *          { "name": "frugal-design", "website": "http://frugaldesign.co.uk", "_id": "23TplPdS" }
 *       ]
 *     }
 * 
 */
router.get( '/c', listClients );


/**
 * @api {get} http://admin.cde.fyi/m List models
 * @apiName listModels
 * @apiGroup Logged In Admin
 * @apiDescription Lists all models
 * @apiExample {get} Example:
 * GET http://admin.cde.fyi/m HTTP/1.1
 *
 * @apiSuccess {String} success An action summary message
 * @apiSuccess {String} data An array of all model profiles with ids
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": "Profiles retrieved",
 *       "data": [
 *          { "displayName": "Site 1 Asset Information Model", "_id": "dBvJIh-H" }, 
 *          { "displayName": "Site 2 Asset Information Model", "_id": "2WEKaVNO" },
 *          { "displayName": "Site 3 Asset Information Model", "_id": "7oet_d9Z" }
 *       ]
 *     }
 * 
 */
router.get( '/m', listModels);


/**
 * @api {get} http://admin.cde.fyi/i List invoices
 * @apiName listInvoices
 * @apiGroup Logged In Admin
 * @apiDescription Lists all invoices
 * @apiExample {get} Example:
 * GET http://admin.cde.fyi/i HTTP/1.1
 *
 * @apiSuccess {String} success An action summary message
 * @apiSuccess {String} data An array of all invoice profiles with ids
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": "Profiles retrieved",
 *       "data": [
 *          { "date": "2019-10-30", "amount": "£250.00", "_id": "dogPzIz8" }, 
 *          { "date": "2019-09-30", "amount": "£250.00", "_id": "nYrnfYEv" }, 
 *          { "date": "2019-08-30", "amount": "£250.00", "_id": "a4vhAoFG" }
 *       ]
 *     }
 * 
 */
router.get( '/i', listInvoices);

/**
 * @api {get} http://admin.cde.fyi/u List users
 * @apiName listUsers
 * @apiGroup Logged In Admin
 * @apiDescription Lists all users by displayName
 * @apiExample {get} Example:
 * GET http://admin.cde.fyi/u HTTP/1.1
 * { "profile.displayName": { "$regex": "Hart", "$options": "i" } }
 *
 * @apiSuccess {String} success An action summary message
 * @apiSuccess {String} data An array of all the user names with ids
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": "Profiles retrieved",
 *       "data": [
 *          { "displayName": "Joe Bloggs", "_id": "eWRhpRV" }, 
 *          { "displayName": "Darth Vadar", "_id": "23TplPdS" }, 
 *          { "displayName": "Luke Skywalker", "_id": "46Juzcyx" }
 *       ]
 *     }
 * 
 */
router.get( '/u', listUsers );

/**
 * @api {post} http://admin.cde.fyi/c/unhold/:client Unhold client
 * @apiName unholdClient
 * @apiGroup Logged In Admin
 * @apiDescription Unholds service provision for the given client
 * @apiExample {post} Example:
 * POST http://admin.cde.fyi/c/unhold/acme-ltd HTTP/1.1
 *
 * @apiSuccess {String} success An action summary message and next steps
 * @apiSuccess {String} data The client id affected
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": "Client is off hold",
 *       "data": "frugal-design"
 *     }
 *
 */
router.post( '/c/unhold/:client', loadGivenClient, unholdClient );

/**
 * @api {post} http://admin.cde.fyi/c/hold/:client Hold client
 * @apiName holdClient
 * @apiGroup Logged In Admin
 * @apiDescription Holds service provision for the given client
 * @apiExample {post} Example:
 * POST http://admin.cde.fyi/c/hold/acme-ltd HTTP/1.1
 *
 * @apiSuccess {String} success An action summary message and next steps
 * @apiSuccess {String} data The client id affected
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": "Client is on hold",
 *       "data": "frugal-design"
 *     }
 *
 */
router.post( '/c/hold/:client', loadGivenClient, holdClient );

/**
 * @api {post} http://admin.cde.fyi/u/unhold/:client Unhold user
 * @apiName unholdUser
 * @apiGroup Logged In Admin
 * @apiDescription Unholds service provision for the given user
 * @apiExample {post} Example:
 * POST http://admin.cde.fyi/u/unhold/23TplPdS HTTP/1.1
 *
 * @apiSuccess {String} success An action summary message and next steps
 * @apiSuccess {String} data The user affected
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": "User is off hold",
 *       "data": "joe@bloggs.com"
 *     }
 *
 */
router.post( '/u/unhold/:user', loadGivenUser, unholdUser );


/**
 * @api {post} http://admin.cde.fyi/u/hold/:user Hold user
 * @apiName holdUser
 * @apiGroup Logged In Admin
 * @apiDescription Holds service provision for the given user
 * @apiExample {post} Example:
 * POST http://admin.cde.fyi/u/hold/23TplPdS HTTP/1.1
 *
 * @apiSuccess {String} success An action summary message and next steps
 * @apiSuccess {String} data The user affected
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": "User is on hold",
 *       "data": "joe@bloggs.com"
 *     }
 *
 */
router.post( '/u/hold/:user', loadGivenUser, holdUser );


/**
 * @api {post} http://admin.cde.fyi/pay Record a plan payment
 * @apiName payInvoice
 * @apiGroup Logged In Admin
 * @apiDescription Creates a client payment and allocates it to the given invoice 
 * @apiExample {get} Example:
 * POST http://admin.cde.fyi/pay HTTP/1.1
 * {
 *    "invoice": "i_nYrnfYEv",
 *    "receivedAt": "21/01/2020",
 *    "gross": "500.00",
 *    "note": "Any misc notes, e.g. to explain part or grouped payments"
 * }
 *
 * @apiSuccess {String} success An action summary message
 * @apiSuccess {String} data The new date of expiry of the client's plan
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "success": "Client plan payment credited",
 *   "invoice": "{ invoice }",
 *   "client": "{ client }"
 * }
 * 
 */
router.post( '/pay', payInvoice );


/**
 * @api {post} http://admin.cde.fyi/c/hold/:client Invoice client models
 * @apiName invoiceUsage
 * @apiGroup Logged In Admin
 * @apiDescription Raises a model usage invoice of all unallocated model usage charges
 * @apiExample {post} Example:
 * POST http://admin.cde.fyi/c/invoice/acme-ltd HTTP/1.1
 *
 * @apiSuccess {String} success An action summary message and next steps
 * @apiSuccess {String} data The invoice that was raised
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": "Invoice raised",
 *       "invoice": "{ invoice }"
 *     }
 *
 */
router.post( '/c/invoice/:client', loadGivenClient, invoiceUsage );


function adminCheck( req, res ) {
    res.json( { success: 'ADMIN route is accessible', user: req.auth.user.email } );
};

async function loadGivenClient( req, res, next ) {
    try
    {
        const client = await Client.findById( req.params.client );
        if (!client) throw new Error( req.params.client + " not found");
        else req.given.client = client;
        next();
    }
    catch ( err ) { res.json( { error: 'Could not load the given client', info: err.message } ); }
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

async function createPlan( req, res ) {
    try
    {
        const plan = new Plan( req.body );
        await plan.save();
        res.json( { success: 'Plan created', data: plan._id } );
    }
    catch ( err ) { res.json( { error: 'Could not create plan', data: err.message } ); }
};

async function listClients( req, res ) {
    try
    {
        const query = req.body || { };
        const clients = await Client.find( query );

        const map = clients.map( ( client ) => { return client._id; }) || [];

        res.json( { success: 'List of clients retrieved', profiles: map } );
    }
    catch ( err ) { res.json( { error: 'Could not list clients', info: err.message } ); }
};

async function listModels( req, res ) {
    try
    {
        const query = req.body || { };
        const models = await Model.find( query );
        const map = {};
        
        models.forEach( ( model ) => { map[ model._id ] = model.summary(); });
        res.json( { success: 'List of models retrieved', profiles: map } );
    }
    catch ( err ) { res.json( { error: 'Could not list models', info: err.message } ); } 
};

async function listInvoices( req, res ) {
    try
    {
        const query = req.body || { };
        const invoices = await Invoice.find( query );
        const map = {};
        
        invoices.forEach( ( invoice ) => { map[ invoice._id ] = invoice.summary(); });
        res.json( { success: 'List of invoices retrieved', profiles: map } );
    }
    catch ( err ) { res.json( { error: 'Could not list invoices', info: err.message } ); } 
};

async function listUsers( req, res, next ) {
    try
    {
        const query = req.body || { };
        const users = await User.find( query );

        const map = {};

        users.forEach( ( user ) => { 
            map[ user.email ] = user._id; }
        );
        res.json( { success: 'List of users retrieved', profiles: map } );
    }
    catch ( err ) { res.json( { error: 'Could not list users', info: err.message } ); }    
};

async function holdClient( req, res, next ) {
    try
    {
        const client = req.given.client;

        await Charge.chargeClient( { client: client, chargeDate: new Date(), nextState: 'hold' } )

        res.json( { success: 'Client service provision placed on hold', data: client._id } );
    }
    catch ( err ) { res.json( { error: 'Could not place client service provision on hold', info: err.message } ); }    
};

async function unholdClient( req, res, next ) {
    try
    {
        const client = req.given.client;

        await Charge.chargeClient( { client: client, chargeDate: new Date(), nextState: 'wip' } )

        res.json( { success: 'Client service provision restored', data: client._id } );
    }
    catch ( err ) { res.json( { error: 'Could not restore client service provision', info: err.message } ); }    
};

async function unholdUser( req, res, next ) {
    try
    {
        const user = req.given.user;
        user.state = 'wip';
        await user.save();

        res.json( { success: 'User placed off hold', data: user.email } );
    }
    catch ( err ) { res.json( { error: 'Could not place user off hold', info: err.message } ); }    
};

async function holdUser( req, res, next ) {
    try
    {
        const user = req.given.user;
        user.state = 'hold';
        await user.save();

        res.json( { success: 'User placed on hold', data: user.email } );
    }
    catch ( err ) { res.json( { error: 'Could not place user on hold', info: err.message } ); }
};

async function payInvoice( req, res ) {
    try
    {
        const invoice = await Invoice.findById( req.body.invoice );
        if ( !invoice ) throw new Error( 'Could not find the given invoice' );
        
        await invoice.payment( req.body.receivedAt, req.body.gross, req.body.note );

        await invoice.populate('client').execPopulate(); 
        res.type('json').send( _s.jsonSorted( invoice, 4 ) );
    }
    catch ( err ) { res.json( { error: 'Could not create payment', info: err.message } ); }
};

async function invoiceUsage( req, res ) {
    try
    {
        const client = req.given.client;

        const invoice = await client.invoiceUsage();
        if ( invoice ) await invoice.issueToClient();

        res.type('json').send( _s.jsonSorted( invoice, 4 ) );
    }
    catch ( err ) { res.json( { error: 'Could not invoice model usage', info: err.message } ); }
};


module.exports = router;