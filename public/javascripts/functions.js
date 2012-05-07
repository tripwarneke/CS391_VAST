// default handling function
$(function () {
	// bind calculate button with mouse click
	$('#calculate').bind('click', function(event){
		calculate();
	});
	// load the assignments of the course when the est is loaded up
	$('#course-select').ready(function(event){
		reloadEST($('#course-select').val());	
	});
	// load the assignments of the course when change the drop down box
	$('#course-select').change(function(event){
		reloadEST($('#course-select').val());
	});
	// save the assignments with button
	$('#save-changes').bind('click',function(event){
		save($('#course-select').val());
	});
	
	
});


function save(cid){

	var assignments = [];
	for (var i = 0; i < 6; i++){
		if($('#weight'+(i+1)).val()!=''){
			var assignment={};
			assignment.name = $('#assign'+(i+1)).val();
			assignment.weight = $('#weight'+(i+1)).val();
			assignment.grade = $('#grade'+(i+1)).val();
			assignments.push(assignment);
		}
	}
	
	var req = $.ajax({
		type: 'POST',
		url : '/save-assignments',
		data: { 'cid' : cid,
			'assignments': assignments
		}
	});
	
	req.done(function (data) {
		calculate();
	});
	
};

function calculate(){
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
		//alert(w);
		result = score*100/w;
		$('#score').text(Math.round(result*100)/100);
		var aEST = (93-score)/((100-w)/100);
		var amEST = (90-score)/((100-w)/100);
		var bpEST = (87-score)/((100-w)/100);
		var bEST = (83-score)/((100-w)/100);
		var bmEST = (80-score)/((100-w)/100);
		var cpEST = (77-score)/((100-w)/100);
		var cEST = (73-score)/((100-w)/100);
		var cmEST = (70-score)/((100-w)/100);
		var dpEST = (67-score)/((100-w)/100);
		var dEST = (63-score)/((100-w)/100);
		var dmEST = (60-score)/((100-w)/100);
		if(w>=100){
			$('#grade').text('You do not have any assignment left to do');
			$('#a').text('');
			$('#am').text('');
			$('#bp').text('');
			$('#b').text('');
			$('#bm').text('');
			$('#cp').text('');
			$('#c').text('');
			$('#cm').text('');
			$('#dp').text('');
			$('#d').text('');
			$('#dm').text('');
		}
		else{
			$('#grade').text('');
			$('#a').text('A: '+Math.round(aEST*100)/100);
			$('#am').text('A-: '+Math.round(amEST*100)/100);
			$('#bp').text('B+: '+Math.round(bpEST*100)/100);
			$('#b').text('B: '+Math.round(bEST*100)/100);
			$('#bm').text('B-: '+Math.round(bmEST*100)/100);
			$('#cp').text('C+: '+Math.round(cpEST*100)/100);
			$('#c').text('C: '+Math.round(cEST*100)/100);
			$('#cm').text('C-: '+Math.round(cmEST*100)/100);
			$('#dp').text('D+: '+Math.round(dpEST*100)/100);
			$('#d').text('D: '+Math.round(dEST*100)/100);
			$('#dm').text('D-: '+Math.round(dmEST*100)/100);
		}
}

function reloadEST(cid) {
	var req = $.ajax({
		type: 'POST',
		url : '/get-assignments',
		data: { 'cid' : cid }
	});
	
	req.done(function (data) {
		var assignments = data.assignments;
		if(assignments.length != 0){

			for (var i = 0; i<assignments.length; i++){
				if(assignments[i]){
					$('#assign'+(i+1)).val(assignments[i].a_aname);
					$('#weight'+(i+1)).val(assignments[i].a_weight);
					$('#grade'+(i+1)).val(assignments[i].a_score);
				}
			}
		
		}
		
		for (var i = assignments.length; i < 6; i++){
			$('#assign'+(i+1)).val('');
			$('#weight'+(i+1)).val('');
			$('#grade'+(i+1)).val('');
		}
		calculate();
	});
};




