function debug(str) {
    console.error(str);
}

var testMode = false;

var interval = 60*1000; // The display interval, in minutes.
if (testMode) {
    interval = 10*1000;
}
var beforeMinute = -1; // 구입체크를 할 시간 몇분 전
var coronaMaskOpenDate = [];
var reloadCountData = [];
var reloadCount = 5;

function checkCoronaMask() {
    setTimeout(function() {
        $.ajax({
            type:"GET",
            url:'https://coronamask.kr/',
            success:function(res) {
                checkCoronaMaskCallback(res);
            }
        });
    }, 100)
}

function checkCoronaMaskCallback(res) {
    var list = $(res).find('.relative.w-full.border-r');

    list.each(function(index) {
        var url = $(this).find('a').attr('href');
        var text = $(this).find('.text-gray-600.leading-none.leading-normal').text();
        //console.log('url: ' + url)
        //console.log('text: ' + text)
        if (text.indexOf("시작") > -1) {
            var date = text.substring(text.indexOf('시작')+4);
            var arDate = date.split(' ');
            var datePart = arDate[0].split('/'); // 2020/03/06
            var timePart = arDate[1].split(':'); // 10:00
            var year = datePart[0];
            var month = datePart[1];
            var day = datePart[2];
            var hour = timePart[0];
            var minute = timePart[1];

            var sellDate = new Date(year, Number(month)-1, day, hour, minute, 0);
            var newItem = {url:url, date: sellDate};

            coronaMaskOpenDate.push(newItem)
        }
    });
}
checkCoronaMask();

/*setInterval(function() {

}, 1000*60*5);*/

function readyToSell(now, sellDate) {
    if (testMode) return true;
    
	if (getDateFormat(now) == getDateFormat(addMinutes(sellDate, beforeMinute))) {
		return true;
	} else {
		return false;
	}
}
var welKipsMallCount = 0;

function checkWelKipsMall(name, url) {
	welKipsMallCount++;

	setTimeout(function() {
		checkUrl(url, 'html', function(res) {
			//if ($(res).find('.info').find('.soldout').length == 0) {
			if (res.indexOf('총 상품 금액') > -1 && res.indexOf('<div class="soldout">SOLD OUT</div>') == -1) {
				sendPushBullet(name, url);
				console.log('[판매중] ' + name + ' : ' + url);
			} else {
				console.log('[재고없음] ' + name);
			}
		})
	}, welKipsMallCount * 1000);
}

function checkNaverStore(name, url) {

    console.error('url : ' + url)
    var isReadyToSell = false;
    $.each(coronaMaskOpenDate, function(index, item) {
        //console.error(item.url)

        if (testMode) {
            isReadyToSell = true; // 임시코드
        }

       if (item.url == url) {
		   var currDate = new Date();
		   var sellDate = item.date;

		   if (readyToSell(currDate, sellDate)) {
			   isReadyToSell = true;

               debug('[coronamask 판매 5분전] ' + url);
			   return false;
		   }
       }
    });

    if (isReadyToSell) { // 판매 5분전인 사이트 일 경우
		checkoutItem(url);
    }

    /*checkUrl(url, 'html', function (res) {
        if (res.indexOf('배송비결제') > -1 && res.indexOf('<em class="fc_point">구매하실 수 없는</em> 상품입니다') == -1 && res.indexOf('현재 주문 폭주로 구매가 어렵습니다') == -1) {
            sendPushBullet(name, url);
            console.log('[판매중] ' + name + ' : ' + url);
        } else {
            console.log('[재고없음] ' + name);
        }
    });*/
};

function getBuyButtonCode() {
    return 'var buyButton = document.querySelector("._buy_button"); buyButton';
}

// 구매사이트를 팝업으로 열고 구매하기 버튼 클릭
function checkoutItem(url) {

    debug('[구입을 위해 site 팝업창 띄움] ' + url);
    
	chrome.tabs.create({'url': url}, function(tab) {
        reloadCountData[url] = 0;

        // 상품 여러개 중 한개를 선택
        chrome.tabs.executeScript(null, {file:'selectOption.js'}, function(result) {
            debug('[품절이 아닌 상품 선택하기] ' + url);
        });

        chrome.tabs.executeScript( null, {code: getBuyButtonCode()},
            function(results) {
                if (results[0] == null) { // 구입불가
                    debug('[구입불가] ' + url);
                    chrome.tabs.reload(tab.id);
                } else {
                    chrome.tabs.executeScript(null, {file:'checkoutItem.js'}, function(result) {
                        debug('[구매하기 버튼 클릭] ' + url);
                    })
                }
        } );
	});
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {

	if (changeInfo.status != 'complete')
		return;

	if (tab.url.startsWith('https://smartstore.naver.com')
    ) {
        chrome.tabs.executeScript(null, {file:'selectOption.js'}, function(result) {
            debug('[1품절이 아닌 상품 선택하기] ' + tab.url);
        });

        chrome.tabs.executeScript( null, {code: getBuyButtonCode()},
            function(results) {
                if (results[0] == null) { // 구입불가
                    debug('[구입불가] ' + tab.url);

                    if (reloadCountData[tab.url] > reloadCount) { // 최대 새로고침 횟수를 넘기면 중단
                        debug('[새로고침 횟수(' + reloadCount + ') 초과로 중단] ' + tab.url);
                        return;
                    }

                    debug('[새로고침] ' + tab.url);
                    chrome.tabs.reload(tab.id)

                    reloadCountData[tab.url] = reloadCountData[tab.url] + 1;
                } else {
                    chrome.tabs.executeScript(null, {file:'checkoutItem.js'}, function(result) {})
                }
            } );
	} else if (tab.url.startsWith('https://order.pay.naver.com/orderSheet/result')) {
        debug('[상품주문완료] ' + tab.url);
        sendPushBullet('상품주문완료', tab.url);
    } else if (tab.url.startsWith('https://order.pay.naver.com/orderSheet')) {
		chrome.tabs.executeScript(null, {file:'orderItem.js'}, function(response) {
		    console.error('resonse...............')
            console.error(response)
            debug('[결제하기 클릭] ' + tab.url);
        });
	}
});

if (testMode) {
    setTimeout(function() {
        //checkCoronaMaskSite();
    }, 100)

    setTimeout(function() {
        //checkCoronaMaskSite();
    }, 5000)
} else {
    setInterval(function() {
        console.log('checking... ' + new Date());
        checkCoronaMaskSite();
    }, interval);

}

function sendPushBullet(title, body) {
    var authorization = '8yH3ytxOI7Bqu3bVbUqHKsVATSCpujVX';
    pushBullet(authorization, title, body);
}
