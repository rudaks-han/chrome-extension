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
                    if (responseText.data.bookProductList) {
                        responseText.data.bookProductList.forEach(function(el) {
                            const statusCode = el.status_code;
                            const productName = el.product_name;


                            //console.log(el);

                            //console.log('selectYn : ' + selectYn);

                            if (!validBookingState(statusCode)) {
                                console.log("[불가]" + productName + " : " + statusCode);
                            } else {
                                console.error("[가능]" + productName + " : " + statusCode);
                            }


                            if (validBookingState(statusCode)) {
                                const startDate = getParam(postData, 'start_date');
                                console.log('statusCode : ' + statusCode);
                                console.log('productName : ' + productName);
                            }
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

function validBookingState(statusCode) {
    if (!(statusCode == '0' || statusCode == '3')) {
        return true;
    } else {
        return false;
    }
}

function getParam(params, name) {
    var sval = "";
    params = params.split("&");
    for (var i = 0; i < params.length; i++) {
        temp = params[i].split("=");
        if ([temp[0]] == name) { sval = temp[1]; }
    }

    return sval;
}

function goNextMonth() {
    model.goNextMonth();
}