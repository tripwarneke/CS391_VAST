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
	client = new pg.Client('tcp://'+user+":"+pword+'@'+host);
	client.connect();
	/*pg.connect('tcp://'+user+":"+pword+'@'+host, function (err, cl){
		if(err){
			throw err;
		}else{
			console.log('connection established');
			client = cl;
		}
	});*/
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
function getUser(userID, cb){
	var sql = 'select * from users where u_uid = $1;';
	client.query(sql, [userID], function(err, result){
		if(err !== null || result.rows.length == 0){
			cb(null);
		}else{
			cb(result.rows[0]);
		}
	});
}
function getAllUsers(cb){
	var sql = 'select * from users;';
	client.query(sql, [], function(err, result) {
		if(err !== null){
			cb(null);
		}else{
			console.log(JSON.stringify(result));
			//console.log('returning rows');
			cb(result.rows);
		}
	});
}

function addAssignment(courseID, assignmentName, assignmentWeight, assignmentScore, cb){
	console.log('adding an assignment to the DB');
	var sql = 'insert into assignments values(default, $1, $2, $3) returning a_aid;';
	client.query(sql, [assignmentName, assignmentWeight, assignmentScore], function(err, rVal){
		if(err !== null){
			console.log('trouble adding assignment, returned:'+rVal);
			cb(-1);
		}else{
			var aid = rVal.rows[0].a_aid;
			console.log('returned:'+ aid);
			var sql2 = 'insert into homeworks values($1, $2);';
			client.query(sql2, [courseID, aid], function(err, rVal){
				if(err !== null){
					console.log('trouble adding homeworks relations, returned:'+rVal);
					cb(-1);
				}else{
					cb(1);
				}
			});
		}
	});
}
function getAssignments(userID, courseID, cb){
	//var sql = 'select A.a_aid, A.a_aname, A.a_weight, A.a_score, T.t_grade from assignments A, takes T, homeworks H where T.t_uid = $1 AND T.t_cid = $2 AND H.h_cid = T.t_cid;';
	var sql = 'select A.a_aid, A.a_aname, A.a_weight, A.a_score from assignments A, homeworks H where  H.h_cid = $1 AND H.h_aid = A.a_aid;';
	client.query(sql, [courseID],function(err, result) {
		if(err !== null){
			cb(null);
		}else{
			//console.log(JSON.stringify(result));
			//console.log('returning rows');
			cb(result.rows);
		}
	});
}
function updateAssignment(aID, aName, aWeight, aScore, cb){
	console.log('updating assignment='+aID);
	var sql = 'update assignments SET a_name = $1, a_weight = $2, a_score = $3 WHERE a_aid = $4;';
	client.query(sql, [aName, aWeight, aScore, aID], function(err, rVal){
		if(err !== null){
			console.log('trouble updating assignment, returned:'+rVal);
			cb(-1);
		}else{
			//returned non-null
			console.log('updated assignment');
			cb(1);
		}
	});
}
function removeAssignment(aID, cb){
	console.log('removing assignment='+aID);
	var sql = 'delete from assignments where a_aid = $1;';
	client.query(sql, [aID], function(err, rVal){
		if(err !== null){
			console.log('trouble deleting assignments for '+aID+' returned: '+rVal);
			cb(-1);
		}else{
			console.log('removed');
			cb(1);
		}
	});
}
function addCourse(userID, coursename, semester, year, instructor, cb) { //SEMESTER is SPRING, SUMMER, WINTER, FALL, year is yyyy
	console.log('adding course:'+coursename);
	var sql = 'insert into courses values(default, $1, $2, $3, $4) returning c_cid;';
	client.query(sql, [coursename, semester, year, instructor], function(err, rVal){
		if(err !== null){
			console.log('trouble storing new course, returned:' + rVal);
			cb(-1);
		}else{
			var cid = rVal.rows[0].c_cid;
			console.log('returned: ' + cid);
			var sql2 = 'insert into takes values($1, $2);';
			client.query(sql2, [userID, cid], function(err, rVal){
				if(err !== null){
					console.log('trouble adding takes relation, returned:'+rVal);
					cb(-1);
				}else{
					cb(1);
				}	
			});	
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
function updateCourse(cID, cName, semester, year, instructor, cb){
	console.log('updating course='+cID);
	var sql = 'update courses SET c_name = $1, c_semester = $2, c_year = $3, c_instructor = $4 WHERE c_cid = $5;';
	client.query(sql, [cName, semester, year, instructor, cID], function(err, rVal){
		if(err !== null){
			console.log('trouble updating course, returned:'+rVal);
			cb(-1);
		}else{
			//returned non-null
			console.log('updated course');
			cb(1);
		}
	});
}
function removeCourse(cID, cb){
	console.log('removing course='+cID);
	var sql = 'delete from courses where c_cid = $1;';
	client.query(sql, [cID], function(err, rVal){
		if(err !== null){
			console.log('trouble deleting assignments for '+aID+' returned: '+rVal);
			cb(-1);
		}else{
			console.log('removed');
			cb(1);
		}
	});
}
function addGrade(userID, cID, grade, credits, cb){
	console.log('adding grade--'+userID+':'+cID+':'+grade+':'+credits);
	var sql = 'insert into takes values($1, $2, $3, $4);';
	client.query(sql, [userID, cID, grade, credits], function(err, rVal){
		if(err !== null){
			console.log('trouble adding grade, returned:'+rVal);
			cb(-1);
		}else{
			//returned non-null
			console.log('added grade');
			cb(1);
		}
	});
}
function updateGrade(userID, cID, grade, credits, cb){
	console.log('updating grade='+cID+':'+credits);
	var sql = 'update takes SET t_grade = $1, t_credits = $2 WHERE t_uid = $3 AND t_cid = $4;';
	client.query(sql, [grade, credits, userID, cID], function(err, rVal){
		if(err !== null){
			console.log('trouble updating grade, returned:'+rVal);
			cb(-1);
		}else{
			//returned non-null
			console.log('updated grade');
			cb(1);
		}
	});
}
function getGrades(userID, cb){
	console.log('getting grades for '+userID);
	var sql = 'select * from takes where t_uid = $1;';
	client.query(sql, [userID], function(err, result){
		if(err !== null){
			cb(null);
		}else{
			cb(result.rows);
		}
	});
}
function removeGrade(userID, cID, cb){
	console.log('removing grade for '+userID+' for course ' +cID);
	var sql = 'delete from takes where t_uid = $1 AND t_cid = $2;';
	client.query(sql, [userID, cID], function(err, rVal){
		if(err !== null){
			console.log('trouble adding grade, returned:'+rVal);
			cb(-1);
		}else{
			//returned non-null
			console.log('added grade');
			cb(1);
		}
	});
}
function GPAfromRows(rows){
	var gradeList = [];
	var creditList = [];
	//console.log(JSON.stringify(rows));
	for (var i=0; i<rows.length; i++){
		gradeList.push(rows[i].t_grade);
		creditList.push(rows[i].t_credits);
	}
	var gpaSum = 0;
	var creditSum = 0;
	for (var j=0; j<gradeList.length; j++){
		var grade = gradeList[j];
		var cred = creditList[j];
		var cred = cred-0;
		if(grade === "A ") gpaSum += 4*cred;
		else if(grade === "A-") gpaSum += 3.75*cred;
		else if(grade === "B+") gpaSum += 3.25*cred;
		else if(grade === "B ") gpaSum += 3*cred;
		else if(grade === "B-") gpaSum += 2.75*cred;
		else if(grade === "C+") gpaSum += 2.25*cred;
		else if(grade === "C ") gpaSum += 2*cred;			
		else if(grade === "C-") gpaSum += 1.75*cred;
		else if(grade === "D+") gpaSum += 1.25*cred;
		else if(grade === "D ") gpaSum += 1*cred;
		else if(grade === "D-") gpaSum += 0.75*cred;
		creditSum += cred;	
		//console.log('gpaSum='+gpaSum+' : creditSum='+creditSum);	
	}
	creditSum = Math.max(creditSum, 1); //so we don't get a divide by zero :)
	return gpaSum/creditSum;
}

// home page, and also login page
exports.home = function(req, res) {
    // TODO: home
	res.render('home',{title:'Home', msg:req.session.msg});
};

function courseList(courses){
	var result='';
	for(var i = 0; i < courses.length; i++){
		result += '<a href="/est/' + courses[i].c_cid+ '">' +courses[i].c_name + '</a><br>';
	}
	return result;
}

exports.profile = function(req, res) {
    var user  = req.session.user;
    if (!user) {
	req.session.msg = 'Please login first';
        res.redirect('/home');
        return;
    }
	getCourses(user.u_uid, function(courses){
		var courses = courseList(courses);
		getGrades(user.u_uid, function(grades){
			var gpa = GPAfromRows(grades).toPrecision(3);

			res.render('profile',{	title:user.u_name+"'s Profile",
			user:user.u_uid,
			uName:user.u_name,
			uSchool:user.u_school,
			GPAReturn:gpa,
			courses:courses
			});
		});
	});

};

exports.gpa = function(req, res) {
	var user = req.session.user;
	if(user){
		getGrades(user.u_uid, function(rows){
			var gpa = GPAfromRows(rows).toPrecision(3);
			var credSum = 0;
			var list = "";
			if(rows.length > 0){
				for(var i=0; i<rows.length; i++){
					list += "<li> Grade:";
					list += rows[i].t_grade;
					list += "      Credits:";
					list += rows[i].t_credits;
					list += " </li><br>";
					credSum += rows[i].t_credits-0;
				}
			}else{
				list = "<li>list of current grades added on the fly here</li>";
			}
			res.render('gpa',{	title:'GPA Calculator',
						user:user.u_uid,
						uName:user.u_name,
						uSchool:user.u_school,
						GPA:gpa,
						credits:credSum,
						GPAList:list
			});
		});
	}
	else{
		req.session.msg = 'Please login first';
        res.redirect('/home');
	}
};

function dropList(courses, cid){
	var result = '';
	for(var i = 0; i < courses.length; i++){
		if(cid == courses[i].c_cid)
			result += '<option selected value="'+courses[i].c_cid+ '" selec>' + courses[i].c_name + '</option>';
		else
			result += '<option value="'+courses[i].c_cid+ '">' + courses[i].c_name + '</option>';
	}
	return result;
};

exports.est = function(req, res) {
	var user  = req.session.user;
    if (!user) {
	req.session.msg = 'Please login first';
        res.redirect('/home');
        return;
    }
	var cid = req.params.cid;
	req.session.cid = cid;
	getCourses(user.u_uid, function(courses){
			res.render('est',{title:'Grade Estimator',
							courses:dropList(courses, cid)
			});
			/*
		getAssignments(user.u_uid, cid, function(assignments){
			var ass1;
			var ass2;
			var ass3;
			var ass4;
			var ass5;
			var ass6;
			if (assignments[0]){
				ass1.a_aid = assignments[0].a_aid;
				ass1.a_aname = assignments[0].a_aname;
				ass1.a_weight = assignments[0].a_weight;
				ass1.a_score= assignments[0].a_score;
			}
			if (assignments[1]){
				ass2.a_aid = assignments[1].a_aid;
				ass2.a_aname = assignments[1].a_aname;
				ass2.a_weight = assignments[1].a_weight;
				ass2.a_score= assignments[1].a_score;
			}
			if (assignments[2]){
				ass3.a_aid = assignments[2].a_aid;
				ass3.a_aname = assignments[2].a_aname;
				ass3.a_weight = assignments[2].a_weight;
				ass3.a_score= assignments[2].a_score;
			}

		});
		*/
	});
	
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
							{ title: 'Create Account', msg:'This username already exists, please pick another one' });
			}else{
				addUser(username, email, school, password, 
						function(err){
						req.session.msg = 'Your account has been created successfully';
						res.redirect('/login');
				});
			}
			
		});
	}
	// just render a normal page if it is not a POST request
	else{
		res.render('create',{title:'Create Account',msg:null});
	}
};

function checkUser(username, password, cb){
	var sql = 'select * from users where u_name = $1;';
	client.query(sql, [username], function(err, result){
		if(err !== null){
				console.log('error on user creation');
				cb(null);
		}else{
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
	if(username && password){
	// query to find the user with provided username	
	checkUser(username, password, function(result){
		var user = result;
		if(user){
			if(password != user.u_password){
				res.render('login_view',{title:'Login',msg:'password does not match'});
				return;
			}
			else{
				user.u_password = "********";
				req.session.user = user;
				res.redirect('/profile');
			}
		}else{
			console.log('cannot find user');
			res.render('login_view',{title:'Login',msg:'username does not exist'});
		}
	});
	}
	else{
		res.render('login_view',{title:'Login',msg:req.session.msg});
	}
};
exports.login_view = function(req, res) {
	res.render('login_view', {title: 'LOGIN', msg:''});
};

exports.logout = function(req, res) {
	req.session.destroy();
	res.render('home',{title:'Home',msg:'Your account has been logged out successfully'});
};


exports.add_grade = function(req, res) {
	var grade = req.body.grade;
	var credits = req.body.credits;
	var userID = req.session.user.u_uid;
	addGrade(userID, 0, grade, credits, function(result){
		res.redirect('/gpa');
	});
};


exports.save_assignment = function(req, res) {
	var cid = req.session.cid;
	var weight1 = req.body.weight1;
	var weight2 = req.body.weight2;
	var weight3 = req.body.weight3;
	var weight4 = req.body.weight4;
	var weight5 = req.body.weight5;
	var weight6 = req.body.weight6;
	if(weight1>0){
		addAssignment(cid, req.body.assign1, weight1, req.body.grade1,function(){});
	}
	if(weight2>0){
		addAssignment(cid, req.body.assign2, weight2, req.body.grade2,function(){});
	}
	if(weight3>0){
		addAssignment(cid, req.body.assign3, weight3, req.body.grade3,function(){});
	}	
	if(weight4>0){
		addAssignment(cid, req.body.assign4, weight4, req.body.grade4,function(){});
	}
	if(weight5>0){
		addAssignment(cid, req.body.assign5, weight5, req.body.grade5,function(){});
	}
	if(weight6>0){
		addAssignment(cid, req.body.assign6, weight6, req.body.grade6,function(){});
	}
	res.redirect('/profile');
};

exports.add_course = function(req, res) {
	var user  = req.session.user;
    if (!user) {
	req.session.msg = 'Please login first';
        res.redirect('/home');
        return;
    }
	var cname = req.body.cname;
	addCourse(user.u_uid, cname, 'SPRING', '2012', 'Tim', function(){ //SEMESTER is SPRING, SUMMER, WINTER, FALL, year is yyyy
		res.redirect('/profile');
	});
};


exports.get_assignments = function(req, res) {
	// Set the content type:
	

	console.log('get assignments called');
	var data = req.body;
	
	var cid = data.cid;
	
	getAssignments(req.session.user.u_uid, cid, function(result){
		
		res.contentType('application/json');
		res.send({ 'assignments' : result});
		console.log('length' +result.length);
		console.log(result)
	});
	
	
	
};
