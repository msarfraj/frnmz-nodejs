var nodemailer = require('nodemailer');
var connection=require('.././model/db');

/*
var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "ms78615@gmail.com",
        pass: "Myname100"
    }
});
*/
var smtpTransport = nodemailer.createTransport({
   host: 'webmail.sapient.com',
    port: 587,
    auth: {
       domain:'sapient',
    	user: 'msarfr',
        pass: 'Myname100'
    },            
   authMethod:'NTLM',
    secure:false,
    ignoreTLS: true,
});

exports.removeme = function(email,callback) {
	var delete_user_Query='Delete FROM user_data WHERE email ='+'"'+email+'"';
	connection.query(delete_user_Query,function(err,result){
		if(err){
			callback({'response':"error from db:user_data",err,'res':false});
		}else if(result.affectedRows!=0){
		//	console.log(result.affectedRows,"--"+result.changedRows)
						callback({'response':"Removed From Database",'res':true});
			}else{
				callback({'response':"Unable to find user ! With Email:"+email,'res':true});
			}
	});
}

var getHistory = function(email,callback) {
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
};

module.exports=getHistory;
