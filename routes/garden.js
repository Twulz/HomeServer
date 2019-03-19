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

  router.post('/sensors/:id/moisture', async (req, res, next) => {
    try {
        if (logging) { console.log('Sensor Id: ' + req.params.id);
                       console.log('Moisture Value: ' + req.body.moistureLevel);}
  
        var results = await database.insertMoistureLevel(req.params.id, req.body.moistureLevel);
        if (results) {
            // get garden section ID of this sensor
            var section_id = (await database.getSensorGardenSection(req.params.id)).garden_section_id;
            if (section_id) {
                // get garden settings from database
                results = await database.getGardenSectionData(section_id);
                if (results) {
                    if (logging) { console.log("Min Moisture: " + results.minMoisture);
                                   console.log("Critical Moisture: " + results.criticalMoisture);
                                   console.log("Light Sensitivity: " + results.lightSensitivity);
                                   console.log("Sun percent: " + results.current_sun);}
                    var waterState;
                    // if moisture is below minimum, check brightness
                    if (req.body.moistureLevel < results.minMoisture) {
                        if (logging) { console.log("UNDER MIN"); }
                        // if below critical, water anyway
                        if (req.body.moistureLevel < results.criticalMoisture) {
                            if (logging) { console.log("CRITICAL"); }
                            waterState = 1;
                        // if brightness is below dusk level, still water
                        } else if (results.current_sun < results.lightSensitivity) {
                            if (logging) { console.log("UNDER SUN"); }
                            waterState = 1;
                        } else {
                            if (logging) { console.log("OVER SUN"); }
                            waterState = 0;
                        }
                    // garden doesn't need water
                    } else {
                        if (logging) { console.log("OVER MIN"); }
                        waterState = 0;
                    }
                    var success = database.updateGardenWaterState(waterState, section_id)
                    if (success) {
                        res.json({"status": 200, "error": null, "response": "Success"});
                    } else {
                        res.statusCode = 500;
                        throw new Error("Could not update watering state");
                    }
                } else {
                    res.statusCode = 500;
                    throw new Error("Could not get section data");
                }
            } else {
                res.statusCode = 500;
                throw new Error("Could not find section ID of this sensor");
            }
            // if below minimum, check brightness

        } else {
            res.statusCode = 400;
            throw new Error("Could not insert moisture level");
        }
    } catch (err) {
        return next(err);
    }
  });

/* router.get('/test', async (req, res, next) => {
    try {
        /* var room_id = await database.getSensorRoom(4);
        if (logging) { console.log("Room ID: " + room_id)}
        var results = database.updateGardenSunState(90, 1);
        res.json({"status": 200, "error": null, "response": results});
    } catch (err) {
        return next(err);
    }
}); */

module.exports = router;