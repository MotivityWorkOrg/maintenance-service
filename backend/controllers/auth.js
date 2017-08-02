'use strict';
let User = require('../models/user');
let console = require('console');
let multer = require('multer');
let jsonWebToken = require('jsonwebtoken');
let fs = require('fs');
//let UploadImage = require('../upload/upload-images');

let storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './backend/images/profile/');
    },
    filename: function (req, file, cb) {
        let dateTimeStamp = Date.now();
        cb(null, file.fieldname + '-' + dateTimeStamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
    }
});

let upload = multer({ //multer settings
    storage: storage
}).single('photo');

function getUserInfo(req) {
    let token = req.headers['authorization'].replace(/^JWT\s/, '');
    let decoded;
    //console.log("Token is  ::  ", token);
    try {
        decoded = jsonWebToken.verify(token, 'superSecret');
        //console.log(decoded);
    }
    catch (err) {
        console.log("Token Error Is:::   ", err);
    }
    return decoded;
}

function getPermissions(role) {
    if (role === 'ADMIN') {
        return ['stores', 'update-profile', 'user-update', 'items', 'orders'];
    }
    return ['items', 'orders'];
}

module.exports = {
    login: function (req, res) {
        console.log(req.body);
        User.getAuthenticated(req.body, function (err, token, user) {
            //console.log(user);
            if (err) {
                console.log(err.message);
                res.status(400).send(err.message);
            } else {
                let response = {};
                response.token = token;
                user.permissions = getPermissions(user.role);
                user.isAuthenticated = true;
                response.user = user;
                res.send(response);
            }
        });
    },
    register: function (req, res) {
        //req.check('username').isAlphanumeric(); // check to see if not empty
        //console.log('Request is :::   ', req.body);
        let errors = req.validationErrors();
        let user = req.body;
        user.displayName = req.body.firstName + ' ' + req.body.lastName;
        //console.log(req.body.year, req.body.month, req.body.day);
        let month = parseInt(req.body.month);
        let day = parseInt(req.body.day) + 1;
        user.dob = new Date(parseInt(req.body.year), month, day);
        if (errors) {
            res.json({status: 200, subStatus: 5, message: errors});
        } else {
            User.Create(user, function (err) {
                if (err) {
                    res.json({status: 200, subStatus: 5, message: err.message});
                    console.log("err.message :::  ", err.message);
                } else {
                    res.json({status: 200, subStatus: 1, message: "SUCCESS"});
                    //console.log("Register User is :::  ", user);
                }
            });
        }
    },

    updateUser: function (req, res) {
        let path = '';
        //console.log(path, '  ::   ', req.headers);
        let userInfo = getUserInfo(req);
        //console.log(__dirname.replace('controllers', ''));
        let mainDir = __dirname.replace('controllers', '') + 'images';
        let subDir = mainDir + '/profile';
        //console.log('Main Dir is :: ', mainDir, ' Sub Dir ::  ', subDir);

        if (!fs.existsSync(mainDir)) {
            fs.mkdirSync(mainDir);
            if (!fs.existsSync(subDir)) {
                fs.mkdirSync(subDir);
            }
        } else {
            if (!fs.existsSync(subDir)) {
                fs.mkdirSync(subDir);
            }
        }

        upload(req, res, function (err) {
            //console.log(req.file);
            if (err) {
                console.log(' Error is   ', err);
                res.json({error_code: 1, err_desc: err});
                return;
            }

            let rootPath = req.file.destination.replace('./backend', '');
            path = 'http://' + req.headers.host + rootPath + req.file.filename;
            console.log('  ::   ', path);
            if (path !== '' && userInfo) {
                let user = {};
                user.profileImage = path;
                user.updatedBy = userInfo.username;
                user.updatedDate = new Date();
                console.log(' user is :: ', user);
                User.findOneAndUpdate({_id: userInfo.id}, user, (err) => {
                    if (err) {
                        console.log(" Update Getting Error  ", err.message);
                        res.json({status: 200, subStatus: 5, message: err.message});
                    }
                    res.json({status: 200, message: ' Image is info updated', data: path})
                })
            }
        });
    }
};