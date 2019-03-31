class WorkHourMarker
{
	BASE_URL = 'https://spectra.daouoffice.com';

	// 출근하기
	markAsClockIn()
	{
		let currDate = getCurrDate();
		let currTime = getCurrTime();

		let url = this.BASE_URL + '/api/ehr/attnd/clockin';
		//let param = '{"clockInTime": "' + currDate + 'T' + currTime + '.000+09:00"}';
		let param = `{"clockInTime": "${currDate}T${currTime}.000+09:00"}`;

		let options = {
			method: 'put',
			url: url,
			headers: {'TimeZoneOffset': '540'},
			param: param,
			success : (res) => {
				if (res.code == 200)
				{
					// 출근도장 OK
					showNotify('출근도장', `${sessionUserName}님, ${currDate} ${currTime}에 출근시간으로 표시되었습니다.`);
					saveLocalStorage('CLOCK_IN_DATE', currDate);
					firebaseApp.writeLog(currDate, sessionUserName, '출근시간', `시간: ${currTime}`);
					log('>>> [' + currDate + '] 출근도장 OK.')
				}
				else
				{
					// 실패
					showNotify('출근도장', `${sessionUserName}님, 출근시간 등록 실패!!!. ==> ${res.message}`);
					log('>>> [' + currDate + '] 출근도장 Fail.')
				}
			},
			error : (xhr) => {
				let responseText = JSON.parse(xhr.responseText);

				this.handleError(responseText.name);
				/*
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
						//showNotify('출근도장', sessionUserName + '님, ' + ' 출근시간 등록 실패!!!.' + ' ==> ' + JSON.parse(xhr.responseText).message);
						showNotify('출근도장', `${sessionUserName}님, 출근시간 등록 실패!!!. ==> ${JSON.parse(xhr.responseText).message}`);
					}
					saveLocalStorage('CLOCK_IN_DATE', currDate);
				}*/
			},
			complete : function(res) {
			}
		};

		requestAjax(options);

		/*var currDate = getCurrDate();
		//saveLocalStorage('CLOCK_IN_DATE', currDate);
		log('[' + currDate + '] 출근도장 OK.')
		showNotify('출근도장', sessionUserName + '님, ' + currDate + '에 출근시간으로 표시되었습니다.');*/

	}

	// 퇴근하기
	markAsClockOut()
	{
		let currDate = getCurrDate();
		let currTime = getCurrTime();

		let url = this.BASE_URL + '/api/ehr/attnd/clockout';
		let param = `{"clockOutTime": "${currDate}T${currTime}.000+09:00"}`;

		let options = {
			method: 'put',
			url: url,
			headers: {'TimeZoneOffset': '540'},
			param: param,
			success : (res) => {
				if (res.code == 200)
				{
					// 퇴근도장 OK
					showNotify('퇴근도장', `${sessionUserName}님, ${currDate} ${currTime}에 퇴근시간 체크되었습니다. 즐퇴하세요~`);
					saveLocalStorage('CLOCK_OUT_DATE', currDate);
					firebaseApp.writeLog(currDate, sessionUserName, '퇴근시간', `시간: ${currTime}`);
					log('>>> [' + currDate + '] 퇴근도장 OK.')
				}
				else
				{
					// 실패
					showNotify('퇴근도장', `${sessionUserName}님, 퇴근시간 등록 실패!!!.`);
					log('>>> [' + currDate + '] 퇴근도장 Fail.')
				}
			},
			error : (xhr) => {
				let responseText = JSON.parse(xhr.responseText);

				this.handleError(responseText.name);

				/*if (responseText.name == 'common.unauthenticated')
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
						//showNotify('퇴근도장', sessionUserName + '님, ' + ' 퇴근시간 등록 실패!!!.' + ' ==> ' + JSON.parse(xhr.responseText).message);
						showNotify('퇴근도장', `${sessionUserName}님, 퇴근도장 등록 실패!!!. ==> ${JSON.parse(xhr.responseText).message}`);
					}
					saveLocalStorage('CLOCK_OUT_DATE', currDate);
				}*/
			},
			complete : function(res) {
			}
		};

		requestAjax(options);

		/*var currDate = getCurrDate();
		//saveLocalStorage('CLOCK_OUT_DATE', currDate);
		log('[' + currDate + '] 퇴근도장 OK.')
		showNotify('퇴근도장', sessionUserName + '님, ' + currDate  + ' ' + currTime + '에 퇴근시간 체크되었습니다. 즐퇴하세요~');
		*/
	}

	handleError(name)
	{

		if (name == 'common.unauthenticated')
		{
			showNotify('출근도장', "스펙트라 그룹웨어에 로그인 되지 않았습니다. 브라우저에서 로그인 해주시기 바랍니다.");
		}
		else if (responseText.name == 'AlreadyClockInException')
		{
			showNotify('출근도장', `${sessionUserName}님, 출근시간 등록 실패!!!. ==> ${JSON.parse(xhr.responseText).message}`);
			saveLocalStorage('CLOCK_IN_DATE', currDate);
		}
		else if (responseText.name == 'AlreadyClockOutException')
		{
			showNotify('퇴근도장', `${sessionUserName}님, 퇴근도장 등록 실패!!!. ==> ${JSON.parse(xhr.responseText).message}`);
			saveLocalStorage('CLOCK_OUT_DATE', currDate);
		}
	}
}