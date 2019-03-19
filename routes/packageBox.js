var express = require('express');
var router = express.Router();
var db = require('../models/dbconnection');
var Database = require('../models/database');

const database = new Database(db);
const logging = true;

// Post an access code to check if the code is allowable in the database.
// Make sure you specify the json (e.g. "{ "fobCardCode": "DE44156F" }") in the "body" field of Postman
// Also ensure it's specified as JSON
router.post('/access/', async (req, res, next) => {
    try {
        if (logging) { console.log("FobCardCode = " + req.body.fobCardCode); }
        if (req.body.fobCardCode) {
            var results = await database.isAllowedFobAccess(req.body.fobCardCode);
            if(logging) { console.log(results); }
            res.setHeader('content-type', 'application/json');
            if (results.length > 0)
            {
                res.statusCode = 200;
                res.send(JSON.stringify({"status": 200, "error": null, "response": "Access Granted"}));
            }
            else
            {
                res.statusCode = 200;
                res.send(JSON.stringify({"status": 200, "error": null, "response": "Access Denied"}));
            }
        } else {
            res.statusCode = 400;
            throw new Error("Code not sent");
        }
    } catch (err) {
        return next(err);
    }
});

router.post('/packageCode/', async (req, res, next) => {
    try {
        if (logging) { console.log("packageCode = " + req.body.keyCode); }
        if (req.body.keyCode) {
            //await db.query("SELECT * FROM package WHERE (keypadCode = ?) AND (packageInBox = 1)", [req.body.keyCode], function (err, results, fields) {
            var results = await database.isAllowedKeypadAccess(req.body.keyCode);
            res.setHeader('content-type', 'application/json');
            if (results.length > 0)
            {
                res.send(JSON.stringify({"status": 200, "error": null, "response": "Access Granted"}));
            }
            else
            {
                res.send(JSON.stringify({"status": 200, "error": null, "response": "Access Denied"}));
            }
        } else {
            res.statusCode = 400;
            throw new Error("Code not sent");
        }
    } catch(err) {
        return next(err);
    }
});

module.exports = router;