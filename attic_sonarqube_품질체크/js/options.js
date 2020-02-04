function initAlarmTime() {
	let hourHtml = '';
	for (let i=0; i<=23; i++) {
		hourHtml += `<option value=${i}>${i}</option>`;
	}

	let minuteHtml = '';
	for (let i=0; i<=59; i++) {
		minuteHtml += `<option value=${i}>${i}</option>`;
	}

	$('#saveSelectHour').html(hourHtml);
	$('#saveSelectMinute').html(minuteHtml);
}

const inputItems = [
	'saveInputBugs',
	'saveInputVulnerabilities',
	'saveSecurityHotspots',
	'saveCodeSmells',
	'saveCoverage',
	'saveDuplications'
];

const componentNames = [
	'Platform',
	'Application'
];

function init()
{
	//var backgroundPage = chrome.extension.getBackgroundPage();
	initAlarmTime();

	setUseFlagChecked();
	setInputValue('saveSelectHour');
	setInputValue('saveSelectMinute');

	/*setInputValue('saveInputBugsPlatform', '0');
	setInputValue('saveInputVulnerabilitiesPlatform', '0');
	setInputValue('saveSecurityHotspotsPlatform', '0');
	setInputValue('saveCodeSmellsPlatform', '0');
	setInputValue('saveCoveragePlatform', '0');
	setInputValue('saveDuplicationsPlatform', '0');*/

	componentNames.forEach((componentName) => {
		inputItems.forEach(inputItem => {
			setInputValue(inputItem + componentName, '0');
		});
	});
}

function setInputValue(id, defaultValue)
{
	chrome.storage.local.get(id, function(items) {

		if (typeof items[id] != 'undefined')
		{
			$('#' + id).val(items[id]);
		}
		else
		{
			$('#' + id).val(defaultValue); // 9시
		}
	});
}

function setUseFlagChecked() {

	chrome.storage.local.get('saveUseFlag', function(items) {

		let useFlag = items['saveUseFlag'];

		useFlag = useFlag || 'N';

		const btnUseFlag = $('.ui.toggle.checkbox.use-flag');
		if (useFlag === 'Y') {
			btnUseFlag.checkbox('set checked');
			btnUseFlag.find('label').html('사용중');
		} else {
			btnUseFlag.checkbox('set unchecked');
			btnUseFlag.find('label').html('사용안함');
		}
	});
}

function reset()
{
	chrome.storage.local.clear();
	location.reload();
}

function saveConfig()
{
	const saveUseFlag = $('#saveUseFlag').is(':checked') ? 'Y' : 'N';
	const saveSelectHour = $('#saveSelectHour').val();
	const saveSelectMinute = $('#saveSelectMinute').val();

	const jsonValue = {};

	jsonValue['saveUseFlag'] = saveUseFlag;
	jsonValue['saveSelectHour'] = saveSelectHour;
	jsonValue['saveSelectMinute'] = saveSelectMinute;

	componentNames.forEach((componentName) => {
		inputItems.forEach(inputItem => {
			const elementName = inputItem + componentName;

			jsonValue[elementName] = $('#' + elementName).val();
		});
	})

	chrome.storage.local.set(jsonValue, function() {
		console.log('Settings saved');
		console.log(jsonValue);

		showNotify('설정', '설정정보가 저장되었습니다.');
	});
};

$(() => {

	$('#btnSave').on('click', saveConfig);
	$('#btnReset').on('click', reset);

	const btnUseFlag = $('.ui.toggle.checkbox.use-flag');
	btnUseFlag.checkbox({
		onChecked:  () => {
			btnUseFlag.find('label').html('사용중');
		},
		onUnchecked: () => {
			btnUseFlag.find('label').html('사용안함');
		}
	});

	init();

});

