function init()
{
	var backgroundPage = chrome.extension.getBackgroundPage();

	chrome.storage.sync.get('use-flag', function(items) {

		var useFlag = items['use-flag'];

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
	var useFlag = $('input[name="use-flag"]:checked').val();

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

function save()
{
	var useFlag = $('input[name="use-flag"]:checked').val();
	var clockInHour = $('#clock-in-hour').val();
	var clockInMinute = $('#clock-in-minute').val();
	var clockOutHour = $('#clock-out-hour').val();
	var clockOutMinute = $('#clock-out-minute').val();
	var clockInBeforeMinute = $('#clock-in-before-minute').val();
	var clockOutAfterMinute = $('#clock-out-after-minute').val();

	var value = {
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

$('input[name="use-flag"]').on('click', saveUseFlag);
$('#clock-in-hour').on('change', save);
$('#clock-in-minute').on('change', save);
$('#clock-out-hour').on('change', save);
$('#clock-out-minute').on('change', save);
$('#clock-in-before-minute').on('change', save);
$('#clock-out-after-minute').on('change', save);

$('#btn-reset').on('click', reset);

