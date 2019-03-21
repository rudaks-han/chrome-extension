var BASE_URL = 'https://spectra.daouoffice.com';

var checkInterval = 3 * 1000;
var calendarCheckInterval = 60 * 60 * 1000; // 1시간 마다

var holidayDate = {}; // {'2019-03-01':'Y'}

var calendarData = {};
var sessionUserName;
var sessionUserId;

var userConfig = {}; // 로그인 사용자 정보
var holidayList = {}; // 휴일정보
var dayOffList = {}; // 연차
var dayHalfOffList = {}; // 반차

(function() {
	// 사용자 정보 가져오기
    // session 정보
    // 달력정보
    var promises =
        [
        	getUserConfig(),
            requestUserSession(),
            requestCalendar()
        ];

    $.when.apply($, promises);
	
	// 휴일정보 (토/일)

	// 달력정보
	//requestCalendar();

	// 달력정보 1시간마다 가져온다.
	setInterval(function() {
		requestCalendar();
	}, calendarCheckInterval);

	// 출퇴근시간 체크 (1분마다 체크)
    setInterval(function() {
    	checkStartWorkTime();
    	// 퇴근 시간 여부 체크
    }, checkInterval);

    function getUserConfig()
	{
        // userConfig.startWorkTime = '08:00';
        // userConfig.endWorkTime = '17:00';

        userConfig['startWorkTime'] = '08:00';
        userConfig['endWorkTime'] = '17:00';

	};

    function requestUserSession()
	{
        requestAjax('get', BASE_URL + '/api/user/session', null, function(res) {
        	sessionUserId = res.data.id;
        	sessionUserName = res.data.name;

			log('name : ' + sessionUserName);
            log('id : ' + sessionUserId);
        });
	}
    function checkStartWorkTime()
    {
    	console.log('checkStartWorkTime')
    	// 주말여부 체크
        // 공휴일인지 여부 체크
        // 연차 여부 체크 (반차 포함)
        // 출근 시간 여부 체크

		//var currDate = getCurrDate();

		// 주말인지 여부 체크
		if (isWeekend())
			return;
		
		// 공휴일인지 여부 체크
		if (isHoliday())
			return;

		if (isUserDayOff())
			return;

		if (isUserDayHalfOff())
		{

		}
		
		// 개인연차여부 체크/반차 포함
		
		// 출근시간 여부 체크

    	/*console.log('is start work time?');
    	var params = '{"id":' + sessionUserId + ',"timeZone":"Asia/Seoul","locale":"ko","noti":"enable","useAbbroadIpCheck":"false","style":"basic","theme":"THEME_CLASSIC"}';
    	requestAjax('put', BASE_URL + '/api/user/config/' + sessionUserId, params, function(res) {
			//log(res);
    	});*/
    }

    function requestCalendar()
	{
		log('ajax requestCalendar')
		var currDate = new Date();
		var year = currDate.getFullYear();
		var month = currDate.getMonth() + 1;
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
			for (var i=0; i<list.length; i++)
			{
				var datetime = list[i].datetime;
				var eventList = list[i].eventList;

				var date = datetime.substring(0, 10);

				//log('datetime: ' + datetime)
				//log('datetime2: ' + year + '-' + month + '-' + day);


				//if (datetime.startsWith(year + '-' + month + '-' + day))
				//{
					if (eventList.length > 0)
					{
						for (var j=0; j<eventList.length; j++)
						{
							// holiday: 휴일
							// company: 연차/공가
							var type = eventList[j].type;

							// 연차 : 서형태,박경규,한경만
							// 반차 : 이승엽(오후) 유민(오전) or ,로 구분
							// 반차 : 한경만, 박은규(오후)
							// 공가 : 유민(오후)
							var summary = eventList[j].summary;

							if (type == 'holiday')
							{
                                holidayList[date] = type;
							}
							else if (type == 'company')
							{
								if (!dayOffList[date])
									dayOffList[date] = [];

                                dayOffList[date].push(summary);
							}

						}
					}

				//}
			}
		})
	}

	function isWeekend()
	{
		var currDate = new Date();
        //currDate = '2019-03-02';
        //currDate = currDate.addDays(2)
        if (currDate.getDay() == 0 || currDate.getDay() == 6) // 토, 일 제외
		{
			log('today[' + getCurrDate() + '] is weekend: ');
			return true;
		}
		else
		{
           // log('today[' + getCurrDate() + '] is weekday: ');
			return false;
		}
	}

	function isHoliday()
	{
		var currDate = getCurrDate();
        //currDate = '2019-03-01';

        //console.log(holidayList);
        if (holidayList[currDate])
		{
            log('today[' + currDate + '] is holiday: ');
			return true;
		}
		else
		{
            //log('today[' + currDate + '] is not a holiday: ');
			return false;
		}
	}

	function isUserDayOff()
	{
		//log('이름 : ' + sessionUserName);
        //sessionUserName = '신미란';
		//console.log(dayOffList);
		var currDate = getCurrDate();
		var todayDayOffList = dayOffList[currDate];
        //console.log(todayDayOffList);

        for (var i=0; i<todayDayOffList.length; i++)
		{
			var item = todayDayOffList[i];
			if (item.indexOf(sessionUserName) > -1)
			{
                if (!(item.indexOf('오전') > -1 || item.indexOf('오후') > -1 || item.indexOf('반차') > -1))
				{
					// 연차
                    log('today[' + currDate + '] is a day off ');
					return true;
				}
			}
		}

		return false;
	}

	function isUserDayHalfOff()
	{
        //log('이름 : ' + sessionUserName);
        var currDate = getCurrDate();
        //currDate = '2019-03-15';
        //sessionUserName = '서정현'
        var todayDayOffList = dayOffList[currDate];
        //console.log(todayDayOffList);

        for (var i=0; i<todayDayOffList.length; i++)
        {
            var item = todayDayOffList[i];
            if (item.indexOf(sessionUserName) > -1)
            {
            	if (item.indexOf('오전') > -1)
				{
                    log('today[' + currDate + '] is a early day half off ');
					return '오전';
				}
				else if (item.indexOf('오후') > -1)
				{
                    log('today[' + currDate + '] is a late day half off ');
					return '오후';
				}
				else if (item.indexOf('반차') > -1)
				{
                    log('today[' + currDate + '] is a day half off [unknown] ');
					return '오전';
				}
            }
        }

        return false;
	}

    function requestAjax(method, url, params, onSuccess)
    {
    	return $.ajax({
			type: method,
			url: url,
			data: params,
			dataType: "json",
			contentType: "application/json", // request payload로 전송됨
			beforeSend: function(res) {
				console.log('[requestAjax] '+  url)	;
			},
			success: function(res){
				onSuccess(res);
			}
		});
    }

    function log(str)
	{
		console.log(">> " + str);
	}

	function getCurrDate()
	{
        var currDate = new Date();
        var year = currDate.getFullYear();
        var month = (currDate.getMonth() + 1);
        if (month < 10)
            month = '0' + month;
        var day = currDate.getDate();
        if (day < 10)
            day = '0' + day;

        return year + '-' + month + '-' + day;
	}

})();

Date.prototype.addDays = function(days)
{
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}