'use strict';
let Flat = require('../models/flat-model');
let Tenant = require('../models/tenant-model');
let console = require('console');
let jsonWebToken = require('jsonwebtoken');

function handleError(res, err) {
    return res.send(500, err);
}

function getUserInfo(req) {
    let token = req.headers['authorization'].replace(/^JWT\s/, '');
    let decoded;
    //console.log("Token is  ::  ", token);
    try {
        decoded = jsonWebToken.verify(token, 'superSecret');
        //console.log(decoded);
    }
    catch (err) {
        console.log("Token Error Is:::   ", err);
    }
    return decoded;
}

module.exports = {
    postFlatInfo: function (req, res) {
        let flatUser = req.body.owner;
        let userInfo = getUserInfo(req);
        flatUser.createdBy = userInfo.username;
        //console.log(flatUser, ' Req Body :: ', userInfo);
        if (!flatUser.isOccupied) {
            let tenant = req.body.tenant;
            //console.log('Tenant is ::: ', tenant);
            tenant.createdBy = userInfo.username;
            let tenantModel = new Tenant(tenant);
            tenantModel.save(tenant, (err) => {
                if (err) {
                    console.log("Error is :::   ", err.message);
                    res.sendStatus(401).send(err.message);
                }
            })
        }
        let flatModel = new Flat(flatUser);
        flatModel.save(flatUser, (err) => {
            if (err) {
                console.log("Error is :::   ", err.message);
                res.json({status: 401, error: err.message});
            }
            res.json({status: 200, message: 'Flat user Info save successfully'});
            //console.log(' Response Data is ::: ', data);
        });
    },
    getFlatsInfo: function (req, res) {
        let obj = {};
        Tenant.find({}).sort({
            create: -1
        }).exec((err, data) => {
            if (err) {
                return handleError(res, err);
            }
            obj.tenants = data;
        });

        Flat.find({}).sort({
            create: -1
        }).exec((err, data) => {
            if (err) {
                return handleError(res, err);
            }
            obj.owners = data;
            res.json({data: obj})
        });
    },
    updateFlatsInfo(req, res){
        let flatOwner = req.body.owner;
        let userInfo = getUserInfo(req);
        flatOwner.updatedBy = userInfo.username;
        flatOwner.updatedDate = new Date();
        if (!flatOwner.isOccupied) {
            let tenant = req.body.tenant;
            tenant.updatedBy = userInfo.username;
            tenant.updatedDate = new Date();
            Tenant.findOneAndUpdate({_id: tenant._id}, tenant, (err) => {
                if (err) {
                    console.log(" Update Getting Error  ", err.message);
                    res.sendStatus(400).send(err.message);
                }
                res.json({status: 200, message: ' Flat Info Updated'})
            })
        }

        Flat.findOne({_id: flatOwner._id}, (err, owner) => {
            if (err) {
                console.log(' Error is ', err.message);
            }
            if (!owner.isOccupied && flatOwner.isOccupied) {
                Tenant.findByIdAndRemove({_id: owner._id}, (err) => {
                    if (err) {
                        console.log(' Tenant delete got problem ', err.message);
                    }
                })
            }
        });

        Flat.findOneAndUpdate({_id: flatOwner._id}, flatOwner, (err) => {
            if (err) {
                console.log(" Update Getting Error  ", err.message);
                res.sendStatus(400).send(err.message);
            }
            res.json({status: 200, message: ' Flat Info Updated'})
        })
    }
};