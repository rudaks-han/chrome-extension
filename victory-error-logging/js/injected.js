(function(xhr) {
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
            var url = this._url ? this._url.toLowerCase() : this._url;

            var status = String(this.status);
            if (status.startsWith('4') || status.startsWith('5')) {
                console.log('--------- error ---------');
                console.log('status: ' + this.status);
                console.log('url: ' + url);

                if ( this.responseType != 'blob' && this.responseText) {
                    try {
                        var responseText = JSON.parse(this.responseText);
                        console.log('response: ' + this.responseText);
                    } catch(err) {
                        console.log("Error in responseType try catch");
                        console.log(err);
                    }
                }

            }

/*
            if(myUrl) {
                if (postData) {
                    if (typeof postData === 'string') {
                        try {
                            this._requestHeaders = postData;
                        } catch(err) {
                            console.log('Request Header JSON decode failed, transfer_encoding field could be base64');
                            console.log(err);
                        }
                    } else if (typeof postData === 'object' || typeof postData === 'array' || typeof postData === 'number' || typeof postData === 'boolean') {
                        // do something if you need
                    }
                }

                var responseHeaders = this.getAllResponseHeaders();
                if ( this.responseType != 'blob' && this.responseText) {
                    try {
                        var responseText = JSON.parse(this.responseText);
                        if (responseText.responses) {
                            var responses = responseText.responses;
                        }
                    } catch(err) {
                        console.log("Error in responseType try catch");
                        console.log(err);
                    }
                }

            }*/
        });

        return send.apply(this, arguments);
    };


})(XMLHttpRequest);
