//place functions for client side interactions and checks here
var interval_id;

//set interval to 3 seconds
var start_polling = function () {
	interval_id = setInterval(get_data, 3000);
};

var stop_polling = function () {
	if (interval_id) {
		clearInterval(interval_id);
	}
};

var get_data = function () {
	var req = $.ajax({
		type: 'GET',
		url : '/get-data'
	});
	req.done(function (data) {
		user = data;
		//console.log('received data: ' + data.msg);
		$('#name').text(user.u_name);
		$('#school').text(user.u_school);
	});
};

//$(function () {
//	get_data();
//	start_polling();// will poll every 3 seconds
//});
