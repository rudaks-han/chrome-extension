function debug(str)
{
	chrome.extension.getBackgroundPage().console.log('[popup.js] ' + str);
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

let saveStorageSync = {};

function startChecking(callback)
{
	saveAllStorageSync(callback);
}

function checkQuality() {
	startChecking(() => {
		const qualityChecker = new QualityChecker();

		qualityChecker.startCheck()
			.then(responses => {
				let hasError = false;
				let messages = '';
				responses.map(response => {
					if (response.hasError) {
						hasError = true;
						messages += '[' + response.componentName + '] <font color="red">Failed</font>' + '<br/>';
					}
				});

				if (hasError) {
					$('#component-errors').html('<b>SonarQube Quality</b><br/>' + messages);
				} else {
				}
			});
	});
}

(function($) {

    const load = () => {
        $('#checkQuality').on('click', command.checkQuality);		
		$('#gotoJenkins').on('click', () => command.openWindow('http://211.63.24.41:8080/view/attic/'));
		$('#gotoSonarqube').on('click', () => command.openWindow('http://211.63.24.41:9000/projects'));
		$('#gotoJira').on('click', () => command.openWindow('https://enomix.atlassian.net/secure/RapidBoard.jspa?rapidView=41&projectKey=ATTP'));
		$('#showOptions').on('click', command.showOptions);

		checkQuality();
    };

    $(load);
})(jQuery);
