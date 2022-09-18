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
                    //console.error(this.responseText)
                    var responseText = JSON.parse(this.responseText);
                    if (responseText.data.bookProductList) {
                        responseText.data.bookProductList.forEach(function(el) {

                            //console.log(el);

                            //console.log('selectYn : ' + selectYn);

                            const statusCode = el.status_code;
                            const productName = el.product_name;

                            if (!validBookingState(statusCode)) {
                                console.log("[불가]" + productName + " : " + statusCode);
                            } else {

                                if (validPlace(statusCode)) {
                                    const startDate = getParam(postData, 'start_date');
                                    console.log('statusCode : ' + statusCode);
                                    console.log('productName : ' + productName);

                                    console.error("[가능]" + productName + " : " + statusCode);

                                    const title = `[${startDate}][${productName}] 강동그린웨이 예약가능`;
                                    const body = `[${startDate}] ${productName}`;
                                    const url = 'https://camp.xticket.kr/web/main';
                                    pushBullet(title, body, url);
                                }
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

function validPlace(productName) {
    if (productName.indexOf('청단풍') > -1
        || productName.indexOf('마로') > -1
        || productName.indexOf('자작') > -1
        || productName.indexOf('매화') > -1) {
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

function pushBullet(title, body, url)
{
    var params = {};
    params.type = 'note';
    params.title = title;
    params.body = body;
    params.url = url;
    $.ajax({
        type:"POST",
        //url:'https://api.pushbullet.com/v2/users/me',
        url:'https://api.pushbullet.com/v2/pushes',
        data:params,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer o.BsIzlJe5UhFijfgNk33yjlAZO3tFvwqM');
            //xhr.setRequestHeader('Authorization', 'Bearer nXmkzdhFQae9zY6YRGScOPTmoKnoT77m'); // 승엽
        },
        success:function(res){
            console.error(JSON.stringify(res))
        }
    });
}
