
function pushBullet(authorization, title, body)
{
	var params = {};
	params.type = 'note';
	params.title = title;
	params.body = body;
	$.ajax({
		type:"POST",
		url:'https://api.pushbullet.com/v2/pushes',
		data:params,
		beforeSend: function (xhr) {
			xhr.setRequestHeader('Authorization', 'Bearer ' + authorization);
		},
		success:function(res) {
			console.log('send pushbullet: ' + title)
			//console.log(JSON.stringify(res))
		},
		error: function(e) {
			console.error('pushbullet error : ' + JSON.stringify(e));
		}
	});
}
