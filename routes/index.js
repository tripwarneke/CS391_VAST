var fs   = require('fs');
var path = require('path');
var pg = require('pg').native;

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

