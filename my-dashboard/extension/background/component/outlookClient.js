import HttpRequest from "../../util/httpRequest.js";

export default class OutlookClient {
    constructor() {
        this.API_URL = 'https://mail.spectra.co.kr';
    }

    requestOptions() {
        return {
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }

    async checkLogin() {
        try {
            const response = await HttpRequest.requestText(`${this.API_URL}/owa/ping.owa?UA=0`);
            return !response.redirected && response.status === 242;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    async findList() {
        const _this = this;
        const data = {};

        const options = {
            method: 'POST',
            headers: _this.requestOptions().headers,
            body: JSON.stringify(data)
        };

        const response = await HttpRequest.request(`${this.API_URL}/owa/sessiondata.ashx?appcacheclient=0`, options);
        const inbox = response.findFolders.Body.ResponseMessages.Items[0].RootFolder.Folders.filter(folder => folder.DisplayName === '받은 편지함')[0];
        const unreadCount = inbox.UnreadCount;
        const conversations = response.findConversation.Body.Conversations;

        return { conversations, unreadCount };
    }
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status != 'complete')
        return;

    if (tab.url === `${this.API_URL}/owa/`) {
        chrome.runtime.sendMessage({action: 'outlookClient.login'});
    } else if (tab.url.startsWith(`${this.API_URL}/owa/auth/logon.aspx`)) {
        chrome.runtime.sendMessage({action: 'outlookClient.logout'});
    }
});