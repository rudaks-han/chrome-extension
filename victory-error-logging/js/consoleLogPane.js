$(function() {
        //$('#victory-log').append(headerLayer());
        //$('#victory-log').append(logLayer());
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
            console.log(request)
            const dataList = request.data;

            console.log('typeof : ' + (typeof dataList));
            //console.log(dataList);
            console.log('length : ' + dataList.length);

            dataList.map((v) => {

            });

            if (request.cmd == 'sendLog' || request.cmd == 'openConsole') {
                    dataList.forEach((data, index) => {
                            //data[index] = value + 3;
                            console.log('index: ' + index)
                            //console.log(value);

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
                    });
            }

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