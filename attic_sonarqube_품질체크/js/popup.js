function debug(str)
{
	chrome.extension.getBackgroundPage().console.error('[popup.js] ' + str);
}

const command =
{
	checkQuality : function(e)
	{
		chrome.runtime.sendMessage({action: "checkQuality"}, function(response) {});
		window.close();
	},

	openWindow : function(url)
	{
		chrome.runtime.sendMessage({action: "openWindow", url}, function(response) {});
		window.close();
	},
	
	showOptions : function() 
	{
		chrome.tabs.create({'url': 'options.html'});
	}
};

(function($) {

    const load = function()
	{
        $('#checkQuality').on('click', command.checkQuality);		
		$('#gotoJenkins').on('click', () => command.openWindow('http://211.63.24.41:8080/view/attic/job/platform/'));
		$('#gotoSonarqube').on('click', () => command.openWindow('http://211.63.24.41:9000/dashboard?id=spectra.attic%3Aplatform'));
		$('#gotoJira').on('click', () => command.openWindow('https://enomix.atlassian.net/secure/RapidBoard.jspa?rapidView=41&projectKey=ATTP'));
		$('#showOptions').on('click', command.showOptions);
		
    };

    $(load);
})(jQuery);
