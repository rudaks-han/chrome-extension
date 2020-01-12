class QualityResultNotifier {
	static notify(result) {

		let message = '';
		if (result.coverage < parseInt(saveStorageSync['saveCoverage'])) {
			message += this.appendMessageLine(message) + `coverage: ${result.coverage}%`;
			hasError = true;
		}

		if (result.codeSmell > parseInt(saveStorageSync['saveCodeSmells'])) {
			message += message.length > 0 ? ', ' : '';
			message += this.appendMessageLine(message) + `codeSmell: ${result.codeSmell}개`;
			hasError = true;
		}

		if (result.bugs > parseInt(saveStorageSync['saveBugs'])) {
			message += message.length > 0 ? ', ' : '';
			message += this.appendMessageLine(message) + `bugs: ${result.bugs}개`;
			hasError = true;
		}

		if (result.vulnerability > parseInt(saveStorageSync['saveVulnerability'])) {
			message += message.length > 0 ? ', ' : '';
			message += this.appendMessageLine(message) + `vulnerability: ${result.vulnerability}개`;
			hasError = true;
		}

		if (result.duplicatedLine > parseInt(saveStorageSync['saveDuplications'])) {
			message += message.length > 0 ? ', ' : '';
			message += this.appendMessageLine(message) + `duplications: ${result.duplicatedLine}%`;
			hasError = true;
		}

		console.log('# saveStorageSync');
		console.table(saveStorageSync);
		console.log('# actual value');
		console.table(result);

		if (hasError) {
			showBgNotification("품질체크 결과 --> Fail", message, true);

			chrome.browserAction.setIcon({
				path: '/images/sad.png'
			});
		}
		else {
			showBgNotification("품질체크 결과", '정상입니다.');

			chrome.browserAction.setIcon({
				path: '/images/happy.png'
			});
		}
	}

	static appendMessageLine(message) {
		return message.length > 0 ? `${message}, ` : '';
	}
}