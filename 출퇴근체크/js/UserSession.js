class UserSession
{
	BASE_URL = 'https://spectra.daouoffice.com';

	getSession()
	{
		let options = {
			method: 'get',
			url: this.BASE_URL + '/api/user/session',
			success : (res) => {
				sessionUserId = res.data.id;
				sessionUserName = res.data.name;

				logger.info(`사용자 세션정보 요청 : ${sessionUserName} [${sessionUserId}]`);
			},
			error : (xhr) => {
				logger.error(`사용자 세션정보 요청 실패 : ${sessionUserName} [${sessionUserId}]`);

				this.loginAfterGetStorage();
			}
		};

		requestAjax(options);
	}

	loginAfterGetStorage(callback)
	{
		promiseStorageSync('username')
			.then(() => promiseStorageSync('password'))
			.then(() => {

				let username = syncStorage['username'];
				let password = syncStorage['password'];

				this.login(username, password, callback);

			})
	}

	login(username, password, callback)
	{
		let param = '{"captcha": "", "username": "' + username + '", "password": "' + password + '", "returnUrl": ""}';
		let guid = this.uuidv4();

		let options = {
			method: 'post',
			url: this.BASE_URL + '/api/login',
			xhrFields: {
				withCredentials: true
			},
			crossDomain: true,
			headers: {'Set-Cookie': guid + '; Path=/'},
			param: param,
			success : (res) => {
				chrome.cookies.get({ url: 'https://spectra.daouoffice.com', name: 'GOSSOcookie' },
					function (cookie) {
						if (cookie) {
							logger.debug("GOSSOcookie : " + cookie.value);
							//GOSSOcookie = cookie.value;
						}
						else {
							logger.error('Can\'t get cookie! Check the name!');
						}
					});

				if (typeof callback == 'function')
					callback(res);
			},
			error : (xhr) => {
				logger.info(`사용자 로그인 실패 : ${username}`);
				if (typeof callback == 'function')
					callback(xhr);
			}
		};

		requestAjax(options);
	}

	uuidv4() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	}
}