class QualityChecker {
	sonarUrl = 'http://211.63.24.41:9000/api/measures/component?additionalFields=metrics%2Cperiods&metricKeys=alert_status%2Cquality_gate_details%2Cbugs%2Cnew_bugs%2Creliability_rating%2Cnew_reliability_rating%2Cvulnerabilities%2Cnew_vulnerabilities%2Csecurity_rating%2Cnew_security_rating%2Csecurity_hotspots%2Cnew_security_hotspots%2Ccode_smells%2Cnew_code_smells%2Csqale_rating%2Cnew_maintainability_rating%2Csqale_index%2Cnew_technical_debt%2Ccoverage%2Cnew_coverage%2Cnew_lines_to_cover%2Ctests%2Cduplicated_lines_density%2Cnew_duplicated_lines_density%2Cduplicated_blocks%2Cncloc%2Cncloc_language_distribution%2Cprojects%2Cnew_lines';

	urls = [
		this.sonarUrl + '&component=talk-api-mocha',
		this.sonarUrl + '&component=talk-api-shop',
		this.sonarUrl + '&component=talk-api-latte',
		this.sonarUrl + '&component=talk-api-crema',
		this.sonarUrl + '&component=talk-api-insight',
		this.sonarUrl + '&component=talk-api-share',
		this.sonarUrl + '&component=talk-ui-backoffice',
		this.sonarUrl + '&component=talk-ui-customer'
	];

	startCheck() {
		let data = [];

		return Promise.all(this.urls.map(url => {
			logger.debug('# ajax request : ' + url);

			return $.ajax(url);
		})).then(responses => {
			logger.debug('# ajax response')
			return responses.map(response => {
				//return new NewCodeParser().execute(response);;
				return new CodeParser().execute(response);;
			});
		}).then(responses => {
			logger.debug('# newCodeParser response')
			//logger.debug(responses);

			return responses.map(response => {
				let componentName = response.componentName;
				return new ErrorChecker().execute(componentName, response);;
			});
		}).then(responses => {
			logger.debug('# ErrorChecker response')
			//logger.debug(responses);
			console.log(responses)

			responses.map(response => {
				data.push(response);
			});

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
