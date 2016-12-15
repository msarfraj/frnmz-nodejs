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
var routes = function(app) {
	var viewdir='views/html/ejs';
	app.get('/', function(req, res) {
		res.render(path.resolve(viewdir+'/home'));
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
		login.login(email, password, function(found) {
			if(found.res){
				req.session.user=found.response;
				res.render(path.resolve(viewdir+'/loginSucess'),{val:found.response});
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
		register.register(name,email,password, function(found) {
			if(found.res){
				res.render(path.resolve(viewdir+'/regSucess'),{val:found});
			}else{
				res.render(path.resolve(viewdir+'/error'),{val:data});
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
	app.post('/api/resetpass', function(req, res) {
		var email = req.body.email;
		chgpass.respass_init(email, function(found) {
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
				res.render(path.resolve(viewdir+'/userDetails'),{val:data,session: req.session});
			}else{
				res.render(path.resolve(viewdir+'/error'),{val:data,session: req.session});
			}
		});
		}else{
			res.render(path.resolve(viewdir+'/goLogin'));	
		}
	});
	app.get('/removemember', function(req, res) {
		res.render(path.resolve(viewdir+'/removeMember'),{val:req.session.user,session: req.session});
	});
	app.post('/removeme', function(req, res) {
		var email = req.body.email;
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
				res.render(path.resolve(viewdir+'/userHistory'),{val:data,session: req.session});
			}else{
				res.render(path.resolve(viewdir+'/error'),{val:data,session: req.session});
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
	app.get('*', function(req, res){
		res.render(path.resolve(viewdir+'/error'),{val:{response:"Not Found"}});
		});
	
};

module.exports = routes;