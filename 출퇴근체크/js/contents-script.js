var url = 'https://spectra.daouoffice.com';

var checkInterval = 3 * 1000;
(function() {
    setInterval(function() {
    	//console.log('interval');
    	// 공휴일인지 여부 체크
    	// 연차 여부 체크 (반차 포함)
    	// 출근 시간 여부 체크
    	checkIfStartWorktime();
    	// 퇴근 시간 여부 체크
    }, checkInterval);

    function checkIfStartWorktime()
    {
    	console.log('is start work time?');
    	var params = '{"id":7667,"timeZone":"Asia/Seoul","locale":"ko","noti":"enable","useAbbroadIpCheck":"false","style":"basic","theme":"THEME_CLASSIC"}';
    	requestAjax('put', 'https://spectra.daouoffice.com/api/user/config/7667', params, function(res) {
    		console.log(res);
    	});

    }

    function requestAjax(method, url, params, onSuccess)
    {
    	$.ajax({
	    type: method,
	    url: url,
	    data: params,
	    dataType: "json",
	    contentType: "application/json", // request payload로 전송됨
	    success: function(res){
	    	onSuccess(res);
	    }
	});
    }

})();

