class QualityChecker {
	urls = [
		'http://211.63.24.41:9000/api/measures/component?additionalFields=metrics%2Cperiods&component=spectra.attic.talk.mocha%3Amocha&metricKeys=alert_status%2Cquality_gate_details%2Cbugs%2Cnew_bugs%2Creliability_rating%2Cnew_reliability_rating%2Cvulnerabilities%2Cnew_vulnerabilities%2Csecurity_rating%2Cnew_security_rating%2Csecurity_hotspots%2Cnew_security_hotspots%2Ccode_smells%2Cnew_code_smells%2Csqale_rating%2Cnew_maintainability_rating%2Csqale_index%2Cnew_technical_debt%2Ccoverage%2Cnew_coverage%2Cnew_lines_to_cover%2Ctests%2Cduplicated_lines_density%2Cnew_duplicated_lines_density%2Cduplicated_blocks%2Cncloc%2Cncloc_language_distribution%2Cprojects%2Cnew_lines',
		'http://211.63.24.41:9000/api/measures/component?additionalFields=metrics%2Cperiods&component=spectra.attic.talk.shop%3Ashop&metricKeys=alert_status%2Cquality_gate_details%2Cbugs%2Cnew_bugs%2Creliability_rating%2Cnew_reliability_rating%2Cvulnerabilities%2Cnew_vulnerabilities%2Csecurity_rating%2Cnew_security_rating%2Csecurity_hotspots%2Cnew_security_hotspots%2Ccode_smells%2Cnew_code_smells%2Csqale_rating%2Cnew_maintainability_rating%2Csqale_index%2Cnew_technical_debt%2Ccoverage%2Cnew_coverage%2Cnew_lines_to_cover%2Ctests%2Cduplicated_lines_density%2Cnew_duplicated_lines_density%2Cduplicated_blocks%2Cncloc%2Cncloc_language_distribution%2Cprojects%2Cnew_lines'
	];

	startCheck() {
		let data = [];

		return Promise.all(this.urls.map(url => {
			console.log('# ajax request : ' + url);

			return $.ajax(url);
		})).then(responses => {
			console.log('# ajax response')
			console.log(responses);
			return responses.map(response => {
				return new NewCodeParser().execute(response);;
			});
		}).then(responses => {
			console.log('# newCodeParser response')
			console.log(responses);

			return responses.map(response => {
				return new ErrorChecker().execute(response.componentName, response);;
			});
		}).then(responses => {
			console.log('# ErrorChecker response')
			console.log(responses);

			responses.map(response => {
				data.push(response);
			});

			return data;
		});
	}

	check(url) {
		console.log('check url : ' + url)

		return new Promise((resolve, reject) => {
			$.get(url, response => {
				resolve(response)
			});
		});
	}
}