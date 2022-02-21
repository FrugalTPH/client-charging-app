"use strict";

const mongoose =        	require("mongoose");
const regex =         	    require('../services/util_regex');

// const Charge =              require('../models/charge');
// const Client =              require('../models/client');
// const Email =               require('../models/email');
// const Invoice =             require('../models/invoice');
// const Model =               require('../models/model');
// const Payment =             require('../models/payment');
// const User =                require('../models/user');

const Schema = mongoose.Schema;
const options = { 
    collection: 'plans',
    timestamps: true, 
    toObject: { virtuals: true },
    toJSON: { virtuals: true } 
};

const schema = new Schema({
    _id: {
        type: String,
        match: /^[0-9a-z](|[-0-9a-z]{4,30}[0-9a-z])$/i
    },
    currency: String,
    archive: Number,
    client: Number,
    vat: Number,
    wip: Number
}, options );

schema.post('init', function(doc) { console.log('Plan.init: %O', doc._id); });
schema.post('save', function(doc) { console.log('Plan.save: %O', doc._id); });
schema.post('validate', function(doc) { console.log('Plan.validate: %s', doc._id); });
schema.post('remove', function(doc) { console.log('Plan.remove: %s', doc._id); });

schema.statics.fuzzyFindById = async function( fuzzyId ) {
    try
    {
        const Plan = this;
        let plan = await Plan.findOne( regex.like( '_id', fuzzyId ) ).sort( { updatedAt: -1 } );
        if ( !plan ) plan = await Plan.findOne( regex.like( '_id', 'start' ) ).sort( { updatedAt: -1 } );
        if ( !plan ) throw new Error('Cannot find an appropriate service plan and/or manager');
        return plan;
    }
    catch ( err ) { throw err; }
};


schema.methods.getSummary = async function () {
    try
    {
        return this.toObject(); 
    }
    catch ( err ) { throw err; }
};


const Plan = mongoose.model('Plan', schema);

module.exports = Plan;