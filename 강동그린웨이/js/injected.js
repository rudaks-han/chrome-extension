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
            if ( this.responseType != 'blob' && this.responseText) {
                try {
                    var responseText = JSON.parse(this.responseText);
                    console.error(responseText)

                    if (responseText.data.bookProductList) {
                        responseText.data.bookProductList.forEach(function(el) {
                            const productName = el.product_name;
                            const selectYn = el.select_yn;

                            console.log(el);
                            console.log('productName : ' + productName);
                            console.log('selectYn : ' + selectYn);
                        })
                    }

                } catch(err) {
                    console.log("Error in responseType try catch");
                    console.log(err);
                }
            }
        });

        return send.apply(this, arguments);
    };

})(XMLHttpRequest);
