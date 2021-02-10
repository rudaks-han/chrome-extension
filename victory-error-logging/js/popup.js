function debug(str) {
	chrome.extension.getBackgroundPage().console.error('[popup.js] ' + str);
}

const command = {
	capture : function(e) {
		window.close();
		chrome.runtime.sendMessage({action: "capture"}, function(response) {});
	}
};

(function($) {

    const load = function() {
    	// 윈도우 캡쳐하기
        $('#windows').on('click', command.capture);
    };

    $(load);
})(jQuery);
