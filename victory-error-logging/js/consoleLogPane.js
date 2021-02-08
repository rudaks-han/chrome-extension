$(function() {
    //for (i=0; i<20; i++)
        //sample();

    $('.clear-console-log').on('click', function() {
        console.log('click...')
        chrome.runtime.sendMessage({'cmd': 'clearConsoleLog'});
    });
});

function sample() {
    var html = '<li>';
    html += '<div>[mocha][400001] This is not a error.</div>';
    html += '<div class="detail-log">';
    html += '</div>';
    html += '</li>';

    data = {url: "//victory-agent-gateway.spectra.co.kr/mocha/login", data: '{"userId":"kmhan","password":"1","force":false}', status: "401", responseText: {}};
    $('.xhr-error-panel > ul').append(html);
    JsonView.renderJSON(data, $('.detail-log:last').get(0));
}

function appendLog(type, data) {
    if (type == 'xhr') {
        const module = data.responseText.module;
        const code = data.responseText.code;
        const message = data.responseText.message;

        var html = '<li>';
        html += '<div>';
        html += '[' + module + '][' + code +'] ' + message;
        html += '</div>';
        html += '<div class="detail-log">';
        html += '</div>';
        html += '</li>';

        $('.xhr-error-panel').find('ul').append(html);

        JsonView.renderJSON(data, $('.detail-log:last').get(0));
    } else {
        var html = '<li>';
        html += '<div class="detail-log">';
        html += '</div>';
        html += '</li>';

        $('.xhr-error-panel').find('ul').append(html);

        JsonView.renderJSON(data, $('.detail-log:last').get(0));
    }
}

function clearConsoleLog() {
    $('.xhr-error-panel').find('ul').find('li').remove();
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {

        console.log(request)

        if (request.cmd == 'sendLog') {
            appendLog(request.type, request.data);
        } else if (request.cmd == 'openConsole') {
            request.data.forEach((data, index) => {
                appendLog(request.type, data);
            });
        } else if (request.cmd == 'clearConsoleLog') {
            clearConsoleLog();
        }

            /*if (request.cmd == 'sendLog' || request.cmd == 'openConsole') {
                    dataList.forEach((data, index) => {
                            /!*!//data[index] = value + 3;
                            console.log('index: ' + index)
                            console.log(data);

                            const module = data.responseText.module;
                            const code = data.responseText.code;
                            const message = data.responseText.message;

                            var html = '<li>';
                            html += '<div>';
                            html += '[' + module + '][' + code +'] ' + message;
                            html += '</div>';
                            html += '<div class="detail-log">';
                            html += '</div>';
                            html += '</li>';

                            $('.xhr-error-panel').find('ul').append(html);

                            JsonView.renderJSON(data, $('.detail-log:last').get(0));*!/
                    });
            }*/

        /*const module = json.responseText.module;
        const code = json.responseText.code;
        const message = json.responseText.message;*/

        /*if (request.cmd == 'sendLog') {
                var html = '<li>';
                html += '<div>';
                html += '[' + module + '][' + code +'] ' + message;
                html += '</div>';
                html += '<div class="detail-log">';
                html += '</div>';
                html += '</li>';

                $('.xhr-error-panel').find('ul').append(html);

                JsonView.renderJSON(json, $('.detail-log:last').get(0));
        }*/

    });