class ErrorChecker {
	execute(componentName, result) {
		return this.parseError(componentName, result);
	}

	parseError(componentName, result) {

		let message = '';
		let hasError = false;

		if (result.newBug > 0) {
			message += this.addComma(message) + `New Bugs: ${result.newBug}개`;
			hasError = true;
		}

		if (result.newVulnerabilities > 0) {
			message += this.addComma(message) + `New Vulnerabilities: ${result.newVulnerabilities}개`;
			hasError = true;
		}

		if (result.newSecurityHotSpots > 0) {
			message += this.addComma(message) + `New Security Hotspots: ${result.newSecurityHotSpots}개`;
			hasError = true;
		}

		if (result.newCodeSmells > 0) {
			message += this.addComma(message) + `New Code Smells: ${result.newCodeSmells}개`;
			hasError = true;
		}

		if (result.newDuplicatedLinesDensity < 0) {
			message += this.addComma(message) + `Duplication: ${result.newDuplicatedLinesDensity}%`;
			hasError = true;
		}

		logger.debug('hasError: ' + hasError)
		return {
			componentName,
			hasError,
			message,
			data: result
		}
	}

	addComma(message) {
		return message.length > 0 ? ', ' : '';
	}
}