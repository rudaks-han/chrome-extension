
var testMode = false;

var checkStartHour = 7;
var checkEndHour = 21;

var interval = 60*1000;
if (testMode) {
    interval = 10*1000;
}
var beforeMinute = -1; // 구입체크를 할 시간 몇분 전
var coronaMaskOpenDate = []; // coronamask.kr 사이트 오픈 시간 정보
var reloadCountData = []; // 사이트별 refresh 개수 횟수
var maxReloadCount = 500; // 최대 refresh 횟수
var naverShopList = [];

checkCoronaMaskStartTime();

setInterval(function() {
    checkCoronaMaskStartTime()
}, 60*1000);

function readyToSell(now, sellDate) {
    if (testMode) return true;
    
	if (getDateFormat(now) == getDateFormat(addMinutes(sellDate, beforeMinute))) {
		return true;
	} else {
		return false;
	}
}

function checkNaverStore(name, url) {
    checkUrl(url, 'html', function (res) {
        if (res.indexOf('배송비결제') > -1 && res.indexOf('<em class="fc_point">구매하실 수 없는</em> 상품입니다') == -1 && res.indexOf('현재 주문 폭주로 구매가 어렵습니다') == -1) {
            sendPushBullet(name, url);
            error('[판매중] ' + name + ' : ' + url);
        } else {
            debug('[재고없음] ' + name);
        }
    });

    var isReadyToSell = false;
    $.each(coronaMaskOpenDate, function(index, item) {
        if (testMode) {
            isReadyToSell = true; // 임시코드
            return false;
        }

       if (item.url == url) {
		   var currDate = new Date();
		   var sellDate = item.date;

		   if (readyToSell(currDate, sellDate)) {
			   isReadyToSell = true;
               debug('[coronamask 판매 ' + beforeMinute + '분전] ' + url);
			   return false;
		   }
       }
    });

    if (isReadyToSell) { // 판매 1분전인 사이트 일 경우
		checkoutItem(url);
    }
};

function getBuyButtonCode() {
    return 'var buyButton = document.querySelector("._buy_button"); buyButton';
}

function getExistSelectOptionCode() {
    return 'var optionLength = $("._combination_option").length; optionLength';
}

function executeScriptCheckoutItem() {
    chrome.tabs.executeScript(null, {file:'js/checkoutItem.js'}, function(result) {
        error('[구매하기 버튼 클릭] ');
    })
}

function executeScriptOrderItem() {
    chrome.tabs.executeScript(null, {file:'js/orderItem.js'}, function(response) {
        error('[결제하기 클릭] ');
    });
}

// 구매사이트를 팝업으로 열고 구매하기 버튼 클릭
function checkoutItem(url) {
    debug('[구입을 위해 site 팝업창 띄움] ' + url);
    sendPushBullet("마스크 판매 1분 전", url);

	chrome.tabs.create({'url': url}, function(tab) {
        reloadCountData[url] = 0;
	});
}

function clickBuyButtonAndRefresh(tab) {
    setTimeout(function() {
        chrome.tabs.executeScript( null, {code: getBuyButtonCode()},
            function(results) {
                if (results[0] == null) { // 구입불가
                    debug('[구입불가] ');

                    if (!reloadCountData[tab.url]) {
                        reloadCountData[tab.url] = 0;
                    }

                    if (reloadCountData[tab.url] > maxReloadCount) { // 최대 새로고침 횟수를 넘기면 중단
                        debug('[새로고침 횟수(' + maxReloadCount + ') 초과로 중단] ' + tab.url);
                        return;
                    }

                    reloadCountData[tab.url] = reloadCountData[tab.url] + 1;

                    debug('[새로고침] ' + reloadCountData[tab.url] + " > " + tab.url);
                    chrome.tabs.reload(tab.id)

                } else {
                    // 구매하기 버튼 클릭
                    executeScriptCheckoutItem();
                }
            } );
    }, 100);
}
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {

	if (changeInfo.status != 'complete')
		return;

	if (tab.url.startsWith('https://smartstore.naver.com')
    ) {
        chrome.tabs.executeScript( null, {code: getExistSelectOptionCode()},
            function(results) {
                if (results[0] > 0) { // 옵션이 있음
                    debug('옵션이 있어서 구매하지 않음 ' + tab.url);
                } else { // 옵션이 없음
                    clickBuyButtonAndRefresh(tab);
                }
            }
        );
	} else if (tab.url.startsWith('https://order.pay.naver.com/orderSheet/result')) {
        error('[상품주문완료] ' + tab.url);
        sendPushBullet('상품주문완료', tab.url);
    } else if (tab.url.startsWith('https://order.pay.naver.com/orderSheet')) {
		// 결제하기 버튼 클릭
        executeScriptOrderItem();
	}
});

if (testMode) {

    console.log("Checking... " + getCurrDate());
    setTimeout(function() {
        checkNaverMaskSite();
        checkWelKipsSite();
    }, 1 * 1000);

    /*setTimeout(function() {
        checkMaskSite();
    }, 10 * 1000);*/
} else {
    console.log("Checking... " + getCurrDate());

    checkNaverMaskSite();
    checkWelKipsSite();

    setInterval(function() {
        console.log("Checking... " + getCurrDate());

        var date = new Date();
        if (date.getHours() < checkStartHour || date.getHours() >= checkEndHour) {
            debug('체크시간 아님 ');
            return;
        }

        checkNaverMaskSite();
        checkWelKipsSite();
    }, interval);

}

function sendPushBullet(title, body) {
    if (testMode)
        return;

    var authorization = '8yH3ytxOI7Bqu3bVbUqHKsVATSCpujVX';
    pushBullet(authorization, title, body);
}
