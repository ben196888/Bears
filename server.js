// server.js
// Base setup
// =======================================================
var express = require("express");
var app = express();
var bodyParser = require("body-parser");

// mongo setup
var mongoose = require("mongoose");
mongoose.connect("mongodb://192.168.99.100/bear");

var Bear = require('./app/models/bear')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8081;

// Routes for app
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next){
	// do logging
	console.log("Something is happening.");
	next(); //make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working
router.get('/', function(req, res){
	res.json({ message: 'hooray! welcome to our api!' });
});

// more routes for our API will happen here

// on routes that end in /bears
// post: create a bear
// get: get all bears
router.route('/bears')
	.post(function(req, res){
		var bear = new Bear(); // create a new instance of the Bear model
		bear.name = req.body.name; // bear.name = $POST["name"];
		bear.save(function(err){
			if(err)res.send(err);
			res.json({ message: "Bear created!" });
		});
	})
	.get(function(req, res){
		Bear.find(function(err, bears){
			if(err)res.send(err);
			res.json(bears);
		});
	});

// on routes that end in /bears/:bear_id
// get: get the bear info with bear_id
// post: update the bear info with bear_id
// delete: delete the bear with bear_id
router.route('/bears/:bear_id')
	.get(function(req, res){
		Bear.findById(req.params.bear_id, function(err, bear){
			if(err)res.send(err);
			res.json(bear);
		});
	})
	.post(function(req, res){
		Bear.findById(req.params.bear_id, function(err, bear){
			if(err)res.send(err);
			bear.name = req.body.name; //update info
			bear.save(function(err){
				if(err)res.send(err);
				res.json({ message: "Bear updated!" });
			});
		});
	})
	.delete(function(req, res){
		Bear.remove({
			_id: req.params.bear_id
		}, function(err, bear){
			if(err)res.send(err);
			res.json({ message: "Successfully deleted" });
		});
	});

// Register our routes
// all of our routes will be prefixed with /api
app.use('/api', router);


// Start the server
app.listen(port);
console.log('Magic happens on port ' + port);