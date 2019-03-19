var express = require('express');
var router = express.Router();
var db = require('../models/dbconnection');
var Database = require('../models/database');

const database = new Database(db);
const logging = true;

const roomIdNotDefined = "Room ID not defined";
const roomIdNotFound = "Room ID not found";

// ASK (below)
router.get('/room/:id/heatingcooling', async (req, res, next) => {
    try {
        if (logging) { console.log('Room Id: ' + req.params.id); }
        var results = await database.getHeatingCooling(req.params.id);
        if (results[0]) {
            res.setHeader('content-type', 'application/json');
            // ASK: is this meant to return results or results[0]??
            res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
        } else {
            res.statusCode = 400;
            throw new Error(roomIdNotFound);
        }
    } catch (err) {
        return next(err);
    }
});

// CHECK the desired output from this function
router.post('/sensors/:id/temperature', async (req, res, next) => {
    try {
        // update the sensor's temperature in the table
        var results = await database.insertTemperature(req.params.id, req.body.temperature);
        if (logging) { console.log("Insert Temperature: " + JSON.stringify(results))}
        if (results) {
            // get the room the sensor is in
            var room_id = (await database.getSensorRoom(req.params.id)).room_id;
            // or the section of the garden the sensor is in
            var section_id = (await database.getSensorGardenSection(req.params.id)).garden_section_id;
            // If room_id is defined, means its an inside sensor
            if (room_id) {
                if (logging) { console.log("Room ID: " + room_id)}
                // get the current state of the heater/cooler in that room
                results = await database.getHeatingCooling(room_id);
                if (logging) { console.log("Raw Current Heating/Cooling: " + JSON.stringify(results[0]))}
                if (results) {
                    var setTemp, desiHeater, desiCooler;
                    currentHeater = results[0].heater_state;
                    currentCooler = results[0].cooling_state;
                    setTemp = results[0].preset_temp;
                    if (logging) { console.log("Current Heating/Cooling: " + currentHeater + " " + currentCooler + " " + setTemp)}
                    if (req.body.temperature < (setTemp-2))
                    {
                        desiHeater = 1;
                        desiCooler = 0;
                    }
                    else if (req.body.temperature > (setTemp + 2))
                    {
                        desiHeater = 0;
                        desiCooler = 1;
                    }
                    else
                    {
                        desiHeater = 0;
                        desiCooler = 0;
                    }
                    if (logging) { console.log("Desired values: " + desiHeater + " " + desiCooler)};
                    // update the heating/cooling state of that room given the new temperature
                    results = await database.updateHeaterCoolerState(desiHeater, desiCooler, room_id);
                    //results = await database.updateHeaterCoolerState(desiHeater, desiCooler, 1);
                    if (results) {
                        res.setHeader('content-type', 'application/json');
                        //res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
                        res.send(JSON.stringify({"status": 200, "error": null, "response": "Success"}));
                    } else {
                        res.statusCode = 500;
                        throw new Error("Could not update heater/cooler state");
                    }
                // if room_id is not defined, means its an outside sensor
                } else {
                    res.statusCode = 500;
                    throw new Error("Could not get heater/cooler state of room");
                }
            } else if (section_id) {
                if (logging) { console.log("Section ID: " + section_id)}
                // For future expansion: Only allow watering at non-critical heat times
                res.json({"status": 200, "error": null, "response": "Success"});
            } else {
                res.statusCode = 400;
                throw new Error(roomIdNotFound);
            }
        } else {
            res.statusCode = 500;
            throw new Error ("Could not enter temperature");
        }
    } catch (err) {
        return next(err);
    }
});

// So this returns all columns from the room table, or just need the blinds field?
// Also it never gets to the delete part?
router.get('/room/:id/blind', async (req, res, next) => {
    try {
        if (logging) { console.log('Room Id: ' + req.params.id); }

        var results = await database.getHeatingCooling(req.params.id);
        if (results[0]) {
            res.setHeader('content-type', 'application/json');
		    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
        } else {
            res.statusCode = 400;
            throw new Error(roomIdNotFound);
        }
        // Don't need to deal with the results of the delete
        await database.deleteOldOutsideLightData();

    } catch (err) {
        return next(err);
    }
});

router.post('/sensors/:id/outside_light', async (req, res, next) => {
    try {
        var results = await database.insertOutsideLight(req.params.id, req.body.light);
        if (logging) { console.log("Insert Light level: " + req.body.light + " " + JSON.stringify(results))}
        if (results) {
            // get the room the sensor is in
            var room_id = (await database.getSensorRoom(req.params.id)).room_id;
            // or the section of the garden the sensor is in
            var section_id = (await database.getSensorGardenSection(req.params.id)).garden_section_id;
            // If room_id is defined, means its sensing the blinds
            if (room_id) {
                var blind;
                if (req.body.light > 80.0) {
                    blind = 1;
                } else if (req.body.light < 70) {
                    blind = 0;
                }
                // get the room the sensor is in
                var room_id = (await database.getSensorRoom(req.params.id)).room_id;
                if (logging) { console.log("Room ID: " + room_id)}
                results = await database.updateBlindState(blind, room_id);
                if (logging) { console.log("Insert Blind update: " + JSON.stringify(results))}
                if (results) {
                    res.setHeader('content-type', 'application/json');
                    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
                } else {
                    res.statusCode = 500;
                    throw new Error("Could not update Blind State");
                }
            // if the section is defined, means its an outside sensor
            } else if (section_id) {
                var success = database.updateGardenSunState(req.body.light, section_id);
                if (success) {
                    res.json({"status": 200, "error": null, "response": results})
                } else {
                    res.statusCode = 500;
                    throw new Error("Could not update garden sun state");
                }
            } else {
                res.statusCode = 400;
                throw new Error(roomIdNotFound);
            }
        } else {
            res.statusCode = 500;
            throw new Error("Could not enter brightness");
        }
    } catch (err) {
        return next(err);
    }
});


module.exports = router;