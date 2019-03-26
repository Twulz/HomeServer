// Server.js

const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
var exports = module.exports = {};
var db = require('./models/dbconnection');
//const routes = require('./routes');

let store = {};
store.temperature = [];

const logging = true;

let app = express();
app.use(bodyParser.json());
app.use(logger('dev'));

app.use(require('./routes/packageBox.js'));
app.use(require('./routes/climateControl.js'));
app.use(require('./routes/lighting.js'));
app.use(require('./routes/garden.js'));

// Error handler, needs to be defined AFTER everything else
app.use(function (err, req, res, next) {
    // If status code hasn't changed, default to 500 server error
    if (res.statusCode === 200) {
        res.statusCode = 500;
        console.error(err);
	}
	// Return an error code
    res.json({
		status: res.statusCode,
        error: new String(err),
    })
});

// Start the server
var server = app.listen(3000, function() {
    console.log('Server started on port 3000...');
});

exports.closeServer = function() {
    server.close();
};