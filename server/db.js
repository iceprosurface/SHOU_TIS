var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
// Connection URL
var url = 'mongodb://localhost:27017/test';

module.exports = function(callback){
	var _this = this;
	 // Use connect method to connect to the server
	MongoClient.connect(url, function(err, db) {
		if (err) return console.log(err);
		if(callback) callback();
		_this.db = db;
		console.log("Connected successfully to server");
	});
	return this;
};
