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
		var w = 0;
		var score = 0;
		var result= 0;
		
		var weight = [];
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
				if(grade[i]){
					score+=weight[i]*grade[i]/100;
					w=w+parseInt(weight[i]);
				}
			}
		}
		alert(w);
		result = Math.round(score*100/w);
		$('#score').text(result);
		var aEST = Math.round((93-score)/((100-w)/100));
		var amEST = Math.round((90-score)/((100-w)/100));
		var bpEST = Math.round((87-score)/((100-w)/100));
		var bEST = Math.round((83-score)/((100-w)/100));
		var bmEST = Math.round((80-score)/((100-w)/100));
		var cpEST = Math.round((77-score)/((100-w)/100));
		var cEST = Math.round((73-score)/((100-w)/100));
		var cmEST = Math.round((70-score)/((100-w)/100));
		var dpEST = Math.round((67-score)/((100-w)/100));
		var dEST = Math.round((63-score)/((100-w)/100));
		var dmEST = Math.round((60-score)/((100-w)/100));
		if(w>=100){
			$('#needed-scores').text('You do not have any assignment left to do');
		}
		
			
			$('#a').text('A: '+aEST);
			$('#am').text('A-: '+amEST);
			$('#bp').text('B+: '+bpEST);
			$('#b').text('B: '+bEST);
			$('#bm').text('B-: '+bmEST);
			$('#cp').text('C+: '+cpEST);
			$('#c').text('C: '+cEST);
			$('#cm').text('C-: '+cmEST);
			$('#dp').text('D+: '+bpEST);
			$('#d').text('D: '+bEST);
			$('#dm').text('D-: '+bmEST);
		
	
	});	
});
