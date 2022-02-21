"use strict";

const bcrypt =        	    require("bcryptjs");
const jwt =                 require('jsonwebtoken');
const pwGen = 				require('generate-password');

function getPayload( token ) { 
    return jwt.verify( token, process.env.JWT_KEY, { ignoreExpiration: true } ); 
}

function setToken( emailAddress, userId ) { 
    return jwt.sign( { email: emailAddress, user: userId }, process.env.JWT_KEY, { mutatePayload: true } );
}

function isPayloadExpired( payload ) { 
    return payload.exp * 1000 <= Date.now(); 
}

function generatePassword() { 
    return pwGen.generate( { length: 10, numbers: true } );
}

async function checkPassword( givenPassword, storedPassword ) {
    return await bcrypt.compare( givenPassword.trim(), storedPassword ); 
}

async function hashPassword( givenPassword ) {
    return await bcrypt.hash( givenPassword.trim(), 8 );
}

module.exports = {
    setToken, 
    getPayload,
    isPayloadExpired,
    generatePassword,
    checkPassword,
    hashPassword
};