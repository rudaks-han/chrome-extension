function init()
{
	var backgroundPage = chrome.extension.getBackgroundPage();

	chrome.storage.sync.get('use-flag', function(items) {

		let useFlag = items['use-flag'];

		if (typeof useFlag == 'undefined')
		{
			useFlag = 'N';
		}

		$('input:radio[name=use-flag]:input[value=' + useFlag + ']').attr("checked", true);

		if (useFlag == 'N')
		{
			disableUserSetting(true);
		}
		else if (useFlag == 'Y')
		{
			disableUserSetting(false);
		}
	});

	setElementValue('username', '');
	setElementValue('password', '');
	setElementValue('clock-in-hour', '09');
	setElementValue('clock-in-minute', '00');
	setElementValue('clock-out-hour', '18');
	setElementValue('clock-out-minute', '00');
	setElementValue('clock-in-before-minute', '5');
	setElementValue('clock-out-after-minute', '1');
}

function setElementValue(id, defaultValue)
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

function saveUseFlag()
{
	let useFlag = $('input[name="use-flag"]:checked').val();

	if (useFlag == 'Y')
	{
		disableUserSetting(false);
	}
	else
	{
		disableUserSetting(true);
	}

	save();
}

function disableUserSetting(flag)
{
	$('[id^="clock-"]').prop('disabled', flag);
}

function checkUsernameAndPassword()
{
	let username = $('#username').val();
	let password = $('#password').val();

	const userSession = new UserSession();
	userSession.login(username, password, function(res) {
		console.log(">>>>" + JSON.stringify(res))
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

function save()
{
	const username = $('#username').val();
	const password = $('#password').val();

	const useFlag = $('input[name="use-flag"]:checked').val();
	const clockInHour = $('#clock-in-hour').val();
	const clockInMinute = $('#clock-in-minute').val();
	const clockOutHour = $('#clock-out-hour').val();
	const clockOutMinute = $('#clock-out-minute').val();
	const clockInBeforeMinute = $('#clock-in-before-minute').val();
	const clockOutAfterMinute = $('#clock-out-after-minute').val();

	const value = {
		'username' : username,
		'password' : password,
		'use-flag' : useFlag,
		'clock-in-hour' : clockInHour,
		'clock-in-minute' : clockInMinute,
		'clock-out-hour' : clockOutHour,
		'clock-out-minute' : clockOutMinute,
		'clock-in-before-minute' : clockInBeforeMinute,
		'clock-out-after-minute' : clockOutAfterMinute,
	};

	chrome.storage.sync.set(value, function() {
      console.log('Settings saved : ' + JSON.stringify(value));
    });
}

function reset()
{
	chrome.storage.sync.clear();
	location.reload();
}

init();

$('#username').on('blur', save);
$('#password').on('blur', save);
$('#btnCheckUsernameAndPassword').on('click', checkUsernameAndPassword);
$('input[name="use-flag"]').on('click', saveUseFlag);
$('#clock-in-hour').on('change', save);
$('#clock-in-minute').on('change', save);
$('#clock-out-hour').on('change', save);
$('#clock-out-minute').on('change', save);
$('#clock-in-before-minute').on('change', save);
$('#clock-out-after-minute').on('change', save);

$('#btn-reset').on('click', reset);

