class QualityResultNotifier {
	static notify(result) {

		console.log(result);
		let message = '';

		if (result.coverage < parseInt(saveStorageSync['saveCoverage'])) {
			message += this.addComma(message) + `coverage: ${result.coverage}%`;
			hasError = true;
		}

		if (result.codeSmell > parseInt(saveStorageSync['saveCodeSmells'])) {
			message += this.addComma(message) + `codeSmell: ${result.codeSmell}개`;
			hasError = true;
		}

		if (result.bugs > parseInt(saveStorageSync['saveBugs'])) {
			message += this.addComma(message) + `bugs: ${result.bugs}개`;
			hasError = true;
		}

		if (result.vulnerability > parseInt(saveStorageSync['saveVulnerability'])) {
			message += this.addComma(message) + `vulnerability: ${result.vulnerability}개`;
			hasError = true;
		}

		if (result.duplicatedLine > parseInt(saveStorageSync['saveDuplications'])) {
			message += this.addComma(message) + `duplications: ${result.duplicatedLine}%`;
			hasError = true;
		}

		console.log('# saveStorageSync');
		console.table(saveStorageSync);
		console.log('# actual value');
		console.table(result);

		console.log('fail message : ' + message);

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

	static addComma(message) {
		return message.length > 0 ? ', ' : '';
	}

	static checkHasError(resultValue, storageValue) {
		if (resultValue > parseInt(saveStorageSync[storageValue])) {
			return true;
		} else {
			return false;
		}
	}


}