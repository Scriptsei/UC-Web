// version.js
// ========
var fs = require('fs');
var database = undefined;
var versionNum = undefined;
var updates = undefined;
var needsUpdate = false;
var hasVersionCollection = false;

var runUpdates = function(db){
  var i = 0;
  for(key in this.updates.updates[i]) {
    this.updates.currentVersion = key;

    for(idx in this.updates.updates[i][key].collections) {
    	var name = this.updates.updates[i][key].collections[idx].toString();

		  db.createCollection(name, {}, function(err, collection) {
		    if(err){
		      console.log("Error creating collection (" + err + ")");
		    } else {
		        console.log("Created collection: " + collection.collectionName);
		    }
		    //db.close();
		  });		
    	i++;			    
  	}
  }

  fs.writeFile('./version.json', JSON.stringify(this.updates), function (err) {
    if (err) throw err;
    console.log("version.json updated to " + this.updates.currentVersion);
  });			
};


var initDatabase = function (database, mongoclient){

 	if(database && mongoclient){
	  	this.database = database;

		mongoclient.open(function(err, mongoclient) {
		  if(err) throw err;

		  var db = mongoclient.db(database);

			var createVersionCollection = function(){

			  if(!hasVersionCollection) {			  	
			    db.createCollection("version", {}, function(err, collection) {
				  if(err){
				  	console.log("Error creating version collection");
					console.log(err);
				  }
				  else {
				     collection.insert({number:"1.0.0"}, function(err, result) {
				       if(err) throw err;
				       checkUpdates();
					 });					  
				  	 console.log("Version collection created.");				  
				  }
			    });	
			  }
			  else {	  	
			      checkUpdates();
			  }

			};

			var checkUpdates = function(){
			  var collection = db.collection('version');

			  collection.findOne({}, function(err, document) {
			    if(err){
			      console.log("error");
			    } 

			    this.versionNum = document.number;

			    console.log("Current Version installed in MongoDB: " + this.versionNum);
			    console.log("Current Version in version.json: " + this.updates.currentVersion);

			    var needsUpdate = this.versionNum !== this.updates.currentVersion;

				if (needsUpdate){
				  runUpdates(db);
				}
				else{
					db.close();
				}

			  });
			};



		  db.collectionNames(function(err, collections){
		  	console.log("Currently Installed Collections");
		    if(collections){
			    collections.forEach(function(collection) {
			      console.log(collection.name);
				  if(collection.name === database + '.version'){
				    hasVersionCollection = true;
				  }
				});
			}
			else {
				console.log("No collections currently installed.");
			}
			createVersionCollection();

		  });

		});

	} else {
		console.log("Error: No supplied, database name or client");
	}
};


module.exports = {
  init: function(database, mongoclient) {
	fs.readFile('./version.json', function (err, data) {
	  if (err) throw err;
	  this.updates = JSON.parse(data);
	  initDatabase(database, mongoclient);
	});
    
  }
};
