var fs   = require('fs');
var path = require('path');

var accountsfile = 'accounts.json';
var usersfile = 'users.json';

var userArr = [];
var userAccounts = {};
var activeUsers = [];


//load and save data methods -- used the names project as a basis
path.exists(usersfile, function (exists) {
        if (exists) {
            loadUsers(function (uArr) {
		userArr = uArr;
            });
        }
});
path.exists(accountsfile, function (exists) {
        if (exists) {
            loadAccounts(function (uAcc) {
		userAccounts = uAcc;
            });
        }
});
function loadUsers(cb) {
    fs.readFile(usersfile, function (err, data) {
        if (err) {
            throw new Error('Error reading database: ' + err);
        }
	console.log("reading users file");
        cb(JSON.parse(data));
    });
}
function loadAccounts(cb) {
    fs.readFile(accountsfile, function (err, data) {
        if (err) {
            throw new Error('Error reading database: ' + err);
        }
	console.log("reading accounts file");
        cb(JSON.parse(data));
    });
}
function saveUsers(cb) {
    var json = JSON.stringify(userArr);
    fs.writeFile(usersfile, json, function (err) {
        if (err) {
            throw new Error('Could not write ' + usersfile);
        } 
        cb();
    });
}
function saveAccounts(cb) {
    var json = JSON.stringify(userAccounts);
    fs.writeFile(accountsfile, json, function (err) {
        if (err) {
            throw new Error('Could not write ' + accountsfile);
        } 
        cb();
    });
}

//check for item in array... only used for checkSession
function existsInArr(item, arr){
	for(var i=0; i<arr.length; i++){
		if(arr[i] === item){
			return true;
		}
	}
	return false;
}
//check if the current user has a valid session (is in the activeUsers)
function checkSession(req,res){
	//console.log("checkSession");
	if(req != null && existsInArr(req.session.username, activeUsers)){
		//console.log("session valid for:"+req.session.username);
		return true;
	}
	res.render('login',{	title:'Login',
				feedback:'Your session has unexpectedly ended, please log back in.'});
	return false;
}


//get current date time in comparable format
function getDateTime(){
	var result = "";
	var today = new Date();
	var year = today.getFullYear();
	var month = today.getMonth() + 1;//add 1 since it is 0 index
	var day = today.getDate();
	var hour = today.getHours();
	var minutes = today.getMinutes();
	var seconds = today.getSeconds();
	//note: adding the null string forces them to be treated like strings instead of nums
	if((month+"").length < 2) month = "0"+month;
	if((day+"").length < 2) day = "0"+day;
	if((hour+"").length < 2) hour = "0"+hour;
	if((minutes+"").length < 2) minutes = "0"+minutes;
	if((seconds+"").length < 2) seconds = "0"+seconds;
	return(year+"/"+month+"/"+day+"-"+hour+":"+minutes+"."+seconds);
}


exports.create = function(req, res) {
    // TODO: user/account creation
	var uName = req.query.username;
	if(req.query.username == null){
		res.render('create',{	title:"Create New Account",
					feedback:""});
	}else{
		var goodUserName = true;
		for(var i=0; i<userArr.length; i++){
			//console.log(userArr[i].username);
			if(userArr[i].username === uName){
				res.render('create',{	title: 'Create New Account',
							feedback:'That username is taken, please choose another.'});
				goodUserName = false;
				break;
			}
		}
		if(goodUserName){
			var user = {	'username':uName,
					'password':req.query.pw1,
					'birthday':req.query.bday,
					'created':getDateTime()};
			userArr.push(user);
			userAccounts[uName]={	'balance':'0.00',
						'transactions':[]};
			saveUsers(function(){
				saveAccounts(function(){
					res.render('login',{	title:'Login',
								feedback:'Account successfully created.'});
				});
			});
		}
	}
};

exports.login = function(req, res) {
    // TODO: user login
	if(req.query.username == null){
		res.render('login',{title:'Login',
					feedback:''});
	}else{
		var uName = req.query.username;
		var pwd = req.query.pwd;
		for(var i=0; i<userArr.length; i++){
			if(userArr[i].username === uName){
				if(userArr[i].password === pwd){
					activeUsers.push(uName);
					req.session.username = uName;
					goToTransactions(req,res, '');
					return;
				}else{
					res.render('login',{title:'Login',
								feedback:'Incorrect password, please try again.'});
					return;
				}
			}
		}
		res.render('login',{title:'Login',
				feedback:'Unknown username, please try again'});		
	}
};

exports.logout = function(req, res) {
    // TODO: user logout
	if(checkSession(req,res)){
	activeUsers.pop(req.session.username);
	req.session.destroy();
	res.render('logout',{title:'Logout',
				feedback:'You have successfully logged out.'});
	}
};




