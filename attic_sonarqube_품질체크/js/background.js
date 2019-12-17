function showBgNotification(title, message, requireInteraction = false) {

	if (Notification && Notification.permission !== "granted") {
		Notification.requestPermission(function (status) {
			if (Notification.permission !== status) {
				Notification.permission = status;
			}
		});
	}

	if (Notification && Notification.permission === "granted") {
		let start = Date.now();
		let id = new Date().getTime() + '';
		let options = {
			type: 'basic',
			//iconUrl: '/images/Angry-Face.png',
			iconUrl: '/images/happy.png',
			title: title,
			message: message,
			requireInteraction: requireInteraction
		};

		chrome.notifications.create(options);

		chrome.notifications.onClicked.addListener(function(notificationId, byUser) {
			chrome.notifications.clear(notificationId, function() {});
		});
	}
}

const interval = 1000*60;
let currDate;

setInterval(() => {
	currDate = new Date();

  	console.log('checking : ' + currDate);

	startChecking(() => {
		if (saveStorageSync['saveUseFlag'] !== 'Y') {
			console.log('saveUseFlag: ' + saveStorageSync['saveUseFlag']);
			return;
		}

		if (!checkValidDate())
			return;

		check();
	});

}, interval);

function checkQuality() {
	startChecking(() => {
		check();
	});
}

function checkValidDate() {
	currDate = new Date();
	if (!(currDate.getDay() === 0 || currDate.getDay() === 6)) // 토, 일 제외
	{
		const selectHour = saveStorageSync['saveSelectHour'];
		const selectMinute = saveStorageSync['saveSelectMinute'];

		if (currDate.getHours() === selectHour && currDate.getMinutes() === selectMinute) {
			return true;
		} else {
			return false;
		}

	}
}

function saveAllStorageSync(callback) {
	getAllStorageSync().then((items) => {
		for (const key in items) {
			saveStorageSync[key] = items[key];
		}

		callback();
	});
}

function startChecking(callback)
{
	saveAllStorageSync(callback);
}

function getAllStorageSync() {
	return new Promise(function(resolve, reject) {
		chrome.storage.local.get(null, function(items) {
			resolve(items);
		});
	});
}

function getStorageSync(key) {
	return new Promise(function(resolve, reject) {
		chrome.storage.local.get(key, function(items) {
			resolve(items[key]);
		});
	});
}


let hasError = false;
let saveStorageSync = {};

const SONARQUBE_URL = 'http://211.63.24.41:9000/api/measures/search_history?component=spectra.attic%3Aplatform&metrics=bugs%2Cvulnerabilities%2Csqale_index%2Cduplicated_lines_density%2Cncloc%2Ccoverage%2Ccode_smells&ps=1000';

function check()
{
	hasError = false;

	const promises = [
		$.ajax(SONARQUBE_URL)
	];
	  
	$.when.apply($, promises).then(
		function(resultSonarqube) {
			Promise.resolve()
				.then(() => {
					return parseSonarQube(resultSonarqube);
				}).then((res) => {
					notifySonarqubeResult(res);
			});
		}

	);
}

function parseSonarQube(response)
{
	let coverageHistory = [];
	let lineOfCodeHistory = [];
	let sqaleIndexHistory = [];
	let codeSmellHistory = [];
	let bugsHistory = [];
	let vulnerabilityHistory = [];
	let duplicatedLineDensitiy = [];

	if (!response.hasOwnProperty('measures')) {
		return {};
	}

	response.measures.map(measure => {
		if (measure.metric === "coverage") {
			coverageHistory = measure.history
		} else if (measure.metric === "ncloc") {
			lineOfCodeHistory = measure.history
		} else if (measure.metric === "sqale_index") {
			sqaleIndexHistory = measure.history
		} else if (measure.metric === "code_smells") {
			codeSmellHistory = measure.history
		} else if (measure.metric === "bugs") {
			bugsHistory = measure.history
		} else if (measure.metric === "vulnerabilities") {
			vulnerabilityHistory = measure.history
		} else if (measure.metric === "duplicated_lines_density") {
			duplicatedLineDensitiy = measure.history
		}
	});


	const coverage = coverageHistory.pop().value;
	const lineOfCode = lineOfCodeHistory.pop().value;
	const sqaleIndex = sqaleIndexHistory.pop().value;
	const codeSmell = codeSmellHistory.pop().value;
	const bugs = bugsHistory.pop().value;
	const vulnerability = vulnerabilityHistory.pop().value;
	const duplicatedLine = duplicatedLineDensitiy.pop().value;

	return {
		coverage,
		lineOfCode,
		sqaleIndex,
		codeSmell,
		bugs,
		vulnerability,
		duplicatedLine
	};
}

function appendMessageLine(message) {
	return message.length > 0 ? `${message}, ` : '';
}

function notifySonarqubeResult(result) {

	let message = '';
	if (result.coverage < parseInt(saveStorageSync['saveCoverage'])) {
		message += appendMessageLine(message) + `coverage: ${result.coverage}%`;
		hasError = true;
	}

	if (result.codeSmell > parseInt(saveStorageSync['saveCodeSmells'])) {
		message += message.length > 0 ? ', ' : '';
		message += appendMessageLine(message) + `codeSmell: ${result.codeSmell}개`;
		hasError = true;
	}

	if (result.bugs > parseInt(saveStorageSync['saveBugs'])) {
		message += message.length > 0 ? ', ' : '';
		message += appendMessageLine(message) + `bugs: ${result.bugs}개`;
		hasError = true;
	}

	if (result.vulnerability > parseInt(saveStorageSync['saveVulnerability'])) {
		message += message.length > 0 ? ', ' : '';
		message += appendMessageLine(message) + `vulnerability: ${result.vulnerability}개`;
		hasError = true;
	}

	if (result.duplicatedLine > parseInt(saveStorageSync['saveDuplications'])) {
		message += message.length > 0 ? ', ' : '';
		message += appendMessageLine(message) + `duplications: ${result.duplicatedLine}%`;
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
/**
 * popup에서 오는 메시지를 받는 함수
 */
const receiveMessage = function(request, sender, sendResponse)
{
	if (request.action === 'checkQuality')
	{
		checkQuality();
	}
	else if (request.action === 'gotoJenkins')
	{
		window.open('http://211.63.24.41:8080/view/attic/job/platform/');
	}
	else if (request.action === 'gotoSonarqube')
	{
		window.open('http://211.63.24.41:9000/dashboard?id=spectra.attic%3Aplatform');
	}
}

/**
 * receiver by chrome.runtime.sendMessage
 */
chrome.runtime.onMessage.addListener(receiveMessage);