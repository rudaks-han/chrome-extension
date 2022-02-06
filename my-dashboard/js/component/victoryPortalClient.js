
export default class VictoryPortalClient {
    constructor() {}

    requestOptions() {
        return {
            headers: {
                Authorization: `Basic a21oYW46THRzRCBmNm5GIHFIUGcgMFdXZCB2dWxjIHA5aVE=`
            }
        };
    }

    async findList() {
        const _this = this;

        return await fetch('https://victory-portal.spectra.co.kr/wp-json/wp/v2/posts?per_page=10', _this.requestOptions())
            .then(response => response.json())
            .then(response => response);

        /*try {
            fetch()
            const response = await axios.get(`https://victory-portal.spectra.co.kr/wp-json/wp/v2/posts?per_page=10`, _this.getAxiosConfig());
            _this.mainWindowSender.send('authenticated', true);
            _this.mainWindowSender.send('findListCallback', response.data);
        } catch (error) {
            ShareUtil.printAxiosError(error);
        }*/
    }
}
