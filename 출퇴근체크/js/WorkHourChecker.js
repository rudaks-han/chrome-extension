class WorkHourChecker
{
	BASE_URL = 'https://spectra.daouoffice.com';

	// 사용자의 개인설정 정보를 가져온다.
	getUserConfig()
	{
		promiseStorageSync('clock-in-hour')
			.then(() => promiseStorageSync('clock-in-minute'))
			.then(() => {
				return new Promise(function(resolve, reject) {
					setTimeout(function() {
						userConfig['startWorkTime'] = syncStorage['clock-in-hour'] + ':' + syncStorage['clock-in-minute']; // 출근시간
						resolve('success');
					}, 10);
				});
			})
			.then(() => promiseStorageSync('clock-out-hour'))
			.then(() => promiseStorageSync('clock-out-minute'))
			.then(() => {
				return new Promise(function(resolve, reject) {
					setTimeout(function() {
						userConfig['endWorkTime'] = syncStorage['clock-out-hour'] + ':' + syncStorage['clock-out-minute']; // 출근시간
						resolve('success');
					}, 10);
				})
			})
			.then(() => promiseStorageSync('clock-in-before-minute', 'minuteBeforeClockIn'))
			.then(() => promiseStorageSync('clock-out-after-minute', 'minuteAfterClockOut'))
			.then(() => {
				return new Promise(function(resolve, reject) {
					setTimeout(function() {
						resolve('success');
					}, 10);
				})
			});
	}

	// 사용자 세션정보 요청
	/*requestUserSession()
	{
		const userSession = new UserSession();
		userSession.getSession();
		/!*
		let options = {
			method: 'get',
			url: BASE_URL + '/api/user/session',
			success : (res) => {
				sessionUserId = res.data.id;
				sessionUserName = res.data.name;

				log(`>>> 사용자 세션정보 요청 : ${sessionUserName}[${sessionUserId}]`);
			}
		};

		requestAjax(options);*!/
	}*/

	// 해당 달의 달력정보를 가져온다.
	requestCalendar()
	{
		let url = `${this.BASE_URL}/api/calendar/user/me/event/daily?year=${getCurrYear()}&month=${getCurrMonth()}`;

		let options = {
			method: 'get',
			url: url,
			success : (response) => this.requestCalendarCallback(response)
		};

		requestAjax(options);
	}

	// requestCalendar에 대한 Callback
	requestCalendarCallback(response)
	{
		let list = response.data.list;
		for (let i = 0; i < list.length; i++) {
			let datetime = list[i].datetime;
			let eventList = list[i].eventList;

			let date = datetime.substring(0, 10);

			if (eventList.length > 0) {
				for (let j = 0; j < eventList.length; j++) {
					let type = eventList[j].type; // holiday: 휴일, company: 연차/공가)
					let summary = eventList[j].summary; // 연차 : 서형태, 반차: 이승엽(오후), 공가 : 유민(오후)

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

	// chrome.storage.sync에 저장된 정보를 promise로 가져온다.
	/*promiseStorageSync(syncStorageId, userConfigId)
	{
		return new Promise(function(resolve, reject) {
			chrome.storage.sync.get(syncStorageId, function(items) {
				syncStorage[syncStorageId] = items[syncStorageId];
				if (userConfigId) userConfig[userConfigId] = items[syncStorageId];

				resolve('success')
			});
		})
	}*/

	// 출/퇴근시간 체크 시작
	checkStartWorkTime()
	{
		// 주말인지 여부 체크
		if (this.isWeekend())
			return;

		// 공휴일인지 여부 체크
		if (this.isHoliday())
			return;

		// 연차 여부 체크
		if (this.isUserDayOff())
			return;

		// 출근체크 시간범위 안에 들어왔는지 여부 체크
		if (!this.isMarkedClockInAlready() && this.isInRangeClockIn())
		{
			const workHourChecker = new WorkHourMarker();
			workHourChecker.markAsClockIn();
		}

		// 퇴근체크 시간범위 안에 들어왔는지 여부 체크
		if (!this.isMarkedClockOutAlready() && this.isInRangeClockOut())
		{
			const workHourChecker = new WorkHourMarker();
			workHourChecker.markAsClockOut();
		}
	}

	// 이미 출근도장 찍음
	isMarkedClockInAlready()
	{
		log('[출근도장 표시되었는지 체크]')
		let storageClockInDate = getLocalStorage('CLOCK_IN_DATE');

		if (storageClockInDate == getCurrDate()) {
			log('>>> 이미 출근도장이 찍혀져 있습니다.')
			return true;
		} else {
			return false;
		}
	}

	// 이미 퇴근도장 찍음
	isMarkedClockOutAlready()
	{
		log('[퇴근도장 표시되었는지 체크]')
		let storageClockOutDate = getLocalStorage('CLOCK_OUT_DATE');

		if (storageClockOutDate == getCurrDate()) {
			log('>>> 이미 퇴근도장이 찍혀져 있습니다.')
			return true;
		} else {
			return false;
		}
	}

	// 주말인지 체크
	isWeekend()
	{
		log('[주말여부 체크]')
		let currDate = new Date();
		if (currDate.getDay() == 0 || currDate.getDay() == 6) // 토, 일 제외
		{
			log('[' + getCurrDate() + '] 오늘은 주말입니다.');
			return true;
		} else {
			return false;
		}
	}

	// 공휴일인지 체크
	isHoliday()
	{
		log('[공휴일 여부 체크]')
		let currDate = getCurrDate();
		if (holidayList[currDate]) {
			log('>>> [' + getCurrDate() + '] 오늘은 공휴일입니다.');
			return true;
		} else {
			return false;
		}
	}

	// 연차인지 체크
	isUserDayOff()
	{
		log('[개인 연차 여부 체크]')
		let currDate = getCurrDate();
		let todayDayOffList = dayOffList[currDate];

		if (todayDayOffList)
		{
			for (let i = 0; i < todayDayOffList.length; i++) {
				let item = todayDayOffList[i];
				if (item.indexOf(sessionUserName) > -1) {
					if (!(item.indexOf('오전') > -1 || item.indexOf('오후') > -1 || item.indexOf('반차') > -1)) {
						// 연차
						log('>>> 오늘은 연차입니다.');
						return true;
					}
				}
			}
		}
		return false;
	}

	// 반차인지 체크
	isUserDayHalfOff()
	{
		log('[개인 반차 여부 체크]')
		let currDate = getCurrDate();
		let todayDayOffList = dayOffList[currDate];

		if (todayDayOffList)
		{
			for (let i = 0; i < todayDayOffList.length; i++) {
				let item = todayDayOffList[i];
				if (item.indexOf(sessionUserName) > -1) {
					if (item.indexOf('오전') > -1) {
						return '오전';
					} else if (item.indexOf('오후') > -1) {
						return '오후';
					} else if (item.indexOf('반차') > -1) {
						log('>>> 오늘은 반차입니다. (오전/오후 알수 없음) ');
						return '오전';
					}
				}
			}
		}

		return false;
	}

	// 출근시간 전 5분전 부터 출근시간 후 1시간 까지
	isInRangeClockIn()
	{
		log('[출근도장 범위내 여부 체크]')

		// 출근시간 설정값
		let arStartWorkTime = userConfig['startWorkTime'].split(':');
		let startWorkTimeHour = arStartWorkTime[0];
		let startWorkTimeMinute = arStartWorkTime[1];

		// 이전시간 설정값
		let minuteBeforeClockIn = parseInt(userConfig['minuteBeforeClockIn']);

		let date = new Date();

		// 임시코드
		//let date = new Date(2019, 3, 22, 10, 57, 0);

		//let startWorkTimeDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), startWorkTimeHour, startWorkTimeMinute, 0);
		let startWorkTimeDate = this.getCurrentDateWithTime(startWorkTimeHour, startWorkTimeMinute, 0);
		// 출근도장 찍을 시간
		let clockInMarkingTime = null;

		// 반차일 경우 시간 조정
		let userDayHalfOff = this.isUserDayHalfOff();
		if (userDayHalfOff == '오전') {
			clockInMarkingTime = startWorkTimeDate.addMinutes(5 * 60 - minuteBeforeClockIn); // 기준시간 12:55
		} else {
			clockInMarkingTime = startWorkTimeDate.addMinutes(-minuteBeforeClockIn); // 기준시간 07:55
		}

		let outTime = startWorkTimeDate.addMinutes(60); // 기준시간 09:00

		if (date >= clockInMarkingTime) {
			if (date > outTime) {
				log('>>> 출근도장 찍을 유효시간(1시간) 초과됨');
				return false
			} else {
				return true;
			}
		} else {
			log('>>> 출근도장 찍을 시간 아님');
			return false;
		}
	}

	// 퇴근시간 후 5분후 부터 1시간 까지
	isInRangeClockOut()
	{
		log('[퇴근도장 범위내 여부 체크]')

		// 출근시간 설정값
		let arEndWorkTime = userConfig['endWorkTime'].split(':');
		let endWorkTimeHour = arEndWorkTime[0];
		let endWorkTimeMinute = arEndWorkTime[1];

		// 이후시간 설정값
		let minuteAfterClockOut = parseInt(userConfig['minuteAfterClockOut']);

		let date = new Date();

		// 임시코드
		//let date = new Date(2019, 3, 22, 12, 5, 0);

		//let endWorkTimeDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), endWorkTimeHour, endWorkTimeMinute, 0);
		let endWorkTimeDate = this.getCurrentDateWithTime(endWorkTimeHour, endWorkTimeMinute, 0);
		// 퇴근도장 찍을 시간
		let clockOutMarkingTime = null;

		// 반차일 경우 시간 조정
		let userDayHalfOff = this.isUserDayHalfOff();
		if (userDayHalfOff == '오후') {
			clockOutMarkingTime = endWorkTimeDate.addMinutes(-5 * 60 + minuteAfterClockOut); // 기준시간 13:05
		} else {
			clockOutMarkingTime = endWorkTimeDate.addMinutes(minuteAfterClockOut); // 기준시간 15:05
		}

		let outTime = endWorkTimeDate.addMinutes(60); // 기준시간 18:00 (17:00 + 01:00)

		if (date >= clockOutMarkingTime) {
			if (date > outTime) {
				log('>>> 퇴근도장 찍을 유효시간(1시간) 초과됨');
				return false
			} else {
				return true;
			}
		} else {
			log('>>> 퇴근도장 찍을 시간 아님');
			return false;
		}
	}

	getCurrentDateWithTime(hour, minute, second)
	{
		let date = new Date();
		return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, minute, second);
	}
}