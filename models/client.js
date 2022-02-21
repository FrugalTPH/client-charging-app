"use strict";

const mongoose =            require("mongoose");

const _a =                  require('../services/util_arr');
const _d =                  require('../services/util_date');

const Charge =              require('../models/charge');
// const Email =               require('../models/email');
const Invoice =             require('../models/invoice');
const Model =               require('../models/model');
// const Payment =             require('../models/payment');
// const Plan =                require('../models/plan');
// const User =                require('../models/user');

const Schema = mongoose.Schema;
const options = { 
    collection: 'clients', 
    timestamps: true, 
    toObject: { virtuals: true },
    toJSON: { virtuals: true } 
};

const schema = Schema({
    _id:
    {
        type: String,
        match: /^[0-9a-z](|[-0-9a-z]{4,14}[0-9a-z])$/i
    },
    profile: 
    {
        displayName: String,
        website: String
    },
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
    manager: { type: String, ref: 'User' },
    managers: [ { type: String, ref: 'User' } ],
    users: [ { type: String, ref: 'User' } ],
    server: String,                                                  // e.g. frugaldesign-c1-9hmhh.mongodb.net/cdefyi
    plan: { type: String, ref: 'Plan' },
    planExpires: { type: Date, default: new Date() }
}, options );

schema.post('init', function(doc) { console.log('Client.init: %O', doc._id); });
schema.post('save', function(doc) { console.log('Client.save: %O', doc._id); });
schema.post('validate', function(doc) { console.log('Client.validate: %s', doc._id); });
schema.post('remove', function(doc) { console.log('Client.remove: %s', doc._id); });


schema.methods.addUser = async function ( userId ) {
    try
    {
        const client = this;

        if ( client.users.includes( userId ) ) throw new Error('The given user already has USER level permissions for this client');
        client.users.push( userId );
        await client.save();
    }
    catch ( err ) { throw err; }
};

schema.methods.addManager = async function ( userId ) {
    try
    {
        const client = this;

        let msg = "MANAGER level client permissions were granted";

        if ( client.managers.includes( userId ) ) throw new Error('The given user already has MANAGER level permissions for this client');
        if ( !client.users.includes( userId ) )
        {
            client.users.push( userId );
            msg = "USER + " + msg;
        }

        client.managers.push( userId );
        await client.save();

        return msg;
    }
    catch ( err ) { throw err; }
};

schema.methods.createCharge = async function ( usage, logger ) {
    try
    {	
        const client = this;

        await client.populate('plan').execPopulate();
        if ( !client.plan._id ) return;

        const charge = new Charge({ 
            client: client._id,
            plan: client.populated( 'plan' ) || client.plan,
            rate: client.chargeRate,
            usage: usage || 365
        });
        await charge.calculateAndSave();
        if ( logger ) logger.info( Charge.toLoggableCsv( { reason: 'service plan', usage: charge.usage } ) );
        return charge;
    }
    catch ( err ) { 
        if ( logger ) logger.info( Charge.toLoggableCsv( { reason: 'error' } ) );
        throw err; 
    }
};

schema.methods.createModelCharges = async function ( logger ) {
    try
    {	
        const client = this;

        const cursor = Model.find( { owner: client._id, onHold: false } ).sort( { _id: 1 } ).cursor();
        await cursor.eachAsync( async function( model ) {
            try { await model.createCharge( logger ); }
            catch ( err ) {  }
        });
    }
    catch ( err ) { throw err;  }
};

schema.methods.getProfile = async function ( extended ) {
    try
    {
        const client = this;

        if ( extended ) 
        {
            await client
            .populate('plan')
            .populate('manager')
            .populate('managers')
            .populate('users')
            .execPopulate();
        }

        return extended 
        ? {
            _id: client._id,
            name: client.profile.displayName || client._id,
            website: client.profile.website,
            created: user.createdAt,
            updatedAt: user.updatedAt,
            manager: client.manager.profile.displayName,
            managers: client.managers ? client.managers.map( ( manager ) => { return manager.profile.displayName; }) : [],
            users: client.users ? client.users.map( ( user ) => { return user.profile.displayName; }) : [],
            state: client.state
        }
        : {
            _id: client._id,
            name: client.profile.displayName || client._id,
            website: client.profile.website,
            created: user.createdAt,
            updatedAt: user.updatedAt,
            state: client.state
        };

    }
    catch ( err ) { throw err; }
};

schema.methods.invoicePlan = async function ( usage, isRenewal, logger ) {
    try
    {	
        const client = this;

        const invoice = new Invoice( { client: client._id, type: isRenewal ? 'plan1' : 'plan', address: client.address });

        const charge = await client.createCharge( usage, logger  );
        if ( !charge ) throw new Error( 'Could not create a charge for the plan invoice' );

        invoice.charges = [ charge._id ];
        charge.allocatedTo = invoice._id;

        await invoice.save();
        await charge.save();

        return invoice;
    }
    catch ( err ) { throw err; }
};

schema.methods.invoiceUsage = async function ( logger ) {
    try
    {	
        const client = this;
        await client.createModelCharges( logger );

        const qry = { client: client._id, model: { $ne: null }, allocatedTo: null };

        const outstandingCharges = await Charge.find( qry );
        if ( !outstandingCharges ) throw new Error( 'There are no outstanding charges to invoice' );

        const netTotal = _a.sumProp( outstandingCharges, 'net' );
        if ( netTotal <= 100 ) throw new Error( 'Net charges less than 100 will be rolled-over to next period' );
        
        const invoice = new Invoice( { client: client._id, type: 'usage', address: client.address });
        await invoice.save();

        outstandingCharges.forEach( async function( charge ) {
            try 
            { 
                charge.allocatedTo = invoice._id;
                await charge.save();
                invoice.charges.push( charge._id );
            }
            catch ( err ) {  }
        });

        return await invoice.save();
    }
    catch ( err ) { throw err; }
};

schema.methods.listUsers = async function() {

    const client = this;

    await client
    .populate('manager')
    .populate('managers')
    .populate('users')
    .execPopulate();
    
    let results = { 
        manager: client.manager.handle,
        deputies: client.managers.filter( mgr => { if ( mgr._id !== client.manager._id ) return mgr.handle; }),
        users: client.users.filter( usr => { if ( !client.managers.some( mgr => ( mgr._id === usr._id ))) return usr.handle })
    };

    return results;
};

schema.methods.removeUser = async function ( userId ) {
    try
    {
        const client = this;

        let msg = "USER level client permissions were revoked";

        if ( userId === client.manager ) throw new Error("The main client manager cannot have their USER level permissions revoked");
        if ( !client.users.includes( userId ) ) throw new Error("The given user doesn't have USER level permissions for this client to revoke");
        if ( client.managers.includes( userId ) ) {
            client.managers = client.managers.filter( ( mgr ) => { return mgr != userId; }) || [];
            msg = "MANAGER + " + msg;
        }
        client.users = client.users.filter( ( usr ) => { return usr != userId; }) || [];
        await client.save();

        return msg;
    }
    catch ( err ) { throw err; }
};

schema.methods.removeManager = async function ( userId ) {
    try
    {
        const client = this;

        if ( userId === client.manager ) throw new Error("The main client manager cannot have their MANAGER level permissions revoked");
        if ( !client.managers.includes( userId ) ) throw new Error("The given user doesn't have MANAGER level permissions for this client to revoke");
        client.managers = client.managers.filter( ( mgr ) => { return mgr != userId; }) || [];
        await client.save();
    }
    catch ( err ) { throw err; }
};


schema.virtual('charges_last10', {
    ref: 'Charge',
    localField: '_id',
    foreignField: 'client',
    options: { sort: { periodTo: -1 }, limit: 10 }
});

schema.virtual('chargeRate').get( function() { return 'client'; });

schema.virtual('handle').get( function() { return { name: this.profile.displayName || this.address.companyName, _id: this._id }; });

schema.virtual('invoices_last10', {
    ref: 'Invoice',
    localField: '_id',
    foreignField: 'client',
    options: { sort: { date: -1 }, limit: 10 }
});

schema.virtual('models_last10', {
    ref: 'Model',
    localField: '_id',
    foreignField: 'owner',
    options: { sort: { updatedAt: -1 }, limit: 10 }
});

schema.virtual('state').get( function() { return this.plan && this.planExpires > new Date() ? 'wip' : 'hold'; });


const Client = mongoose.model('Client', schema);

module.exports = Client;