const Database = require('../../models/database');
const config = require('../../models/dbconnection');
const data = require('../../models/dummyData');

const { expect } = require('chai');
const db = new Database(config);

var request = require('superagent');
var port = 3000;

// Wait 1sec between each test
beforeEach(function (done) {
    setTimeout(function(){
      done();
    }, 1000);
  });

describe('Lights', function(){

    // Reinitialise test bench, timeout must be increased for db table creation
    this.timeout(15000);
    before(async () => await db.initDatabase(data))

    describe('getRoomLights', function() {
        it('should return the required light states of the given room', function(done) {
        request
            .get('http://localhost:'+port+'/room/1/light')
            .set('Accept', 'application/json')
            .end(function(err, res){
                expect(res).to.exist;
                expect(res.statusCode).to.equal(200);
                expect(res.body.response[0]).to.include({"light_id": 1, "state": 1});
                expect(res.body.response[1]).to.include({"light_id": 2, "state": 1});
                expect(res.body.response[2]).to.include({"light_id": 3, "state": 0});
                done();
            });
        });
    });

    describe('updateRoomBrightness', function() {
        it('should update the brightness of the given sensor in the database', function(done) {
        request
            .post('http://localhost:'+port+'/sensors/4/inside_light')
            .send({"brightnessValue": 850})
            .set('Accept', 'application/json')
            .end(function(err, res) {
                expect(res).to.exist;
                expect(res.statusCode).to.equal(200);
                expect(res.body.response).to.include('Success');
                done();
            });
        });
    });

    describe('turnLightsOn', function(){
        it('should turn on the lights in a given room',function(done){
            request
            .post('http://localhost:'+port+'/sensors/4/inside_light')
            .send({"brightnessValue": 400})
            .set('Accept', 'application/json')
            .end(function(err, res) {
                request
                    .get('http://localhost:'+port+'/room/1/light')
                    .set('Accept', 'application/json')
                    .end(function(err, res){
                        expect(res).to.exist;
                        expect(res.statusCode).to.equal(200);
                        expect(res.body.response[0]).to.include({"light_id": 1, "state": 1});
                        expect(res.body.response[1]).to.include({"light_id": 2, "state": 1});
                        expect(res.body.response[2]).to.include({"light_id": 3, "state": 1});
                        done();
                    });
            });
        }); 
    });

    describe('turnLightsOff', function(){
        it('should turn off the lights in a given room',function(done){
            request
            .post('http://localhost:'+port+'/sensors/4/inside_light')
            .send({"brightnessValue": 600})
            .set('Accept', 'application/json')
            .end(function(err, res) {
                request
                    .get('http://localhost:'+port+'/room/1/light')
                    .set('Accept', 'application/json')
                    .end(function(err, res){
                        expect(res).to.exist;
                        expect(res.statusCode).to.equal(200);
                        expect(res.body.response[0]).to.include({"light_id": 1, "state": 0});
                        expect(res.body.response[1]).to.include({"light_id": 2, "state": 0});
                        expect(res.body.response[2]).to.include({"light_id": 3, "state": 0});
                        done();
                    });
            });
        }); 
    });

    // Destroy
    //after(async () => await db.destroySchema())
});