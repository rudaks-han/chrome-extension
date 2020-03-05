function showNotify(title, message) {
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
}

function addMinutes(date, minutes) {
	return new Date(date.getTime() + minutes*60000);
}

function getDateFormat(date) {
	return date.getFullYear() + '/' + makeTwoLength(date.getMonth()+1) + '/' + makeTwoLength(date.getDate()) + ' ' + makeTwoLength(date.getHours()) + ':' + makeTwoLength(date.getMinutes());
}

function makeTwoLength(str) {
	if (String(str).length == 1) {
		return '0' + str;
	}
	return str;
}

function checkUrl(url, datatype, callback)
{
	$.ajaxQueue({
		type:"GET",
		dataType: datatype,
		//contentType: "application/x-www-form-urlencoded; charset=euc-kr",
		url:url,
		beforeSend : function(xhr){
		},
		success:function(res){
			callback(res);
		},
		error:function(e){
			//alert("error : " + e.responseText);
			console.error(e);
		}
	});
}