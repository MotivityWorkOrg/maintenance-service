let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let monthlyDetailSchema = new Schema({
    _id: {
        type: Number,
        required: true
    },
    totalIncome: {
        type: Number,
        required: true
    },
    totalExpenses: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    description:{
        type: String
    },
    period: {
        type: String,
        required: true
    },
    createdBy: {
        type: String,
        required: true
    },
    updatedBy: {
        type: String
    },
    createdDate: {
        type: Date,
        default: Date.now()
    },
    updatedDate: {
        type: Date
    }
}, {
    versionKey: false
});
module.exports = mongoose.model('MonthlyDetail', monthlyDetailSchema);