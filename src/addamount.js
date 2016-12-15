var connection=require('.././model/db');
var dateFormat = require('dateformat');
exports.addamount = function(trandate, amount, email,callback) {
	var get_user_Query='SELECT * FROM user_data WHERE email ='+'"'+email+'"';
	connection.query(get_user_Query,function(err,getUserResult){
		if(err){
			callback({'response':"DB Error while fetching data from -user_data: "+err,'res':false});
		}else if(getUserResult.length>0){
			var userName=getUserResult[0].username;
			var userid=email.split('@')[0];
			if(trandate.length==0){
				trandate=dateFormat(new Date(), "yyyy-mm-dd");
			}
			var insert_data_Query='insert into user_accounts(paidon,amount,email,userid) values("'+trandate+'","'+amount+'","'+email+'","'+userid+'")' ;
			connection.query(insert_data_Query,function(err,result){
				if(err){
					callback({'response':"DB Error:While insert into -user_accounts "+err,'res':false});
				}else if(result.affectedRows!=0){
					callback({'response':"Sucessfully Added for "+userName,'res':true});
				}else{
					callback({'response':"Unable to Update for "+userName,'res':true});
				}
			});
		}else{
			callback({'response':"Unable to find Person With Id : "+email+" Add details.",'res':true});
		}
	});
		}

exports.updateamount = function(trandate, amount,email,callback) {
	var userid=email.split('@')[0];
	if(trandate.length==0){
		trandate=dateFormat(new Date(), "yyyy-mm-dd");
	}
	var insert_data_Query='insert into transactions(trandate,amount,owner,userid) values("'+trandate+'","'+amount+'","'+email+'","'+userid+'")' ;
	connection.query(insert_data_Query,function(err,result){
		if(err){
			callback({'response':"DB Error:While insert into transactions "+err,'res':false});
		}else{
			callback({'response':"Sucessfully Added for Spent. Thanks "+email,'res':true});
		}
	});
}
