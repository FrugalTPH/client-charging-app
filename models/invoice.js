"use strict";

const mongoose =            require("mongoose");

const mail =                require('../services/mail');
const _a =                  require('../services/util_arr');
const _n =                  require('../services/util_number');
const _d =                  require('../services/util_date');
const _s =                  require('../services/util_string');

// const Charge =              require('../models/charge');
// const Client =              require('../models/client');
// const Email =               require('../models/email');
// const Model =               require('../models/model');
const Payment =             require('../models/payment');
// const Plan =                require('../models/plan');
// const User =                require('../models/user');


const Schema = mongoose.Schema;
const options = { 
    collection: 'invoices',
    timestamps: true, 
    toObject: { virtuals: true },
    toJSON: { virtuals: true } 
};

const schema = Schema({
    _id: {
        type: String,
        default: function() {  return 'i_' + _s.shortId(); }
    },
    client: { type: String, ref: 'Client' },
    type: { type: String, enum: [ 'plan', 'plan1', 'usage', 'other' ] },
    address: {
        companyName: String,
        companyNumber: String,
        vatNumber: String,
        address: String,
        postCode: String,
        faoName: String,
        faoPhone: String,
        faoEmail: String
    },
    outstandingAt: Date,
    disputedAt: Date,
    settledAt: Date,
    charges: [{ type: String, ref: 'Charge' }],
    payments: [{ type: String, ref: 'Payment' }],
    grossCharges: { type: Number, default: 0 },
    grossPayments: { type: Number, default: 0 }
}, options );

schema.pre('save', async function ( next ) {
    const invoice = this;
    if ( !invoice.isModified('outstandingAt') && invoice.outstandingAt ) 
    {
        const check = [
            invoice.isModified('client'),
            invoice.isModified('type'),
            invoice.isModified('address'),
            invoice.isModified('charges'),
        ];
        if ( check.includes( true ) ) throw new Error( 'Cannot make specified alterations to an issued invoice' );
    }
    if ( !invoice.isModified('settledAt') && invoice.settledAt ) 
    {
        const check = [
            invoice.isModified('disputedAt'),
            invoice.isModified('payments')
        ];
        if ( check.includes( true ) ) throw new Error( 'Cannot make specified alterations to a settled invoice' );
    }
    next();
});

schema.post('init', function(doc) { console.log('Invoice.init: %O', doc._id); });
schema.post('save', function(doc) { console.log('Invoice.save: %O', doc._id); });
schema.post('validate', function(doc) { console.log('Invoice.validate: %s', doc._id); });
schema.post('remove', function(doc) { console.log('Invoice.remove: %s', doc._id); });

schema.methods.calculateAndSave = async function ( date ) {
    try
    {
        const invoice = this;
        await invoice.populate('charges').populate('payments').execPopulate();

        const c = _a.sumProp( invoice.charges, 'net' ) + _a.sumProp( invoice.charges, 'vat' );
        const p = _a.sumProp( invoice.payments, 'gross' );
        
        invoice.grossCharges = invoice.isPlan ? _n.ndp0( c ) : _n.ndp2( c );
        invoice.grossPayments = _n.ndp2( p );

        if ( invoice.balance <= 0 && !invoice.settledAt ) 
        {
            invoice.settledAt = date || new Date();
            if ( invoice.isPlan ) await invoice.creditDaysToClient();
        }
        await invoice.save();
    }
    catch ( err ) { throw err; }
};

schema.methods.creditDaysToClient = async function() {
    try
    {  
        const invoice = this; 
        await invoice.populate('client').execPopulate();

        const client = invoice.client;
        if ( !client ) return;
        
        const startDate = invoice.type === 'plan1' ? client.planExpires : new Date();
        const days = invoice.charges[0].usage;

        if ( days && days > 0 ) {
            client.planExpires = _d.dateAdd( startDate, days || 365 );
            await client.save();
        }
    }
    catch ( err ) { throw err; }
};

schema.methods.getSummary = async function ( extended ) {
    try
    {
        const invoice = this;

        return extended 
        ? invoice.toObject()
        : {
            type: invoice.type,
            date: invoice.date,
            company: invoice.address.companyName,
            gross: invoice.totalNet + invoice.totalVat,
            state: invoice.state
        };
    }
    catch ( err ) { throw err; }
};

schema.methods.issueToClient = async function() {

    const invoice = this;
    if ( !invoice.outstandingAt ) invoice.outstandingAt = new Date();
    await invoice.calculateAndSave();
    await mail.issueInvoice( invoice );
};

schema.methods.payment = async function( paymentDate, gross, note ) {
    try
    {
        const invoice = this;
    
        const payment = new Payment({
            client: invoice.populated('client') || invoice.client,
            allocatedTo: invoice._id,
            receivedAt: paymentDate,
            gross: gross,
            note: note || undefined
        });
        await payment.save();

        invoice.payments.push ( payment._id );
        await invoice.calculateAndSave();
    }
    catch ( err ) { throw err; }
};

schema.virtual('balance').get( function() { return this.grossCharges - this.grossPayments; });

schema.virtual('isPlan').get( function() { return /^plan/i.test( this.type ); });

schema.virtual('isUsage').get( function() { return this.type === 'usage'; });

schema.virtual('state').get( function() {
    if ( this.settledAt ) return 'settled';
    if ( this.disputedAt ) return 'disputed';
    if ( this.outstandingAt ) return 'outstanding';
    return 'draft';
});

const Invoice = mongoose.model('Invoice', schema);

module.exports = Invoice;