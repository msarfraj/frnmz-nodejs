var mysql      = require('mysql');
var dataInfo=require('../util/./constants');
var connection = mysql.createConnection({
  host     : dataInfo.host,
  user     : dataInfo.user,
  password : dataInfo.password,
  database : dataInfo.database,
  reconnect : true
});

connection.connect(function(error){
	if(error){
		console.err("unable to connect database");
	}else{
		console.log("database is connected..");
	}
});
module.exports = connection;