function init()
{
	var backgroundPage = chrome.extension.getBackgroundPage();

	chrome.storage.sync.get('use-flag', function(items) {

		let useFlag = items['use-flag'];

		useFlag = useFlag || 'N';

		//$('input:radio[name=use-flag]:input[value=' + useFlag + ']').attr("checked", true);
		//$('input:checkbox[id=use-flag]').is('checked') ? .attr("checked", true);

		if (useFlag == 'Y') {
			$('.ui.toggle.checkbox.use-flag').checkbox('set checked');
		} else {
			$('.ui.toggle.checkbox.use-flag').checkbox('set unchecked');
		}

		if (useFlag == 'N')
		{
			disableUserSetting(true);
		}
		else if (useFlag == 'Y')
		{
			disableUserSetting(false);
		}
	});


	/*$('#clock-in-before-minute').append(getOptionTime(60));
	$('#clock-out-after-minute').append(getOptionTime(60));*/

	/*$('#clock-in-random-from-minute').append(getOptionTime(60));
	$('#clock-in-random-to-minute').append(getOptionTime(60));

	$('#clock-out-random-from-minute').append(getOptionTime(60));
	$('#clock-out-random-to-minute').append(getOptionTime(60));*/

	setInputValue('username', '');
	setInputValue('password', '');
	setInputValue('clock-in-hour', '09');
	setInputValue('clock-in-minute', '00');
	setInputValue('clock-out-hour', '18');
	setInputValue('clock-out-minute', '00');
	setRadioValue('clock-in-check-type', 'TIME');
	setInputValue('clock-in-before-minute', '5');
	setInputValue('clock-in-random-from-minute', '10');
	setInputValue('clock-in-random-to-minute', '5');
	setRadioValue('clock-out-check-type', 'TIME');
	setInputValue('clock-out-after-minute', '1');
	setInputValue('clock-out-random-from-minute', '10');
	setInputValue('clock-out-random-to-minute', '5');
}

function getOptionTime(toMinute, suffix)
{
	let str = '';
	for (let i=1; i<=parseInt(toMinute); i++)
		str += '<option value="' + i + '">' + i + (suffix ? suffix : '') +'</option>\n';

	return str;
}

function setInputValue(id, defaultValue)
{
	chrome.storage.sync.get(id, function(items) {

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

function setRadioValue(name, defaultValue)
{
	chrome.storage.sync.get(name, function(items) {
		if (typeof items[name] != 'undefined')
		{
			$('input:radio[name=' + name + ']:input[value=' + items[name] + ']').attr('checked', true);
		}
		else
		{
			$('input:radio[name=' + name + ']:input[value=' + defaultValue + ']').attr('checked', true);
		}
	});
}

function saveUseFlag()
{
	$(this).toggleClass('active');

	/*let useFlag = $('input[name="use-flag"]:checked').val();

	if (useFlag == 'Y')
	{
		disableUserSetting(false);
	}
	else
	{
		disableUserSetting(true);
	}*/

	save();
}

function disableUserSetting(flag)
{
	$('[id^="clock-"]').prop('disabled', flag);
	$('input[name^="clock-"]').prop('disabled', flag);
}

function checkUsernameAndPassword()
{
	let username = $('#username').val();
	let password = $('#password').val();

	const userSession = new UserSession();
	userSession.login(username, password, function(res) {
		if (res.code == '200')
		{
			showNotify('아이디/비밀번호 확인', '확인되었습니다.');
		}
		else
		{
			showNotify('아이디/비밀번호 확인', '아이디 혹은 비밀번호가 맞지 않습니다.');
		}
	});
}

function validateClockInRandomMinute()
{
	let from = parseInt($('#clock-in-random-from-minute').val());
	let to = parseInt($('#clock-in-random-to-minute').val());

	if (from < to)
	{
		alert('시작시간이 종료시간보다 이전이어야 합니다.');
		$('#clock-in-random-from-minute').val(to);
	}

	save();
}

function validateClockOutRandomMinute()
{
	let from = parseInt($('#clock-out-random-from-minute').val());
	let to = parseInt($('#clock-out-random-to-minute').val());

	if (from > to)
	{
		alert('시작시간이 종료시간보다 이전이어야 합니다.');
		$('#clock-out-random-from-minute').val(to);
	}

	save();
}

function save()
{
	const username = $('#username').val();
	const password = $('#password').val();

	//const useFlag = $('input[name="use-flag"]:checked').val();
	const useFlag = $('#use-flag').is(':checked') ? 'Y' : 'N'

	const clockInHour = $('#clock-in-hour').val();
	const clockInMinute = $('#clock-in-minute').val();
	const clockOutHour = $('#clock-out-hour').val();
	const clockOutMinute = $('#clock-out-minute').val();
	const clockInCheckType = $('input[name=clock-in-check-type]:checked').val();
	const clockInBeforeMinute = $('#clock-in-before-minute').val();
	const clockInRandomFromMinute = $('#clock-in-random-from-minute').val();
	const clockInRandomToMinute = $('#clock-in-random-to-minute').val();
	const clockOutCheckType = $('input[name=clock-out-check-type]:checked').val();
	const clockOutAfterMinute = $('#clock-out-after-minute').val();
	const clockOutRandomFromMinute = $('#clock-out-random-from-minute').val();
	const clockOutRandomToMinute = $('#clock-out-random-to-minute').val();

	const value = {
		'username' : username,
		'password' : password,
		'use-flag' : useFlag,
		'clock-in-hour' : clockInHour,
		'clock-in-minute' : clockInMinute,
		'clock-out-hour' : clockOutHour,
		'clock-out-minute' : clockOutMinute,
		'clock-in-check-type' : clockInCheckType,
		'clock-in-before-minute' : clockInBeforeMinute,
		'clock-in-random-from-minute' : clockInRandomFromMinute,
		'clock-in-random-to-minute' : clockInRandomToMinute,
		'clock-out-check-type' : clockOutCheckType,
		'clock-out-after-minute' : clockOutAfterMinute,
		'clock-out-random-from-minute' : clockOutRandomFromMinute,
		'clock-out-random-to-minute' : clockOutRandomToMinute
	};

	chrome.storage.sync.set(value, function() {
		logger.debug('Settings saved');
		logger.debug(value);
    });
}

function reset()
{
	chrome.storage.sync.clear();
	location.reload();
}

$(() => {

	init();

	/*
	$('#username').on('blur', save);
	$('#password').on('blur', save);
	$('#btnCheckUsernameAndPassword').on('click', checkUsernameAndPassword);
//$('input[name="use-flag"]').on('click', saveUseFlag);
	$('#use-flag').on('click', saveUseFlag);
	$('#clock-in-hour').on('change', save);
	$('#clock-in-minute').on('change', save);
	$('#clock-out-hour').on('change', save);
	$('#clock-out-minute').on('change', save);

	$('input[name=clock-in-check-type]').on('click', save);
	$('#clock-in-before-minute').on('change', save);

	$('#clock-in-random-from-minute').on('change', validateClockInRandomMinute);
	$('#clock-in-random-to-minute').on('change', validateClockInRandomMinute);

	$('input[name=clock-out-check-type]').on('click', save);
	$('#clock-out-after-minute').on('change', save);

	$('#clock-out-random-from-minute').on('change', validateClockOutRandomMinute);
	$('#clock-out-random-to-minute').on('change', validateClockOutRandomMinute);

*/
});



function saveConfig()
{
	const username = $('#username').val();
	const password = $('#password').val();
	const useFlag = $('#use-flag').is(':checked') ? 'Y' : 'N';
	const clockInHour = $('#clock-in-hour').val();
	const clockInMinute = $('#clock-in-minute').val();
	const clockOutHour = $('#clock-out-hour').val();
	const clockOutMinute = $('#clock-out-minute').val();
	const clockInCheckType = $('input[name=clock-in-check-type]:checked').val();
	const clockInBeforeMinute = $('#clock-in-before-minute').val();
	const clockInRandomFromMinute = $('#clock-in-random-from-minute').val();
	const clockInRandomToMinute = $('#clock-in-random-to-minute').val();
	const clockOutCheckType = $('input[name=clock-out-check-type]:checked').val();
	const clockOutAfterMinute = $('#clock-out-after-minute').val();
	const clockOutRandomFromMinute = $('#clock-out-random-from-minute').val();
	const clockOutRandomToMinute = $('#clock-out-random-to-minute').val();

	const jsonValue = {
		'username' : username,
		'password' : password,
		'use-flag' : useFlag,
		'clock-in-hour' : clockInHour,
		'clock-in-minute' : clockInMinute,
		'clock-out-hour' : clockOutHour,
		'clock-out-minute' : clockOutMinute,
		'clock-in-check-type' : clockInCheckType,
		'clock-in-before-minute' : clockInBeforeMinute,
		'clock-in-random-from-minute' : clockInRandomFromMinute,
		'clock-in-random-to-minute' : clockInRandomToMinute,
		'clock-out-check-type' : clockOutCheckType,
		'clock-out-after-minute' : clockOutAfterMinute,
		'clock-out-random-from-minute' : clockOutRandomFromMinute,
		'clock-out-random-to-minute' : clockOutRandomToMinute
	};

	console.error(jsonValue)

	chrome.storage.sync.set(jsonValue, function() {
		logger.debug('Settings saved');
		//logger.debug(JSON.stringify(jsonValue));
		console.log(jsonValue);
	});
};

$(() => {
	$('select.dropdown').dropdown();

	const btnUseFlag = $('.ui.toggle.checkbox.use-flag');
	btnUseFlag.checkbox({
		onChecked:  () => {
			btnUseFlag.find('label').html('사용중');
			disableUserSetting(false);
		},
		onUnchecked: () => {
			btnUseFlag.find('label').html('사용안함');
			disableUserSetting(true);
		}
	});

	$('#clock-in-before-minute').append(getOptionTime(60, "분 전"));
	$('#clock-out-after-minute').append(getOptionTime(60, "분 후"));

	$('#clock-in-random-from-minute').append(getOptionTime(60, "분 전"));
	$('#clock-in-random-to-minute').append(getOptionTime(60, "분 전"));

	$('#clock-out-random-from-minute').append(getOptionTime(60, "분 후"));
	$('#clock-out-random-to-minute').append(getOptionTime(60, "분 후"));

	$('#btnSave').on('click', saveConfig);
	$('#btnReset').on('click', reset);

});

