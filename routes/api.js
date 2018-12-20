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
          let collection = db.collection(project)
        })
      }  
    }
    
    
    .put(function (req, res){
      var project = req.params.project;
      var issue = req.body._id;
      delete req.body._id;
      
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      
    });
    
};
