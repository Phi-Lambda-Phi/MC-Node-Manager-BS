/*	app.js

	For Indian Hills Community College
	Parking On Hills, https://parking.indianhils.edu
	by Blaine Harper

	PURPOSE: Root application for parking registartion UI and API
*/

const multer = require("multer");
const fs = require('fs');
const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const path = require('path');
const cluster = require('cluster');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const msal = require('@azure/msal-node');
const axios = require('axios');
var favicon =	require('serve-favicon');
var cors = require('cors');

var protocols = ['https://','http://'];
var origins = [];

var app = express();

DEBUG = 	true;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));

// CORS
app.use(cors({
    origin: '*'
}));

require("dotenv").config({ path: __dirname + `/.env.dev` }); 

/**
 * Using express-session middleware for persistent user session. Be sure to
 * familiarize yourself with available options. Visit: https://www.npmjs.com/package/express-session
 */
app.use(session({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false, // set this to true on production
    }
}));

function loadEnv(req, res, next) {
	if( req.session.env ) { next(); } else {
		req.session.env = {
			'title':'Minecraft RCON',
			'subtitle':'Node Bootstrap edition',
			'uri':'mine-rcon.philamb.info',
			'loc':req.originalUrl
		};
		next();
	}
}

app.use(loadEnv);
app.use(`/`,require(`./routes/index`));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('base/error');
});

// Failsafe App.js relaunch
if (cluster.isPrimary) {
	cluster.fork();
	
	cluster.on('exit', function(worker, code, signal) {
		cluster.fork();
	});
} else {
	app.listen(process.env.PORT, () => {
		console.log(`App listening on port ${process.env.PORT}`)
	});
}

module.exports = app;
