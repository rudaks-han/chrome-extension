(function(window) {
    function handleCustomError(message, stack) {
        if (!message) message = 'Uncaught (in promise)';

        if(!stack) {
            stack = (new Error()).stack.split("\n").splice(2, 4).join("\n");
        }

        if (stack.length) {
            const stackLines = stack.split("\n");
            const callSrc = (stackLines.length > 1 && (/^.*?\((.*?):(\d+):(\d+)/.exec(stackLines[1]) || /(\w+:\/\/.*?):(\d+):(\d+)/.exec(stackLines[1]))) || [null, null, null, null];

            document.dispatchEvent(new CustomEvent('jsErrorEvent', {
                detail: {
                    stack: stackLines.join("\n"),
                    url: callSrc[1],
                    line: callSrc[2],
                    col: callSrc[3],
                    text: message
                }
            }));

        } else {
            document.dispatchEvent(new CustomEvent('jsErrorEvent', {
                detail: {
                    stack: JSON.stringify(stack),
                    text: message
                }
            }));
        }

    }

    // handle uncaught promises errors
    window.addEventListener('unhandledrejection', function(e) {
        if (typeof e.reason == 'undefined') {
            e.reason = e.detail;
        }
        //handleCustomError(e.reason.message, e.reason.stack);
        handleCustomError(e.reason.message, e.reason);
    });

    // handle console.error()
    const consoleErrorFunc = window.console.error;
    window.console.error = function() {
        const argsArray = [];
        for(let i in arguments) { // because arguments.join() not working! oO
            argsArray.push(arguments[i]);
        }
        consoleErrorFunc.apply(console, argsArray);

        handleCustomError(argsArray.length == 1 && typeof argsArray[0] == 'string' ? argsArray[0] : JSON.stringify(argsArray.length == 1 ? argsArray[0] : argsArray));
    };

    // handle uncaught errors
    window.addEventListener('error', function(e) {
        if(e.filename) {

            document.dispatchEvent(new CustomEvent('jsErrorEvent', {
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
    /*window.addEventListener('error', function(e) {
        const src = e.target.src || e.target.href;
        const baseUrl = e.target.baseURI;
        if(src && baseUrl && src != baseUrl) {
            document.dispatchEvent(new CustomEvent('jsErrorEvent', {
                detail: {
                    is404: true,
                    url: src
                }
            }));
        }
    }, true);*/
})(window);

