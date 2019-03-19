var express = require('express');
var router = express.Router();
var db = require('../models/dbconnection');
var Database = require('../models/database');

const database = new Database(db);
const logging = true;

router.get('/room/:id/light', async (req, res, next) => {
    try {
        if (logging) { console.log('Room Id: ' + req.params.id); }
  
        var results = await database.getRoomLightValues(req.params.id);
        if (logging) { console.log(results)}
        if (results[0]) {
            res.setHeader('content-type', 'application/json');
            res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
        } else {
            res.statusCode = 400;
            throw new Error(roomIdNotFound);
        }  
    } catch (err) {
        return next(err);
    }
  });

router.post('/sensors/:id/inside_light', async (req, res, next) => {
  try {
      if (logging) { console.log('Sensor Id: ' + req.params.id);
                     console.log('Brightness value: ' + req.body.brightnessValue);}

      var results = await database.insertInsideLight(req.params.id, req.body.brightnessValue);
      if (results) {
          // determine if the lights should be on/off
          var lightState;
          if (req.body.brightnessValue > 500) {
              lightState = 0;
          } else if (req.body.brightnessValue < 500) {
              lightState = 1;
          }
          if (logging) { console.log("Light State: " + lightState)}
          var room_id = (await database.getSensorRoom(req.params.id)).room_id;
          if (logging) { console.log("Room ID: " + JSON.stringify(room_id))}  
          results = await database.updateRoomLightState(lightState, room_id);
          if (logging) { console.log("Insert Brightness update: " + JSON.stringify(results))}
          if (results) {
            res.json({"status": 200, "error": null, "response": results});
          } else {
              res.statusCode = 500;
              throw new Error("Could not update Inside Lights")
          }
      } else {
          res.statusCode = 400;
          throw new Error(roomIdNotFound);
      }
  } catch (err) {
      return next(err);
  }
});

router.post('/test', async (req, res, next) => {
    try {
        /* var room_id = await database.getSensorRoom(4);
        if (logging) { console.log("Room ID: " + room_id)} */
        var results = await database.updateRoomLightState(1,1);
        res.json({"status": 200, "error": null, "response": results});
    } catch (err) {
        return next(err);
    }
});

module.exports = router;