/**
 * Module dependencies
 */

var expect   = require('chai').expect
  , mongoose = require('mongoose')
  , _        = require('underscore');

var config     = require('../app/config') 
  , models     = require('../app/models');

var dbTestSettings = config.dbTestSettings
  , db             = undefined;


/**
 * Begin tests
 */

describe('models', function (){
    
    before('Create a db connection', function(done) {
        db = mongoose.createConnection(dbTestSettings.host
                                     , dbTestSettings.database
                                     , dbTestSettings.port);
        //Wait till db is connected
        db.on('connected', function(){
            done();
        });
    });
    
    after('Destroy the db connection', function() {
        db.close();
        db = undefined;
    });

    describe('#register', function (){
        it('should expose model constructors', function (){
            models.register(db); 
            
            // List of the models that should be registered
            var Models = [ 'Applicant', 'Employer', 'JobPosting' ];
            
            // Build a list of keys in db.models. Our models
            // should be in that list
            var dbModels = _.keys(db.models)
            
            // Check our models match
            var diff = _.difference(Models, dbModels);
            expect(diff).to.be.empty;
        });
    });

    describe('#applicant', function (){
        it('should return a applicant model c\'tor', function (){
            var Applicant = models.applicant();
        });
    });

    describe('#employer', function (){
        it('should return a employer model c\'tor', function (){
            var Employer = models.employer();
        });
    });

    describe('#jobPosting', function (){
        it('should return a jobPosting model c\'tor', function (){
            var JobPosting = models.jobPosting();
        });
    });

    describe('Applicant', function (){
        it('should be able to be saved to DB', function (done){
            var Applicant = models.applicant();
            var johnDoe   = new Applicant({
                    login: {
                        password: "password1"
                      , uName:    "jdoe001"
                    }
                  , contact: {
                        email: "jdoe001@ucr.edu"
                    }
                  , location: {
                        city:     "Riverside"
                      , state:    "CA"
                      , zip:      "92501"
                      , address1: "1111 Linden St"
                      , country:  "USA"
                    }
                  , spec: {
                        degree: "Computer Science"
                    }
                  , personal: {
                        fName: "John"
                      , lName: "Doe"
                    }
                });
            
            // Save applicant
            johnDoe.save(function(err, applicant, numAffected){
                if(err) console.log(err);
                // Find him again
                var searchCriteria = {
                    personal: {
                        fName: "John"
                      , lName: "Doe"
                    }
                };
            
                Applicant.find(searchCriteria, function(err, applicant){
                    if(err) throw new Error("John Doe was not found!");
                    // We have found him, so delete him from DB and
                    // move on
                    Applicant.remove(applicant, function(){
                        done();
                    });
                });
            });
        });
    });
});

