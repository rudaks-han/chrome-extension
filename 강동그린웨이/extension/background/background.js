function goNextMonth() {
    return model.goNextMonth();
}

chrome.runtime.onMessage.addListener(
    function(message, callback) {
        /*if (message.action === 'goNextMonth'){
            chrome.tabs.query({active: true, currentWindow: true}).then(([tab]) => {
                chrome.scripting.executeScript(
                    {
                        target: {tabId: tab.id},
                        func: goNextMonth
                        // function: () => {}, // files or function, both do not work.
                    })
            })
        }*/
    });

//chrome.alarms.create('checkUserSession', { when:Date.now(), periodInMinutes: 5}); // 5분


/*
chrome.alarms.onAlarm.addListener(alarm => {
    const { name, periodInMinutes, scheduledTime } = alarm;
    switch (name) {
        case 'checkUserSession':
            workHourTimer.checkUserSession();
            break;
        case 'checkCalendar':
            workHourTimer.checkCalendar();
        case 'checkWorkHour':
            workHourTimer.checkWorkHour();
        default:
    }

});*/

/*

chrome.runtime.onInstalled.addListener(async () => {
    console.error('installed')
    const rules = [{
        id: 1,
        action: {
            type: 'modifyHeaders',
            requestHeaders: [
                {
                    header: 'Referer',
                    operation: 'set',
                    value: 'https://naver.com',
                },
                {
                    header: 'Remote Address',
                    operation: 'set',
                    value: '13.125.114.54:443',
                },
                {
                    header: 'Origin',
                    operation: 'set',
                    value: 'https://camp.xticket.kr',
                }
                ],
        },
        condition: {
            domains: [chrome.runtime.id],
            urlFilter: '|https://camp.xticket.kr',
            resourceTypes: ['xmlhttprequest'],
        },
    }];
    await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: rules.map(r => r.id),
        addRules: rules,
    });

    console.error('__updated rule')
});*/
