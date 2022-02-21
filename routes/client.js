"use strict";

const express = 		    require("express");
const auth =                require('../middleware/auth');
const router =              express.Router( { mergeParams: true } );

const _s =                  require('../services/util_string');

const Charge =              require('../models/charge');
const Invoice =             require('../models/invoice');
const Model =               require('../models/model');
const User =                require('../models/user');

router.all( '*', auth.clientSubdomain );
router.get( '/', clientCheck );
router.all( '*', auth.client_notOnHold, auth.userConfirmToken );


/**
 * @api {get} http://:client.cde.fyi/u List users
 * @apiName listUsers
 * @apiGroup Verified Client
 * @apiDescription Lists users associated with the given client
 * @apiExample {get} Example:
 * GET http://acme-ltd.cde.fyi/u HTTP/1.1
 *
 * @apiParam {String} client Client account name
 * 
 * @apiSuccess {String} success An action summary message
 * @apiSuccess {String} data An array of all the user names with ids
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": "User profiles retrieved",
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
 * @api {get} http://:client.cde.fyi/m List models
 * @apiName listModels
 * @apiGroup Verified Client
 * @apiDescription Lists models associated with the given client
 * @apiExample {get} Example:
 * GET http://acme-ltd.cde.fyi/m HTTP/1.1
 * 
 * @apiParam {String} client Client account name
 *
 * @apiSuccess {String} success An action summary message
 * @apiSuccess {String} data An array of all the models' names and ids
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": "Model summaries retrieved",
 *       "data": [
 *          { "displayName": "Site 1 Asset Information Model", "_id": "dBvJIh-H" }, 
 *          { "displayName": "Site 2 Asset Information Model", "_id": "2WEKaVNO" }, 
 *          { "displayName": "Site 3 Asset Information Model", "_id": "7oet_d9Z" }
 *       ]
 *     }
 * 
 */
router.get( '/m', listModels );


/**
 * @api {get} http://:client.cde.fyi/t List charges
 * @apiName listCharges
 * @apiGroup Verified Client
 * @apiDescription Lists charges associated with the given client
 * @apiExample {get} Example:
 * GET http://acme-ltd.cde.fyi/t HTTP/1.1
 * 
 * @apiParam {String} client Client account name
 *
 * @apiSuccess {String} success An action summary message
 * @apiSuccess {String} data An array of all the models' names and ids
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": "Charge summaries retrieved",
 *       "data": [
 *          { "displayName": "Site 1 Asset Information Model", "_id": "dBvJIh-H" }, 
 *          { "displayName": "Site 2 Asset Information Model", "_id": "2WEKaVNO" }, 
 *          { "displayName": "Site 3 Asset Information Model", "_id": "7oet_d9Z" }
 *       ]
 *     }
 * 
 */
router.get( '/t', listCharges );


/**
 * @api {get} http://:client.cde.fyi/i List invoices
 * @apiName listInvoices
 * @apiGroup Verified Client
 * @apiDescription Lists all invoices associated with the given client
 * @apiExample {get} Example:
 * GET http://acme-ltd.cde.fyi/i HTTP/1.1
 *
 * @apiParam {String} client Client account name
  * 
 * @apiSuccess {String} success An action summary message
 * @apiSuccess {String} data An array of all the invoice summaries (date, amount & ids)
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": "Invoice summaries retrieved",
 *       "data": [
 *          { "date": "2019-10-30", "amount": "£250.00", "_id": "dogPzIz8" }, 
 *          { "date": "2019-09-30", "amount": "£250.00", "_id": "nYrnfYEv" }, 
 *          { "date": "2019-08-30", "amount": "£250.00", "_id": "a4vhAoFG" }
 *       ]
 *     }
 * 
 */
router.get( '/i', listInvoices );

/**
 * @api {post} http://:client.cde.fyi/m Create a model
 * @apiName createModel
 * @apiGroup Verified Client
 * @apiDescription Creates a new Model for the given client
 * @apiExample {post} Example:
 * POST http://acme-ltd.cde.fyi/m HTTP/1.1
 * { 
 *    "displayName": "Site x Project Information Model", 
 * }
 * 
 * @apiParam {String} client Client account name
 *
 * @apiSuccess {String} success An action summary message
 * @apiSuccess {String} data The id of the model that was created
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": "Model created",
 *       "data": "2WEKaVNO"
 *     }
 * 
 */
router.post( '/m', createModel );

/**
 * @api {get} http://:client.cde.fyi/m/:model Read a model
 * @apiName readModel
 * @apiGroup Verified Client
 * @apiDescription Returns the given model for the given client
 * @apiExample {get} Example:
 * GET http://acme-ltd.cde.fyi/m/2WEKaVNO HTTP/1.1
 * 
 * @apiParam {String} client Client account name
 * @apiParam {String} model Model ID
 *
 * @apiSuccess {String} success An action summary message
 * @apiSuccess {String} data The returned model summary
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": "Model retrieved",
 *       "data":
 *        { 
 *           "displayName": "Site 1 Asset Information Model", 
 *           "_id": "dBvJIh-H"
 *        }
 *     }
 * 
 */
router.get( '/m/:model', loadGivenModel, readModel );


/**
 * @api {patch} http://:client.cde.fyi/m/:model Update a model
 * @apiName updateModel
 * @apiGroup Verified Client
 * @apiDescription Updates the given model for the given client
 * @apiExample {patch} Example:
 * PATCH http://acme-ltd.cde.fyi/m/2WEKaVNO HTTP/1.1
 * { 
 *   "displayName": "Site 1 AIM"
 * }
 * 
 * @apiParam {String} client Client account name
 * @apiParam {String} model Model ID
 *
 * @apiSuccess {String} success An action summary message
 * @apiSuccess {String} data The model id of the model that was updated
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": "Model updated",
 *       "data": "2WEKaVNO"
 *     }
 * 
 */
router.patch( '/m/:model', loadGivenModel, updateModel );


/**
 * @api {patch} http://:client.cde.fyi/m/:state/:model Change model state
 * @apiName setModelState
 * @apiGroup Verified Client
 * @apiDescription Sets the given model to the given model state
 * @apiExample {patch} Example:
 * PATCH http://acme-ltd.cde.fyi/m/hold/m_2WEKaVNO HTTP/1.1
 * 
 * @apiParam {String} client Client account name
 * @apiParam {String} model Model ID
 * @apiParam {String} state Model state ( wip, archive or hold/unhold )
 *
 * @apiSuccess {String} success An action summary message
 * @apiSuccess {String} data The model
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": "Model updated",
 *       "model": "{ model }"
 *     }
 * 
 */
router.patch( '/m/:state/:model', loadGivenModel, setModelState );


/**
 * @api {delete} http://:client.cde.fyi/m/:model Delete a model
 * @apiName deleteModel
 * @apiGroup Verified Client
 * @apiDescription Deletes (archives) the given model for the given client
 * @apiExample {delete} Example:
 * DELETE http://acme-ltd.cde.fyi/m/2WEKaVNO HTTP/1.1
 * 
 * @apiParam {String} client Client account name
 * @apiParam {String} model Model ID
 *
 * @apiSuccess {String} success An action summary message
 * @apiSuccess {String} data The model id of the model that was deleted
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": "Model updated",
 *       "data": "2WEKaVNO"
 *     }
 * 
 */
router.delete( '/m/:model', loadGivenModel, deleteModel );


/**
 * @api {get} http://:client.cde.fyi/i/:invoice Read an invoice
 * @apiName readInvoice
 * @apiGroup Verified Client
 * @apiDescription Returns the given client invoice
 * @apiExample {get} Example:
 * GET http://acme-ltd.cde.fyi/i/dogPzIz8 HTTP/1.1
 * 
 * @apiParam {String} client Client account name
 * @apiParam {String} invoice Invoice ID
 *
 * @apiSuccess {String} success An action summary message
 * @apiSuccess {String} data The returned invoice summary
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": "Invoice retrieved",
 *       "data":
 *        { 
 *           "date": "2019-10-30", 
 *           "amount": "£250.00",
 *           "_id": "dogPzIz8"
 *        }
 *     }
 * 
 */
router.get( '/i/:invoice', loadGivenInvoice, readInvoice );


/**
 * @api {post} http://acme-ltd.cde.fyi/user/:user Add User
 * @apiName addUser
 * @apiGroup Verified Client
 * @apiDescription Grants user-level permissions for this client's data to the given user
 * @apiExample {post} Example:
 * POST http://acme-ltd.cde.fyi/user/dogPzIz8 HTTP/1.1
 * { 
 *   "email": "joe@bloggs.com"
 * }
 *
 * @apiSuccess {String} success An action summary message and next steps
 * @apiSuccess {String} data The main email of the user
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": "User-level client permissions granted",
 *       "data": "acme-ltd : joe@bloggs.com"
 *     }
 *
 */
router.post( '/user/:user', loadGivenUser, addUser );


/**
 * @api {delete} http://acme-ltd.cde.fyi/user/:user Remove User
 * @apiName removeUser
 * @apiGroup Verified Client
 * @apiDescription Revokes user-level permissions for this client's data from the given user
 * @apiExample {delete} Example:
 * DELETE http://acme-ltd.cde.fyi/user/dogPzIz8 HTTP/1.1
 * { 
 *   "email": "joe@bloggs.com"
 * }
 *
 * @apiSuccess {String} success An action summary message and next steps
 * @apiSuccess {String} data The main email of the user
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": "User-level client permissions revoked",
 *       "data": "acme-ltd : joe@bloggs.com"
 *     }
 *
 */
router.delete( '/user/:user', loadGivenUser, removeUser );


/**
 * @api {post} http://acme-ltd.cde.fyi/manager/:user Add Manager
 * @apiName addManager
 * @apiGroup Verified Client
 * @apiDescription Grants manager-level permissions for this client's data to the given user
 * @apiExample {post} Example:
 * POST http://acme-ltd.cde.fyi/manager/dogPzIz8 HTTP/1.1
 * { 
 *   "email": "joe@bloggs.com"
 * }
 *
 * @apiSuccess {String} success An action summary message and next steps
 * @apiSuccess {String} data The main email of the user
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": "Manager-level client permissions granted",
 *       "data": "acme-ltd : joe@bloggs.com"
 *     }
 *
 */
router.post( '/manager/:user', loadGivenUser, addManager );


/**
 * @api {delete} http://acme-ltd.cde.fyi/manager/:user Remove Manager
 * @apiName removeManager
 * @apiGroup Verified Client
 * @apiDescription Revokes manager-level permissions for this client's data from the given user
 * @apiExample {delete} Example:
 * DELETE http://acme-ltd.cde.fyi/manager/dogPzIz8 HTTP/1.1
 * { 
 *   "email": "joe@bloggs.com"
 * }
 *
 * @apiSuccess {String} success An action summary message and next steps
 * @apiSuccess {String} data The main email of the user
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": "Manager-level client permissions revoked",
 *       "data": "acme-ltd : joe@bloggs.com"
 *     }
 *
 */
router.delete( '/manager/:user', loadGivenUser, removeManager );


function clientCheck( req, res ) {
    res.type('json').send( _s.jsonSorted( req.auth.client, 4 ) );
};

async function loadGivenInvoice( req, res, next ) {
    try
    {
        const invoice = await Invoice.findById( req.params.invoice );
        if ( !invoice ) throw new Error( 'Could not load the given invoice' );
        req.given.invoice = invoice;
        next();
    }
    catch ( err ) { res.json( { error: err.message, data: err.stack } ); }   
};

async function loadGivenModel( req, res, next ) {
    try
    {
        const model = await Model.findById( req.params.model );
        if ( !model ) throw new Error( 'Could not load the given model' );
        req.given.model = model;
        next();
    }
    catch ( err ) { res.json( { error: err.message, data: err.stack } ); }   
};

async function listUsers( req, res ) {
    try
    {
        const client = req.auth.client;
        const users = await client.listUsers();

        res.json( { success: client._id + " user list retrieved", data: users } );
    }
    catch ( err ) { res.json( { error: 'Could not list users', data: err.message } ); }
};

function listModels( req, res, next ) {
    res.json( { error: 'DEBUG', data: 'Not yet implemented' } );
};

function listInvoices( req, res ) {
    res.json( { error: 'DEBUG', data: 'Not yet implemented' } );
};

function listCharges( req, res, next ) {  
    res.json( { error: 'DEBUG', data: 'Not yet implemented' } );
};

async function createModel( req, res ) {
    try
    {
        const client = req.auth.client;
        const user = req.auth.user;

        const model = new Model({
            aliases: req.body.aliases,
            profile: {
                type: req.body.type || 'AIM',
                displayName: req.body.name || 'New model',
                subject: req.body.subject,
                purpose: req.body.purpose
            },
            owner: client._id,
            manager: user._id,
            managers: [ user._id ],
            users: [ user._id ],
            server: client.server
        });
        
        await model.save();

        res.type('json').send( _s.jsonSorted( model, 4 ) );
    }
    catch ( err ) { res.json( { error: 'Could not create new model', data: err.message } ); }
};

function readModel( req, res ) {
    const model = req.given.model;
    res.json( { success: 'Profile retrieved', profile: model.getSummary() } );
};

function updateModel( req, res ) {
    res.json( { debug: 'updateGivenModel' } );
};

async function setModelState( req, res ) {
    try
    {
        const model = req.given.model;

        if ( model.owner !== req.auth.client._id ) throw new Error( 'The given model does not belong to ' + model.owner );

        if ( req.params.state === 'hold') await model.hold();
        else if ( req.params.state === 'unhold') await model.unhold();
        else if ( req.params.state === 'wip') await model.wip();
        else if ( req.params.state === 'archive') await model.archive();
        else throw new Error( 'A valid new model state was not specified' );

        await model.populate('charges_last10').execPopulate();
        res.type('json').send( _s.jsonSorted( model, 4 ) );
    }
    catch ( err ) { res.json( { error: 'Could not set model state', msg: err.message, stack: err.stack } ); }
};

function deleteModel( req, res ) {
    res.json( { debug: 'deleteGivenModel' } );
};

function readInvoice( req, res ) {
    const invoice = req.given.invoice;
    res.json( { success: 'Profile retrieved', profile: invoice.getSummary( true ) } );
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

async function addUser( req, res ) {
    try
    {
        const user = req.given.user;
        const client = req.auth.client;

        await client.addUser( user._id );
        res.json( { success: "USER level client permissions were granted", data: client._id + " : " + user.email } );
    }
    catch ( err ) { res.json( { error: 'Could not add USER level client permissions', data: err.message } ); }
};

async function addManager( req, res ) {
    try
    {
        const user = req.given.user;
        const client = req.auth.client;

        const msg = await client.addManager( user._id );

        res.json( { success: msg, data: client._id + " : " + user.email } );
    }
    catch ( err ) { res.json( { error: 'Could not add MANAGER level client permissions', data: err.message } ); }
};

async function removeUser( req, res ) {
    try
    {
        const user = req.given.user;
        const client = req.auth.client;

        const msg = await client.removeUser( user._id );
        res.json( { success: msg, data: client._id + " : " + user.email } );
    }
    catch ( err ) { res.json( { error: 'Could not remove USER level client permissions', data: err.message } ); }
};

async function removeManager( req, res ) {
    try
    {
        const user = req.given.user;
        const client = req.auth.client;

        await client.removeManager( user._id );
        res.json( { success: "MANAGER level client permissions were revoked", data: client._id + " : " + user.email } );
    }
    catch ( err ) { res.json( { error: 'Could not remove MANAGER level client permissions', data: err.message } ); }
};


module.exports = router;