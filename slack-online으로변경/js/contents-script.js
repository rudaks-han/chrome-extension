$(document).ready(function() {
	//var getApiTokenTimer = setInterval(function() {
	
		var actualCode = ['localStorage.setItem("api_token", boot_data.api_token);'].join('\n');
		
		var script = document.createElement('script');
		script.textContent = actualCode;
		(document.head||document.documentElement).appendChild(script);
		script.parentNode.removeChild(script);
		
	//}, 60*60*1000);
	var getApiTokenTimer = setInterval(function() {
		console.error('getApiTokenTimer checking...' + new Date());
		var bCheck = true;
		
		var d = new Date();
	    var weekday = d.getDay()
	    var hour = d.getHours();
	    
		if (weekday == 6 || weekday == 0) // 토, 일 제외
		{
			console.error('weekday == 6 or weekday == 0');
			bCheck = false;
		}
		else if (hour >= 18 || hour < 8) // 근무시간에만
		{
			console.error('getHours >= 18 || getHours < 8');
			bCheck = false;
		}
		
		if (bCheck)
		{
			var params = 'token=' + localStorage.getItem('api_token') + '&set_active=true&_attemps=1'; 
			$.ajax({
		        type:"POST",  
		        url:'/api/users.setActive?t=' + d.getTime() + '&dummy=',
		        data:params,      
		        success:function(response)
		        {   
		        	console.error(JSON.stringify(response));
		        },   
		        error:function(e)
		        {
		        	console.error(e.description);
		        }  
		    });  
		}
		
	}, 1*60*1000);
});
