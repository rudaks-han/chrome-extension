import HttpRequest from "../../util/httpRequest.js";

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

        return await HttpRequest.request('https://victory-portal.spectra.co.kr/wp-json/wp/v2/posts?per_page=10', _this.requestOptions());
    }
}
