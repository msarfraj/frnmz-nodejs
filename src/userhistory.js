var connection=require('.././model/db');
 
exports.history = function(email,callback) {
	var get_user_history='Select * FROM user_accounts WHERE email ='+'"'+email+'"';
	connection.query(get_user_history,function(err,result){
		if(err){
			callback({'response':"error from db:user_accounts",err,'res':false});
		}else if(result.length>0){
						callback({'response':result,'res':true});
			}else{
				callback({'response':"Unable to find user ! With Email:"+email,'res':true});
			}
	});
}

exports.removeme = function(email,callback) {
	var delete_user_Query='Delete FROM user_data WHERE email ='+'"'+email+'"';
	connection.query(delete_user_Query,function(err,result){
		if(err){
			callback({'response':"error from db:user_data",err,'res':false});
		}else if(result.affectedRows!=0){
			var delete_transaction_Query='Delete FROM user_accounts WHERE email ='+'"'+email+'"';
			connection.query(delete_transaction_Query,function(err,result){
				if(err){
					callback({'response':"error from db:transactions",err,'res':false});
				}else{
						callback({'response':"Removed From Database",'res':true});
			}});
			}else{
				callback({'response':"Unable to find user ! With Email:"+email,'res':true});
			}
	});
}