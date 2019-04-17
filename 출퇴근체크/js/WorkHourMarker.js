class WorkHourMarker
{
	BASE_URL = 'https://spectra.daouoffice.com';

	// 출근하기
	requestClockIn()
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
					showBgNotification('출근도장', `${sessionUserName}님, ${currDate} ${currTime}에 출근시간으로 표시되었습니다.`, true);
					saveLocalStorage('CLOCK_IN_DATE', currDate);
					firebaseApp.writeLog(currDate, sessionUserName, '출근시간', `시간: ${currTime}`);
					logger.info('>>> [' + currDate + '] 출근도장 OK.')
				}
				else
				{
					// 실패
					showBgNotification('출근도장', `${sessionUserName}님, 출근시간 등록 실패!!!. ==> ${res.message}`);
					logger.info('>>> [' + currDate + '] 출근도장 Fail.')
				}
			},
			error : (xhr) => {
				let responseText = JSON.parse(xhr.responseText);

				this.handleError(responseText);
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
	requestClockOut()
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
					showBgNotification('퇴근도장', `${sessionUserName}님, ${currDate} ${currTime}에 퇴근시간 체크되었습니다. 즐퇴하세요~`, true);
					saveLocalStorage('CLOCK_OUT_DATE', currDate);
					firebaseApp.writeLog(currDate, sessionUserName, '퇴근시간', `시간: ${currTime}`);
					logger.info('>>> [' + currDate + '] 퇴근도장 OK.')
				}
				else
				{
					// 실패
					showBgNotification('퇴근도장', `${sessionUserName}님, 퇴근시간 등록 실패!!!.`);
					logger.info('>>> [' + currDate + '] 퇴근도장 Fail.')
				}
			},
			error : (xhr) => {
				let responseText = JSON.parse(xhr.responseText);

				this.handleError(responseText);
			},
			complete : function(res) {
			}
		};

		requestAjax(options);

	}

	handleError(responseText)
	{
		//console.log('responseText : ' + JSON.stringify(responseText))
		if (responseText.name === 'common.unauthenticated')
		{
			showBgNotification('출근도장', "스펙트라 그룹웨어에 로그인 되지 않았습니다. 브라우저에서 로그인 해주시기 바랍니다.");
			logger.info('스펙트라 그룹웨어에 로그인 되지 않았습니다. 브라우저에서 로그인 해주시기 바랍니다.');
		}
		else if (responseText.name === 'AlreadyClockInException')
		{
			showBgNotification('출근도장', `${sessionUserName}님, 출근시간 등록 실패!!!. ==> ${responseText.message}`);
			logger.info(`${sessionUserName}님, 출근시간 등록 실패!!!. ==> ${responseText.message}`);

			saveLocalStorage('CLOCK_IN_DATE', getCurrDate());
		}
		else if (responseText.name === 'AlreadyClockOutException')
		{
			showBgNotification('퇴근도장', `${sessionUserName}님, 퇴근도장 등록 실패!!!. ==> ${responseText.message}`);
			logger.info(`${sessionUserName}님, 퇴근도장 등록 실패!!!. ==> ${responseText.message}`);
			saveLocalStorage('CLOCK_OUT_DATE', getCurrDate());
		}
	}
}