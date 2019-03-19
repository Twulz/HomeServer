const Database = require('../../models/database');
const config = require('../../models/dbconnection');
const data = require('../../models/dummyData');

const { expect } = require('chai');
const db = new Database(config);

var request = require('superagent');
var port = 3000;

// Wait 1sec between each test
beforeEach(function (done) {
    this.timeout(15000);
    setTimeout(function(){
      done();
    }, 3000);
  });

describe('Garden', function(){

    // Reinitialise test bench, timeout must be increased for db table creation
    this.timeout(15000);
    before(async () => await db.initDatabase(data))

   describe('getGardenState', function() {
        it('should return the threshold values for garden section 1', function(done) {
        request
            .get('http://localhost:'+port+'/garden_section/1')
            .set('Accept', 'application/json')
            .end(function(err, res){
                expect(res).to.exist;
                expect(res.statusCode).to.equal(200);
                expect(res.body.response).to.include({"section_id": 1, "minMoisture": 500, "criticalMoisture": 300, "lightSensitivity": 50, "current_sun": 50, "valve_state": 0});
                done();
            });
        });
    });

    describe('postGardenTemperature', function() {
        it('should insert the temperature from the garden into the database', function(done) {
        request
            .post('http://localhost:'+port+'/sensors/8/temperature')
            .send({"temperature": 20})
            .set('Accept', 'application/json')
            .end(function(err, res){
                expect(res).to.exist;
                expect(res.statusCode).to.equal(200);
                expect(res.body.response).to.include('Success');
                done();
            });
        });
    });

    describe('postGardenMoisture', function() {
        it('should insert the moisture from the garden into the database', function(done) {
        request
            .post('http://localhost:'+port+'/sensors/7/moisture')
            .send({"moistureLevel": 300})
            .set('Accept', 'application/json')
            .end(function(err, res){
                expect(res).to.exist;
                expect(res.statusCode).to.equal(200);
                expect(res.body.response).to.include('Success');
                done();
            });
        });
    });

    describe('turnWateringOnCritical', function(){
        it('should turn on the watering system in garden section 1 (below critical level)',function(done){
            request
            .post('http://localhost:'+port+'/sensors/7/moisture')
            .send({"moistureLevel": 100})
            .set('Accept', 'application/json')
            .end(function(err, res) {
                request
                    .get('http://localhost:'+port+'/garden_section/1')
                    .set('Accept', 'application/json')
                    .end(function(err, res){
                        expect(res).to.exist;
                        expect(res.statusCode).to.equal(200);
                        expect(res.body.response).to.include({"section_id": 1, "valve_state": 1});
                        done();
                    });
            });
        }); 
    });

    describe('turnWateringOnMinimum', function(){
        it('should turn on the watering system in garden section 1 (above critical, below min, low light)',function(done){
            request
                .post('http://localhost:'+port+'/sensors/5/outside_light')
                .send({"light": 40})
                .set('Accept', 'application/json')
                .end(function(err, res) {
                request
                    .post('http://localhost:'+port+'/sensors/7/moisture')
                    .send({"moistureLevel": 400})
                    .set('Accept', 'application/json')
                    .end(function(err, res) {
                        request
                            .get('http://localhost:'+port+'/garden_section/1')
                            .set('Accept', 'application/json')
                            .end(function(err, res){
                                expect(res).to.exist;
                                expect(res.statusCode).to.equal(200);
                                expect(res.body.response).to.include({"section_id": 1, "current_sun": 40, "valve_state": 1});
                                done();
                            });
                    });
            });
        }); 
    });

    describe('turnWateringOffOverSun', function(){
        it('should turn on the watering system in garden section 1 (above critical, below min, high light)',function(done){
            request
                .post('http://localhost:'+port+'/sensors/5/outside_light')
                .send({"light": 70})
                .set('Accept', 'application/json')
                .end(function(err, res) {
                request
                    .post('http://localhost:'+port+'/sensors/7/moisture')
                    .send({"moistureLevel": 400})
                    .set('Accept', 'application/json')
                    .end(function(err, res) {
                        request
                            .get('http://localhost:'+port+'/garden_section/1')
                            .set('Accept', 'application/json')
                            .end(function(err, res){
                                expect(res).to.exist;
                                expect(res.statusCode).to.equal(200);
                                expect(res.body.response).to.include({"section_id": 1, "current_sun": 70, "valve_state": 0});
                                done();
                            });
                    });
            });
        }); 
    });
/*
    describe('turnWateringOff', function(){
        it('should turn off the watering system in garden section 1',function(done){
            request
            .post('http://localhost:'+port+'/sensors/7/moisture')
            .send({"moistureLevel": 600})
            .set('Accept', 'application/json')
            .end(function(err, res) {
                request
                    .get('http://localhost:'+port+'/garden_section/1')
                    .set('Accept', 'application/json')
                    .end(function(err, res){
                        expect(res).to.exist;
                        expect(res.statusCode).to.equal(200);
                        expect(res.body.response).to.include({"section_id": 1, "valve_state": 0});
                        done();
                    });
            });
        }); 
    }); */

    // Destroy
    //after(async () => await db.destroySchema())
});