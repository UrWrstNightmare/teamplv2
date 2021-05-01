<!DOCTYPE html>
<html lang="ko">
	<head>
		<?php include $_SERVER['DOCUMENT_ROOT']."/include/preload-head.php" ?>
		<link href="/today/todayStyle.css" rel="stylesheet" type="text/css">
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
		<title>Today | SADA</title>
        <!-- The core Firebase JS SDK is always required and must be listed first -->
        <script src="https://www.gstatic.com/firebasejs/7.24.0/firebase-app.js"></script>

        <!-- TODO: Add SDKs for Firebase products that you want to use
             https://firebase.google.com/docs/web/setup#available-libraries -->
        <script src="https://www.gstatic.com/firebasejs/7.24.0/firebase-analytics.js"></script>
        <script src="https://www.gstatic.com/firebasejs/7.24.0/firebase-messaging.js"></script>
        <script src="https://unpkg.com/ionicons@5.2.3/dist/ionicons.js"></script>


        <script>
            // Your web app's Firebase configuration
            // For Firebase JS SDK v7.20.0 and later, measurementId is optional
            var firebaseConfig = {
                apiKey: "AIzaSyBEfGbjOzxpOv_fqvBRj3tu6y1F9PEmxM0",
                authDomain: "sada-web-a803e.firebaseapp.com",
                databaseURL: "https://sada-web-a803e.firebaseio.com",
                projectId: "sada-web-a803e",
                storageBucket: "sada-web-a803e.appspot.com",
                messagingSenderId: "46252028401",
                appId: "1:46252028401:web:c1bc22b072bba2aa241450",
                measurementId: "G-VCYWVHY5V4"
            };
            // Initialize Firebase
            firebase.initializeApp(firebaseConfig);
            firebase.analytics();

            const messaging = firebase.messaging();
            messaging.requestPermission()
            .then(function() {
                console.log('Have permission');
                return messaging.getToken();
            })
            .then(function(token){
                console.log(token); //save to server to push messages!
            })
            .catch(function(err){
                console.log('Error Occurred');
            });

            messaging.onMessage(function(payload){
                console.log('onMessage: ', payload);
            })
        </script>
	</head>
<body>

<?php include $_SERVER['DOCUMENT_ROOT']."/include/header-ko.php" ?><br>
<style>
    ::-webkit-scrollbar{
        width: 0px;
        background: transparent;
    }

    .speech-bubble-container{
        position: absolute;
        width: 100vw;
        margin: 0 0 0 -15px;
        padding: 0;
    }

    .speech-bubble {
        position: relative;
        background: #00aabb;
        border-radius: .4em;
        width: 100px;
        height: 50px;
        float: right;
        margin-right: 23px;
        margin-top: 8px;
    }

    .speech-bubble:after {
        content: '';
        position: absolute;
        top: 0;
        left: 80%;
        width: 0;
        height: 0;
        border: 20px solid transparent;
        border-bottom-color: #00aabb;
        border-top: 0;
        border-left: 0;
        margin-left: -10px;
        margin-top: -20px;
    }
</style>

<!-- View Schedule TODO: MAKE THIS MODULAR, and add viewSchedule.php -->
<script>
    function openScheduleWindow(){
        document.body.style.overflow = 'hidden';
        $("#viewSchedule").show();
        $("#quickSettings").hide();
        $("#viewSchedule").removeClass('viewSchedule-deAnimate');
        $("#viewSchedule").addClass('viewSchedule-animate');
    }
    function closeScheduleWindow(){
        $("#viewSchedule").removeClass('viewSchedule-animate');
        $("#viewSchedule").addClass('viewSchedule-deAnimate');
        setTimeout(() => {  $("#viewSchedule").hide();}, 50);
        $("#quickSettings").show();


        document.body.style.overflow = 'auto';

    }
</script>
<style>
    @keyframes zoomIn {
        0% {
            opacity: 0;
            vertical-align: center;
        }
        100% {
            opacity: 1;
            vertical-align: unset;
        }
    }
    /* [2] Transition property for smooth transformation of images */
    #viewSchedule {
        transition: transform .5s ease;
    }

    /* [3] Finally, transforming the image when container gets hovered */
    .viewSchedule-animate {
       animation: zoomIn .1s forwards;
    }
    .viewSchedule-deAnimate{
        animation: zoomIn 50ms backwards;
    }
</style>
<!--
<div id="viewSchedule" style="position: fixed; visibility: hidden;">
    <object data="/today/scheduleApplet/html/iframe.html" style="overflow-y: hidden; position: absolute; left: 0px; right: 0px; width: 100vw; height: 100vh; margin: auto; float: left;">

        <embed src="/today/scheduleApplet/html/iframe.html" overflow="hidden" width="100vw" height="100vh"> </embed>
        CloudPlay Schedule Viewer을 로딩하는데 오류가 발생하였습니다! [-LDA500]
    </object>
</div>
-->
<div id="viewSchedule" style="position: fixed; ">
    <object data="/today/settingApplet/modal.html" style="overflow-y: hidden; position: absolute; left: 0px; right: 0px; width: 100vw; height: 100vh; margin: auto; float: left;">

        <embed src="/today/settingApplet/modal.html" overflow="hidden" width="100vw" height="100vh"> </embed>
        Night CloudPlay Settings Viewer을 로딩하는데 오류가 발생하였습니다! [-LDA500]
    </object>
</div>
<!-- -->
	<div class="feed-main-banner">
	 	<h1>Feed <ion-icon onclick="openQuickSettings();" id="quickSettings" name="options" style="float: right; width: 25px; border-style: solid; border-radius: 50%; box-shadow: 0px 0px 21px -4px rgba(0,0,0,0.75);
;padding: 0px 5px;"></ion-icon></h1>
        <div class="speech-bubble-container">
            <div class="speech-bubble"></div>
        </div>
		<h1 class="main-date"><?php $dateString = date("l, M j", time()); echo $dateString; ?></h1>
	</div>
	<script>
        function openQuickSettings(){
            console.log("Click!");
            openScheduleWindow();
        }

		$(document).ready(function() {
			$("#viewSchedule").hide();
		})
	</script>

<!--
	<div id="animationBanner" class="banner" style="overflow: hidden;">
		<div><h3>개발 중</h3><p>5월 공개 예정</p></div>
	</div>
-->
	<!--
	<div id="feedTimetable" class="timetableBanner banner">
		<div class="feedTimetableTitle">시간표</div>
		<div id="feedTimetableSurrounding">로드 중</div>
	</div>
	-->
<!--
<button onclick="openScheduleWindow();">
    openModal
</button>
-->
	<div id="feedDailymeal" class="dailymealBanner banner">
		<div class="feedDailymealTitle">급식</div>
		<div id="feedDailymealSurrounding">로드 중</div>
	</div>
	<div id="feedUpcomingSchedule" class="upcomingScheduleBanner banner">
		<div class="upcomingScheduleTitle">Upcoming</div>
		<div id="upcomingScheduleSurrounding">로드 중</div>
	</div>
	<div class="banner">
		<h2>공지사항</h2>
		- 현재 개발 중인 사이트입니다. 4월 16일 런칭 예정입니다.<br>
		- 학년 및 학급 일정(과제, 수행 등) 추가 예정입니다. 학생 User가 일정 추가할 수 있도록 개발 중입니다.<br>
		- 400kbps 환경에서는 사이트 로딩 속도가 느릴 수 있습니다. Caching, SVG, JS 최적화 중입니다.<br>
		- 라이트 모드 현재 미지원 상태입니다. (Dark apparence only) 곧 지원됩니다.
	</div>
	<div class="banner">
		<h4>면책 조항</h4>
		SADA에서 운영하는 Today at GBS의 모든 정보는 교육청 및 학교 홈페이지, 컴시간에서 정기적으로 수집하는 정보로, 정보가 누락되거나 실시간으로 반영되지 않을 가능성이 있습니다. SADA에서는 이로 인해 발생하는 수업 결손 및 지각 등의 차질에 관해 책임을 지지 않습니다.
	</div>
	<div class="banner">
		<h2>설정</h2>
		<button class="black-button" onClick=location.href="/today/setting.php">상세 설정</button>
	</div>

<?php include $_SERVER['DOCUMENT_ROOT']."/today/layout/navigation-bar.php" ?>
<?php include $_SERVER['DOCUMENT_ROOT']."/include/footer-ko.php" ?>
	<script src="/today/todayScript.js"></script>
</body>
</html>