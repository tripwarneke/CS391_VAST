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

$(function () {
	$('#calculate').bind('click', function(event){
		//if($('#weight1').val()!=0)
			//alert('please fill in grade');
		
		var num = 0;
		var result = 0;
		
		var weight = [];
			//if($('#grade1').text().length==0)
		weight.push($('#weight1').val());		
		weight.push($('#weight2').val());	
		weight.push($('#weight3').val());	
		weight.push($('#weight4').val());	
		weight.push($('#weight5').val());	
		weight.push($('#weight6').val());	
		
		var grade = [];
		grade.push($('#grade1').val());
		grade.push($('#grade2').val());
		grade.push($('#grade3').val());
		grade.push($('#grade4').val());
		grade.push($('#grade5').val());
		grade.push($('#grade6').val());
		
		for(var i =0; i<weight.length;i++){
			if(weight[i]>0){
				result+=weight[i]*grade[i]/100;
				num++;
			}
		}
		$('#score').text(result);
		
		
		
	
	});	
});
