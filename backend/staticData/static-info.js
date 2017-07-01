'use strict';
module.exports = {
    getAllExpensesTypes: function () {
        let expenses = {
            watchMan: {
                id: 1,
                type: 'Watchman Salary'
            },
            electricity: {
                id: 2,
                type: 'Electricity Bill'
            },
            water: {
                id: 3,
                type: 'Water Bill'
            },
            utilities: {
                id: 4,
                type: 'Utilities'
            }
        };
        this.expensesTypes = [];
        for (let key in expenses) {
            this.expensesTypes.push(expenses[key]);
        }
        return this.expensesTypes;
    },
    getAllIncomeTypes: function () {
        let incomes = {
            other: {
                id: 1,
                type: 'Other Income'
            },
            flatMaintenance: {
                id: 2,
                type: 'Flat Maintenance'
            }
        };
        this.allIncomes = [];
        for (let key in incomes) {
            this.allIncomes.push(incomes[key]);
        }
        return this.allIncomes;
    },
    getAllFlats: function () {
        return [
            {
                id: 1,
                type: 101
            },
            {
                id: 2,
                type: 102
            },
            {
                id: 3,
                type: 201
            },
            {
                id: 4,
                type: 202
            },
            {
                id: 5,
                type: 301
            },
            {
                id: 6,
                type: 302
            },
            {
                id: 7,
                type: 401
            },
            {
                id: 8,
                type: 402
            }
        ]
    }
};

