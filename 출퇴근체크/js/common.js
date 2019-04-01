
function saveLocalStorage(key, value)
{
    localStorage[key] = value;
}

function getLocalStorage(key)
{
    return localStorage[key];
}

function requestAjax(options)
{
    log('======= Ajax Request ======');
    log('[url] ' + options.url);
    log('[method] ' + options.method);
    if (options.headers)
        log('[headers] ' + options.headers);
    if (options.data)
        log('[data] ' + options.data);
    log('=========================');

    return $.ajax({
        type: options.method,
        url: options.url,
        headers: options.headers,
        data: options.param,
        dataType: "json",
        contentType: "application/json", // request payload로 전송됨
        success : options.success,
        error : options.error,
        complete : options.complete
    });
}

function log(str)
{
    console.log('[' + getCurrDate()  + ' ' + getCurrTime() + '] ' + str);
}

function getCurrDate()
{
    var currDate = new Date();
    var year = currDate.getFullYear();
    var month = (currDate.getMonth() + 1);
    if (month < 10)
        month = '0' + month;
    var day = currDate.getDate();
    if (day < 10)
        day = '0' + day;

    return year + '-' + month + '-' + day;
}

function getCurrTime()
{
    var currDate = new Date();
    var hour = currDate.getHours();
    if (hour < 10)
        hour = '0' + hour;
    var minute = currDate.getMinutes();
    if (minute < 10)
        minute = '0' + minute;
    var second = currDate.getSeconds();
    if (second < 10)
        second = '0' + second;

    return hour + ':' + minute + ':' + second;
}

function getCurrYear()
{
    var currDate = new Date();
    return currDate.getFullYear();
}

function getCurrMonth()
{
    var currDate = new Date();
    var month = currDate.getMonth() + 1;
    if (month < 10)
        month = '0' + month;

    return month;
}

function getCurrDay()
{
    var currDate = new Date();
    var day = currDate.getDate();
    if (day < 10)
        day = '0' + day;

    return day;
}

Date.prototype.addDays = function(days)
{
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}

Date.prototype.addMinutes = function(minutes)
{
    var dat = new Date(this.valueOf());
    dat.setTime(dat.getTime() + minutes * 60 * 1000);
    return dat;
}

Date.prototype.addHours = function(hours)
{
    var dat = new Date(this.valueOf());
    dat.setTime(dat.getTime() + hours * 60 * 60 * 1000);
    return dat;
}

function showNotify(title, message) {

    chrome.runtime.sendMessage({action: "notification", title: title, message: message}, function(response) {
        console.log("Response: ", response);
    });

}

// chrome.storage.sync에 저장된 정보를 promise로 가져온다.
function promiseStorageSync(syncStorageId, userConfigId)
{
    return new Promise(function(resolve, reject) {
        chrome.storage.sync.get(syncStorageId, function(items) {
            syncStorage[syncStorageId] = items[syncStorageId];
            if (userConfigId) userConfig[userConfigId] = items[syncStorageId];

            resolve('success')
        });
    })
}

/*
let date = new Date();
let endWorkTimeDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), '17', '00', 0);
console.error('endWorkTimeDate : ' + endWorkTimeDate);

clockOutMarkingTime = endWorkTimeDate.addMinutes(-5 * 60 + "1");

console.error('clockOutMarkingTime : ' + clockOutMarkingTime);
*/
