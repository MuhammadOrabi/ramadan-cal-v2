var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var url;
var env = process.env.NODE_ENV || 'development';
if (env === 'development') {
	url = 'mongodb://cal_admin:cal_admin@ds151018.mlab.com:51018/cal'
	// url = 'mongodb://heroku_1qlzlsfq:dc89r9rch7krv0vs2omujvgd9q@ds111791.mlab.com:11791/heroku_1qlzlsfq';
} else {
	url = 'mongodb://heroku_1qlzlsfq:dc89r9rch7krv0vs2omujvgd9q@ds111791.mlab.com:11791/heroku_1qlzlsfq';
}

var mongoose = require('mongoose');
mongoose.connect(url, { useMongoClient: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
	console.log('Connected Correctly to Database');
});

var indexRouter = require('./routes/index');
var flowicsRouter = require('./routes/flowics');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/', flowicsRouter);

module.exports = app;
