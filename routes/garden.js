var express = require('express');
var router = express.Router();
var db = require('../models/dbconnection');
var Database = require('../models/database');

const database = new Database(db);
const logging = true;

router.get('/garden_section/:id', async (req, res, next) => {
    try {
        if (logging) { console.log('Garden Section ID: ' + req.params.id); }

        var results = await database.getGardenSectionData(req.params.id);
        if (logging) { console.log(results)}
        if (results) {
            res.setHeader('content-type', 'application/json');
            res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
        } else {
            res.statusCode = 400;
            throw new Error("Garden Section ID not found");
        }  
    } catch (err) {
        return next(err);
    }
});

router.post('/garden_section/:id/valve_state', async (req, res, next) => {
    try {
        if (logging) { console.log('Sensor Id: ' + req.params.id);
                       console.log('Valve State: ' + req.body.valve_state);}

        var results = await database.updateValveState(req.body.valve_state, req.params.id);
        if (results) {
            if (logging) {console.log("Successfully updated valve state");}
            res.setHeader('content-type', 'application/json');
            res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
        } else {
            res.statusCode = 400;
            throw new Error("Could not insert moisture level");
        }
    } catch (err) {
        return next(err);
    }
});

module.exports = router;