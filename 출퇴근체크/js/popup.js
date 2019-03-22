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
})(jQuery);
