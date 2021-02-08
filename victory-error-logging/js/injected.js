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


function codeToInject() {

    function handleCustomError(message, stack) {
        if(!stack) {
            stack = (new Error()).stack.split("\n").splice(2, 4).join("\n");
        }

        var stackLines = stack.split("\n");
        var callSrc = (stackLines.length > 1 && (/^.*?\((.*?):(\d+):(\d+)/.exec(stackLines[1]) || /(\w+:\/\/.*?):(\d+):(\d+)/.exec(stackLines[1]))) || [null, null, null, null];

        document.dispatchEvent(new CustomEvent('ErrorToExtension', {
            detail: {
                stack: stackLines.join("\n"),
                url: callSrc[1],
                line: callSrc[2],
                col: callSrc[3],
                text: message
            }
        }));
    }

    // handle uncaught promises errors
    window.addEventListener('unhandledrejection', function(e) {
        if (typeof e.reason === 'undefined') {
            e.reason = e.detail;
        }
        handleCustomError(e.reason.message, e.reason.stack);
    });

    // handle console.error()
    var consoleErrorFunc = window.console.error;
    window.console.error = function() {
        var argsArray = [];
        for(var i in arguments) { // because arguments.join() not working! oO
            argsArray.push(arguments[i]);
        }
        consoleErrorFunc.apply(console, argsArray);

        handleCustomError(argsArray.length == 1 && typeof argsArray[0] == 'string' ? argsArray[0] : JSON.stringify(argsArray.length == 1 ? argsArray[0] : argsArray));
    };

    // handle uncaught errors
    window.addEventListener('error', function(e) {
        if(e.filename) {
            document.dispatchEvent(new CustomEvent('ErrorToExtension', {
                detail: {
                    stack: e.error ? e.error.stack : null,
                    url: e.filename,
                    line: e.lineno,
                    col: e.colno,
                    text: e.message
                }
            }));
        }
    });

    // handle 404 errors
    window.addEventListener('error', function(e) {
        var src = e.target.src || e.target.href;
        var baseUrl = e.target.baseURI;
        if(src && baseUrl && src != baseUrl) {
            document.dispatchEvent(new CustomEvent('ErrorToExtension', {
                detail: {
                    is404: true,
                    url: src
                }
            }));
        }
    }, true);
}

var script = document.createElement('script');
script.textContent = '(' + codeToInject + '())';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);