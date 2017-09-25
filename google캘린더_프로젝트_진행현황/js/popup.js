(function($) {

    var load = function()
	{
    	
        $('#manmonth').on('click', function() {
			window.open('https://docs.google.com/spreadsheets/d/1DRbQ6DpwtTgqpCSJkl_AinO5HPyZXD0CTORbg5S3uqI/edit#gid=0');
		});

		$('#wbs').on('click', function() {
			window.open('https://www.dropbox.com/s/29fy0wnxoq992dw/EER_v1.9_WBS.xlsx?dl=0');
		});
		
		$('#jira').on('click', function() {
			window.open('http://211.63.24.57:8080/secure/RapidBoard.jspa?rapidView=28');
		});

    };

    $(load);
})(jQuery);