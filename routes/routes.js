var chgpass = require('../src/chpass');
var addamnt = require('../src/addamount');
var register = require('../src/register');
var login = require('../src/login');
var url=require('url');
var fs = require('fs');
var path    = require('path');
var ejs = require('ejs');
var trans=require('../src/trans');
var usermodel=require('../src/viewUsers');
var user = require('../src/user');
var history = require('../src/userhistory');
var maintaindata = require('../src/maintaindata');
var feedback = require('../src/feedback');
var cron = require('node-schedule');
var os = require("os");
var dateFormat = require('dateformat');
var routes = function(app) {
	var viewdir='views/html/ejs';
	var rule = new cron.RecurrenceRule();
	rule.dayOfWeek =3;
	rule.hour =13;
	rule.minute = 30;
	console.log("Shecduling mail job on :"+new Date());
	cron.scheduleJob(rule, function(req){
		console.log("Running mail job on :"+new Date());
		usermodel.viewUsers(function(data) {
			if(data.res){
				maintaindata.sendnotification(data.response,function(data){
					console.log("sent email data"+data.response);
				});
			}
		});
		
	});
		
	
	app.get('/', function(req, res) {
		res.render(path.resolve(viewdir+'/home'));
	});
	app.get('/about', function(req, res) {
		res.render(path.resolve(viewdir+'/about'));
	});
	app.get('/feedback', function(req, res) {
		res.render(path.resolve(viewdir+'/feedback'));
	});
	app.post('/postfeedback', function(req, res) {
		var email = req.body.email;
		var name = req.body.name;
		var comment=req.body.comment;
		feedback.feedbackemail(name,email,comment,function(data){
			res.render(path.resolve(viewdir+'/error'),{val:data});
		});
		
	});
	app.get('/dologin', function(req, res) {
		if(req.session.user){
			res.render(path.resolve(viewdir+'/loginSucess'),{val:req.session.user});
		}else{
			res.render(path.resolve(viewdir+'/login'));
		}
	});
	app.get('/addmember', function(req, res) {
		res.render(path.resolve(viewdir+'/register'),{val:req.session.user});
	});
	app.get('/dochpass', function(req, res) {
		res.render(path.resolve(viewdir+'/passchange'));
	});
	app.post('/login', function(req, res) {
		var email = req.body.emailid;
		var password = req.body.password;
		var adminkey=req.body.adminkey;
		var secretKey='@dm!N-frnmZ';
		login.login(email, password, function(found) {
			if(found.res){
				req.session.user=found.response;
				if(adminkey===secretKey){
					req.session.admin=true;
				}
				res.render(path.resolve(viewdir+'/home'),{val:found.response});
			}else{
				res.render(path.resolve(viewdir+'/userActionResult'),{val:found});
			}
		});
	});
	app.get('/doregister', function(req, res) {
		res.render(path.resolve(viewdir+'/register'));
	});
	app.post('/register', function(req, res) {
		var email = req.body.email;
		var name = req.body.name;
		var password=req.body.password;
		var number=req.body.cellno;
		register.register(name,email,password,number, function(found) {
			if(found.res){
				res.render(path.resolve(viewdir+'/regSucess'),{val:found});
			}else{
				res.render(path.resolve(viewdir+'/error'),{val:found});
			}
		});
	});
	app.post('/api/chgpass', function(req, res) {
		var id = req.body.userid;
		var oldPass = req.body.oldPass;
		var newPass = req.body.newPass;

		chgpass.cpass(id, oldPass, newPass, function(found) {
			if(found.res){
				res.render(path.resolve(viewdir+'/passChangeSucess'));
			}
		});
	});
	app.get('/doresetpass', function(req, res) {
		res.render(path.resolve('resetPass'));
	});
	app.post('/resetpass', function(req, res) {
		var email = req.body.emailid;
		var pass = req.body.password;
		chgpass.resetpass(email,pass, function(found) {
				res.render(path.resolve(viewdir+'/resetPassMessage'),{val:found});
		});
	});

	app.post('/api/resetpass/chg', function(req, res) {
		var email = req.body.email;
		var code = req.body.code;
		var npass = req.body.newpass;

		chgpass.respass_chg(email, code, npass, function(found) {
			console.log(found);
			res.json(found);
		});
	});
	app.get('/viewsummary', function(req, res) {
		console.log(req.url);
		if(req.session.user){
		trans.summary(function(data) {
			if(data.res){
				res.render(path.resolve(viewdir+'/summary'),{val:data});
			}else{
				res.render(path.resolve(viewdir+'/error'),{val:data});
			}
		});
		}else{
			res.render(path.resolve(viewdir+'/goLogin'));	
		}
	});
	app.get('/addtransaction', function(req, res) {
		res.render(path.resolve(viewdir+'/addtransaction'),{session: req.session});
	});
	app.get('/addamount', function(req, res) {
		res.render(path.resolve(viewdir+'/addamount'),{session: req.session});
	});
	app.post('/addamntdb', function(req, res) {
		var trandate = req.body.addedon;
		var amount = req.body.amount;
		var email = req.body.email;
		addamnt.addamount(trandate, amount, email, function(data) {
			if(data.res){
				res.render(path.resolve(viewdir+'/transuccess'),{val:data,session: req.session});
			}else{
				console.log(data.response);
				res.render(path.resolve(viewdir+'/error'),{val:data,session: req.session});
			}
		});
	});
	app.post('/updatetrans', function(req, res) {
		var trandate = req.body.spenton;
		var amount = req.body.amount;
		var email = req.body.email;
		console.log(trandate);
		addamnt.updateamount(trandate, amount,email, function(data) {
			if(data.res){
				res.render(path.resolve(viewdir+'/transuccess'),{val:data,session: req.session});
			}else{
				res.render(path.resolve(viewdir+'/error'),{val:data,session: req.session});
			}
		});
	});
	app.get('/viewAll', function(req, res) {
		if(req.session.user){
			usermodel.viewUsers(function(data) {
			if(data.res){
				res.render(path.resolve(viewdir+'/userDetails'),{val:data});
			}else{
				res.render(path.resolve(viewdir+'/error'),{val:data});
			}
		});
		}else{
			res.render(path.resolve(viewdir+'/goLogin'));	
		}
	});
	app.get('/removemember', function(req, res) {
		res.render(path.resolve(viewdir+'/removeMember'),{val:req.session.user,session: req.session});
	});
	app.get('/removeme', function(req, res) {
		var email=req.url.split('?')[1];
		if(req.session.user&&req.session.user.email==email){
			res.render(path.resolve(viewdir+'/userActionResult'),{val:{'response':'Logged in User cannot be removed.'}});
		}else{
			history.removeme(email, function(found) {
			res.render(path.resolve(viewdir+'/userActionResult'),{val:found});
		});
	}
	});
	app.get('/getUser?*', function(req, res) {
		var email=req.url.split('?')[1];
		if(req.session.user){
			history.history(email ,function(data) {
			if(data.res){
				res.render(path.resolve(viewdir+'/userHistory'),{val:data});
			}else{
				res.render(path.resolve(viewdir+'/error'),{val:data});
			}
		});
		}else{
			res.render(path.resolve(viewdir+'/goLogin'));	
		}
	});
	app.get('/logout', function(req, res) {
		req.session.user=false;
		res.render(path.resolve(viewdir+'/logout'));
	});
	app.get('/confirm', function(req, res) {
		var d=new Date();
		var day=dateFormat(d, "yyyy-mm-dd");
		var confirmedby=req.url.split('?')[1];
		 maintaindata.maintaindata(confirmedby,day ,function(data) {
			if(data.res){
				res.render(path.resolve(viewdir+'/confermedsuccess'),{val:data});
			}else{
				res.render(path.resolve(viewdir+'/error'),{val:data});
			}
		});
		
	});
	app.get('/totalcount', function(req, res) {
		var d=new Date();
		var day=dateFormat(d, "yyyy-mm-dd");
		 maintaindata.totalcount(day ,function(data) {
			if(data.res){
				var firstDate=dateFormat(data.data[0].eventday, "yyyy-mm-dd");
				var today=false;
				if(firstDate!==day){
					today=true;
				}
				res.render(path.resolve(viewdir+'/responses'),{val:data,today:today});
			}else{
				res.render(path.resolve(viewdir+'/error'),{val:data});
			}
		});
		
	});
	app.get('/viewresponses', function(req, res) {
		var url=decodeURIComponent(req.url);
		var d=url.split('?')[1];
		var day=dateFormat(d, "yyyy-mm-dd");
		maintaindata.viewMembers(day,function(data) {
			if(data.res){
				res.render(path.resolve(viewdir+'/responseList'),{val:data});
			}else{
				res.render(path.resolve(viewdir+'/error'),{val:data});
			}
		});
		
	});
	app.get('/forgotpass', function(req, res) {
		res.render(path.resolve(viewdir+'/passreset'));
	});
	app.get('*', function(req, res){
		res.render(path.resolve(viewdir+'/error'),{val:{response:"Not Found"}});
		});
	
};

module.exports = routes;