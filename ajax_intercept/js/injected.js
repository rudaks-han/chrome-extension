(function(xhr) {

    // 포함되는 글자
    var matchText = ['LogoutTimeoutProcessor'];
    var matchUrl = 'http://172.16.100.51:5601';

    var XHR = XMLHttpRequest.prototype;

    var open = XHR.open;
    var send = XHR.send;
    var setRequestHeader = XHR.setRequestHeader;

    XHR.open = function(method, url) {
        this._method = method;
        this._url = url;
        this._requestHeaders = {};
        this._startTime = (new Date()).toISOString();

        return open.apply(this, arguments);
    };

    XHR.setRequestHeader = function(header, value) {
        this._requestHeaders[header] = value;
        return setRequestHeader.apply(this, arguments);
    };

    XHR.send = function(postData) {

        this.addEventListener('load', function() {
            var endTime = (new Date()).toISOString();

            var myUrl = this._url ? this._url.toLowerCase() : this._url;
            console.error('myUrl : '  + myUrl)
            if(myUrl && myUrl.includes(matchUrl)) {
                if ( this.responseType != 'blob' && this.responseText) {
                    // responseText is string or null
                    try {

                        // here you get RESPONSE TEXT (BODY), in JSON format, so you can use JSON.parse
                        var responseText = JSON.parse(this.responseText);
                        if (responseText.responses) {
                            var responses = responseText.responses;
                            responses.forEach(function(element) {
                                var hits = element.hits.hits;

                                hits.forEach(function(el) {
                                    var message = el._source.message;
                                    matchText.forEach(function(text) {
                                        if (message.indexOf(text) > -1) {
                                            matched(el);
                                        }
                                    })
                                })
                            })
                        }
                    } catch(err) {
                        console.log("Error in responseType try catch");
                        console.log(err);
                    }
                }

            }
        });

        return send.apply(this, arguments);
    };

})(XMLHttpRequest);

function matched(el) {
    var id = el._id;
    var message = el._source.message;

    setStorage(id, message);
}

function setStorage(id, value) {
    var json = {
        id: id,
        value: value
    };

    console.log(localStorage)
    /*chrome.storage.local.set(json, function () {
        //logger.debug(JSON.stringify(jsonValue));
        console.log('config updated : ' + JSON.stringify(json));
    });*/
}

function getStorage(id) {
    chrome.storage.local.get(id, function(items) {

        if (typeof items[id] != 'undefined')
        {

        }
        else
        {

        }
    });
}