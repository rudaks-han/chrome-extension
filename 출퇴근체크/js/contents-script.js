var BASE_URL = 'https://spectra.daouoffice.com';

var checkInterval = 3 * 1000;
var calendarCheckInterval = 60 * 60 * 1000; // 1시간 마다

var holidayDate = {}; // {'2019-03-01':'Y'}

var calendarData = {};

(function() {
	// 휴일정보 (토/일)

	// 달력정보
	requestCalendar();

	setInterval(function() {
		requestCalendar();
	}, calendarCheckInterval);

    setInterval(function() {
    	//console.log('interval');
    	// 공휴일인지 여부 체크
    	// 연차 여부 체크 (반차 포함)
    	// 출근 시간 여부 체크
    	checkIfStartWorktime();
    	// 퇴근 시간 여부 체크
    }, checkInterval);

    function checkIfStartWorktime()
    {
    	console.log('is start work time?');
    	var params = '{"id":7667,"timeZone":"Asia/Seoul","locale":"ko","noti":"enable","useAbbroadIpCheck":"false","style":"basic","theme":"THEME_CLASSIC"}';
    	requestAjax('put', BASE_URL + '/api/user/config/7667', params, function(res) {
			log(res);
    	});
    }

    function requestCalendar()
	{
		log('ajax requestCalendar')
		var currDate = new Date();
		var year = currDate.getFullYear();
		var month = currDate.getMonth();
		if (month < 10)
			month = '0' + month;
		var day = currDate.getDate();
		if (day < 10)
			day = '0' + day;

		var url = BASE_URL + '/api/calendar/user/me/event/daily?year=' + year + '&month=' + month;

		var currDate = new Date();
		requestAjax('get', url, null, function(res) {
			//console.error(JSON.stringify(res));
			calendarData = res;

			var list = res.data.list;
			console.error(list.length)
			for (var i=0; i<list.length; i++)
			{
				var datetime = list[i].datetime;
				var eventList = list[i].eventList;

				//log('datetime: ' + datetime)
				//log('datetime2: ' + year + '-' + month + '-' + day);
				if (datetime.startsWith(year + '-' + month + '-' + day))
				{
					if (eventList.length > 0)
					{
						for (var j=0; j<eventList.length; j++)
						{
							// holiday: 휴일
							// company: 연차
							// company: 공
							var type = eventList[j].type;

							// 연차 : 서형태,박경규,한경만
							// 반차 : 이승엽(오후) 유민(오전) or ,로 구분
							// 반차 : 한경만, 박은규(오후)
							// 공가 : 유민(오후)
							var summary = eventList[j].summary;
						}
					}

				}
			}
		})
	}


    function requestAjax(method, url, params, onSuccess)
    {
    	$.ajax({
			type: method,
			url: url,
			data: params,
			dataType: "json",
			contentType: "application/json", // request payload로 전송됨
			success: function(res){
				onSuccess(res);
			}
		});
    }

    function log(str)
	{
		console.log(">> " + str);
	}

})();

