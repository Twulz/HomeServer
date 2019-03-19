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

/*
describe('HeatingCooling', function(){

    // Reinitialise test bench, timeout must be increased for db table creation
    this.timeout(15000);
    before(async () => await db.initDatabase(data))

    describe('updateTemperature', function() {
        it('should update the temperature of the given sensor in the database', function(done) {
        request
            .post('http://localhost:'+port+'/sensors/1/temperature')
            .send({"temperature": 23})
            .set('Accept', 'application/json')
            .end(function(err, res) {
                expect(res).to.exist;
                expect(res.statusCode).to.equal(200);
                expect(res.body.response).to.include('Success');
                done();
            });
        });
    });

    describe('getHeatingCooling', function() {
        it('should return the heating/cooling state of the given room', function(done) {
        request
            .get('http://localhost:'+port+'/room/1/heatingcooling')
            .set('Accept', 'application/json')
            .end(function(err, res){
                expect(res).to.exist;
                expect(res.statusCode).to.equal(200);
                expect(res.body.response[0]).to.include({"room_id": 1, "preset_temp": 23, "heater_state": 0, "cooling_state": 0});
                done();
            });
        });
    });

    describe('turnHeaterOn', function(){
        it('should turn on the heater',function(done){
            request
            .post('http://localhost:'+port+'/sensors/1/temperature')
            .send({"temperature": 20})
            .set('Accept', 'application/json')
            .end(function(err, res) {
                request
                    .get('http://localhost:'+port+'/room/1/heatingcooling')
                    .set('Accept', 'application/json')
                    .end(function(err, res){
                        expect(res).to.exist;
                        expect(res.statusCode).to.equal(200);
                        expect(res.body.response[0]).to.include({"room_id": 1, "preset_temp": 23, "heater_state": 1, "cooling_state": 0});
                        done();
                    });
            });
        }); 
    });

    describe('turnCoolingOn', function(){
        it('should turn on the cooler',function(done){
            request
            .post('http://localhost:'+port+'/sensors/1/temperature')
            .send({"temperature": 26})
            .set('Accept', 'application/json')
            .end(function(err, res) {
                request
                    .get('http://localhost:'+port+'/room/1/heatingcooling')
                    .set('Accept', 'application/json')
                    .end(function(err, res){
                        expect(res).to.exist;
                        expect(res.statusCode).to.equal(200);
                        expect(res.body.response[0]).to.include({"room_id": 1, "preset_temp": 23, "heater_state": 0, "cooling_state": 1});
                        done();
                    });
            });
        }); 
    });

    describe('turnHVACoff', function(){
        it('should turn off heater and cooler',function(done){
            request
            .post('http://localhost:'+port+'/sensors/1/temperature')
            .send({"temperature": 23})
            .set('Accept', 'application/json')
            .end(function(err, res) {
                request
                    .get('http://localhost:'+port+'/room/1/heatingcooling')
                    .set('Accept', 'application/json')
                    .end(function(err, res){
                        expect(res).to.exist;
                        expect(res.statusCode).to.equal(200);
                        expect(res.body.response[0]).to.include({"room_id": 1, "preset_temp": 23, "heater_state": 0, "cooling_state": 0});
                        done();
                    });
            });
        }); 
    });

    // Destroy
    //after(async () => await db.destroySchema())
});

describe('Blinds', function(){

    describe('updateOutsideLight', function() {
        it('should update the light outside read by the given sensor in the database', function(done) {
        request
            .post('http://localhost:'+port+'/sensors/3/outside_light')
            .send({"light": 90})
            .set('Accept', 'application/json')
            .end(function(err, res) {
                expect(res).to.exist;
                expect(res.statusCode).to.equal(200);
                expect(res.body.response).to.include('Success');
                done();
            });
        });
    });

    describe('getBlind state', function() {
        it('should return the blind state of the given room', function(done) {
        request
            .get('http://localhost:'+port+'/room/1/blind')
            .set('Accept', 'application/json')
            .end(function(err, res){
                expect(res).to.exist;
                expect(res.statusCode).to.equal(200);
                expect(res.body.response[0]).to.include({"room_id": 1, "blind_state": 1});
                done();
            });
        });
    });

    describe('openBlinds', function(){
        it('should open the blinds',function(done){
            request
            .post('http://localhost:'+port+'/sensors/3/outside_light')
            .send({"light": 60})
            .set('Accept', 'application/json')
            .end(function(err, res) {
                request
                    .get('http://localhost:'+port+'/room/1/blind')
                    .set('Accept', 'application/json')
                    .end(function(err, res){
                        expect(res).to.exist;
                        expect(res.statusCode).to.equal(200);
                        expect(res.body.response[0]).to.include({"room_id": 1, "blind_state": 0});
                        done();
                    });
            });
        }); 
    });

    describe('closeBlinds', function(){
        it('should close the blinds',function(done){
            request
            .post('http://localhost:'+port+'/sensors/3/outside_light')
            .send({"light": 90})
            .set('Accept', 'application/json')
            .end(function(err, res) {
                request
                    .get('http://localhost:'+port+'/room/1/blind')
                    .set('Accept', 'application/json')
                    .end(function(err, res){
                        expect(res).to.exist;
                        expect(res.statusCode).to.equal(200);
                        expect(res.body.response[0]).to.include({"room_id": 1, "blind_state": 1});
                        done();
                    });
            });
        }); 
    });

}); */