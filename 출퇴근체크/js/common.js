
function saveLocalStorage(key, value) {
    /*chrome.storage.local.set(value, function() {
        log('syncStorage saved : ' + JSON.stringify(value));
    });*/

    localStorage[key] = value;

    //chrome.storage.setItem(key, value);
}

function getStorage(key) {
    return localStorage[key];
    /*chrome.storage.local.get(['CLOCK_IN_DATE'], function(result) {
        log('syncStorage value is : ' + JSON.stringify(result));
    });*/
}

function requestAjax(options)
{
    log('======= Ajax Request ======');
    log('[url] ' + options.url);
    log('[method] ' + options.method);
    log('[headers] ' + options.headers);
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

/*function requestAjax(method, url, params, beforeSend, onSuccess)
{
    return $.ajax({
        type: method,
        url: url,
        data: params,
        dataType: "json",
        contentType: "application/json", // request payload로 전송됨
        beforeSend: function(xhr) {
            console.log('[requestAjax] '+  url)	;
        },
        success: function(res){
            onSuccess(res);
        }
    });
}*/

function log(str)
{
    console.log('[' + getCurrDate()  + ' ' + getCurrTime() + '] ' + str);
}

function logWithTime(str)
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

Date.prototype.addDays = function(days)
{
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}

Date.prototype.addMinutes = function(minutes)
{
    var dat = new Date(this.valueOf());
    dat.setTime(dat.getTime() + minutes * 60000);
    return dat;
}

function showNotify(title, message) {

    chrome.runtime.sendMessage({action: "notification", title: title, message: message}, function(response) {
        console.log("Response: ", response);
    });

}
