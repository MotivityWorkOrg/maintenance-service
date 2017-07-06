let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let tenantSchema = new Schema({
    _id: {
        type: Number,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    altNumber: {
        type: Number,
        required: true
    },
    email: {
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
module.exports = mongoose.model('Tenant', tenantSchema);