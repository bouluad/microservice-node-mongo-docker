'use strict';

const mongodb = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');
const statuses = require('statuses');
const debug = require('debug');
const pjson = require('../package');

const log = debug('dcnm:middleware');

function initMiddleware(app, db) {
	app.use(
		cors()
	);

	app.use(
		bodyParser.json()
	);

	app.use(function logAllRequests(req, res, next) {
		log(`${ req.method } - ${ req.originalUrl }`);

		next();
	});

	app.get('/status', function getStatus(req, res) {
		res.jsonp({
			status: 'ok',
			version: pjson.version
		});
	});

	app.post('/users', function createUser(req, res, next) {
		const collection = db.collection('users');

		collection
			.insertOne(req.body)
			.then(({ ops }) => {
				const [ user ] = ops;

				res.jsonp(user);
			})
			.catch(err => next(err));
	});

	app.get('/users', function getAllUsers(req, res, next) {
		const collection = db.collection('users');

		collection
			.find({})
			.toArray()
			.then(users => res.jsonp(users))
			.catch(err => next(err));
	});

	app.get('/users/:id', function getSingleUser(req, res, next) {
		const collection = db.collection('users');
		const id = mongodb.ObjectID(req.params.id);

		collection
			.findOne({ _id: id })
			.then(user => res.jsonp(user))
			.catch(err => next(err));
	});

	app.use(function notFoundMiddleware(req, res, next) {
		const error = new Error('The requested resource doesn\'t exist.');

		error.status = 404;

		next(error);
	});

	app.use(function errorMiddleware(err, req, res, next) { // eslint-disable-line no-unused-vars
		const statusCode = err.status || 500;
		const errorType = statuses[statusCode];
		const errorMessage = err.message || err || 'An unexpected error occured.';

		res.status(statusCode).jsonp({
			error: errorType,
			errorMessage
		});
	});

	return app;
}

module.exports = initMiddleware;
