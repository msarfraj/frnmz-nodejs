var crypto = require('crypto');
var rand = require('csprng');
var nodemailer = require('nodemailer');
//var dataInfo=require('.././constants');
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
})
;
exports.resetpass = function(emailid,pass,callback) {
	var get_user_Query='SELECT * FROM user_data WHERE email ='+'"'+emailid+'"';
	connection.query(get_user_Query,function(err,result){
		if(err){
			callback({'response':"DB:Error while Querying for:user_date *",'res':false});
		}else{
			if(result.length>0&&result[0].email==emailid){
					var update_password_query='UPDATE user_data SET password='+'"'+pass+'" WHERE email='+'"'+emailid+'"';
				connection.query(update_password_query,function(err,result){
					if(err){
						callback({'response':"DB:Error while updating pass for:user_data *"+emailid,'res':false});
					}else{
						callback({'response':"Password Sucessfully Changed",'res':true});
					}
				});
			}else{
				callback({'response':"Unable to find user !",'res':false});
			}
		}
	});
}
exports.respass_init = function(email,callback) {
	
	var get_user_Query='SELECT * FROM user_data WHERE email ='+'"'+email+'"';
	connection.query(get_user_Query,function(err,result){
		if(err){
			throw err;
		}else{
			if(result.length>0){
				var temp=result[0].userid+email.split("@")[0];
						var mailOptions = {
							    from: "Mohd Sarfraj",
							    to: email,
							    subject: "Reset Password ",
							    text: "Hello "+result[0].username+"  Code to reset your Password is "+temp+". Regards,Mohd Sarfraj.",
							 
							}
						smtpTransport.sendMail(mailOptions, function(error, response){
						    if(error){
						 
						callback({'response':"Error While Resetting password. Try Again !"+error.message,'res':false});
						 
						    }else{
						 
						callback({'response':"Check your Email("+email+") and enter the verification code to reset your Password.",'res':true});
						 
						    }
						});
			}else{
				callback({'response':"Unable to find user !",'res':false});
			}
		}
	});
	}
exports.respass_chg = function(email,code,npass,callback) {
	var get_user_Query='SELECT * FROM user_data WHERE userid ='+'"'+email+'"';
	connection.query(get_user_Query,function(err,result){
		if(err){
			throw err;
		}else{
			if(result.length>0&&result[0].userid==id){
				if(result[0].password==opass){
					var update_password_query='UPDATE user_data SET password='+'"'+npass+'" WHERE userid='+'"'+id+'"';
				connection.query(update_password_query,function(err,result){
					if(err){
						throw err;
					}else{
						callback({'response':"Password Sucessfully Changed",'res':true});
					}
				});}else{
				callback({'response':"Passwords do not match. Try Again !",'res':false});
			}
			}else{
				callback({'response':"Unable to find user !",'res':false});
			}
		}
	});
}