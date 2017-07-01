'use strict';
let Income = require('../models/income-model');
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
    createIncome: function (req, res) {
        let incomeObj = req.body;
        let userInfo = getUserInfo(req);
        incomeObj.createdBy = userInfo.username;
        console.log(incomeObj);
        let incomeModel = new Income(incomeObj);
        incomeModel.save(incomeObj, (err, data) => {
            if (err) {
                console.log("Error is ", err.message);
                res.sendStatus(500).send("income creation failed");
            }
            res.json({status: 200, data: data, message: 'Expense created successfully'});
            //console.log("Res is ::  ", data);
        })
    },

    updateIncome: function (req, res) {
        let incomeObj = req.body;
        let userInfo = getUserInfo(req);
        incomeObj.updatedBy = userInfo.username;
        incomeObj.updatedDate = new Date();
        console.log(incomeObj);
        Income.findOneAndUpdate(
            {_id: req.query._id},
            incomeObj,
            function (err, income) {
                if (err)
                    res.send(err);
                //console.log("Inserted Expense is+++ ",income);
                res.json({income: income});
            }
        );
    },

    deleteIncome: function (req, res) {
        Income.remove({
            _id: req.query._id
        }, function (err) {
            if (err) {
                res.send(err);
            }
            res.json({message: 'expense deleted!'});
        });
    }
};