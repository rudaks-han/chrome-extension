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
	    	console.error(JSON.stringify(res))
	    }
	});

	//var params = 'device_iden=uju8k2VOqrYsjz7O3P0Jl6&email=rudaks94@gmail.com&channel_tag=&client_iden=&type=note&title=test&body=testbody';


}, 1000);

	
  var interval = 60000; // The display interval, in minutes.

	//setTimeout(function() {
  setInterval(function() {
    if (
      JSON.parse(localStorage.isActivated) &&
        localStorage.frequency <= interval
    )
	{

	//pushBullet('test', 'test');
    	console.error('checking... ' + new Date());    			
		checkIfReserved('별관>콘도', 'all', '100200010000', '2017-05-04');
		checkIfReserved('별관>콘도', 'all', '100200010000', '2017-05-05');
		checkIfReserved('별관>콘도', 'all', '100200010000', '2017-05-06');
				
		//checkIfReserved('별관>투투', 'all', '100200020000', '2016-04-02');
		//checkIfReserved('별관>투투', 'all', '100200020000', '2016-04-09');
		//checkIfReserved('별관>투투', 'all', '100200020000', '2016-04-16');
		//checkIfReserved('별관>투투', 'all', '100200020000', '2016-04-23');
		//checkIfReserved('별관>투투', 'all', '100200020000', '2016-04-30');
		

		//interval = 0;
    }
  }, interval);
//}


function checkIfReserved(name, category1, category2, startDate)
{
	var url = 'http://namihotel.araweb.kr/nami_reserve_view_3.php';
	var params = 'category1=' + category1 + '&category2=' + category2 + '&start_date=' + startDate;

	$.ajax({
        type:"POST",
        url:url,
        data:params,
        success:function(res){

			//var favoriteCondo = '후리지아,시인의집,강가별장,사슴,토끼,까치,타조,청설모';
			var favoriteCondo = '후리지아,시인의집,강가별장';
        	var arHtml = res.split("<div class='category3_list'  >");
        	for (var i=0; i<arHtml.length; i++)
        	{
        		if (arHtml[i] == '')
        			continue;

        		//console.error('checking... ' + startDate)
        		var condoName = arHtml[i].substring(arHtml[i].indexOf('</div>')+6, arHtml[i].indexOf("<div style='height:15px"));
				condoName = condoName.substring(0, condoName.indexOf('<br>'));
        		var reserveStatus = arHtml[i].substring(arHtml[i].indexOf('reserve_'), arHtml[i].indexOf('</div></div>'));

				//console.error('condoName : ' + condoName);

				//if (!(condoName.indexOf('후리지아') > -1 || condoName.indexOf('시인의집') > -1 || condoName.indexOf('강가별장') > -1))
				if (favoriteCondo.indexOf(condoName) == -1)
				{
					continue;
				}
				
        		if (reserveStatus.indexOf('예약가능') > -1)
        		{
        			showNotify('[' + startDate + '] ' + condoName + ' 예약가능', 'Tel : 031-580-8000');
        			pushBullet('[' + startDate + '] ' + condoName + ' 예약가능, Tel : 031-580-8000', '[' + startDate + '] ' + condoName + ' 예약가능, Tel : 031-580-8000');
        		}
        		else
        		{
        			console.error('[' + startDate + '] ' + condoName + " 예약불가 >> " + reserveStatus);
        		}
        	}
        },
        error:function(e){
            //alert("error : " + e.responseText);
        	console.error(e);
        }
    });

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
	    	console.error(JSON.stringify(res))
	    }
	});
}
