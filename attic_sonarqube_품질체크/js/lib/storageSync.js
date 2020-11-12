

function getAllStorageSync() {
    return new Promise(function(resolve, reject) {
        chrome.storage.local.get(null, function(items) {
            resolve(items);
        });
    });
}

function saveAllStorageSync(callback) {
    getAllStorageSync().then((items) => {
        for (const key in items) {
            saveStorageSync[key] = items[key];
        }

        callback();
    });
}