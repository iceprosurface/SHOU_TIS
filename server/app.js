var express = require('express');
var assert = require('assert');
var db = require('./db');
var database;
var serveStatic = require('serve-static');
var app = express();

app.use(serveStatic(__dirname + '/../dest'));

//app.get('/', function(req, res){
//	  res.send('hello world');
//});

app.get('/insert/id/:id/value/:value',function(req,res){
	let id = req.params.id;
	let value = req.params.value;
	db.db.collection('test').insertOne({id:id,value:value}, function(err, r) {
		assert.equal(null, err);
		res.send();
	});
});
db = new db(function(){
	app.listen(8888);
	console.log('Express listening on port 8888');
});
