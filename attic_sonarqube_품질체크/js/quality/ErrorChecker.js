class ErrorChecker {
	execute(componentName, result) {
		return this.parseError(componentName, result);
	}

	parseError(componentName, result) {

		let message = '';
		let hasError = false;

		if (result.newBug > parseInt(saveStorageSync['saveBugs' + componentName])) {
			message += this.addComma(message) + `New Bugs: ${result.newBug}개`;
			hasError = true;
		}

		if (result.newVulnerabilities > parseInt(saveStorageSync['saveVulnerability' + componentName])) {
			message += this.addComma(message) + `New Vulnerabilities: ${result.newVulnerabilities}개`;
			hasError = true;
		}

		if (result.newSecurityHotSpots > parseInt(saveStorageSync['saveSecurityHotspots' + componentName])) {
			message += this.addComma(message) + `New Security Hotspots: ${result.newSecurityHotSpots}개`;
			hasError = true;
		}

		if (result.newCodeSmells > parseInt(saveStorageSync['saveCodeSmells' + componentName])) {
			message += this.addComma(message) + `New Code Smells: ${result.newCodeSmells}개`;
			hasError = true;
		}

		if (result.newCoverage < parseInt(saveStorageSync['saveCoverage' + componentName])) {
			message += this.addComma(message) + `Coverage: ${result.newCoverage}%`;
			hasError = true;
		}

		if (result.newDuplicatedLinesDensity < parseInt(saveStorageSync['saveDuplications' + componentName])) {
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

	notify(componentName) {
		this.showBrowserNotification(componentName, this.hasError, this.message);
	}

	showBrowserNotification(componentName, hasError, message) {
		if (hasError) {
			const requireInteraction = true;
			showBgNotification(`[Failed] ${componentName} 품질체크 결과`, message, requireInteraction);

			chrome.browserAction.setIcon({
				path: '/images/sad.png'
			});
		} else {
			showBgNotification(`[Passed] ${componentName} 품질체크 결과`, '정상입니다.');

			chrome.browserAction.setIcon({
				path: '/images/happy.png'
			});
		}

	}

	addComma(message) {
		return message.length > 0 ? ', ' : '';
	}
}