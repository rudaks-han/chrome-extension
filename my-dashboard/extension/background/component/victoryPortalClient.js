import HttpRequest from "../../util/httpRequest.js";

export default class VictoryPortalClient {
    constructor() {
        this.API_URL = 'https://victory-portal.spectra.co.kr';
    }

    requestOptions() {
        return {
            headers: {
                Authorization: `Basic a21oYW46THRzRCBmNm5GIHFIUGcgMFdXZCB2dWxjIHA5aVE=`
            }
        };
    }

    async findList() {
        const _this = this;

        return await HttpRequest.request(`${this.API_URL}/wp-json/wp/v2/posts?per_page=10`, _this.requestOptions());
    }
}
