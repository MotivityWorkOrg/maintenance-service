'use strict';
let user = require('../models/user');
let reset = require('../models/forgot-password');
let nodeMailer = require('nodemailer');
let console = require('console');
let MS_PER_DAY = 1000 * 60 * 60 * 24;


let transporter = nodeMailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'vsfoodjumbo@gmail.com',
        pass: 'vsfood@123'
    }
});

function dateDiffInDays(a, b) {
    // Discard the time and time-zone information.
    let utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    let utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / MS_PER_DAY);
}

// reset a users password:

function resetPassword() {
    let chars = "abcdefghijklmnopqrstuvwxyz123456789";
    let newPass = '';

    for (let i = 0; i < 10; i++) {
        newPass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return newPass;
}
module.exports = {
    changePassword: function (req, res) {
        let passwordReset = {};
        let newPass = resetPassword();
        passwordReset.email = req.body.email;
        passwordReset.password = newPass;
        reset = new reset(passwordReset);
        user.findOne({email: req.body.email}, function (err, user) {
            console.log(newPass, ' ::: USER :::');
            if (err) {
                res.send(err.message);
            }
            if (user) {
                reset.save(passwordReset, (resetErr, reset) => {
                    if (err) {
                        res.send(resetErr.message);
                    }
                    console.log(reset);
                });
            }
        });
        let mailOptions = {
            from: 'VSFood Team <vsfoodjumbo@gmail.com>', // sender address
            to: req.body.email,
            subject: 'New VSFood password.', // Subject line
            html: '<b>Your new password is ' + newPass + '.  </b><br/><br/><br/>' +
            '<a href="http://localhost:3000/reset-password">Reset here.</a>' // html body
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Message sent: ' + info.response);
            }
        });
        res.end();
    },

    resetPassword: function (req, res) {
        let email;
        reset.findOne({password: req.body.oldPassword}, (err, pass) => {
            if (err) {
                res.send('Password did not matched, please enter valid password');
            }
            if (pass) {
                email = pass.email;
                let today = new Date();
                let diff = dateDiffInDays(today, pass.create);
                if (diff < 1) {
                    user.findOne({email: email}, function (err, user) {
                        user.password = req.body.password;
                        user.save(function (err) {
                            if (err) {
                                res.send(err.message);
                            }
                            res.send(200);
                        });
                    });
                }
                else {
                    res.send(401, 'password expired try again');
                }
            }
        });
    }
};
