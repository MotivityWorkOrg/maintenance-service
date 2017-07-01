let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let forgotSchema = new Schema({
    password: {
        type: String,
        trim: true,
        required: "password required"
    },
    email: {
        type: String,
        trim: true
    },
    create: {
        type: Date,
        default: Date.now
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('ResetPassword', forgotSchema);