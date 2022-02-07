import ShareUtil from '../util/shareUtil.js';

export default class ShareClient {
    constructor() {}

    async setStorage(data) {
        await ShareUtil.setStorageData(data);
    }

    async getStorage(key) {
        console.error('getStorage key')
        console.error(key)
        return await ShareUtil.getStorageData(key);
    }
}
