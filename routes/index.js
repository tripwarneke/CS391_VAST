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

function getUsers(cb){
	var sql = 'select * from users;';
	client.query(sql, [],
		function(err, result) {
			if(err !== null){
				cb(null);
			}else{
				console.log(JSON.stringify(result));
				//console.log('returning rows');
				cb(result);
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
				cb(result);
			}
		});
}

function getGrades(userID, cb){
	var sql = 'select * from gradebook where g_uid = $1;';
	client.query(sql, [userID],
		function(err, result) {
			if(err !== null){
				cb(null);
			}else{
				console.log(JSON.stringify(result));
				//console.log('returning rows');
				cb(result);
			}
		});
}

// home page, and also login page
exports.home = function(req, res) {
    // TODO: home
	res.render('home',{title:'Home', error:req.session.msg});
};
exports.profile = function(req, res) {
    var user  = req.session.user;
    if (!user) {
		req.session.msg = 'Please login first';
        res.redirect('/home');
        return;
    }
	res.render('profile',{title:'Profile',user:req.session.user});
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
	var sql = 'select * from users where u_name = $1;';
	client.query(sql, [username],
		function(err, result) {
			if(err !== null){
				throw err;
			}else{
				// check if the username is already chosen
				if(result.rows.length != 0)
					res.render('create', 
							{ title: 'Create Account', error:'This username is already exist, please pick another one' });
				// if the information is fine, create an account and redirect to home page for login
				else{
					addUser(username, email, school, password, 
						function(err){
						res.redirect('/home');
					});
				}
			}
		});
	}
	// just render a normal page if it is not a POST request
	else{
		res.render('create',{title:'Create Account',error:null});
	}
};

var checkUser = function (username, password){
	var answer = undefined;
	var sql = 'select * from users where u_name = $1;';
	client.query(sql, [username], function(err, result){
		if(err !== null){
				throw err;
		}
		else{
			if(result.rows.length != 0){
				answer = result.rows[0];
				console.log('found and returned user'+result.rows[0].u_name);
			}else{
				console.log('cannot find user');
			}
		}
	});
	return answer;
}

// handle login
exports.login = function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	// query to find the user with provided username
	var sql = 'select * from users where u_name = $1;';
	client.query(sql, [username], function(err, result){
		if(err !== null){
				throw err;
		}
		else{
			// if the user is exist
			if(result.rows.length != 0){

				var user = result.rows[0];
				// check password
				if(password != user.u_password){
					res.render('home',{title:'Home',error:'password does not match'});
					return;
				}
				else{
					req.session.user = user;
					res.redirect('/profile');
				}	
			}
			else{
				console.log('cannot find user');
				res.render('home',{title:'Home',error:'username does not exist'});
			}
		}
	});	
};

exports.logout = function(req, res) {
	req.session.destroy();
	res.render('home',{title:'Home',error:'Your account has been logged out successfully'});
};

<<<<<<< HEAD
exports.home = function(req, res) {
    // TODO: home
	res.render('home',{title:'Home'});
};
exports.profile = function(req, res) {
    // TODO: home
	res.render('profile',{title:'Profile'});
};
exports.gpa = function(req, res) {
    // TODO: home
	res.render('gpa',{title:'GPA Calculator'});
};

exports.est = function(req, res) {
    // TODO: home
	res.render('est',{title:'Grade Estimator'});
};
exports.test = function(req, res) {
    // TODO: home
	res.render('test',{title:'Grade Estimator'});
};

=======
// handle create page and create account
exports.add_course = function(req, res) {
	var course= req.body.course;
	var grade = req.body.grade;
	var credits = req.body.credits;
	var semester = req.body.semester;
	var year = req.body.year;

};
>>>>>>> 113f7de5f5eae4c203b1f8b12f4c70ba6e2e2b30
