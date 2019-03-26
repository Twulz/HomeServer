const Database = require('../../models/database');
const config = require('../../models/dbconnection');
const data = require('../../models/dummyData');
var server = require('../../server.js');

const { expect } = require('chai');
const db = new Database(config);

var request = require('superagent');
var port = 3000;

describe('grantAccessKeypad', function(){

    // Reinitialise test bench, timeout must be increased for db table creation
    //this.timeout(15000);
    //before(async () => await db.initDatabase(data))

    describe('accessGranted', function(){
        it('should grant access to correct code',function(done){
        request
            .post('http://localhost:'+port+'/packageCode/')
            .send({"keyCode": "123456"})
            .set('Accept', 'application/json')
            .end(function(err, res){
                expect(res).to.exist;
                expect(res.statusCode).to.equal(200);
                expect(res.body.response).to.include('Granted');
                done();
            })
        });
    });

    describe('accessDenied', function(){
        it('should deny access to incorrect code',function(done){
        request
            .post('http://localhost:'+port+'/packageCode/')
            .send({"keyCode": "ABD7DB"})
            .set('Accept', 'application/json')
            .end(function(err, res){
                expect(res).to.exist;
                expect(res.statusCode).to.equal(200);
                expect(res.body.response).to.include('Denied');
                done();
            })
        });
    });

    describe('badRequest_spelling', function(){
        it('should return an error for no provided code (spelling error)',function(done){
        request
            .post('http://localhost:'+port+'/packageCode/')
            .send({"fob": "ABD7DB"})
            .set('Accept', 'application/json')
            .end(function(err, res){
                expect(res).to.exist;
                expect(res.statusCode).to.equal(400);
                expect(res.body.error).to.include('Code not sent');
                done();
            })
        });
    });

    describe('badRequest_noBody', function(){
        it('should return an error for no provided code (no POST body)',function(done){
        request
            .post('http://localhost:'+port+'/packageCode/')
            .set('Accept', 'application/json')
            .end(function(err, res){
                expect(res).to.exist;
                expect(res.statusCode).to.equal(400);
                expect(res.body.error).to.include('Code not sent');
                //server.closeServer();
                done();
            })
        });
    });

    // Destroy
    //after(async () => await db.destroySchema())
});