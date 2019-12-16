function debug(str)
{
	chrome.extension.getBackgroundPage().console.error('[popup.js] ' + str);
}

var command =
{
	checkQuality : function(e)
	{
		chrome.runtime.sendMessage({action: "checkQuality"}, function(response) {});
		window.close();
	},
	
	gotoJenkins : function(e)
	{
		chrome.runtime.sendMessage({action: "gotoJenkins"}, function(response) {});
		window.close();
	},
	
	gotoSonarqube : function(e)
	{
		chrome.runtime.sendMessage({action: "gotoSonarqube"}, function(response) {});
		window.close();
	},
	
	showOptions : function() 
	{
		chrome.tabs.create({'url': 'options.html'});
	}
};

(function($) {

    var load = function()
	{
        $('#checkQuality').on('click', command.checkQuality);		
		$('#gotoJenkins').on('click', command.gotoJenkins);		
		$('#gotoSonarqube').on('click', command.gotoSonarqube);		
		$('#showOptions').on('click', command.showOptions);		
		
    };

    $(load);
})(jQuery);
