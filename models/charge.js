"use strict";

const mongoose =        	require("mongoose");

const _n =                  require('../services/util_number');
const _d =                  require('../services/util_date');
const _s =                  require('../services/util_string');

// const Client =              require('../models/client');
// const Email =               require('../models/email');
// const Invoice =             require('../models/invoice');
// const Model =               require('../models/model');
// const Payment =             require('../models/payment');
// const Plan =                require('../models/plan');
// const User =                require('../models/user');

const Schema =          mongoose.Schema;
const options = { 
	collection: 'charges',
	timestamps: true, 
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
};

const schema = new Schema({
	_id: {
        type: String,
        default: function() {  return 'c_' + _s.shortId(); }
	},
	client: { type: String, ref: 'Client', required: true },
	model: { type: String, ref: 'Model' },
	periodFrom: { type: Date },
	periodTo: { type: Date },
	plan: { type: String, ref: 'Plan' },
	rate: { type: String, enum: [ 'client', 'wip', 'archive' ], required: true },
	usage: { type: Number, required: true },
	net: { type: Number, required: true }, 
	vat: { type: Number, required: true },
	allocatedTo: { type: String, ref: 'Invoice' }
}, options);

schema.post('init', function(doc) { console.log('Charge.init: %s', doc._id); });
schema.post('save', function(doc) { console.log('Charge.save: %s', doc._id); });
schema.post('validate', function(doc) { console.log('Charge.validate: %s', doc._id); });
schema.post('remove', function(doc) { console.log('Charge.remove: %s', doc._id); });

schema.methods.calculateAndSave = async function () {
	try
	{
		const charge = this;
		await charge.populate( 'plan' ).execPopulate();
		const plan = charge.plan;
		if ( !plan._id ) return;

		const n = plan[ charge.rate ] * ( charge.usage < 0.05 ? 0.05 :  charge.usage );
		charge.net = !charge.model ? _n.ndp0( n ) : _n.ndp2( n );

		const v = charge.net * plan.vat;
		charge.vat = !charge.model ? _n.ndp0( v ) : _n.ndp2( v );

		await charge.save();
	}
	catch ( err ) { throw err; }
};

schema.statics.toLoggableCsv = function ( props ) {
	return [ 
		props.ts || _d.ts(), 
		props.usage || this.usage || '0.000',
		props.reason || null,
		props.client || this.client || null,
		props.model || this.model || null
	]
	.join( ', ' );
};


const Charge = mongoose.model('Charge', schema );

module.exports = Charge;