'use strict';
module.exports = function (req, res, next) {
	//console.log("Coming in CORS ::::::::::::");
	// Website you wish to allow to connect
	res.header('Access-Control-Allow-Origin', 'http:localhost:5000');

	// Request methods you wish to allow
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

	// Request headers you wish to allow
	res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');

	// Set to true if you need the website to include cookies in the requests sent
	// to the API (e.g. in case you use sessions)
	res.header('Access-Control-Allow-Credentials', true);

	// Pass to next layer of middleware
	next();
};