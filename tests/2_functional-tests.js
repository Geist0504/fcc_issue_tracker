/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
var ObjectId = require('mongodb').ObjectID;

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          _id: new ObjectId('5c205686eba5360474a805d5'),
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
         console.log(res.body)
          assert.equal(res.body.issue_title, 'Title')
          assert.equal(res.body.issue_text, 'text')
          assert.equal(res.body.created_by, 'Functional Test - Every field filled in')
          assert.equal(res.body.assigned_to, 'Chai and Mocha')
          assert.equal(res.body.status_text, 'In QA')
          assert.equal(res.body.open, true)
          assert.equal(new Date(res.body.created_on).setHours(0,0,0,0), new Date().setHours(0,0,0,0))
          assert.equal(new Date(res.body.updated_on).setHours(0,0,0,0), new Date().setHours(0,0,0,0))
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
        chai.request(server)
         .post('/api/issues/test')
         .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Title')
          assert.equal(res.body.issue_text, 'text')
          assert.equal(res.body.created_by, 'Functional Test - Every field filled in')
          assert.equal(res.body.open, true)
          assert.equal(new Date(res.body.created_on).setHours(0,0,0,0), new Date().setHours(0,0,0,0))
          assert.equal(new Date(res.body.updated_on).setHours(0,0,0,0), new Date().setHours(0,0,0,0))
          done();
        });
      });
      
      test('Missing required fields', function(done) {
        chai.request(server)
         .post('/api/issues/test')
         .send({
          issue_title: 'Title',
          issue_text: 'text'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'missing inputs');
          done();
        })
        
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        chai.request(server)
         .put('/api/issues/test')
         .send({
           _id: '65423165dfjklherfgfg',
         })
        .end((err, res) =>{
          assert.equal(res.status, 200)
          assert.equal(res.text, 'no updated field sent')
          done();
        })
      });
      
      test('One field to update', function(done) {
        chai.request(server)
         .put('/api/issues/test')
         .send({
           _id: '5c205686eba5360474a805d5',
          issue_title: 'New Title'
         })
        .end((err, res) =>{
          assert.equal(res.status, 200)
          assert.equal(res.text, 'successfully updated')
          done();
        })
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
         .put('/api/issues/test')
         .send({
           _id: '5c205686eba5360474a805d5',
          issue_title: 'New Title',
          issue_text: 'New Text'
         })
        .end((err, res) =>{
          assert.equal(res.status, 200)
          assert.equal(res.text, 'successfully updated')
          done();
        })
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({issue_title: { $eq: 'Title'}})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({_id: '5c205686eba5360474a805d5'}, {issue_title: { $eq: 'New Title'}} )
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, '_id error')
          done()
        })
      });
      
      test('Valid _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({_id: '5c205686eba5360474a805d5'})
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.text, 'deleted 5c205686eba5360474a805d5')
          done()
        })
      });
      
    });

});
