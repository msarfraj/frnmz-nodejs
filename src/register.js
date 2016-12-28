var crypto = require('crypto');
var rand = require('csprng');
var connection=require('.././model/db');
 
exports.register = function(name,email,password,mobile,callback) {
	var get_data_Query='SELECT * FROM user_data WHERE email ='+'"'+email+'"';
connection.query(get_data_Query,function(err,result){
	if(err){
		callback({'response':"Eror Occured "+err,'res':false});
	}else{
		if(result.length >0&&result[0].email==email){
			callback({'response':"Already Exist",'res':true});
		}else{
			var number='+91'+mobile;
			var insert_data_Query='insert into user_data(username,password,email,mobile) values("'+name+'","'+password+'","'+email+'","'+number+'")' ;
			connection.query(insert_data_Query,function(err,result){
				if(err){
					callback({'response':"error Occured "+err,'res':false});
				}else{
					callback({'response':"Sucessfully Registered ",'res':true});
				}
			});
		}
	}
});
}