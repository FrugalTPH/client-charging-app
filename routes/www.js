"use strict";

const express = 		    require("express");
const auth =                require('../middleware/auth');
const mail =                require('../services/mail');

const Email =               require('../models/email');
const Invoice =             require('../models/invoice');
const User =                require('../models/user');

const router =              express.Router( { mergeParams: true } );

router.get( '/', wwwCheck );

router.get('/confirmCallback', auth.emailConfirmToken, emailConfirmCallback );

/**
 * @api {post} http://cde.fyi/signup Signup
 * @apiName createUser
 * @apiGroup Guest
 * @apiDescription Creates new user and redirects to user confirmation route
 * @apiExample {post} Example:
 * POST http://cde.fyi/signup HTTP/1.1
 * { 
 *   "email": "joe@bloggs.com",
 *   "password": "password"
 * }
 *
 * @apiSuccess {String} success An action summary message and next steps
 * @apiSuccess {String} data The new account email address
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "success": "Check your email and click on the verification link sent",
 *   "data": "joe@bloggs.com"
 * }
 *
 */
router.post( '/signup', createUser );


/**
 * @api {post} http://cde.fyi/login Login
 * @apiName userLogin
 * @apiGroup Guest
 * @apiDescription Logs the user in so that they become an User
 * @apiExample {post} Example:
 * POST http://cde.fyi/login HTTP/1.1
 * { 
 *   "email": "joe@bloggs.com",
 *   "password": "password",
 * }
 * 
 * @apiSuccess {String} success An action summary message
 * @apiSuccess {String} data The account email address
 * @apiSuccess {String} cookie A JWT uniquely identifying the User login to store in a response cookie
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "success": "You have been logged in on this device",
 *   "data": "joe@bloggs.com",
 *   "cookie": "1234567890"
 * }
 * 
 */
router.post('/login', auth.userEmailAndPassword, userLogin );


/**
 * @api {post} http://cde.fyi/forgotPassword Forgot password
 * @apiName forgotPassword
 * @apiGroup Guest
 * @apiDescription Resets user password with an auto-generated one, and emails it out to the user
 * @apiExample {post} Example:
 * POST http://cde.fyi/forgotPassword HTTP/1.1
 * { 
 *   "email": "joe@bloggs.com",
 * }
 * 
 * @apiSuccess {String} success An action summary message
 * @apiSuccess {String} data The account email address
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "success": "Check your email for a new password that can be used to log into your account",
 *   "data": "joe@bloggs.com"
 * }
 * 
 */
router.post("/forgotPassword", auth.userResetPassword, userForgotPassword );


function wwwCheck( req, res ) {
    res.json( { success: 'WWW route is accessible' } );
};

async function createUser( req, res ) {
    try
    {
        const email = new Email( { _id: req.body.email } );
        const user = User.create( { email: email._id, password: req.body.password } );
        
        await email.grant( user._id );
        await mail.sendEmailChangedConfirmation( email._id, email.token );

        res.json( { success: 'Check your email and click on the verification link sent', data: user.email } );
    }
    catch ( err ) { res.json( { error: 'Could not create new user', data: err.message } ); }
};

async function emailConfirmCallback( req, res ) {
    try
    {
        const email = req.auth.email;
        const user = req.unauth.user;

        await email.confirm( user._id );
        await mail.sendWelcome( email._id );

        res.json( { success: 'Email verified on ' + email.updatedAt, data: email._id } );
    }
    catch ( err ) { res.json( { error: 'Could not confirm user email', data: err.message } ); }
};

async function userLogin( req, res ) {
    try
    {
        const user = req.unauth.user;
        
        const token = await user.login();

        res.cookie( 'jwt', token, { httpOnly: true, secure: false, maxAge: 3600000 } )
        .send( { success: 'You have been logged in on this device', data: user.email } );
    }
    catch ( err ) { res.json( { error: 'Could not login', data: err.message } ); }
};

async function userForgotPassword( req, res ) {
    try
    {
        const user = req.unauth.user;
        
        const tempPW = await user.forgotPassword();
        await mail.sendNewPassword( user.email, tempPW );

        res.json( { success: 'Check your email for a new password that can be used to log into your account', data: user.email } );
    }
    catch ( err ) { res.json( { error: 'Could not reset password', data: err.message } ); }
};



router.post( '/test', test );

async function test( req, res ) {
    try
    {
        const invoice = await Invoice.findById(req.body.invoice);
        
        if (invoice)
        {
            await invoice.calculateAndSave();

            
        }                
    }
    catch ( err ) { console.log(err); }

    res.end();
};




module.exports = router;