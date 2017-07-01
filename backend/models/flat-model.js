let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let flatSchema = new Schema({
    _id: {
        type: Number,
        required: true
    },
    tenantName: {
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
    emailId: {
        type: String,
        required: true
    },
    isOccupied: {
        type: Boolean,
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
module.exports = mongoose.model('Flat', flatSchema);