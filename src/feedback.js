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

exports.feedbackemail = function(name,email,comment, callback) {
	var email = 'msarfraj@sapient.com';
	var frommail = '"Mohd Sarfraj ?" <msarfraj@sapient.com>';
	var subject = "Feedback for FRNMZ App";
	var messagebody = comment+"<br>from <br>"+email;

	var mailOptions = {
		from : frommail,
		to : email,
		subject : subject,
		html : messagebody 
	}
	smtpTransport.sendMail(mailOptions, function(error, response) {
		if (error) {
			callback({
				'response' : "Error occured." + error.message,
				'res' : false});
		} else {

			callback({
				'response' : "Thanks for Your Valuable feedback.",
				'res' : true
			});

		}
	});

	
}