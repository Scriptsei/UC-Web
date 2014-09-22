// version.js
// ========
var database = undefined;
var versionNum = undefined;

module.exports = {
  init: function(database, mongoclient) {
  	if(database && mongoclient){
  		this.mongoclient = mongoclient;
	  	this.database = database;
		// Open the connection to the server
		mongoclient.open(function(err, mongoclient) {
		  if(err) throw err;

		  var versionCollection = false;

		  var db = mongoclient.db(database);

		  if(db) {
		  	  var getCurrentVersion = function(){
				  var collection = db.collection('version');

				  collection.findOne({}, function(err, document) {
				    if(err){
				      console.log("error");
				    } 

				    this.versionNum = document.number;
				    console.log("Current Version installed: " + this.versionNum);
				    //db.close();
				  });
		  	  };

			  var createVersionCollection = function(){
			  	if(!versionCollection){			  	
					db.createCollection("version", {}, function(err, collection){
						if(err){
							console.log("Error creating version collection");
							console.log(err);
						} else {
						    collection.insert({number:"1.0.0"}, function(err, result) {
						      if(err) throw err;
						    });					  
						  console.log("Version collection created.");				  
						}
					});	
					setTimeout(getCurrentVersion(), 5000);
				}
					  	
			  };

		  	  var checkforVersion = function(){
				  db.collectionNames(function(err, collections){
				  	console.log("Currently Installed Collections");
				    if(collections){
					    collections.forEach(function(collection) {
					      console.log(collection.name);
						  if(collection.name === database + '.version'){
						    versionCollection = true;
						  }
						});
					}
				  });
				  setTimeout(createVersionCollection(), 3000);
			  };

			  checkforVersion();

			  

		  } else {
		  	console.log("Error");
		  }
		});
	} else {
		console.log("Error, no supplied, database name or connection");
	}
  },

  getNumber: function () {
  	return this.versionNum;
  },

  needsUpdate: function () {
    return false;
  },

  update: function () {
    return false;
  } 
};
