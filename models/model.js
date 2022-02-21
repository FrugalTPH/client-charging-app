"use strict";

const mongoose =            require("mongoose");

const _d =                  require('../services/util_date');
const _s =                  require('../services/util_string');

const Charge =              require('../models/charge');
// const Client =              require('../models/client');
// const Email =               require('../models/email');
// const Invoice =             require('../models/invoice');
// const Payment =             require('../models/payment');
// const Plan =                require('../models/plan');
// const User =                require('../models/user');

const Schema =          	mongoose.Schema;
const options = { 
    collection: 'models',
    timestamps: true, 
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
};

const schema = Schema({
    _id: {
        type: String,
        default: function() {  return 'm_' + _s.shortId(); }
    },
    aliases: [ String ],
    profile:
    {
        type: { type: String },
        displayName: String,
        subject: String,
        purpose: String
    },
    owner: { type: String, ref: 'Client' },
    manager: { type: String, ref: 'User' },
    managers: [ { type: String, ref: 'User' } ],
    users: [ { type: String, ref: 'User' } ],
    server: String,                                  // e.g. frugaldesign-c1-9hmhh.mongodb.net/cdefyi,
    onHold: { type: Boolean, default: false },
    chargeFrom: { type: Date, default: new Date() },
    chargeRate: { type: String, enum: [ 'wip', 'archive' ], default: 'wip' }
}, options );

schema.post('init', function(doc) { console.log('Model.init: %O', doc._id); });
schema.post('save', function(doc) { console.log('Model.save: %O', doc._id); });
schema.post('validate', function(doc) { console.log('Model.validate: %s', doc._id); });
schema.post('remove', function(doc) { console.log('Model.remove: %s', doc._id); });

schema.methods.addUser = async function ( userId ) {
    try
    {
        const model = this;

        if ( model.users.includes( userId ) ) throw new Error('The given user already has USER level permissions for this model');
        model.users.push( userId );
        await model.save();
    }
    catch ( err ) { throw err; }
};

schema.methods.addManager = async function ( userId ) {
    try
    {
        const model = this;

        let msg = "MANAGER level model permissions were granted";

        if ( model.managers.includes( userId ) ) throw new Error('The given user already has MANAGER level permissions for this model');
        if ( !model.users.includes( userId ) )
        {
            model.users.push( userId );
            msg = "USER + " + msg;
        }

        model.managers.push( userId );
        await model.save();

        return msg;
    }
    catch ( err ) { throw err; }
};

schema.methods.archive = async function () {
    try
    {
        const model = this;

        if ( model.onHold ) 
        {
            if ( model.chargeRate === 'wip' ) model.chargeRate = 'archive';
            await model.unhold();
        }
        else
        {
            if ( model.chargeRate === 'wip' )
            {
                const charge = await model.createCharge();
                model.chargeFrom = charge.periodTo;
                model.chargeRate = 'archive';
                await model.save()
            }
        }
    }
    catch ( err ) { throw err; }
};

schema.methods.createCharge = async function ( chargeDate, logger ) {
    try
    {	
        const model = this;

        const chargeTo = chargeDate || new Date();
        
        await model.populate('owner').execPopulate();
        const client = model.owner;
		if ( !client._id ) return;

        if ( !model.onHold ) 
        {
            const usage = _d.daysUsage( model.chargeFrom, chargeTo );
            if ( usage >= 0 )
            {
                await client.populate('plan').execPopulate();
                
                if ( !client.plan._id ) return;
    
                const charge = new Charge({ 
                    client: client._id, 
                    model: model._id, 
                    periodFrom: model.chargeFrom,
                    periodTo: chargeTo,
                    plan: client.populated( 'plan' ) || client.plan,
                    rate: model.chargeRate,
                    usage: usage
                });
                await charge.calculateAndSave();
                model.chargeFrom = new Date();
                await model.save();
                if ( logger ) logger.info( Charge.toLoggableCsv( { reason: 'model provision', usage: usage } ) );
                return charge;
            } 
            else if ( logger ) logger.info( Charge.toLoggableCsv( { reason: 'up-to-date', usage: usage } ) );
        }
        else if ( logger ) logger.info( Charge.toLoggableCsv( { reason: 'on hold' } ) );
    }
    catch ( err ) { 
        if ( logger ) logger.info( Charge.toLoggableCsv( { reason: 'error' } ) );
        throw err; 
    }
};

schema.methods.getSummary = async function ( extended ) {
    try
    {
        const model = this;

        if ( extended ) 
        { 
            await model
            .populate('owner')
            .populate('manager')
            .populate('managers')
            .populate('users')
            .execPopulate();
        }
        
        return extended 
        ? {
            owner: model.owner,
            type: model.profile.type,
            name: model.profile.displayName,
            subject: model.profile.subject,
            purpose: model.profile.purpose,
            aliases: model.profile.aliases,
            created: model.createdAt,
            updatedAt: model.updatedAt,
            manager: model.manager.profile.displayName,
            deputies: model.managers  ? model.managers.map( ( manager ) => { return manager.profile.displayName; }) : [],
            users: model.users  ? model.users.map( ( user ) => { return user.profile.displayName; }) : []
        }
        : {
            type: model.profile.type,
            name: model.profile.displayName,
            created: model.createdAt,
            updatedAt: model.updatedAt,
            manager: model.manager ? model.manager.displayName : "private",
        };

    }
    catch ( err ) { throw err; }
};

schema.methods.hold = async function () {
    try
    {
        const model = this;
        if ( model.onHold ) throw new Error( 'Model is already on hold' );
        await model.createCharge();
        model.onHold = true;
        await model.save();
    }
    catch ( err ) { throw err; }
};

schema.methods.listUsers = async function() {

    const model = this;

    await model
    .populate('owner')
    .populate('manager')
    .populate('managers')
    .populate('users')
    .execPopulate();
    
    let results = { 
        owner: model.owner.handle,
        manager: model.manager.handle,
        deputies: model.managers.filter( mgr => { if ( mgr._id !== model.manager._id ) return mgr.handle; }),
        users: model.users.filter( usr => { if ( !model.managers.some( mgr => ( mgr._id === usr._id ))) return usr.handle })
    };

    return results;
};

schema.methods.removeUser = async function ( userId ) {
    try
    {
        const model = this;

        let msg = "USER level model permissions were revoked";

        if ( userId === model.manager ) throw new Error("The main model manager cannot have their USER level permissions revoked");
        if ( !model.users.includes( userId ) ) throw new Error("The given user doesn't have USER level permissions for this model to revoke");
        if ( model.managers.includes( userId ) ) {
            model.managers = model.managers.filter( ( mgr ) => { return mgr != userId; }) || [];
            msg = "MANAGER + " + msg;
        }
        model.users = model.users.filter( ( usr ) => { return usr != userId; }) || [];
        await model.save();

        return msg;
    }
    catch ( err ) { throw err; }
};

schema.methods.removeManager = async function ( userId ) {
    try
    {
        const model = this;

        if ( userId === model.manager ) throw new Error("The main model manager cannot have their MANAGER level permissions revoked");
        if ( !model.managers.includes( userId ) ) throw new Error("The given user doesn't have MANAGER level permissions for this model to revoke");
        model.managers = model.managers.filter( ( mgr ) => { return mgr != userId; }) || [];
        await model.save();
    }
    catch ( err ) { throw err; }
};

schema.methods.unhold = async function () {
    try
    {
        const model = this;

        if ( !model.onHold ) throw new Error( 'Model is already not on hold' );

        model.chargeFrom = new Date();
        model.onHold = false;
        await model.save();
    }
    catch ( err ) { throw err; }
};

schema.methods.wip = async function () {
    try
    {
        const model = this;

        if ( model.onHold ) 
        {
            if ( model.chargeRate === 'archive' ) model.chargeRate = 'wip';
            await model.unhold();
        }
        else
        {
            if ( model.chargeRate === 'archive' )
            {
                const charge = await model.createCharge();
                model.chargeFrom = charge.periodTo;
                model.chargeRate = 'wip';
                await model.save()
            }
        }
    }
    catch ( err ) { throw err; }
};

schema.virtual('charges_last10', {
    ref: 'Charge',
    localField: '_id',
    foreignField: 'model',
    options: { sort: { periodTo: -1 }, limit: 10 }
});

schema.virtual('handle').get( function() { return { name: this.profile.displayName, _id: this._id }; });

schema.virtual('state').get( function() { return this.onHold ? 'hold' : this.chargeRate; });


const Model = mongoose.model('Model', schema);

module.exports = Model;