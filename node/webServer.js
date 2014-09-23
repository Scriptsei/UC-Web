var express = require('express');
var stylus = require('stylus');
var nib = require('nib');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var Server = require('mongodb').Server;
var version = require('./version');
var crypto = require('crypto');

var database = 'universalConquest';

// Set up the connection to the local db
var mongoclient = new MongoClient(new Server("localhost", 27017), {native_parser: true});

console.log('***Beginning Server***');
console.log();

version.init(database, mongoclient);

//if(version.needsUpdate()){
//  version.update();
//}

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

  mongoclient.open(function(err, mongoclient) {
      if(err) throw err;

      var db = mongoclient.db(database);

      if(db) {
        var users = db.collection('users');
        user = "{ userName:\"" + userName + "\", password:\"" + password + "\", email:\"" + email + "\", newsletters:\"" + newsletters + "\", notices:\"" + notices + "\"}";
        collection.insert(user, function(err, result) {
          if(err) {
            res.render('signupFailure',
              { title : 'Universal Conquest - Error' }
            ); 
          } else {
            res.render('signupSuccess',
              { title : 'Universal Conquest - Congratulations' }
            ); 
          }
        });                
      } else {
        console.log("Error: Database doesn't exist.");
      }
  });	
});

app.post('/login', function(req, res) {
  var userName = req.body.username;
  var password = req.body.password;

  res.render('play',
    { title : 'Universal Conquest' }
  );  
});

app.listen(8080);
