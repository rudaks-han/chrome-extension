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

setTimeout(function() {
	$.ajax({
	    type:"GET",
	    //url:'https://api.pushbullet.com/v2/users/me',
	    //url:'https://api.pushbullet.com/v2/devices',
	    url:'https://api.pushbullet.com/v2/contacts',
	    //data:params,
	    beforeSend: function (xhr) {
	        //xhr.setRequestHeader('Authorization', 'Bearer 8yH3ytxOI7Bqu3bVbUqHKsVATSCpujVX');
			xhr.setRequestHeader('Authorization', 'Bearer nXmkzdhFQae9zY6YRGScOPTmoKnoT77m');			
	    },
	    success:function(res){
	    	console.log(JSON.stringify(res))
	    }
	});

	//var params = 'device_iden=uju8k2VOqrYsjz7O3P0Jl6&email=rudaks94@gmail.com&channel_tag=&client_iden=&type=note&title=test&body=testbody';


}, 1000);

	
  var interval = 60*1000; // The display interval, in minutes.

	//setTimeout(function() {
  setInterval(function() {


	//pushBullet('test', 'test');
    	console.log('checking... ' + new Date());
		checkIfReserved('2019-09-01');

		//interval = 0;

  }, interval);
//}


function checkIfReserved(startDate)
{
	var url = 'https://live.ipms247.com/booking/rmdetails';
	var params = 'checkin=' + startDate + '&gridcolumn=1&adults=1&child=0&nonights=1&ShowSelectedNights=true&DefaultSelectedNights=1&calendarDateFormat=yy-mm-dd&rooms=1&promotion=DFDMBRFREE&ArrvalDt=2019-08-24&HotelId=13024&isLogin=lf&selectedLang=-ko-Korean&modifysearch=false&promotioncode=DFDMBRFREE&layoutView=2&ShowMinNightsMatchedRatePlan=false&LayoutTheme=2&w_showadult=false&w_showchild_bb=false&ShowMoreLessOpt=&w_showchild=true';

	$.ajax({
        type:"POST",
        url:url,
        data: params,
        beforeSend : function(xhr){
        },
        success:function(res){
            //console.log(res);

            if (res.indexOf('<span>객실 선택</span>') > -1) {

				var title = '[' + startDate + '] 힐링파크 객실이 있네요. 언능 예약하세요';
                console.error(startDate + ' ');

                pushBullet(title, title);
			} else {
            	console.log(startDate + ' 객실이 없어요.ㅠㅠ')

			}

        },
        error:function(e){
            //alert("error : " + e.responseText);
        	console.error(e);
        }
    });

    /*$.ajax({
        type: 'GET',
        dataType: 'jsonp',
        data: {'name': 'kimyeonsuk'},
        url: url,
        // jsonp 값을 전달할 때 사용되는 파라미터 변수명
        // 이 속성을 생략하면 callback 파라미터 변수명으로 전달된다.
        jsonp: 'stone',
        success:function(json) {
            console.log(json)
        }
    });*/

}

function pushBullet(title, body)
{
	var params = {};
	params.type = 'note';
	params.title = title;
	params.body = body;
	$.ajax({
	    type:"POST",
	    //url:'https://api.pushbullet.com/v2/users/me',
	    url:'https://api.pushbullet.com/v2/pushes',
	    data:params,
	    beforeSend: function (xhr) {
	        xhr.setRequestHeader('Authorization', 'Bearer 8yH3ytxOI7Bqu3bVbUqHKsVATSCpujVX');
			//xhr.setRequestHeader('Authorization', 'Bearer nXmkzdhFQae9zY6YRGScOPTmoKnoT77m'); // 승엽
	    },
	    success:function(res){
	    	console.log(JSON.stringify(res))
	    }
	});
}
