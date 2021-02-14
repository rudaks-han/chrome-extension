function init()
{
	chrome.storage.sync.get('username', function(items) {
		let username = items['username'];
		$('#username').val(username);
	});

	$('#btnSaveUsername').on('click', function() {
		const jsonValue = {
			'username': $('#username').val()
		};
		chrome.storage.sync.set(jsonValue, () => {
			console.log('json', jsonValue)
			alert('저장되었습니다.');
		});
	});
}

$(() => {
	init();
});

