var fs   = require('fs');
var path = require('path');
var pg = require('pg');

var host = 'ec2-184-72-185-94.compute-1.amazonaws.com/postgres';
//var port = 5432;
var user = 'power_user';
var pword = 'cs445pg';
var client;

init();


function init(){
	console.log('connecting to VAST db');
	pg.connect('tcp://'+user+":"+pword+'@'+host, function (err, cl){
		if(err){
			throw err;
		}else{
			console.log('connection established');
			client = cl;
		}
	});
}
function addUser(userName, userEmail, userSchool, userPassword, cb){
	console.log('adding a user to the DB');
	var sql = 'insert into users values(default, $1, $2, $3, $4, false);';
	client.query(sql, [userName, userEmail, userSchool, userPassword], function(err, rVal){
		if(err !== null){
			console.log('trouble storing new user, returned:'+rVal);
			cb(-1);
		}else{
			//returned non-null
			console.log('added new user');
			cb(1);
		}
	});
}
function addAssignment(assignmentName, assignmentWeight, assignmentScore, cb){
	console.log('adding a user to the DB');
	var sql = 'insert into assignments values(default, $1, $2, $3, $4);';
	client.query(sql, [userName, userEmail, userSchool, userPassword], function(err, rVal){
		if(err !== null){
			console.log('trouble storing new user, returned:'+rVal);
			cb(-1);
		}else{
			//returned non-null
			cb(1);
		}
	});
}
function addCourse(coursename, semester, year, instructor, cb) { //SEMESTER is SPRING, SUMMER, WINTER, FALL, year is yyyy
	console.log('adding course:'+coursename);
	var sql = 'insert into courses values(default, $1, $2, $3, $4);';
	client.query(sql, [coursename, semester, year, instructor], function(err, rVal){
		if(err !== null){
			console.log('trouble storing new course, returned:' + rVal);
			cb(-1);
		}else{
			cb(1);
		}
	});
}

function getUser(userID, cb){
	var sql = 'select * from users where u_name = $1;';
	client.query(sql, [username], function(err, result){
		if(err !== null || result.rows.length == 0){
			cb(null);
		}else{
			cb(result.rows[0]);
		}
	});
}
function getAllUsers(cb){
	var sql = 'select * from users;';
	client.query(sql, [],
		function(err, result) {
			if(err !== null){
				cb(null);
			}else{
				console.log(JSON.stringify(result));
				//console.log('returning rows');
				cb(result.rows);
			}
	});
}

function getAssignments(userID, courseID, cb){
	var sql = 'select A.a_aid, A.a_aname, A.a_weight, A.a_score, T.t_grade from assignments A, takes T, homeworks H where T.t_uid = $1 AND T.t_cid = $2 AND H.h_cid = T.t_cid;';
	client.query(sql, [userID, courseID],
		function(err, result) {
			if(err !== null){
				cb(null);
			}else{
				console.log(JSON.stringify(result));
				//console.log('returning rows');
				cb(result.rows);
			}
		});
}

function getCourses(userID, cb){
	var sql = 'select C.c_cid, C.c_name, C.c_semester, C.c_year, C.c_instructor, T.t_grade from courses C, takes T where T.t_uid=$1 AND T.t_cid = C.c_cid;';
	client.query(sql, [userID], function(err, result){
		if(err !== null){
			console.log("error getting courses for "+userID);
			cb(null);
		}else{
			cb(result.rows);
		}
	});
}
function getGPAs(userID, cb){
	var sql = 'select t_grade, t_credits from takes where t_uid = $1;';
	client.query(sql, [userID], function(err, result){
		if(err !== null){
			console.log("error getting GPAs for " + userID);
			cb(null);
		}else{
			cb(result.rows);
		}
	});
}

// home page, and also login page
exports.home = function(req, res) {
    // TODO: home
	res.render('home',{title:'Home', msg:req.session.msg});
};
exports.profile = function(req, res) {
    var user  = req.session.user;
    if (!user) {
		req.session.msg = 'Please login first';
        res.redirect('/home');
        return;
    }
	res.render('profile',{title:'Profile',user:user});
};
exports.gpa = function(req, res) {
    // TODO: home
	res.render('gpa',{title:'GPA Calculator'});
};

exports.est = function(req, res) {
    // TODO: home
	res.render('est',{title:'Grade Estimator'});
};

// handle create page and create account
exports.create = function(req, res) {
	var username = req.body.username;
	var email = req.body.email;
	var school = req.body.school;
	var password = req.body.password;
	// check if there is a POST request for creating account
	if(username && email && school && password){
		// check if the username is already chosen
		checkUser(username,password, function(result){
			var user = result;
			if(user){
				res.render('create', 
							{ title: 'Create Account', error:'This username already exists, please pick another one' });
			}else{
				addUser(username, email, school, password, 
						function(err){
						req.session.msg = 'Your account has been created successfully';
						res.redirect('/home');
				});
			}
			
		});
	}
	// just render a normal page if it is not a POST request
	else{
		res.render('create',{title:'Create Account',error:null});
	}
};

function checkUser(username, password, cb){
	var sql = 'select * from users where u_name = $1;';
	client.query(sql, [username], function(err, result){
		if(err !== null){
				throw err;
		}
		else{
			if(result.rows.length != 0){
				console.log('found and returned user'+result.rows[0].u_name);
				cb(result.rows[0]);
			}else{
				console.log('cannot find user');
				cb(null);
			}
		}
	});
	return;
}

// handle login
exports.login = function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	// query to find the user with provided username
	
	checkUser(username, password, function(result){
		var user = result;
		if(user){
			if(password != user.u_password){
				res.render('home',{title:'Home',msg:'password does not match'});
				return;
			}
			else{
				req.session.user = user;
				res.redirect('/profile');
			}
		}else{
			console.log('cannot find user');
			res.render('home',{title:'Home',msg:'username does not exist'});
		}
	});	
};

exports.logout = function(req, res) {
	req.session.destroy();
	res.render('home',{title:'Home',msg:'Your account has been logged out successfully'});
};


// handle create page and create account
exports.add_course = function(req, res) {
	var course= req.body.course;
	var grade = req.body.grade;
	var credits = req.body.credits;
	var semester = req.body.semester;
	var year = req.body.year;
	
};

