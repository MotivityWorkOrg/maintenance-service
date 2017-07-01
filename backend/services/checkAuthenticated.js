'use strict';
let jwt = require('jsonwebtoken');
let moment = require('moment');

module.exports = function checkAuthenticated(req, res, next) {
    if (!req.header('Authentication')) {
        return res.status(401).send({message: 'Please make sure your request has an Authentication header'});
    }
    let token = req.header('Authentication').split(' ')[1];
    let payload = jwt.decode(token, 'vsFoodBillingApp');
    if (payload.exp <= moment.unix()) {
        return res.status(401).send({message: 'Token has expired'});
    }
    req.user = payload.sub;
    next();
};