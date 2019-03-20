var checkInterval = 300000 * 1000;
(function() {
    setInterval(function() {
    	//console.log('interval');
    	// 출근 시간 여부 체크
    	checkIfStartWorktime();
    	// 퇴근 시간 여부 체크
    }, checkInterval);


     function checkIfStartWorktime()
    {
    	console.log('is start work time?');
    	var params = '{"id":7667,"timeZone":"Asia/Seoul","locale":"ko","noti":"enable","useAbbroadIpCheck":"false","style":"basic","theme":"THEME_CLASSIC"}';
    	requestAjax('PUT', 'https://spectra.daouoffice.com/api/user/config/7667', params, function(res) {
    		console.log(res);
    	});

    }

    function requestAjax(method, url, params, onSuccess)
    {
    	// Cookie: userLoginId=2014001; userLoginInfoSaved=true; GOSSOcookie=52fd09c1-b030-45c6-a59b-03eca71f71ea; IsCookieActived=true
    	$.ajax({
	    type: method,
	    url: url,
	    data: params,
	    success: function(res){
	    	onSuccess(res);
	    }
	});
    }

})();
