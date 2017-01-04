var connection = require('.././model/db');
var nodemailer = require('nodemailer');

/*
 * var smtpTransport = nodemailer.createTransport({ service: "Gmail", auth: {
 * user: "ms78615@gmail.com", pass: "Goli.se@" } });
 */

var smtpTransport = nodemailer.createTransport({
	host : 'webmail.sapient.com',
	port : 587,
	auth : {
		domain : 'sapient',
		user : 'msarfr',
		pass : 'Myname90'
	},
	authMethod : 'NTLM',
	secure : false,
	ignoreTLS : true,
});

exports.maintaindata = function(confirmedby, date, callback) {
	var getdata = 'SELECT * FROM person_count WHERE eventday =' + '"'
			+ date + '"';
	connection
			.query(
					getdata,
					function(err, result) {
						if (err) {
							callback({
								'response' : "DB error while getting data from table:person_count",
								'res' : false
							});
						} else {
							if (result.length == 0) {
								var count = 1;
								var createrow = 'Insert into person_count (eventday,count,emaillist) values("'
										+ date
										+ '","'
										+ count
										+ '","'
										+ confirmedby
										+ '")';
								connection
										.query(
												createrow,
												function(err, queryresult) {
													if (err) {
														callback({
															'response' : "DB error while inserting into from table:person_count",
															'res' : false
														});
													} else {
														callback({
															'response' : "Thanks for Confirmation",
															'res' : true
														});
													}
												});

							} else {
								if(result[0].emaillist.includes(confirmedby)){
									callback({
										'response' : "Response Already registered.",
										'res' : true
									});
								}else{
								var count = result[0].count + 1;
								var emailstring = result[0].emaillist +","+ confirmedby;
								var updaterow = 'UPDATE  person_count set count="'
										+ count
										+ '",emaillist="'
										+ emailstring
										+ '" WHERE eventday ='
										+ '"'
										+ date
										+ '"';
								connection
										.query(
												updaterow,
												function(err, result) {
													if (err) {
														callback({
															'response' : "DB error while updating data into from table:person_count",
															'res' : false
														});
													} else {
														callback({
															'response' : "Thanks for Confirmation",
															'res' : true
														});
													}
												});
							}
							}
						}
					});
}
exports.sendnotification = function(emailList, callback) {
	var email = 'msarfraj@sapient.com';
	var frommail = '"Mohd Sarfraj ?" <msarfraj@sapient.com>';
	var subject = "Who all will join to Mosque for Friday Prayer?";
	var messagebody = "<p>Assalamo Alaikum, <br>Please confirm your availability for Namaz,by clicking the <a href='https://frnmz-frnmz.44fs.preview.openshiftapps.com/confirm?";
	if(process.env.NODE_ENV=="development"){
	messagebody = "<p>Assalamo Alaikum, <br>Please confirm your availability for Namaz,by clicking the <a href='http://localhost:8080/confirm?";
	}
	if (emailList.length > 0) {
		emailList.forEach(function(item) {
			var mailOptions = {
				from : frommail,
				to : item.email,
				subject : subject,
				html : messagebody + item.email + "'>link</a><br>Allah-Hafiz !!!<p>"
			}
			smtpTransport.sendMail(mailOptions, function(error, response) {
				if (error) {
					callback({
						'response' : "Sending Email." + error.message,
						'res' : false
					});

				} else {

					callback({
						'response' : "Sent email.",
						'res' : true
					});

				}
			});
		});
	}
}

exports.totalcount = function(date, callback) {
	var getdata = 'SELECT * FROM person_count order by eventday DESC';
	connection.query(getdata,function(err, result) {
						if (err) {
							callback({
								'response' : "DB error while getting data from table:person_count",
								'res' : false
							});
						} else {
							if (result.length == 0) {
								callback({'data' : "No responses yet",
									'res' : true,
									'resp':false});
							} else {
								callback({'data' : result,
									'res' : true,
									'resp':true});

							}
						}
					});
}

exports.viewMembers = function(date, callback) {
	var getdata = 'SELECT * FROM person_count WHERE eventday =' + '"' + date+ '"';
	connection.query(getdata,function(err, result) {
						if (err) {
							callback({'response' : "DB error while getting data from table:person_count",
								'res' : false});
						} else {
							if (result.length == 0) {
								callback({'response' : "No responses yet",
									'res' : true});
							} else {
								var users=[];
								var emailArr=[];
								var userArr=result[0].emaillist.split(',');
								var i=0;
									userArr.forEach(function(useremail) {
										emailArr.push("'"+useremail+"'");
									});
										var getmobile = 'SELECT * FROM user_data WHERE email in (' +[emailArr]+ ')';
										var eachUser=[];
										connection.query(getmobile,function(err, mobileresult) {
													if (err) {
														callback({'response' : "DB error while getting data from table:user_data",
															'res' : false});
													}else{
														if(mobileresult.length>0){
															callback({
																'response' : mobileresult,
																'res' : true
															});
														}
													}});
										users[i]=eachUser;
							}
						}
					});
}

