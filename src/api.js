'use strict';

const express = require('express');
const co = require('co');
const mongoDB = require('mongodb');
const initMiddleware = require('./init-middleware');

const start = co.wrap(function *startApi(port, dbUri) {
	const app = express();
	const MongoClient = mongoDB.MongoClient;
	const db = yield MongoClient.connect(dbUri);
	const api = initMiddleware(app, db);
	const server = api.listen(port);

	return {
		db,
		server
	};
});

const stop = co.wrap(function *stopApi(db, server) {
	yield db.close();
	yield server.close();

	return Promise.resolve();
});

module.exports = { start, stop };
