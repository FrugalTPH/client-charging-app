"use strict";

const moment =        	    require("moment");
const mongoose =        	require("mongoose");
const uniqueValidator =     require('mongoose-unique-validator');
const validator = 			require('validator');
const crypt =               require('../services/crypt');
const { reverseEmail } =    require('../services/util_string');

// const Charge =              require('../models/charge');
// const Client =              require('../models/client');
// const Invoice =             require('../models/invoice');
// const Model =               require('../models/model');
// const Payment =             require('../models/payment');
// const Plan =                require('../models/plan');
// const user =                require('../models/user');

const Schema =          	mongoose.Schema;
const options = { 
    collection: 'emails',
    timestamps: true, 
    toObject: { virtuals: true },
    toJSON: { virtuals: true } 
};

const schema = new Schema({
    _id: { 
        type: String,
        validate: [ function(v) { return validator.isEmail( reverseEmail(v) ); } , 'Invalid email' ],
        get: _id => reverseEmail(_id),
        set: v => reverseEmail( v.trim().toLowerCase() ) 
    },
    verifiedBy: { type: String, ref: 'User' },
    token: String,
    isExpired: Boolean
}, options );

schema.post('init', function(doc) { console.log('Email.init: %O', doc._id); });
schema.post('save', function(doc) { console.log('Email.save: %O', doc._id); });
schema.post('validate', function(doc) { console.log('Email.validate: %s', doc._id); });
schema.post('remove', function(doc) { console.log('Email.remove: %s', doc._id); });

schema.plugin( uniqueValidator );

schema.methods.getSummary = async function () {
    try
    {
        const email = this;

        await email.populate('verifiedBy').execPopulate();

        return email.toObject();
    }
    catch ( err ) { throw err; }
};

schema.methods.grant = async function ( userId ) {
    try
    {
        const email = this;
        if ( !email.token ) 
        {
            email.token = crypt.setToken( email._id, userId );
            email.verifiedBy = undefined;
            email.isExpired = true;
            await email.save();
        }
    }
    catch ( err ) { throw err; }
};

schema.methods.confirm = async function ( userId ) {
    try
    {
        const email = this;
        email.token = undefined;
        email.verifiedBy = userId;
        email.isExpired = false;
        email.markModified( 'updatedAt' );

        await email.save();
    }
    catch ( err ) { throw err; }
};

schema.methods.setExpired = async function () {
    try
    {
        const email = this;
        const updated = new moment( email.updatedAt );
        const diff = new moment().diff( updated, process.env.TIME_UNITS );
        email.isExpired = diff > process.env.EXPIRY_VERIFIED_EMAIL;
        await email.save();
    }
    catch ( err ) { throw err; }
};


const Email = mongoose.model('Email', schema);

module.exports = Email;