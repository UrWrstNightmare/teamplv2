/* Today at GBS (Javascript)
Made by Seyun Bae (ninesens@naver.com)
Functions Updated by Jiho Park (jihopark7777@gmail.com)
*/

function checkOnly(value) {
	var obj= document.getElementsByName("timetableGrade");
	for(var i=0; i<obj.length; i++){
		if(obj[i]!=value){
			obj[i].checked=false;
		}
	};
}

/* Cookie */
function setCookie(name, value){
	document.cookie=name+'='+escape(value);
}

function getCookie(cookie_name) {
	var x, y;
	var val = document.cookie.split(';');

	for (var i = 0; i < val.length; i++) {
    	x = val[i].substr(0, val[i].indexOf('='));
		y = val[i].substr(val[i].indexOf('=') + 1);
		x = x.replace(/^\s+|\s+$/g, '');
		if (x == cookie_name) {
			return unescape(y);
		}
	}
	return undefined;
}

function setCookieTimetable() {
	var period=365;
	var Grade=document.getElementById("Grade").value;
	var Class=document.getElementById("Class").value;
	var exdate=new Date();
	exdate.setDate(exdate.getDate()+period);
	var cookieValueGrade=escape(Grade) + ((period == null) ? '' : ';    expires=' + exdate.toUTCString());
	var cookieValueClass=escape(Class) + ((period == null) ? '' : ';    expires=' + exdate.toUTCString());
	document.cookie = 'timetableGrade' + '=' + cookieValueGrade;
	document.cookie = 'timetableClass' + '=' + cookieValueClass;
}

function setCookieShortSubjectName() {
	var period=365;
	if(document.getElementById("shortSubjectName").value==null||0) {
		var shortSubjectName=0;
	}
	else {
		var shortSubjectName=document.getElementById("shortSubjectName").value;
	}
	var exdate=new Date();
	exdate.setDate(exdate.getDate()+period);
	var cookieValueShortSubjectName=escape(shortSubjectName) + ((period == null) ? '' : ';    expires=' + exdate.toUTCString());
	document.cookie = 'shortSubjectName' + '=' + cookieValueShortSubjectName;
}

function InputShortSubjectNameDefault() {
	if(!document.getElementById("shortSubjectName")) return;
	if(getCookie('shortSubjectName')!=null) {
		var shortSubjectName=getCookie('shortSubjectName');
	   }
	else {
		var shortSubjectName=0;
	}
	document.getElementById("shortSubjectName").defaultValue=shortSubjectName;
}
InputShortSubjectNameDefault();

/* Timetable */
function InputGradeDefault() {
	if(!document.getElementById("Grade")) return;
	if(getCookie('timetableGrade')!=null) {
		var Grade=getCookie('timetableGrade');
	   }
	else {
		var Grade=1;
	}
	document.getElementById("Grade").defaultValue=Grade;
}

function InputClassDefault() {
	if(!document.getElementById("Class")) return;
	if(getCookie('timetableClass')!=null) {
		var Class=getCookie('timetableClass');
	   }
	else {
		var Class=1;
	}
	document.getElementById("Class").defaultValue=Class;
}

let modalContent = {};

function viewTimetable() {
	if(!document.getElementById("timetableSurrounding")) return;
	if(getCookie('timetableGrade')!=null) {
		var Grade=getCookie('timetableGrade');
		var Class=getCookie('timetableClass');
	   }
	else {
		var Grade=Number(document.getElementById("Grade").value);
		var Class=Number(document.getElementById("Class").value);
	}
	var scheduleURL="https://sada.gbshs.kr/today/data/schedule.json";
	let dailyChangeLog="https://sada.gbshs.kr/today/data/changeLog.json";
	let hourlyChangeLog="https://sada.gbshs.kr/today/data/HourlyLog.json";
	$.getJSON(scheduleURL,function(data){
		var html='';
		html+='<table class="timetable"><tbody>';
		html+='<tr>';
		html+='<th class="timetableWeekday"></th><th class="timetableWeekday">월</th><th class="timetableWeekday">화</th><th class="timetableWeekday">수</th><th class="timetableWeekday">목</th><th class="timetableWeekday">금</th>';
		html+='</tr>';
		for(let i=0; i<=7; i++) {
				//교시
			html+='<tr>';
			i++;
			html+='<th class="timetablePeriod">'+i+'</th>'
			i--;
			for(let j=0; j<=4; j++) {
				//날짜
				//data[학년][반][날짜0][교시0]
				html+='<td class="timetableCell" id="cell-'+j+'-'+i+'">';
				if(data[Grade][Class][j][i]!=null){
					if(data[Grade][Class][j][i].subject!="*") {
						html+=data[Grade][Class][j][i].subject;
					}
					html+='<br>';
					html+='<label class="teacherName">'+data[Grade][Class][j][i].teacher+'</label>';
				}
				html+='</td>';
			}
			html+='</tr>';
		}
		html+='</tbody></table>';
		for(var i=1; i<=15; i++) {
			html=html.replace(" t","");
			html=html.replace("운동과건겅","운동과건강");
		}
		if(getCookie('shortSubjectName')==1) html=timetableShortSubjectNameReplace(html);
		document.getElementById('timetableSurrounding').innerHTML=html;
	})
	.done(function(){
		$.getJSON(dailyChangeLog, function(data){
			modalContent = {};
			if(data.affectedClasses.includes(Number(Grade+Class))){
				console.info("Found changed classes for class-id: " + (Grade+Class));
				let changeList=data.changedClass[Grade][Class].changes;
				//console.log(changeList);
				for(let obj of changeList){
					console.log(obj);
					let selector = "#cell-"+(Number(obj.after.weekday)-1)+"-"+(Number(obj.after.class_time)-1);
					console.log(selector);
					$(selector).toggleClass("timetableCellChanged");
					let importance = "imp-" + obj.importance;
					modalContent[selector] = {};
					modalContent[selector].importance = obj.importance;
					modalContent[selector].weekday = obj.after.weekdayString;
					modalContent[selector].period = Number(obj.period)+1;
					modalContent[selector].type = obj.type;
					modalContent[selector].classChangeSubject = obj.before.subject + "->" + obj.after.subject;
					if(obj.after.subject == ""){
						modalContent[selector].classChangeSubject = obj.before.subject + " 수업이 취소되었습니다"
					}
					modalContent[selector].classChangeTeacher = "<br><label class='teacherName-modal'>"+obj.before.teacher+"->"+obj.after.teacher+"</label>";
					if(obj.after.teacher =="  *"){
						modalContent[selector].classChangeTeacher = "<br><label class='teacherName-modal'>"+obj.before.teacher+" 선생님도 쉬셔야죠 :)</label>";
					}
					$(selector).toggleClass(importance);
					$(selector).on("click", function(e){ //jQuery Listener
						console.log("Opening Modal: #" + e.target.id);
						openModal("#"+e.target.id);
					});
				}
			}else{
				console.info("There are no changed classes for class-id: " + (Grade+Class));
			}
		});
		$.getJSON(hourlyChangeLog, function(data){
			if(data.affectedClasses.includes(Number(Grade+Class))){
				console.info("Found changed classes for class-id: " + (Grade+Class));
				let changeList=data.changedClass[Grade][Class].changes;
				//console.log(changeList);
				for(let obj of changeList){
					console.log(obj);
					let selector = "#cell-"+(Number(obj.after.weekday)-1)+"-"+(Number(obj.after.class_time)-1);
					console.log(selector);
					$(selector).toggleClass("timetableCellChanged");
					let importance = "imp-" + obj.importance;
					modalContent[selector] = {};
					modalContent[selector].importance = obj.importance;
					modalContent[selector].weekday = obj.after.weekdayString;
					modalContent[selector].period = obj.period;
					modalContent[selector].type = obj.type;
					modalContent[selector].classChangeSubject = obj.before.subject + "->" + obj.after.subject;
					if(obj.after.subject == ""){
						modalContent[selector].classChangeSubject = obj.before.subject + " 수업이 취소되었습니다";
					}
					modalContent[selector].classChangeTeacher = "<br><label class='teacherName-modal'>"+obj.before.teacher+"->"+obj.after.teacher+"</label>";
					if(obj.after.teacher =="  *"){
						modalContent[selector].classChangeTeacher = "<br><label class='teacherName-modal'>"+obj.before.teacher+" 선생님도 쉬셔야죠 :)</label>";
					}
					$(selector).toggleClass(importance);
					$(selector).on("click", function(e){ //jQuery Listener
						console.log("Opening Modal: #" + e.target.id);
						openModal("#"+e.target.id);
					});
				}
			}else{
				console.info("There are no changed classes for class-id: " + (Grade+Class));
			}
		});
	});
}

function openModal(targetId){
	if(!modalContent.hasOwnProperty(targetId)){
		console.log("Warning! No Modal Data Found... This may be a timing error!");
		return;
	}
	let obj = modalContent[targetId];
	// Get the modal
	let modal = document.getElementById("infoModal");

	// Get the <span> element that closes the modal
	let span = document.getElementsByClassName("close")[0];
	
	$("#modal-header-text").text(obj.weekday+"요일 "+obj.period + "교시 (" + obj.importance+ ")");
	$("#modal-body-text").html(obj.classChangeSubject + obj.classChangeTeacher);
	$("#modal-footer-text").text(obj.type);
	// When the user clicks on the button, open the modal
  	modal.style.display = "block";


	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
  		modal.style.display = "none";
	}

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
  		if (event.target == modal) {
    		modal.style.display = "none";
  		}
	}
	
}

function timetableShortSubjectNameReplace(html) {
	for(var i=1; i<=60; i++) {
		// 국어
		// 수학
		html=html.replace("심화수학II","수학");
		html=html.replace("AP미적분학I","수학");
		// 사회
		html=html.replace("통합사회","사회");
		html=html.replace("정치와법","사회");
		// 역사
		html=html.replace("한국사","역사");
		// 과학
		html=html.replace("통합과학","과학");
		// 물리
		html=html.replace("고급물리학","물리");
		html=html.replace("물리학II","물리");
		html=html.replace("AP일반물리학","물리");
		// 화학
		html=html.replace("고급화학 t","화학");
		html=html.replace("화학 t","화학");
		html=html.replace("고급화학","화학");
		html=html.replace("화학II t","화학");
		html=html.replace("화학II","화학");
		html=html.replace("AP일반화학","화학");
		// 생물
		html=html.replace("고급생명과학","생물");
		html=html.replace("AP일반생물학","생물");
		html=html.replace("생명과학II","생물");
		html=html.replace("심화생명과학","생물");
		// 지학
		html=html.replace("고급지구과학","지학");
		html=html.replace("일반지구과학","지학");
		html=html.replace("지구과학II","지학");
		html=html.replace("지구환경과우주론","지학");
		// 정보
		html=html.replace("정보과학","정보");
		html=html.replace("정보과학세미나Ⅰ","정보");
		html=html.replace("정보세미나Ⅰ","정보");
		// 영어
		html=html.replace("영어I","영어");
		html=html.replace("영어Ⅱ","영어");
		// 중어
		html=html.replace("중국어I","중어");
		// 음악
		// 체육
		html=html.replace("운동과건겅","체육");
		html=html.replace("운동과건강","체육");
		html=html.replace("스포츠생활","체육");
		// 진로
		html=html.replace("진로와직업","진로");
	}
	return html;
}


/* Dailymeal */
function mealTextReplace(html) {
	for(var i=1; i<=20; i++) {
		html=html.replace("10.", "<label class=\"allergyInfo\">10</label>");
		html=html.replace("11.", "<label class=\"allergyInfo\">11</label>");
		html=html.replace("12.", "<label class=\"allergyInfo\">12</label>");
		html=html.replace("13.", "<label class=\"allergyInfo\">13</label>");
		html=html.replace("14.", "<label class=\"allergyInfo\">14</label>");
		html=html.replace("15.", "<label class=\"allergyInfo\">15</label>");
		html=html.replace("16.", "<label class=\"allergyInfo\">16</label>");
		html=html.replace("17.", "<label class=\"allergyInfo\">17</label>");
		html=html.replace("18.", "<label class=\"allergyInfo\">18</label>");
	}
	for(var i=1; i<=20; i++) {
		html=html.replace("(과)","");
		html=html.replace("(조)","");
		html=html.replace("(중)","");
		html=html.replace("(석)","");
		html=html.replace("(조식)","");
		html=html.replace("(중식)","");
		html=html.replace("(석식)","");
		html=html.replace("(조,과)","");
		html=html.replace("(중,과)","");
		html=html.replace("(석,과)","");
		html=html.replace("(완)","");
		html=html.replace("(완,과)","");
		html=html.replace("1과","");
		html=html.replace("(1과)","");
		html=html.replace("-1과","");
		html=html.replace("1발","");
		html=html.replace("(1발)","");
		html=html.replace("*", "");
		html=html.replace("1.", "<label class=\"allergyInfo\">1</label>");
		html=html.replace("2.", "<label class=\"allergyInfo\">2</label>");
		html=html.replace("3.", "<label class=\"allergyInfo\">3</label>");
		html=html.replace("4.", "<label class=\"allergyInfo\">4</label>");
		html=html.replace("5.", "<label class=\"allergyInfo\">5</label>");
		html=html.replace("6.", "<label class=\"allergyInfo\">6</label>");
		html=html.replace("7.", "<label class=\"allergyInfo\">7</label>");
		html=html.replace("8.", "<label class=\"allergyInfo\">8</label>");
		html=html.replace("9.", "<label class=\"allergyInfo\">9</label>");
		html=html.replace("\n", "<br>");
		html=html.replace("<br><br>", "<br>");
		html=html.replace("</h3><br>", "</h3>");
	}
	html=html.replace("\n", "");
	return html;
}

function viewDailymeal() {
	if(!document.getElementById("dailymealSurrounding")) return;
	var dailymealURL="https://sada.gbshs.kr/today/data/dailyMeal.json";
	$.getJSON(dailymealURL,function(data){
		var html='<table class="dailymeal"><tbody><tr>';
		if(data.meal===" "||"") html+="<p class=\"noMealExist\">오늘은 급식이 없습니다.</p>";
		html+=data.meal;
		html+='#end';
		html=html.replace("[조식]", "<td class=\"dailymealMeal\"><h3>조식</h3>");
		html=html.replace("[중식]\n", "</td><td class=\"dailymealMeal\"><h3>중식</h3>");
		html=html.replace("[석식]\n", "</div><td class=\"dailymealMeal\"><h3>석식</h3>");
		html=html.replace("#end", "</td>");
		html=mealTextReplace(html);
		html+="</tr></tbody></table>"
		document.getElementById('dailymealSurrounding').innerHTML=html;
	});
}

/* Schedule */
function viewSchedule() {
	if(!document.getElementById("scheduleSurrounding")) return;
	var ScheduleURL="https://sada.gbshs.kr/today/data/monthlySchedule.json";
	$.getJSON(ScheduleURL,function(data){
		var html='<table class="schedule"><tbody><tr><td class="scheduleWeekday">일</td><td class="scheduleWeekday">월</td><td class="scheduleWeekday">화</td><td class="scheduleWeekday">수</td><td class="scheduleWeekday">목</td><td class="scheduleWeekday">금</td><td class="scheduleWeekday">토</td></tr>';
		var today=new Date();
		var startWeekday=new Date(today.getYear(), today.getMonth()+1, 1).getDay();
		var lastDate=new Date(today.getYear(), today.getMonth()+1, 0).getDate();
		if(startWeekday!=0) html+='<tr>';
		for(var i=1; i<=startWeekday; i++) html+='<td class="scheduleCell"></td>';
		for(var i=1; i<=lastDate; i++) {
			if(new Date(today.getYear(), today.getMonth()+1, i).getDay()==0) html+='<tr>';
			html+='<td class="scheduleCell" onClick="viewDetailSchedule('+i+')">';
			if(today.getDate()==i) {
				html+='<div class="scheduleCellDay scheduleCellDayToday">'+i+'</div>';
			}
			else {
				html+='<div class="scheduleCellDay">'+i+'</div>';
			}
			if(data[i]!='') {
				html+='<div class="scheduleCellScheduleExist"></div>';
			}
			html+='</td>';
			if(new Date(today.getYear(), today.getMonth()+1, i).getDay()==6) html+='</tr>';
		}
		html+="</tr></tbody></table>"
		document.getElementById('scheduleSurrounding').innerHTML=html;
	});
	viewDetailSchedule(new Date().getDate());
}

function viewDetailSchedule(date) {
	if(!document.getElementById("detailScheduleSurrounding")) return;
	var ScheduleURL="https://sada.gbshs.kr/today/data/monthlySchedule.json";
	$.getJSON(ScheduleURL,function(data){
		var html='<table class="detailSchedule"><tbody><tr>';
		const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		html+='<td class="detailScheduleDate">'+monthNames[new Date().getMonth()]+' '+date+'</td>';
		if(data[date]!="") {
			html+='<td class="detailScheduleDescription">'+data[date]+'</td></tr></tbody></table>';
		}
		else {
			html+='<td class="detailScheduleDescription">일정 없음</td></tr></tbody></table>';
		}
		document.getElementById('detailScheduleSurrounding').innerHTML=html;
	});
}

function viewUpcomingSchedule(date) {
	if(!document.getElementById("upcomingScheduleSurrounding")) return;
	var ScheduleURL="https://sada.gbshs.kr/today/data/monthlySchedule.json";
	$.getJSON(ScheduleURL,function(data){
		const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		var html='<table class="upcomingSchedule"><tbody>';
		for (var i=date; i<=date+2; i++) {
			html+='<tr><td class="upcomingScheduleDate">'+i+'</td>';
			if(data[i]!="") {
				html+='<td class="upcomingScheduleDescription">'+data[i]+'</td></tr>';
			}
			else {
				html+='<td class="upcomingScheduleDescription">일정 없음</td></tr>';
			}
		}
		html+='</tbody></table>';
		document.getElementById('upcomingScheduleSurrounding').innerHTML=html;
	});
}


/* Feed */
function viewFeedTimetable() {
	if(!document.getElementById("feedTimetableSurrounding")) return;
	if(getCookie('timetableGrade')!=null) {
		var Grade=getCookie('timetableGrade');
		var Class=getCookie('timetableClass');
	   }
	else {
		var Grade=1;
		var Class=1;
	}
	var scheduleURL="https://sada.gbshs.kr/today/data/schedule.json";
	$.getJSON(scheduleURL,function(data){
		var html='';
		j=new Date().getDay()-1;
		if(j==1||5) {
			html+='<div class="feedTimetableWeekdaySS">다음 주 월요일</div>'
			j=0;
		}
		html+='<table class="timetable"><tbody>';
		html+='<tr>';
		html+='<th class="timetableWeekday">교시</th><th class="timetableWeekday">1</th><th class="timetableWeekday">2</th><th class="timetableWeekday">3</th><th class="timetableWeekday">4</th><th class="timetableWeekday">5</th><th class="timetableWeekday">6</th><th class="timetableWeekday">7</th>';
		html+='</tr><tr><td></td>';
		for(let i=0; i<=6; i++) {
				//data[학년][반][날짜0][교시0]
				html+='<td class="timetableCell">';
				if(data[Grade][Class][j][i]!=null){
					if(data[Grade][Class][j][i].subject!="*") {
						html+=data[Grade][Class][j][i].subject;
					}
					html+='<br>';
					html+='<label class="teacherName">'+data[Grade][Class][j][i].teacher+'</label>';
				}
				html+='</td>';
		}
		html+='</tr></tbody></table>';
		html=timetableShortSubjectNameReplace(html);
		document.getElementById('feedTimetableSurrounding').innerHTML=html;
	});
}

function viewFeedDailymeal() {
	if(!document.getElementById("feedDailymealSurrounding")) return;
	var dailymealURL="https://sada.gbshs.kr/today/data/dailyMeal.json";
	$.getJSON(dailymealURL,function(data){
		var hour=new Date().getHours();
		var html='<table class="dailymeal"><tbody><tr>';
		if(data.meal===" "||"") html+="<p class=\"noMealExist\">오늘은 급식이 없습니다.</p>";
		html+=data.meal;
		html+='#end';
		if(hour<=8) {
			html=html.replace("[조식]", "<td class=\"dailymealMeal\"><h3>조식</h3>");
			html=html.replace("[중식]\n", "</td><td class=\"dailymealMeal dailymealMealnoDisplay\"><h3>중식</h3>");
			html=html.replace("[석식]\n", "</div><td class=\"dailymealMeal dailymealMealnoDisplay\"><h3>석식</h3>");
		}
		else if(hour<=12) {
			html=html.replace("[조식]", "<td class=\"dailymealMeal dailymealMealnoDisplay\"><h3>조식</h3>");
			html=html.replace("[중식]\n", "</td><td class=\"dailymealMeal\"><h3>중식</h3>");
			html=html.replace("[석식]\n", "</div><td class=\"dailymealMeal dailymealMealnoDisplay\"><h3>석식</h3>");
		}
		else {
			html=html.replace("[조식]", "<td class=\"dailymealMeal dailymealMealnoDisplay\"><h3>조식</h3>");
			html=html.replace("[중식]\n", "</td><td class=\"dailymealMeal dailymealMealnoDisplay\"><h3>중식</h3>");
			html=html.replace("[석식]\n", "</div><td class=\"dailymealMeal\"><h3>석식</h3>");
		}
		html=html.replace("#end", "</td>");
		html=mealTextReplace(html);
		html+="</tr></tbody></table>"
		document.getElementById('feedDailymealSurrounding').innerHTML=html;
	});
}

/* Excute */
viewFeedTimetable();
viewFeedDailymeal();
InputGradeDefault();
InputClassDefault();
viewTimetable();

viewDailymeal();

viewSchedule();
viewUpcomingSchedule(new Date().getDate());