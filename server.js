'use strict';
let express = require('express');
let path = require('path');
let console = require('console');
//let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let httpProxy = require('http-proxy');
let proxy = httpProxy.createProxyServer();
let methodOverride = require('method-override');
let expressValidator = require('express-validator');
//let moesifExpress = require('moesif-express');
let cors = require('cors');
let MoesifExpress = require('./backend/moesif/index');
//let crossSharing = require('./backend/services/cors');
let app = express();
let auth = require('./backend/controllers/auth');

let StaticInfo = require('./backend/controllers/StaticInfo');
let Expense = require('./backend/controllers/expense');
let Income = require('./backend/controllers/income');
let Expenditure = require('./backend/controllers/expenditure');
let ForgotPassword = require('./backend/controllers/forgot-password');
let Flat = require('./backend/controllers/flats');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(cors());
// parse application/vnd.api+json as json
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(bodyParser.urlencoded({extended: true}));
// override with the X-HTTP-Method-Override header in the request
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/backend')));

let publicPath = path.resolve(__dirname, '..', 'backend');
app.use(expressValidator());

// Bring Mongoose into the app
let mongoose = require('mongoose');
// Build the connection string
let dbURI = mongodb://damarlaravi:S@ndhita533@ds025180.mlab.com:25180/building; //'mongodb://localhost:27017/maintenance';
mongoose.Promise = require('bluebird');
// Create the database connection
mongoose.connect(dbURI);

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open to ' + dbURI);
});

// If the connection throws an error
mongoose.connection.on('error', function (err) {
    console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});

let expressJwt = require('express-jwt');
app.use('/private/*', expressJwt({secret: 'superSecret'}));

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.send(401, 'invalid token...');
    }
    console.log(next);
    next();
});

let TEST_API_SECRET_KEY = 'eyJhcHAiOiI1MTk6MTgiLCJ2ZXIiOiIyLjAiLCJvcmciOiIyMDc6NSIsImlhdCI6MTQ5OTczMTIwMH0.Tz0cqalny9Uln68y9EItVVRHLJJ3LrvnGHbiH_4e4qw';
let moesifMiddleWare = MoesifExpress({applicationId: TEST_API_SECRET_KEY});
app.use(moesifMiddleWare);

//Handle Requests
app.post('/auth/signup', auth.register);
app.post('/auth/login', auth.login);
app.post('/user/upload-image', auth.updateUser);

//get Static Info
app.get('/types/expenses', StaticInfo.getExpenseTypes);
app.get('/types/incomes', StaticInfo.getIncomeTypes);
app.get('/types/flats', StaticInfo.getFlats);

// Handle Expenses here
app.put('/api/expense', Expense.updateExpense);
app.post('/api/expense', Expense.createExpenses);

//Handle Incomes here
app.put('/api/income', Income.updateIncome);
app.post('/api/income', Income.createIncome);

app.get('/api/expenditures', Expenditure.getExpenditureInfo);

app.post('/api/forgot-password', ForgotPassword.changePassword);
app.post('/api/reset-password', ForgotPassword.resetPassword);

// Flat info
app.post('/api/add-flat', Flat.postFlatInfo);
app.get('/api/add-flat', Flat.getFlatsInfo);
app.put('/api/add-flat', Flat.updateFlatsInfo);

// uncomment when authentication done and use sensitive data
//app.use('/private', express.static(path.join(__dirname, 'private')));

let isProduction = process.env.NODE_ENV === 'production';
//let host = process.env.APP_HOST || 'localhost';
let port = isProduction ? 8080 : 5000;
if (!isProduction) {
    // Any requests to localhost:3000/assets is proxied
    // to webpack-dev-server
    app.all(['/assets/*', '*.hot-update.json'], function (req, res) {
        proxy.web(req, res, {
            target: 'http://' + host + ':3001'
        });
    });
}

app.use(express.static(publicPath));

// place your handlers here
app.get('/*', function (req, res) {
    res.sendFile(path.join(publicPath, 'index.html'));
});

// It is important to catch any errors from the proxy or the
// server will crash. An example of this is connecting to the
// server when webpack is bundling
proxy.on('error', function (e) {
    console.log('Could not connect to proxy, please try again...', e);
});

app.listen(port, function () {
    console.log('Server running on port ' + port);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        console.log(" In development Mode ::  ", err.stack);
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
        console.log("NEXT is ::: ", next);
        next();
    });
}

// production error handler
// no stack traces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
    console.log(next);
});

module.exports = app;