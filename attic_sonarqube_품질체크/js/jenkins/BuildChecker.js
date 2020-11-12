class BuildChecker {
	urls = [
		'http://211.63.24.41:8080/view/victory/job/talk-api-mocha/job/master/lastBuild/api/json?pretty=true',
		'http://211.63.24.41:8080/view/victory/job/talk-api-shop/job/master/lastBuild/api/json?pretty=true'
	];

	startCheck() {
		let data = [];

		return Promise.all(this.urls.map(url => {
			logger.debug('# ajax request : ' + url);

			return $.ajax(url);
		})).then(responses => {
			logger.debug('# ajax response')
			console.log(responses);
			return responses.map(response => {
				console.log('response: ' + response)
				console.log('result: ' + response.result)

				let hasError = false;
				const componentName = response.fullDisplayName.split(' ')[0];
				const value = response.result;

				if (value !== 'SUCCESS') {
					hasError = true;
				}

				return {
					componentName,
					hasError
				};
			});
		}).then(responses => {

			data.push(responses);
			return data;
		});
	}

	check(url) {
		logger.debug('check url : ' + url)

		return new Promise((resolve, reject) => {
			$.get(url, response => {
				resolve(response)
			});
		});
	}
}