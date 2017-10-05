'use strict';

const api = require('./api');
const debug = require('debug');

const log = debug('dcnm:start');

const PORT = 8888;
const DB_URI = 'mongodb://mongo:27017';
// const DB_URI = 'mongodb://localhost/dcnm';

api
	.start(PORT, DB_URI)
	.then(function handleStart() {
		log(`api running on http://localhost:${ PORT }/status`);
	})
	.catch(function handleStartError(err) {
		const stackTrace = `${ JSON.stringify(err.stack, null, 2) }`;

		log(`api start error: ${ err }`);
		log(`stack: ${ stackTrace }`);

		console.log(`stack: ${ stackTrace }`);

		process.exit(1);
	});
