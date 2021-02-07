(function(xhr, document) {
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

    XHR.send = function(data) {
        this.addEventListener('load', function() {
            var url = this._url ? this._url.toLowerCase() : this._url;

            var status = String(this.status);
            if (status.startsWith('4') || status.startsWith('5')) {
                console.log('--------- error ---------');
                console.log('status: ' + this.status);
                console.log('url: ' + url);

                var responseText = '{}';

                if ( this.responseType != 'blob' && this.responseText) {
                    try {
                        responseText = JSON.parse(this.responseText);
                    } catch(err) {
                        console.log("Error in responseType try catch");
                        console.log(err);
                    }
                }

                var json = {
                    url,
                    data,
                    status,
                    responseText
                }

                document.dispatchEvent(new CustomEvent('xhrErrorEvent', { detail: json }));
            }
        });

        return send.apply(this, arguments);
    };


})(XMLHttpRequest, document);
