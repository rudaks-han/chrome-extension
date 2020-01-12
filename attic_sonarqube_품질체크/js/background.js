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
		const selectHour = parseInt(saveStorageSync['saveSelectHour']);
		const selectMinute = parseInt(saveStorageSync['saveSelectMinute']);

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

const SONARQUBE_URL = 'http://211.63.24.41:9000';

let hasError = false;
let saveStorageSync = {};

const SONARQUBE_CHECK_URL = `${SONARQUBE_URL}/api/measures/component?additionalFields=metrics%2Cperiods&component=spectra.attic%3Aplatform&metricKeys=alert_status%2Cquality_gate_details%2Cbugs%2Cnew_bugs%2Creliability_rating%2Cnew_reliability_rating%2Cvulnerabilities%2Cnew_vulnerabilities%2Csecurity_rating%2Cnew_security_rating%2Csecurity_hotspots%2Cnew_security_hotspots%2Ccode_smells%2Cnew_code_smells%2Csqale_rating%2Cnew_maintainability_rating%2Csqale_index%2Cnew_technical_debt%2Ccoverage%2Cnew_coverage%2Cnew_lines_to_cover%2Ctests%2Cduplicated_lines_density%2Cnew_duplicated_lines_density%2Cduplicated_blocks%2Cncloc%2Cncloc_language_distribution%2Cprojects%2Cnew_lines`;
//const SONARQUBE_CHECK_URL = `${SONARQUBE_URL}/api/measures/search_history?component=spectra.attic%3Aplatform&metrics=bugs%2Cvulnerabilities%2Csqale_index%2Cduplicated_lines_density%2Cncloc%2Ccoverage%2Ccode_smells&ps=1000`;

function check()
{
	hasError = false;

	const promises = [
		$.ajax(SONARQUBE_CHECK_URL)
	];
	  
	$.when.apply($, promises).then(
		function(resultSonarqube) {
			Promise.resolve()
				.then(() => {
					//return SonarqubeParser.parse(resultSonarqube)
					return SonarqubeNewCodeParser.parse(resultSonarqube)
				}).then((res) => {
					QualityResultNotifier.notify(res);
			});
		}

	);
}

/**
 * popup에서 오는 메시지를 받는 함수
 */
const receiveMessage = function(request, sender, sendResponse)
{
	if (request.action === 'checkQuality') {
		checkQuality();
	} else if (request.action === 'openWindow') {
		window.open(request.url);
	}
}

/**
 * receiver by chrome.runtime.sendMessage
 */
chrome.runtime.onMessage.addListener(receiveMessage);