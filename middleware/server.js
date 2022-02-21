"use strict";

const wwwRoute =            require('../routes/www');
const userRoute =           require('../routes/user');
const clientRoute =         require('../routes/client');
const adminRoute =          require('../routes/admin');

function getNullProps( req, res, next ) {
    req.unauth = { };                                                           // User-owned objects - PRE-LOGIN
    req.auth = { };                                                             // User-owned objects - POST-LOGIN
    req.given = { };                                                            // Read/manipulated objects from given parameters 
    next();
}

function getSubdomain( req, res, next ) {
    var str = req.hostname.split( ':' )[0];                                     // Strip port number if its there
    if( str === process.env.HOSTNAME ) req.subDomainRoute = '';
    else 
    {
        str = str.replace( process.env.HOSTNAME, '' );                          // Strip top-level-domain
        if ( str[str.length-1] === '.' ) str = str.slice(0,-1);                 // Strip trailing dot
        req.subDomainRoute = str.split('.').reverse()[0];                       // Order by ascending
    }
    next();
}

function getRouteBySubdomain( req, res, next ) {
    if (req.subDomainRoute == 'users') return userRoute( req, res, next )
    else if (req.subDomainRoute == 'admin') return adminRoute( req, res, next )
    else if (req.subDomainRoute.length > 5) return clientRoute( req, res, next )
    else return wwwRoute( req, res, next );
}


module.exports = { 
    getNullProps,
    getSubdomain,
    getRouteBySubdomain
};