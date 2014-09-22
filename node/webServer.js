var express = require('express');
var stylus = require('stylus');
var nib = require('nib');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var Server = require('mongodb').Server;
var version = require('./version');
var fs = require('fs');

// Set up the connection to the local db
var mongoclient = new MongoClient(new Server("localhost", 27017), {native_parser: true});

version.init('universalConquest', mongoclient);

if(version.needsUpdate()){
  version.update();
}

var app = express();

var compile = function(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
};

app.set('views', __dirname + '\\views');
app.set('view engine', 'jade');

app.use(stylus.middleware(
  { src: __dirname + '\\public'
  , compile: compile
  }
));
app.use(express.static(__dirname + '\\public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded(
  { extended: true }
));

app.get('/', function (req, res) {
  res.render('index',
    { title : 'Universal Conquest' }
  );
});

app.get('/signup', function (req, res) {
  res.render('signup',
    { title : 'Universal Conquest - Sign Up' }
  );
});

app.get('/about', function (req, res) {
  res.render('about',
    { title : 'Universal Conquest - About' }
  );
});

app.get('/contact', function (req, res) {
  res.render('contact',
    { title : 'Universal Conquest - Contact' }
  );
});

app.post('/signup', function(req, res) {
  var userName = req.body.username;
  var password = req.body.password;
  var email = req.body.email;
  var newsletters = req.body.newsletters === "on";
  var notices = req.body.notices === "on"; 

  MongoClient.connect('mongodb://127.0.0.1:27017/users', function(err, db) {
    if(err) throw err;

    var collection = db.collection('users');
    collection.insert({a:2}, function(err, docs) {

      collection.count(function(err, count) {
        console.log(format("count = %s", count));
      });

      // Locate all the entries using find
      collection.find().toArray(function(err, results) {
        console.dir(results);
        // Let's close the db
        db.close();
      });
    });
  });

  res.render('signupSuccess',
    { title : 'Universal Conquest - Congratulations' }
  ); 	
});

app.post('/login', function(req, res) {
  var userName = req.body.username;
  var password = req.body.password;

  res.render('play',
    { title : 'Universal Conquest' }
  );  
});

app.listen(8080);
