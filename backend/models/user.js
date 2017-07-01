'use strict';

/**
 * Module dependencies
 */
let mongoose = require('mongoose');
let bCrypt = require('bcryptjs');
let jsonWebToken = require('jsonwebtoken');
let SALT_WORK_FACTOR = 12;
let console = require('console');
//let tokenModel = require('../models/token-data');

/**
 * User schema
 */
let UserSchema = new mongoose.Schema({
	firstName: {
		type: String,
		trim: true,
		default: ''
	},
	lastName: {
		type: String,
		trim: true,
		default: ''
	},
	displayName: {
		type: String,
		trim: true
	},
	email: {
		type: String,
		trim: true,
		default: '',
		match: [/.+@.+\..+/, 'Please fill a valid email address']
	},
	username: {
		type: String,
		unique: true,
		required: 'Please fill in a username',
		trim: true
	},
	password: {
		type: String,
		required: true,
		default: ''
	},
	phoneNumber: {
		type: String,
		required: 'phoneNumber is required',
		maxLength: Number(10)
	},
	address: [{
		type: mongoose.Schema.ObjectId,
		ref: "Address",
		default: null
	}],
	dob: {
		type: Date,
		required: true
	},
	role: {
		type: String,
		default: 'USER'
	},
	updated: {
		type: Date
	},
	created: {
		type: Date,
		default: Date.now
	}
}, {
    versionKey: false
});

/**
 * A Validation function for local strategy password
 */
UserSchema.path('password').validate(function (password) {
	console.log(" Password Length Coming As ::  :: ", password.length);
	return (password && password.length > 6);
}, 'Password should be longer');

/**
 * Pre-save hooks
 */
UserSchema.pre('save', function (next) {
	let user = this;
	console.log('saving user!');
	// only hash the password if it has been modified (or is new)
	if (!user.isModified('password')) return next();

	// generate a salt
	bCrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
		if (err) return next(err);

		// hash the password along with our new salt
		bCrypt.hash(user.password, salt, function (err, hash) {
			if (err) return next(err);

			// override the clear-text password with the hashed one
			user.password = hash;
			next();
		});
	});
});


/**
 * Methods
 */
UserSchema.methods.comparePassword = function (candidatePassword, callback) {
	bCrypt.compare(candidatePassword, this.password, function (err, isMatch) {
		if (err) return callback(err);
		return callback(null, isMatch);
	});
};

/**
 * Statics
 */
UserSchema.statics.getAuthenticated = function (user, callback) {
	//console.log('getAuthenticated', user);
	this.findOne({username: user.username}, function (err, doc) {
		if (err) {
			console.log(err);
			return callback(err);
		}

		// make sure the user exists
		else if (!doc) {
			console.log('user not found,');
			return callback(new Error('Invalid username or password.', 401), null);
		}
		else {
			// test for a matching password
			doc.comparePassword(user.password, function (err, isMatch) {
				if (err) {
					console.log(err);
					return callback(err);
				}

				// check if the password was a match
				if (isMatch) {
					let user = {
						username: doc.username,
						id: doc.id,
						displayName: doc.displayName,
						email: doc.email,
						role: doc.role
					};

					// return the jwt
					let token = jsonWebToken.sign(user, 'superSecret', {
						expiresIn: 86400 // expires in 24 hours, expressed in seconds
					});
					return callback(null, token, user);
				}
				else {
					return callback(new Error('Invalid username or password.'), null);
				}
			});
		}
	});
};


UserSchema.statics.Create = function (user, callback) {
	// find a user in Mongo with provided username
	this.findOne({'email': user.email}, function (err, doc) {
		// In case of any error return
		if (err) {
			return callback(err);
		}
		// already exists
		if (doc) {
			return callback(new Error('Username Already Exists'), null);
		} else {
			if (user.password !== user.confirm) {
				return callback(new Error('Passwords do not match.'), null);
			}

			// if there is no user with that username
			// create the user
			let User = mongoose.model('User', UserSchema);
			let newUser = new User({
				password: user.password,
				username: user.username,
				firstName: user.firstName,
				lastName: user.lastName,
				displayName: user.displayName,
				email: user.email,
				phoneNumber: user.phoneNumber,
				address: user.address !== undefined ? user.address : null,
				dob: user.dob,
				stores: user.stores !== undefined ? user.stores : null,
				role: user.role,
				created: new Date()
			});

			// save the user
			newUser.save(function (err) {
				// In case of any error, return using the done method
				if (err) {
					return callback(err.message);
				}
				// User Registration successful
				return callback(null, newUser);
			});
		}
	});
};


/**
 * Register UserSchema
 */
module.exports = mongoose.model('User', UserSchema);