"use strict";

const mongoose =        	require("mongoose");

const _s =                  require('../services/util_string');

// const Charge =              require('../models/charge');
// const Client =              require('../models/client');
// const Email =               require('../models/email');
// const Invoice =             require('../models/invoice');
// const Model =               require('../models/model');
// const Plan =                require('../models/plan');
// const User =                require('../models/user');

const Schema =          mongoose.Schema;
const options = { 
	collection: 'payments',
	timestamps: true, 
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
};

const schema = new Schema({
	_id: {
        type: String,
        default: function() {  return 'p_' + _s.shortId(); }
	},
	client: { type: String, ref: 'Client', required: true },
	receivedAt: { type: Date, default: new Date(), required: true },
	gross: { type: Number, required: true },
	allocatedTo: { type: String, ref: 'Invoice', required: true },
	note: String
}, options);

schema.post('init', function(doc) { console.log('Payment.init: %s', doc._id); });
schema.post('save', function(doc) { console.log('Payment.save: %s', doc._id); });
schema.post('validate', function(doc) { console.log('Payment.validate: %s', doc._id); });
schema.post('remove', function(doc) { console.log('Payment.remove: %s', doc._id); });


const Payment = mongoose.model('Payment', schema );

module.exports = Payment;