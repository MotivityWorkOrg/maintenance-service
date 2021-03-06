'use strict';
let Expense = require('../models/expenses-model');
let Income = require('../models/income-model');
let console = require('console');

function handleError(res, err) {
    return res.send(500, err);
}
let response = {};
let timeSpan;

function getTotal(res, expenses, income) {
    response.periodInfo = timeSpan;
    response.byHand = 0;
    if (expenses) {
        response.expenses = expenses;
        response.totalExpenses = expenses.reduce((total, data) => {
            return total + parseFloat(data.amount);
        }, 0);
        //console.log('  response.totalExpenses   ', response.totalExpenses);
        response.byHand = totalDiff(response.totalExpenses, response.totalIncome)
    }

    if (income) {
        response.income = income;
        response.totalIncome = income.reduce((total, data) => {
            return total + parseFloat(data.amount);
        }, 0);
        //console.log('  response.totalExpenses In income  ', response.totalExpenses);
        response.byHand = totalDiff(response.totalExpenses, response.totalIncome)
    }

    if (response.expenses && response.income) {
        //console.log(' RES is ', response);
        res.json({status: 200, data: response});
    }
}

function totalDiff(totalExpenses, totalIncomes) {
    return totalIncomes - totalExpenses;
}

module.exports = {
    getExpenditureInfo: function (req, res) {
        //console.log(req.query);
        let period = req.query;
        timeSpan = req.query.period;
        response = {};
        //console.log('Number ', typeof timeSpan);
        if (timeSpan.length === 4) {
            period = {
                'paymentDate': {
                    $gte: new Date(timeSpan, 1, 1),
                    $lte: new Date(timeSpan, 12, 0)
                }
            }
        }

        //console.log(period);
        Expense.find(period).sort({
            create: -1
        }).exec((err, data) => {
            if (err) {
                return handleError(res, err);
            }
            getTotal(res, data, null);
        });

        Income.find(period).sort({
            create: -1
        }).exec((err, data) => {
            if (err) {
                return handleError(res, err);
            }
            getTotal(res, null, data);
        });
    }
};
