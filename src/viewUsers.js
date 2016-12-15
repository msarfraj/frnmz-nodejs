var crypto = require('crypto');
var rand = require('csprng');
var gravatar = require('gravatar');
var connection=require('.././model/db');
 
exports.viewUsers = function(callback) {
var getdata='SELECT * FROM user_data';
connection.query(getdata,function(err,result){
		if(err){
			throw err;
		}else{
			if(result.length==0){
				callback({'response':"Data base empty:",'res':false});
			}else{
				
				callback({'response':result,'res':true});	
			}
		}
	});
}