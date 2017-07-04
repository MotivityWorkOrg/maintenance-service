'use strict';
let Expense = require('../models/expenses-model');
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
    createExpenses: function (req, res) {
        let expenseObj = req.body;
        let userInfo = getUserInfo(req);
        console.log(' userInfo ::: ', userInfo);
        expenseObj.createdBy = userInfo.username;
        let expenseModel = new Expense(expenseObj);
        expenseModel.save(expenseObj, (err, data) => {
            if (err) {
                console.log("Error is ", err.message);
                res.sendStatus(500).send("Expense creation failed");
            }
            res.json({status: 200, data: data, message: 'Expense created successfully'});
            //console.log("Res is ::  ", data);
        })
    },

    updateExpense: function (req, res) {
        let expenseObj = req.body;
        let userInfo = getUserInfo(req);
        expenseObj.updatedBy = userInfo.username;
        expenseObj.updatedDate = new Date();
        console.log(expenseObj);
        Expense.findOneAndUpdate(req.query, expenseObj, (err, expense) => {
                if (err)
                    res.send(err);
                //console.log("Inserted Expense is+++ ",income);
                res.json({expense: expense});
            }
        );
    },

    deleteExpense: function (req, res) {
        Expense.remove({
            _id: req.query._id
        }, function (err) {
            if (err) {
                res.send(err);
            }
            res.json({message: 'expense deleted!'});
        });
    }
};