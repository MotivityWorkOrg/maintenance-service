'use strict';
let User = require('../models/user');
let console = require('console');

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
            res.json({status: 200, subStatus: 5 , message: errors});
		} else {
			User.Create(user, function (err, user) {
				if (err) {
					res.json({status: 200, subStatus: 5 , message: err.message});
					console.log("err.message :::  ", err.message);
				} else {
                    res.json({status: 200, subStatus: 1 , message: "SUCCESS"});
					//console.log("Register User is :::  ", user);
				}
			});
		}
	}
};