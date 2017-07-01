let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let addressSchema = new Schema({
    addressType: {
        type: String,
        trim: true,
        default: 'Home'
    },
    address1: {
        type: String,
        trim: true,
        default: ''
    },
    address2: {
        type: String,
        trim: true,
        default: ''
    },
    city: {
        type: String,
        rim: true,
        default: ''
    },
    pinCode: {
        type: String,
        rim: true,
        maxLength: Number(6),
        default: ''
    },
    state: {
        type: String,
        trim: true,
        default: 'Telangana'
    },
    country: {
        type: String,
        trim: true,
        default: 'India'
    },
    create: {
        type: Date,
        default: Date.now
    }
}, {
    versionKey: false
});

module.exports = mongoose.model("Address", addressSchema);