"use strict";

const mongoose =        	require("mongoose");
const validator = 			require('validator');

// const Charge =              require('../models/charge');
// const Client =              require('../models/client');
const Email =               require('../models/email');
// const Invoice =             require('../models/invoice');
// const Model =               require('../models/model');
// const Payment =             require('../models/payment');
// const Plan =                require('../models/plan');

const crypt =               require('../services/crypt');
const _s =                  require('../services/util_string');

const Schema =          	mongoose.Schema;
const options = { 
    collection: 'users', 
    timestamps: true, 
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
};

const schema = new Schema({
    _id: {
        type: String,
        default: function() {  return 'u_' + _s.shortId(); }
    },
    profile: 
    {
        displayName: String,
        websites: [ String ]
    },
    email: { 
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        index: { unique: true },
        ref: 'Email',
        validate: v => { if ( !validator.isEmail( v ) ) { throw new Error( { error: 'Invalid Email address'} ); } }
    },
    password:
    {
        type: String,
        required: true,
        minLength: 7
    },
    logins:
    [
        {
            type: String,
            required: true
        }
    ],
	permissions: [ String ],
    isAdmin: { type: Boolean, default: false },
    state: { type: String, default: 'wip' }
}, options );

schema.pre('save', async function ( next ) {
    const user = this;
    if ( user.isModified('password') ) { user.password = await crypt.hashPassword( user.password ); }
    next();
});

schema.post('init', function(doc) { console.log('User.init: %O', doc._id); });
schema.post('save', function(doc) { console.log('User.save: %O', doc._id); });
schema.post('validate', function(doc) { console.log('User.validate: %s', doc._id); });
schema.post('remove', function(doc) { console.log('User.remove: %s', doc._id);});

schema.methods.forgotPassword = async function () {
    try
    {
        const user = this;
        const tempPW = crypt.generatePassword();
        user.password = tempPW;
        await user.save();
        return tempPW;
    }
    catch ( err ) { throw err; }
};

schema.methods.getProfile = async function ( extended ) {
    try
    {
        const user = this;

        if ( extended ) 
        {
            await user
            .populate('emails')
            .execPopulate();
        }

        return extended 
        ? {
            email: user.email,
            name: user.profile.displayName || user.email,
            created: user.createdAt,
            updatedAt: user.updatedAt,
            activeLogins: user.logins.length,
            emails: user.emails ? user.emails.map( ( email ) => { return email._id; }) : []
        }
        : {
            name: user.profile.displayName || user.email,
            created: user.createdAt,
            updatedAt: user.updatedAt
        };

    }
    catch ( err ) { throw err; }
};

schema.methods.isVerified = async function () {
    const user = this;
    const email = await Email.findById( user.email );
    return email && !email.isExpired && email.verifiedBy === user._id;
}

schema.methods.login = async function () {
    try
    {
        const user = this;
        
        if ( !await user.isVerified() ) throw new Error( 'Your primary email is unverified, or has not been re-verified recently enough' );

        const token = crypt.setToken( user.email, user._id );
        user.logins = user.logins.concat( token );
        await user.save();
        return token;
    }
    catch ( err ) { throw err; }
};

schema.methods.logout = async function ( loginToken ) {
    try
    {
        const user = this;
        user.logins = user.logins.filter( ( login ) => { return login != loginToken; });     
        await user.save();
    }
    catch ( err ) { throw err; }
};

schema.methods.logoutAll = async function () {
    try
    {
        const user = this;
        user.logins = [];
        await user.save();
    }
    catch ( err ) { throw err; }
};

schema.methods.resetPassword = async function ( newPassword ) {
    try
    {
        const user = this;
        user.password = newPassword;
        await user.save();
    }
    catch ( err ) { throw err; }
};

schema.statics.create = async function( obj ) {

    let user;

    try
    {
        user = new User( obj );
        await user.save();
        return user;
    }
    catch ( err ) { 
        if( user ) await user.remove();
        throw err; 
    }    
}

schema.statics.getPaged = async function( query, limit, page ) {

    const q = query || { };
    const l = limit || 5;
    const p = page || 1;
    
    const r = User.find( q ).skip( l * p ).limit( l );
    const c = User.countDocuments( q );

    await Promise.all( r, c );

    return {
        result: r,
        count: c,
        page: p,
        pages: Math.ceil( c / l ),
        query: q
    };
};

schema.virtual('handle').get( function() { return { name: this.profile.displayName || this.email, _id: this._id }; });

schema.virtual('clients', {
    ref: 'Client',
    localField: '_id',
    foreignField: 'users',
    options: { sort: { _id: 1 } }
});

schema.virtual('emails', {
    ref: 'Email',
    localField: '_id',
    foreignField: 'verifiedBy',
    options: { sort: { _id: -1 } }
});

schema.virtual('models', {
    ref: 'Model',
    localField: '_id',
    foreignField: 'owner',
    options: { sort: { updatedAt: -1 } }
});


const User = mongoose.model('User', schema);

module.exports = User;