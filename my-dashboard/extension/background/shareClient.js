import StorageUtil from '../util/storageUtil.js';

export default class ShareClient {
    constructor() {}

    async setStorage(data) {
        console.log('ShareClient#setStorage data');
        console.log(data)
        await StorageUtil.setStorageData(data);
    }

    async getStorage(data) {
        console.log('ShareClient#getStorage key');
        console.log(data['key']);
        return await StorageUtil.getStorageData(data['key']);
    }

    async clearStorage() {
        console.log('ShareClient#clearStorage');
        return await StorageUtil.clearStorageData();
    }
}
