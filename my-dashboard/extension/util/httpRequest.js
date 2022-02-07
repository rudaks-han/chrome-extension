export default class HttpRequest {

    static async request(url) {
        return await fetch(url)
            .then(response => response.json())
            .then(response => response)
            .catch(e => {
                return e.response;
            });
    }

    static async request(url, options) {
        return await fetch(url, options)
            .then(response => response.json())
            .then(response => response)
            .catch(e => {
                return e.response;
            });
    }

    static async requestText(url) {
        return await fetch(url)
            .then(response => response)
            .catch(e => {
                return e.response;
            });
    }

    static async requestAll(urls, options) {
        const _this = this;
        return Promise.all(_this.toPromise(urls, options))
            .then(responses => {
                return responses
            });
    }

    static toPromise(urls, options) {
        const promises = [];
        urls.map(url => {
            promises.push(fetch(url, options).then(response => response.json()));
        })

        return promises;
    }
}
