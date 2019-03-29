/*
var BASE_URL = 'https://spectra.daouoffice.com';

var checkInterval = 60 * 1000;
var userSessionInterval = 10 * 60 * 1000; // 10분 마다
var calendarCheckInterval = 60 * 60 * 1000; // 1시간 마다

var calendarData = {};
var sessionUserName;
var sessionUserId;

var syncStorage = {};
var userConfig = {}; // 로그인 사용자 정보
var holidayList = {}; // 휴일정보
var dayOffList = {}; // 연차

function init() {
	// 사용여부 체크
	chrome.storage.sync.get('use-flag', function (items) {

		var useFlag = items['use-flag'];

		if (useFlag == 'Y')
		{
			check();
		}
		else
		{
			log('출퇴근 체크가 사용하지 않음으로 설정되어 있습니다.');
		}
	});
}

init();

function check() {
	var promises =
		[
			getUserConfig(),
			requestUserSession(),
			requestCalendar()
		];

	$.when.apply($, promises).then(function () {
		// 세션정보 10분마다 가져온다.
		setInterval(function() {
			requestUserSession();
		}, userSessionInterval);

		// 달력정보 1시간마다 가져온다.
		setInterval(function () {
			requestCalendar();
		}, calendarCheckInterval);

		// 출퇴근시간 체크 (1분마다 체크)
		setInterval(function () {
			checkStartWorkTime();
			// 퇴근 시간 여부 체크
		}, checkInterval);
	});
}

function promiseStorageSync(syncStorageId, userConfigId)
{
	return new Promise(function(resolve, reject) {
		chrome.storage.sync.get(syncStorageId, function(items) {
			syncStorage[syncStorageId] = items[syncStorageId];
			if (userConfigId) userConfig[userConfigId] = items[syncStorageId];

			resolve('success')
		});
	})
}

function getUserConfig() {

	promiseStorageSync('clock-in-hour')
		.then(function() {
			return promiseStorageSync('clock-in-minute')
		})
		.then(function() {
			return new Promise(function(resolve, reject) {
				setTimeout(function() {
					userConfig['startWorkTime'] = syncStorage['clock-in-hour'] + ':' + syncStorage['clock-in-minute']; // 출근시간
					resolve('success');
				}, 10);
			});
		})
		.then(function() {
			return promiseStorageSync('clock-out-hour');
		})
		.then(function() {
			return promiseStorageSync('clock-out-minute')
		})
		.then(function() {
			return new Promise(function(resolve, reject) {
				setTimeout(function() {
					userConfig['endWorkTime'] = syncStorage['clock-out-hour'] + ':' + syncStorage['clock-out-minute']; // 출근시간
					resolve('success');
				}, 10);
			})
		})
		.then(function() {
			return promiseStorageSync('clock-in-before-minute', 'minuteBeforeClockIn');
		})
		.then(function() {
			return promiseStorageSync('clock-out-after-minute', 'minuteAfterClockOut');
		})
		.then(function() {
			return new Promise(function(resolve, reject) {
				setTimeout(function() {
					resolve('success');
				}, 10);
			})
		});
};

function requestUserSession() {
	var options = {
		method: 'get',
		url: BASE_URL + '/api/user/session',
		success : function(res) {
			sessionUserId = res.data.id;
			sessionUserName = res.data.name;

			log('사용자 세션정보 요청 : ' + sessionUserName + '[' + sessionUserId + ']');
		}
	};

	requestAjax(options);
}

function checkStartWorkTime() {
	// 주말인지 여부 체크
	if (isWeekend())
		return;

	// 공휴일인지 여부 체크
	if (isHoliday())
		return;

	// 연차 여부 체크
	if (isUserDayOff())
		return;

	// 출근체크 시간범위 안에 들어왔는지 여부 체크
	if (!isMarkedClockInAlready() && isInRangeClockIn()) {
		clockIn();
	}

	// 퇴근체크 시간범위 안에 들어왔는지 여부 체크
	if (!isMarkedClockOutAlready() && isInRangeClockOut()) {
		clockOut();
	}
}

function requestCalendar() {
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

	var options = {
		method: 'get',
		url: url,
		success : function(res) {
			calendarData = res;

			var list = res.data.list;
			for (var i = 0; i < list.length; i++) {
				var datetime = list[i].datetime;
				var eventList = list[i].eventList;

				var date = datetime.substring(0, 10);

				if (eventList.length > 0) {
					for (var j = 0; j < eventList.length; j++) {
						var type = eventList[j].type; // holiday: 휴일, company: 연차/공가)
						var summary = eventList[j].summary; // 연차 : 서형태, 반차: 이승엽(오후), 공가 : 유민(오후)

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
			}
		}
	};

	requestAjax(options);
}

// 이미 출근도장 찍음
function isMarkedClockInAlready() {
	log('# 출근도장 표시되었는지 체크')
	var storageClockInDate = getStorage('CLOCK_IN_DATE');

	if (storageClockInDate == getCurrDate()) {
		log('이미 출근도장이 찍혀져 있습니다.')
		return true;
	} else {
		return false;
	}
}

// 이미 퇴근도장 찍음
function isMarkedClockOutAlready() {
	log('# 퇴근도장 표시되었는지 체크')
	var storageClockOutDate = getStorage('CLOCK_OUT_DATE');

	if (storageClockOutDate == getCurrDate()) {
		log('이미 퇴근도장이 찍혀져 있습니다.')
		return true;
	} else {
		return false;
	}
}

// 주말인지 체크
function isWeekend() {
	log('# 주말여부 체크')
	var currDate = new Date();
	//currDate = '2019-03-02';
	//currDate = currDate.addDays(2)
	if (currDate.getDay() == 0 || currDate.getDay() == 6) // 토, 일 제외
	{
		log('[' + getCurrDate() + '] 오늘은 주말입니다.');
		return true;
	} else {
		// log('today[' + getCurrDate() + '] is weekday: ');
		return false;
	}
}

// 공휴일인지 체크
function isHoliday() {
	log('# 공휴일 여부 체크')
	var currDate = getCurrDate();
	//currDate = '2019-03-01';

	//console.log(holidayList);
	if (holidayList[currDate]) {
		log('[' + getCurrDate() + '] 오늘은 공휴일입니다.');
		return true;
	} else {
		//log('today[' + currDate + '] is not a holiday: ');
		return false;
	}
}

// 연차인지 체크
function isUserDayOff() {
	log('연차 여부 체크')
	var currDate = getCurrDate();
	var todayDayOffList = dayOffList[currDate];

	if (todayDayOffList)
	{
		for (var i = 0; i < todayDayOffList.length; i++) {
			var item = todayDayOffList[i];
			if (item.indexOf(sessionUserName) > -1) {
				if (!(item.indexOf('오전') > -1 || item.indexOf('오후') > -1 || item.indexOf('반차') > -1)) {
					// 연차
					log('오늘은 연차입니다.');
					return true;
				}
			}
		}
	}
	return false;
}

// 반차인지 체크
function isUserDayHalfOff() {
	log('# 반차 여부 체크')
	//log('이름 : ' + sessionUserName);
	var currDate = getCurrDate();
	//currDate = '2019-03-15';
	//sessionUserName = '서정현'
	var todayDayOffList = dayOffList[currDate];
	//console.log(todayDayOffList);

	if (todayDayOffList)
	{
		for (var i = 0; i < todayDayOffList.length; i++) {
			var item = todayDayOffList[i];
			if (item.indexOf(sessionUserName) > -1) {
				if (item.indexOf('오전') > -1) {
					return '오전';
				} else if (item.indexOf('오후') > -1) {
					return '오후';
				} else if (item.indexOf('반차') > -1) {
					log('오늘은 반차입니다. (오전/오후 알수 없음) ');
					return '오전';
				}
			}
		}
	}

	return false;
}

// 출근시간 전 5분전 부터 출근시간 후 1시간 까지
function isInRangeClockIn() {
	log('# 출근도장 범위내 여부 체크')

	// 출근시간 설정값
	var arStartWorkTime = userConfig['startWorkTime'].split(':');
	var startWorkTimeHour = arStartWorkTime[0];
	var startWorkTimeMinute = arStartWorkTime[1];

	// 이전시간 설정값
	var minuteBeforeClockIn = userConfig['minuteBeforeClockIn'];

	var date = new Date();

	// 임시코드
	//var date = new Date(2019, 3, 22, 10, 57, 0);

	var startWorkTimeDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), startWorkTimeHour, startWorkTimeMinute, 0);
	// 출근도장 찍을 시간
	var clockInMarkingTime = null;

	// 반차일 경우 시간 조정
	var userDayHalfOff = isUserDayHalfOff();
	if (userDayHalfOff == '오전') {
		clockInMarkingTime = startWorkTimeDate.addMinutes(5 * 60 - minuteBeforeClockIn); // 기준시간 12:55
	} else {
		clockInMarkingTime = startWorkTimeDate.addMinutes(-minuteBeforeClockIn); // 기준시간 07:55
	}

	var outTime = startWorkTimeDate.addMinutes(60); // 기준시간 09:00

	// log('date : ' + date);
	// log('clockInMarkingTime : ' + clockInMarkingTime);
	if (date >= clockInMarkingTime) {
		if (date > outTime) {
			log('출근도장 찍을 유효시간(1시간) 초과됨');
			return false
		} else {
			return true;
		}
	} else {
		log('출근도장 찍을 시간 아님');
		return false;
	}
}

// 퇴근시간 후 5분후 부터 1시간 까지
function isInRangeClockOut() {
	log('# 퇴근도장 범위내 여부 체크')

	// 출근시간 설정값
	var arEndWorkTime = userConfig['endWorkTime'].split(':');
	var endWorkTimeHour = arEndWorkTime[0];
	var endWorkTimeMinute = arEndWorkTime[1];

	// 이후시간 설정값
	var minuteAfterClockOut = userConfig['minuteAfterClockOut'];

	var date = new Date();

	// 임시코드
	//var date = new Date(2019, 3, 22, 12, 5, 0);

	var endWorkTimeDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), endWorkTimeHour, endWorkTimeMinute, 0);
	// 퇴근도장 찍을 시간
	var clockOutMarkingTime = null;

	// 반차일 경우 시간 조정
	var userDayHalfOff = isUserDayHalfOff();
	if (userDayHalfOff == '오후') {
		clockOutMarkingTime = endWorkTimeDate.addMinutes(-5 * 60 + minuteAfterClockOut); // 기준시간 13:05
	} else {
		clockOutMarkingTime = endWorkTimeDate.addMinutes(minuteAfterClockOut); // 기준시간 15:05
	}

	var outTime = endWorkTimeDate.addMinutes(60); // 기준시간 18:00 (17:00 + 01:00)

	if (date >= clockOutMarkingTime) {
		if (date > outTime) {
			log('퇴근도장 찍을 유효시간(1시간) 초과됨');
			return false
		} else {
			return true;
		}
	} else {
		log('퇴근도장 찍을 시간 아님');
		return false;
	}
}

function clockIn(showNotification) {
	var currDate = getCurrDate();
	var currTime = getCurrTime();

	var url = BASE_URL + '/api/ehr/attnd/clockin';
	var param = '{"clockInTime": "' + currDate + 'T' + currTime + '.000+09:00"}';

	var options = {
		method: 'put',
		url: url,
		headers: {'TimeZoneOffset': '540'},
		param: param,
		success : function(res) {
			if (res.code == 200)
			{
				// 출근도장 OK
				showNotify('출근도장', sessionUserName + '님, ' + currDate  + ' ' + currTime + '에 출근시간으로 표시되었습니다.');
				saveLocalStorage('CLOCK_IN_DATE', currDate);
				log('[' + currDate + '] 출근도장 OK.')
			}
			else
			{
				// 실패
				showNotify('출근도장', sessionUserName + '님, ' + ' 출근시간 등록 실패!!!.' + ' ==> ' + res.message);
				log('[' + currDate + '] 출근도장 Fail.')
			}
		},
		error : function(xhr) {
			var responseText = JSON.parse(xhr.responseText);

			if (responseText.name == 'common.unauthenticated')
			{
				if (showNotification)
				{
					showNotify('출근도장', "스펙트라 그룹웨어에 로그인 되지 않았습니다. 브라우저에서 로그인 해주시기 바랍니다.");
				}
			}
			else if (responseText.name == 'AlreadyClockInException')
			{
				if (showNotification)
				{
					showNotify('출근도장', sessionUserName + '님, ' + ' 출근시간 등록 실패!!!.' + ' ==> ' + JSON.parse(xhr.responseText).message);
				}
				saveLocalStorage('CLOCK_IN_DATE', currDate);
			}
		},
		complete : function(res) {
		}
	};

	requestAjax(options);

	//var currDate = getCurrDate();
	//saveLocalStorage('CLOCK_IN_DATE', currDate);
	//log('[' + currDate + '] 출근도장 OK.')
	//showNotify('출근도장', sessionUserName + '님, ' + currDate + '에 출근시간으로 표시되었습니다.');

}

function clockOut(showNotification) {
	var currDate = getCurrDate();
	var currTime = getCurrTime();

	var url = BASE_URL + '/api/ehr/attnd/clockout';
	var param = '{"clockOutTime": "' + currDate + 'T' + currTime + '.000+09:00"}';

	var options = {
		method: 'put',
		url: url,
		headers: {'TimeZoneOffset': '540'},
		param: param,
		success : function(res) {
			if (res.code == 200)
			{
				// 퇴근도장 OK
				showNotify('퇴근도장', sessionUserName + '님, ' + currDate  + ' ' + currTime + '에 퇴근시간 체크되었습니다. 즐퇴하세요~');
				saveLocalStorage('CLOCK_OUT_DATE', currDate);
				log('[' + currDate + '] 퇴근도장 OK.')
			}
			else
			{
				// 실패
				showNotify('퇴근도장', sessionUserName + '님, ' + ' 퇴근시간 등록 실패!!!.');
				log('[' + currDate + '] 퇴근도장 Fail.')
			}
		},
		error : function(xhr) {
			var responseText = JSON.parse(xhr.responseText);

			if (responseText.name == 'common.unauthenticated')
			{
				if (showNotification)
				{
					showNotify('출근도장', "스펙트라 그룹웨어에 로그인 되지 않았습니다. 브라우저에서 로그인 해주시기 바랍니다.");
				}
			}
			else if (responseText.name == 'AlreadyClockOutException')
			{
				if (showNotification)
				{
					showNotify('출근도장', sessionUserName + '님, ' + ' 출근시간 등록 실패!!!.' + ' ==> ' + JSON.parse(xhr.responseText).message);
				}
				saveLocalStorage('CLOCK_OUT_DATE', currDate);
			}
		},
		complete : function(res) {
		}
	};

	requestAjax(options);

	//var currDate = getCurrDate();
	//saveLocalStorage('CLOCK_OUT_DATE', currDate);
	//log('[' + currDate + '] 퇴근도장 OK.')
	//showNotify('퇴근도장', sessionUserName + '님, ' + currDate  + ' ' + currTime + '에 퇴근시간 체크되었습니다. 즐퇴하세요~');

}
*/

chrome.storage.onChanged.addListener(function (changes, areaName) {
    for (key in changes) {
        var storageChange = changes[key];
        //console.error('key : ' + key + ' > ' + JSON.stringify(storageChange));
        // key: 키 값
        // areaName: ‘sync’ or ‘local'
        // storageChange.oldValue: 이전 값
        // storageChange.newValue: 변경된 값
    }
});