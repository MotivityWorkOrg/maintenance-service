let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let incomeSchema = new Schema({
    paymentDate: {
        type: Date,
        required: true
    },
    period: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    flatNo: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    category: {
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
module.exports = mongoose.model('Income', incomeSchema);