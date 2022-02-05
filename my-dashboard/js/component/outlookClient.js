
export default class OutlookClient {
    constructor() {}

    requestOptions() {
        return {
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }

    async checkLogin() {
        try {
            return await fetch('https://mail.spectra.co.kr/owa/ping.owa?UA=0')
                //.then(response => response.json())
                .then(response => {
                    return !response.redirected && response.status === 242;
                });
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

        return await fetch(`https://mail.spectra.co.kr/owa/sessiondata.ashx?appcacheclient=0`, options)
            .then(response => response.json())
            .then(response => {
                const inbox = response.findFolders.Body.ResponseMessages.Items[0].RootFolder.Folders.filter(folder => folder.DisplayName === '받은 편지함')[0];
                const unreadCount = inbox.UnreadCount;
                const conversations = response.findConversation.Body.Conversations;

                return { conversations, unreadCount }
            });
    }
}
