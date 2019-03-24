function debug(str)
{
	chrome.extension.getBackgroundPage().console.error('[popup.js] ' + str);
}

var command =
{
	
	gotoDaouoffice : function(e)
	{
		chrome.runtime.sendMessage({action: "gotoDaouoffice"}, function(response) {});
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
        $('#gotoDaouoffice').on('click', command.gotoDaouoffice);
		$('#showOptions').on('click', command.showOptions);		
		
    };

    $(load);

    //#clockUseFlag;

    chrome.storage.sync.get('use-flag', function (items) {

        var useFlag = items['use-flag'];
		if (useFlag == 'Y')
		{
			$('#clockUseFlagText').html('(사용중) <img src="images/rolling-icon.png" style="vertical-align:text-bottom">').css({'color': 'blue'});
		}
		else
		{
            $('#clockUseFlagText').html('(사용안함)').css({'color': 'red'});
		}
			
    });
})(jQuery);
