function debug(str) {
    console.log(str);
}

var testMode = false;

var checkStartHour = 7;
var checkEndHour = 21;

var interval = 60*1000;
if (testMode) {
    interval = 10*1000;
}
var beforeMinute = -1; // 구입체크를 할 시간 몇분 전
var coronaMaskOpenDate = [];
var reloadCountData = [];
var maxReloadCount = 500;
var welKipsMallCount = 0;
var naverShopList = [];

function checkCoronaMaskStartTime() {
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

    coronaMaskOpenDate.length = 0;
    list.each(function(index) {
        var name = $(this).find('.text-gray-900').text();
        var url = $(this).find('a').attr('href');
        var text = $(this).find('.text-gray-600.leading-none.leading-normal').text();

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

            coronaMaskOpenDate.push(newItem);

            var exists = false;
            if (naverShopList.length > 0) {
                for (var i=0; i<naverShopList.length; i++) {
                    if (newItem.url == naverShopList[i].url) {
                        exists = true;
                        break;
                    }
                }

                if (!exists && newItem.url.startsWith('https://smartstore.naver.com')) {
                    console.error('사이트 등록 필요 : ' + name)
                    console.error(newItem);

                    addNaverSite(name, newItem.url);

                }
            }
        }
    });
}

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

function checkWelKipsMall(name, url) {
	welKipsMallCount++;

	setTimeout(function() {
		checkUrl(url, 'html', function(res) {
			if (res.indexOf('총 상품 금액') > -1 && res.indexOf('<div class="soldout">SOLD OUT</div>') == -1) {
				sendPushBullet(name, url);
				debug('[판매중] ' + name + ' : ' + url);
			} else {
                //debug('[재고없음] ' + name);
			}
		})
	}, welKipsMallCount * 1000);
}

function checkNaverStore(name, url) {
    checkUrl(url, 'html', function (res) {
        if (res.indexOf('배송비결제') > -1 && res.indexOf('<em class="fc_point">구매하실 수 없는</em> 상품입니다') == -1 && res.indexOf('현재 주문 폭주로 구매가 어렵습니다') == -1) {
            sendPushBullet(name, url);
            debug('[판매중] ' + name + ' : ' + url);
        } else {
            //debug('[재고없음] ' + name);
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

    console.log('isReadyToSell : ' + isReadyToSell)
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

function executeScriptCheckoutItem(url) {
    chrome.tabs.executeScript(null, {file:'js/checkoutItem.js'}, function(result) {
        debug('[구매하기 버튼 클릭] ');
    })
}

function executeScriptOrderItem() {
    chrome.tabs.executeScript(null, {file:'js/orderItem.js'}, function(response) {
        debug('[결제하기 클릭] ');
    });
}

// 구매사이트를 팝업으로 열고 구매하기 버튼 클릭
function checkoutItem(url) {
    debug('[구입을 위해 site 팝업창 띄움] ' + url);
    sendPushBullet("마스크 판매 1분 전", url);

	chrome.tabs.create({'url': url}, function(tab) {
        reloadCountData[url] = 0;

        /*chrome.tabs.executeScript( null, {code: getExistSelectOptionCode()},
            function(results) {
                if (results[0] >= 1) {
                    debug('옵션이 있어서 구매하지 않음 ' + url);
                } else {

                    setTimeout(function() {
                        chrome.tabs.executeScript( null, {code: getBuyButtonCode()},
                            function(results) {
                                if (results[0] == null) { // 구입불가
                                    debug('[구입불가] ' + url);
                                    chrome.tabs.reload(tab.id);
                                } else {
                                    // 구매하기 버튼 클릭
                                    executeScriptCheckoutItem(url);
                                }
                            } );
                    }, 200);
                }
            }
        );*/
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
        debug('[상품주문완료] ' + tab.url);
        sendPushBullet('상품주문완료', tab.url);
    } else if (tab.url.startsWith('https://order.pay.naver.com/orderSheet')) {
		// 결제하기 버튼 클릭
        executeScriptOrderItem();
	}
});

if (testMode) {
    setTimeout(function() {
        checkMaskSite();
    }, 1 * 1000);

    /*setTimeout(function() {
        checkMaskSite();
    }, 10 * 1000);*/
} else {
    checkMaskSite();
    setInterval(function() {
        console.log('checking... ' + new Date());

        var date = new Date();
        if (date.getHours() < checkStartHour || date.getHours() >= checkEndHour) {
            debug('체크시간 아님 ');
            return;
        }

        checkMaskSite();
    }, interval);

}

function sendPushBullet(title, body) {
    if (testMode)
        return;

    var authorization = '8yH3ytxOI7Bqu3bVbUqHKsVATSCpujVX';
    pushBullet(authorization, title, body);
}
