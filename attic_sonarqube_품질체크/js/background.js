function showBgNotification(title, message, requireInteraction = false, iconUrl) {

	if (Notification && Notification.permission !== "granted") {
		Notification.requestPermission(function (status) {
			if (Notification.permission !== status) {
				Notification.permission = status;
			}
		});
	}
	if (Notification && Notification.permission === "granted") {
		var n = new Notification(title + "\n" + message);
	}

	if (Notification && Notification.permission !== "granted") {
		Notification.requestPermission(function (status) {
			if (Notification.permission !== status) {
				Notification.permission = status;
			}
		});
	}

	if (Notification && Notification.permission === "granted") {
		let start = Date.now();
		let id = new Date().getTime() + '' + title;
		let options = {
			type: 'basic',
			//iconUrl: '/images/Angry-Face.png',
			iconUrl: '/images/happy.png',
			title: title,
			message: message,
			requireInteraction: requireInteraction
		};

		if (iconUrl) {
			options.iconUrl = iconUrl;
		}

		chrome.notifications.create(options);
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

		checkQuality();
	});

}, interval);

function checkQuality() {
	startChecking(() => {
		const qualityChecker = new QualityChecker();

		qualityChecker.startCheck()
			.then(responses => {

				let hasError = false;
				let messages = '';
				responses.map(response => {
					if (response.hasError) {
						hasError = true;
						messages += '[' + response.componentName + '] Failed' + '\n';
					}
				});

				if (hasError) {
					showBgNotification('', messages, true, '/images/Angry-Face.png');
				} else {
					showBgNotification('', 'All passed', false);
				}
			});
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

function startChecking(callback)
{
	saveAllStorageSync(callback);
}

let saveStorageSync = {};

//const SONARQUBE_CHECK_URL = `${SONARQUBE_URL}/api/measures/search_history?component=spectra.attic%3Aplatform&metrics=bugs%2Cvulnerabilities%2Csqale_index%2Cduplicated_lines_density%2Cncloc%2Ccoverage%2Ccode_smells&ps=1000`;

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