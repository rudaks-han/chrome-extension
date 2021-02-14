function debug(str) {
	chrome.extension.getBackgroundPage().console.log('[popup.js] ' + str);
}

const useFlagStorageId = 'victoryLogCollector_useFlag';

const command = {
	capture : (e) => {
		window.close();
		chrome.runtime.sendMessage({action: "capture"}, (response) => {});
	},
	showOptions : () => {
		chrome.tabs.create({'url': 'options.html'});
	},
};

function getUseFlagOnStorage() {
	chrome.storage.sync.get('useFlag', (items) => {
		if (!items['useFlag'] || items['useFlag'] === 'Y') {
			setUseFlagChecked(true);
		} else {
			setUseFlagChecked(false);
		}
	});


}

function setUseFlagChecked(flag) {
	if (flag)
		$('.ui.toggle.checkbox.useFlag').checkbox('set checked');
	else
		$('.ui.toggle.checkbox.useFlag').checkbox('set unchecked');
}

(function($) {
    const load = function() {
        $('#windows').on('click', command.capture);
		$('#showOptions').on('click', command.showOptions);

		getUseFlagOnStorage();

		const btnUseFlag = $('.ui.toggle.checkbox.useFlag');
		btnUseFlag.checkbox({
			onChecked:  () => {
				console.log('checked')
				const jsonValue = {
					'useFlag': 'Y'
				};
				chrome.storage.sync.set(jsonValue, () => {
					console.log(jsonValue)
				});

				chrome.runtime.sendMessage({action: "change-useflag", value: 'Y'}, (response) => {});
			},
			onUnchecked: () => {
				console.log('unchecked');
				const jsonValue = {
					'useFlag': 'N'
				};
				chrome.storage.sync.set(jsonValue, () => {
					console.log(jsonValue)
				});

				chrome.runtime.sendMessage({action: "change-useflag", value: 'N'}, (response) => {});
			}
		});
    };

    $(load);
})(jQuery);
