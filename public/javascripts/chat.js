var last = 0;
//This function
var get_msg = function () {
	var req = $.ajax({
		type: 'POST',
		url : '/get-data',
	});	
	req.done(function (data) {
		//console.log('received data: ' + data.msg);
		//$('#display').text(data.ms);
		for(var i = data.ms.length-1; i >= 0; i--){
			if(data.ms[i].mid > last){ 
				msg_append(data.ms[i]);
				last = data.ms[i].mid;
				//console.log('ms: ' + data.msg[i]);
			}
		}

	});
};
//print out our messages with the most recent at the top
function msg_append(messages) {
	var li = '<li>' + messages.mid + "		" + messages.message + "		" + messages.tstamp +'</li>';
	$('ul#messages').prepend(li);
}


var set_msg = function () {
	var msg = $('#inputtext').text();
	var req = $.ajax({
		type: 'POST',
		url : '/set_msg',
		data: { 'msg' : msg }
	});

	req.done(function (data) {
		var notify = $('#notify');
		notify.html('Message "' + data.msg + '" Received');
		$('#display').text("last message: " + "\'" + data.msg + "\'");
		notify.fadeOut(function () {
			notify.empty();
			notify.show();
		});
	});
};

var interval_id;

//set interval to 3 seconds
var start_polling = function () {
	interval_id = setInterval(get_msg, 3000);
};

var stop_polling = function () {
	if (interval_id) {
		clearInterval(interval_id);
	}
};

$(function () {
	get_msg();
	start_polling();// will poll every 3 seconds
	$('#send').bind('click', function(event){
		//error check messgae for size limit of 140 charcters
		if($('#inputtext').text().length > 140){
			$('#display').text('Message cannot be more than 140 characters');
			$('#inputtext').text("");
		}
		//check for blank messages so we don;t fill up the db with blanks
		else if ($('#inputtext').text().length < 1){
			$('#display').text('Write something and the hit the \'Send\' button');
		}
		else{
			set_msg();
			//msg_append($('#inputtext').text());
			$('#inputtext').text("");
		}
	});
});

