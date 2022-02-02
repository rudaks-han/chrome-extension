const loginClient = new LoginClient();
const daouofficeClient = new DaouofficeClient();

const receiveMessage = (request, sender, sendResponse) => {
    //console.error('receiveMessage')
    //console.table(request)

    /*const requestArr = request.action.split('.');
    const requestClass = requestArr[0];
    const requestFn = requestArr[1];

    switch (requestClass) {
        case 'loginClient':
            //loginClient[requestFn].apply(loginClient, null)

            const response = requestLogin(requestFn);
            response.then(res => {
                console.error('____ res');
                console.log(res)

                sendResponse({data: res})
            })

            break;
        case 'daouofficeClient':
            daouofficeClient[requestFn].apply(daouofficeClient, null);
            break;
    }*/

    requestFn(request)
        .then((response) => {
            console.error('response')
            console.error(response)

            sendResponse(response);
        }
    )

    return true;
}

const requestFn = async (request) => {
    const requestArr = request.action.split('.');
    const requestClass = requestArr[0];
    const requestFn = requestArr[1];

    let response = null;
    switch (requestClass) {
        case 'loginClient':
            response = await loginClient[requestFn].apply(loginClient, null);
            break;
        case 'daouofficeClient':
            response = await daouofficeClient[requestFn].apply(daouofficeClient, null);
            break;
    }

    return response;
}

chrome.runtime.onMessage.addListener(receiveMessage);

