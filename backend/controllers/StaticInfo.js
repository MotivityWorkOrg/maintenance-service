let StaticInfo = require('../staticData/static-info');
let console = require('console');
module.exports = {
    getExpenseTypes: function (req, res) {
        //console.log('Getting From req   ', req);
        res.send(StaticInfo.getAllExpensesTypes());
    },
    getIncomeTypes: function (req, res) {
        //console.log('Getting From req   ', req);
        res.send(StaticInfo.getAllIncomeTypes());
    },
    getFlats: function (req, res) {
        //console.log('Getting From req   ', req);
        res.send(StaticInfo.getAllFlats());
    }
};