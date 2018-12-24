/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var assert = require('assert');
let db;

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {})


module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = req.params.project;
      let searchQuery = req.query;
      if (searchQuery._id) { searchQuery._id = new ObjectId(searchQuery._id)}
      if (searchQuery.open) { searchQuery.open = String(searchQuery.open) == "true" }
      MongoClient.connect(CONNECTION_STRING, function(err, db) {
        let collection = db.collection(project)
        collection.find(searchQuery).toArray(function(err,docs){res.json(docs)});
      })
      
    })
    
    .post(function (req, res){
      var project = req.params.project;
      var issue = {
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_on: new Date(),
        updated_on: new Date(),
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to || '',
        open: true,
        status_text: req.body.status_text || ''
      };
      if(!issue.issue_title || !issue.issue_text || !issue.created_by) {
        res.send('missing inputs');
      } else{
        MongoClient.connect(CONNECTION_STRING, function(err, db) {
          let collection = db.collection(project);
          collection.insertOne(issue, (err, data) =>{
            issue._id = data.insertedId;
            res.json(issue)
          })
        })
      }  
    })
    
    
    .put(function (req, res){
      let project = req.params.project;
      let issue = req.body._id;
      delete req.body._id;
      let updates = req.body
      for (let e in updates){ if(!updates[e]){ delete updates[e]}}
      if(Object.keys(updates).length === 0) {
          res.send('no updated field sent');
        } else{
          updates.updated_on = new Date();
          MongoClient.connect(CONNECTION_STRING, function(err, db) {
            let collection = db.collection(project)
            collection.findAndModify({_id:new ObjectId(issue)},[['_id', 1]],{$set: updates},{new: true}, (err, data) => {
              if(err){res.send('could not update ' + issue)} 
              else {res.send('successfully updated')}
            })
        })
      }
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      let issue = req.body._id;
      if(req.body._id){ req.body._id = new ObjectId(req.body._id)}
      MongoClient.connect(CONNECTION_STRING, function(err, db) {
        let collection = db.collection(project)
        collection.deleteOne({_id: req.body._id}, (err, data) => {
          
        })
      })
    })
}
