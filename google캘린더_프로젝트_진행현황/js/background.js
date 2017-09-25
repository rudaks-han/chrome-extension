var tabUrl = 'https://docs.google.com/spreadsheets/d/1DRbQ6DpwtTgqpCSJkl_AinO5HPyZXD0CTORbg5S3uqI/edit';

function showNotify(title, message) {
	if (Notification && Notification.permission !== "granted") {
	    Notification.requestPermission(function (status) {
	      if (Notification.permission !== status) {
	        Notification.permission = status;
	      }
	    });
	  }
	  if (Notification && Notification.permission === "granted") {
	      //var n = new Notification(title + "\n" + message);
		 
			var id = new Date().getTime() + '';
			var options = {
				type: 'basic',
				iconUrl: '/images/Angry-Face.png',
				title: title,
				message: message
			 };
			 
			 var start = Date.now();
			chrome.notifications.create(id, options, function() {
				setInterval(function() {
					var time = Date.now() - start;
					chrome.notifications.update(id, {
						message,
					}, function() { });
				}, 1000);
			});
			
			chrome.notifications.onClicked.addListener(function(notificationId, byUser) {
				//chrome.tabs.create({url: "https://docs.google.com/spreadsheets/d/1DRbQ6DpwtTgqpCSJkl_AinO5HPyZXD0CTORbg5S3uqI/edit#gid=0"});
				openTab();
				chrome.notifications.clear(notificationId, function() {});
			});
	    }
}
  
var tabId = null;
 function openTab()
{
	chrome.windows.getAll({"populate" : true}, function(windows) {
		var existingTab = false;
		
		for (var i = 0; i < windows.length; i++)
		{
			for (var j = 0; j < windows[i].tabs.length; j++)
			{	
				var _url = windows[i].tabs[j].url;
				
				//console.error('______url : ' + _url);
				
				if (typeof _url != 'undefined')
				{
					if (_url.indexOf(tabUrl) > -1)
					{
						existingTab = true;
						tabId = windows[i].tabs[j].id;
						break;
					}
				}
				
			}
		}
		
		console.error('existingTab : ' + existingTab);
		if (existingTab)
		{
			chrome.tabs.update(tabId, {selected : true}, function() {
			});
		}
		else
		{
				console.error('create....');
			chrome.tabs.create({url:tabUrl}, function(tab) {
				tabId = tab.id;				
				console.error('___created');
			});
		}
	});
}

  
  var interval = 1000*60*10; // The display interval, in minutes.
  //var interval = 1000*5*1; // The display interval, in minutes.
    
  var timer = setInterval(function() {
      var currDate = new Date();
      
	  console.error('checking : ' + currDate);
	  
	  //console.error(currDate.getFullYear() + ', ' + currDate.getMonth() + ', ' + currDate.getDate());
	  
	  var year = currDate.getFullYear();
	  var month = currDate.getMonth() + 1;
	  if (String(month).length == 1)
		month = '0' + month;
	  var day = currDate.getDate();
	  if (String(day).length == 1)
		day = '0' + day;
	  
		var dateFrom = "2017/02/22";
		var dateTo = "2017/05/31";
		var currDateFormat = year + '/' + month + '/' + day;
		//currDateFormat = "2017/01/01";
		

		var from = Date.parse(dateFrom);
		var to   = Date.parse(dateTo);
		var check = Date.parse(currDateFormat);
		
		if (check <= to && check >= from) 
		{
			console.error('포함됨');
		}
		else
		{
			console.error('포함안됨 >> clearTimeout');
			clearTimeout(timer);
		}
	  
	  
		if (!(currDate.getDay() == 0 || currDate.getDay() == 6)) // 토, 일 제외
		{
			var min = currDate.getMinutes();
			//if (currDate.getHours() == 18 && min >= 0 && min < 10) // 17시대에 체크
			if (currDate.getHours() == 17 && min >= 0 && min < 10) // 17시대에 체크			
		   {
				showNotify('투입공수 등록', 'v1.9 스프린트 투입공수를 등록하세요~');
		   }
		}
		
  }, interval);
  
