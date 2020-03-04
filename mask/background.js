function showNotify(title, message) {
	if (Notification && Notification.permission !== "granted") {
		Notification.requestPermission(function (status) {
			if (Notification.permission !== status) {
				Notification.permission = status;
			}
		});
	}
	if (Notification && Notification.permission === "granted") {
		var n = new Notification(title + "\n" + message);
	}

}

setTimeout(function() {
	$.ajax({
		type:"GET",
		//url:'https://api.pushbullet.com/v2/users/me',
		//url:'https://api.pushbullet.com/v2/devices',
		url:'https://api.pushbullet.com/v2/contacts',
		//data:params,
		beforeSend: function (xhr) {
			xhr.setRequestHeader('Authorization', 'Bearer 8yH3ytxOI7Bqu3bVbUqHKsVATSCpujVX');
			//xhr.setRequestHeader('Authorization', 'Bearer nXmkzdhFQae9zY6YRGScOPTmoKnoT77m');
		},
		success:function(res){
			console.log(JSON.stringify(res))
		}
	});
}, 1000);

//var interval = 60*1000; // The display interval, in minutes.
var interval = 60*1000; // The display interval, in minutes.

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
}

function getDateFormat(date) {
    return date.getFullYear() + '/' + makeTwoLength(date.getMonth()+1) + '/' + makeTwoLength(date.getDate()) + ' ' + makeTwoLength(date.getHours()) + ':' + makeTwoLength(date.getMinutes());
}

function makeTwoLength(str) {
    if (String(str).length == 1) {
        return '0' + str;
    }
    return str;
}

var beforeMinute = -1;
var coronaMaskOpenDate = [];

function checkCoronaMask() {
    setTimeout(function() {
        $.ajax({
            type:"GET",
            url:'https://coronamask.kr/',
            success:function(res){
                coronaMaskOpenDate.length = 0;

                console.log(res);
                var list = $(res).find('.relative.w-full.border-r');

                list.each(function(index) {
                    var url = $(this).find('a').attr('href');
                    var text = $(this).find('.text-gray-600.leading-none.leading-normal').text();
                    console.error('url: ' + url)
                    console.error('text: ' + text)
                    if (text.indexOf("시작") > -1) {
                        console.error('text: ' + text);
                        var date = text.substring(text.indexOf('시작')+4);
                        var arDate = date.split(' ');
                        var datePart = arDate[0].split('/'); // 2020/03/06
                        var timePart = arDate[1].split(':'); // 10:00
                        var year = datePart[0];
                        var month = datePart[1];
                        var day = datePart[2];
                        var hour = timePart[0];
                        var minute = timePart[1];

                       /* console.error('year: ' + year);
                        console.error('month: ' + month);
                        console.error('day: ' + day);
                        console.error('hour: ' + hour);
                        console.error('minute: ' + minute);*/

                        /*year = 2020
                        month = 3
                        day = 04
                        hour = 23
                        minute = 11*/
                        var sellDate = new Date(year, Number(month)-1, day, hour, minute, 0);
                        var newItem = {url:url, date: sellDate};

                        //Array.prototype.push.apply(coronaMaskOpenDate, {url, sellDate});
                        coronaMaskOpenDate.push(newItem)
                        //var now = new Date();
                        /*console.error('now: ' + sellDate);
                        console.error('add 1minute: ' + addMinutes(sellDate, -1));
                        console.error('now: ' + now);
                        console.error('getDateFormat1: ' + getDateFormat(now));
                        console.error('getDateFormat2: ' + getDateFormat(addMinutes(sellDate, beforeMinute)));*/


                        /*if (getDateFormat(now) == getDateFormat(addMinutes(sellDate, beforeMinute))) {
                            console.error('________________ 시작')
                        } else {
                            console.error('아직')
                        }*/
                    }
                })
            }
        });
    }, 100)
}

checkCoronaMask();

setInterval(function() {

}, 1000*60*5);

function checkSite() {
	welKipsMallCount = 0;

	var name = '';
	var url = '';

	/*name = '웹킵스몰 스마트블랙 KF94 45개';
	url = 'http://www.welkeepsmall.com/shop/shopdetail.html?branduid=1007193&xcode=023&mcode=002&scode=&type=X&sort=manual&cur_code=023&GfDT=bm95W1g%3D';
	checkWelKipsMall(name, url);

	name = '웹킵스몰 뉴스마트 KF94 25개';
	url = 'http://www.welkeepsmall.com/shop/shopdetail.html?branduid=997662&xcode=023&mcode=002&scode=&type=X&sort=manual&cur_code=023&GfDT=amx3VA%3D%3D';
	checkWelKipsMall(name, url);

	name = '웹킵스몰 프리미엄 KF94 25개';
	url = 'http://www.welkeepsmall.com/shop/shopdetail.html?branduid=920693&xcode=023&mcode=001&scode=&type=X&sort=manual&cur_code=023&GfDT=bWh3UF0%3D';
	checkWelKipsMall(name, url);

	name = '웹킵스몰 프리미엄 KF80 25개';
	url = 'http://www.welkeepsmall.com/shop/shopdetail.html?branduid=922816&xcode=023&mcode=001&scode=&type=X&sort=manual&cur_code=023&GfDT=bm91W11G';
	checkWelKipsMall(name, url);

	name = '웹킵스몰 뉴스마트 KF80 50개';
	url = 'http://www.welkeepsmall.com/shop/shopdetail.html?branduid=1000801&xcode=023&mcode=002&scode=&type=X&sort=manual&cur_code=023&GfDT=bm19W11H';
	checkWelKipsMall(name, url);

	name = '웹킵스몰 뉴스마트 KF94 50개';
	url = 'http://www.welkeepsmall.com/shop/shopdetail.html?branduid=1000798&xcode=023&mcode=002&scode=&type=X&sort=manual&cur_code=023&GfDT=bWd3UFg%3D';
	checkWelKipsMall(name, url);

	name = '웹킵스몰 리얼블랙 KF94 25개';
	url = 'http://www.welkeepsmall.com/shop/shopdetail.html?branduid=997637&xcode=023&mcode=003&scode=&type=X&sort=manual&cur_code=023&GfDT=Zm93UFs%3D';
	checkWelKipsMall(name, url);

	name ='[아동용] 웹킵스몰 마스크 소형 KF80 25개';
	url = 'http://www.welkeepsmall.com/shop/shopdetail.html?branduid=1007206&xcode=023&mcode=001&scode=&special=1&GfDT=bm9%2FW1w%3D';
	checkWelKipsMall(name, url);


	name = '네이버스토어 아에르 스탠다스 베이직 마스크'
	url = 'https://smartstore.naver.com/aer-shop/products/4722827602';
	checkNaverStore(name, url);

	name = '네이버스토어 닥터퓨리 뽑아쓰는';
	url = 'https://smartstore.naver.com/mfbshop/products/4072573492';
	checkNaverStore(name, url);

	name = '네이버스토어 닥터퓨리 미세먼지지';
	url = 'https://smartstore.naver.com/mfbshop/products/4072435942?site_preference=device&NaPm=';
	checkNaverStore(name, url);

	name = '네이버스토어 상공양행 마스크';
	url = 'https://smartstore.naver.com/sangkong/products/4762917002';
	checkNaverStore(name, url);

	name = '네이버스토어 국대 마스크';
	url = 'https://smartstore.naver.com/korea-mask/products/4825762296#DEFAULT';
	checkNaverStore(name, url);

	name = '네이버스토어 에티카 마스크';
	url = 'https://smartstore.naver.com/etiqa/products/4817982860';
	checkNaverStore(name, url);

	name = '네이버스토어 공감이 뉴네퓨어 마스크';
	url = 'https://smartstore.naver.com/gonggami/products/4705579501';
	checkNaverStore(name, url);

	name = '네이버스토어 동국제약';
	url = 'https://smartstore.naver.com/dkpharm_naturesvitamin/products/4810907388?NaPm=';
	checkNaverStore(name, url);

	name = '네이버스토어 금아덴탈';
	url = 'https://smartstore.naver.com/kumaelectron/products/4754238400';
	checkNaverStore(name, url);

	name = '네이버스토어 마이케어';
	url = 'https://smartstore.naver.com/heattem/products/4172159700';
	checkNaverStore(name, url);

	name = '네이버스토어 마이케어2';
	url = 'https://smartstore.naver.com/heattem/products/4824368953';
	checkNaverStore(name, url);

	name = '네이버스토어 금아스토어';
	url = 'https://smartstore.naver.com/kumaelectron/products/4754244746';
	checkNaverStore(name, url);

	name = '네이버스토어 닥터퓨리';
	url = 'https://smartstore.naver.com/mfbshop/products/4735164530';
	checkNaverStore(name, url);

	name = '네이버스토어 금아스토어';
	url = 'https://smartstore.naver.com/kumaelectron/products/4754246120';
	checkNaverStore(name, url);

	name = '네이버스토어 금아스토어 메디라인';
	url = 'https://smartstore.naver.com/kumaelectron/products/4754248104';
	checkNaverStore(name, url);

	name = '네이버스토어 금아스토어 블랙';
	url = 'https://smartstore.naver.com/kumaelectron/products/4813999869';
	checkNaverStore(name, url);
*/
    name = '네이버스토어 휴그린 중형';
    url = 'https://smartstore.naver.com/soommask/products/4828127993?NaPm=#DEFAULT';
    checkNaverStore(name, url);
/*
    name = '네이버스토어 미마마스크';
    url = 'https://smartstore.naver.com/aseado/products/4837257765';
    checkNaverStore(name, url);

    name = '네이버스토어 미마마스크 어린이';
    url = 'https://smartstore.naver.com/aseado/products/4837266971';
    checkNaverStore(name, url);

    name = '네이버스토어 일반마스크 비포장 50매';
    url = 'https://smartstore.naver.com/neulhaerangmask/products/4632987981';
    checkNaverStore(name, url);

    name = '네이버스토어 해피키친';
    url = 'https://smartstore.naver.com/carmang1825/products/4834056954';
    checkNaverStore(name, url);

    name = '네이버스토어 라록스';
    url = 'https://smartstore.naver.com/ygfac/products/3905641271';
    checkNaverStore(name, url);
    
*/
    name = '네이버스토어 마데카 파워 앰플';
    url = 'https://smartstore.naver.com/dkpharm_naturesvitamin/products/4737857552';
    checkNaverStore(name, url);


    /*
    name = '네이버스토어 ';
    url = '';
    checkNaverStore(name, url);
    */
	/*name = '금아덴탈 마스크';
	url = 'http://item.gmarket.co.kr/?goodscode=1319742635&jaehuid=200010777';
	checkUrl(url, 'html', function(res) {
		//console.log(res);
		if (res.indexOf('<strong class="price_real">일시품절</strong>') == -1) {
			console.log('[판매중] ' + name + ' : ' + url);
		} else {
			console.log('[재고없음] ' + name);
		}
	});*/
	
	/*
	name = '카카오스토어 뉴네퓨어 마스크';
	url = 'https://store.kakao.com/laomete/products/55563134';
	checkUrl(url, 'html', function(res) {
		if ($(res).find('.prd_type3').html().indexOf('구매하실 수 없는') == -1) {
			pushBullet(name, url);
		}
	});
	 */


	/*name = '블리라이프 황사마스크'
	url = 'http://bling-market.com/m/html/dh_product/prod_view/1807';
	checkUrl(url, 'html', function(res) {
		if (res.indexOf('/_data/file/goodsImages/f9ffc089ea48c99878fd710a36bbf938.jpg') == -1) {
			pushBullet(name, url);
			console.log('[판매중] ' + name + ' : ' + url);
		} else {
			console.log('[재고없음] ' + name);
		}
	});*/

}

var welKipsMallCount = 0;

function checkWelKipsMall(name, url) {
	welKipsMallCount++;

	setTimeout(function() {
		checkUrl(url, 'html', function(res) {
			//if ($(res).find('.info').find('.soldout').length == 0) {
			if (res.indexOf('총 상품 금액') > -1 && res.indexOf('<div class="soldout">SOLD OUT</div>') == -1) {
				pushBullet(name, url);
				console.log('[판매중] ' + name + ' : ' + url);
			} else {
				console.log('[재고없음] ' + name);
			}
		})
	}, welKipsMallCount * 1000);
}

function checkNaverStore(name, url) {

    console.error('url : ' + url)
    var coronaMaskFound = false;
    $.each(coronaMaskOpenDate, function(index, item) {
        console.error(item.url)

       //if (item.url == url) {
            console.error('___있음 OOO')

            // 시간체크
            //openTab(url);
            coronaMaskFound = true;
            return false;
       // }
    });

    if (coronaMaskFound) {
        //openTab(url);
        chrome.tabs.create({'url': url}, function(tab) {
            console.error('Tab Created ' + tab.id);

            chrome.tabs.executeScript(null, {file:'checkoutItem.js'});

            //var code = 'alert(document.querySelector("._buy_button"))';
            //chrome.tabs.executeScript(tab.id, {code: code});
        });
    }

    /*checkUrl(url, 'html', function (res) {
        if (res.indexOf('배송비결제') > -1 && res.indexOf('<em class="fc_point">구매하실 수 없는</em> 상품입니다') == -1 && res.indexOf('현재 주문 폭주로 구매가 어렵습니다') == -1) {
            pushBullet(name, url);
            console.log('[판매중] ' + name + ' : ' + url);
        } else {
            console.log('[재고없음] ' + name);
        }
    });*/


};

function openTab(url) {
    chrome.tabs.create({ url: url });

    checkSiteAvailable();
}

function checkSiteAvailable() {
    
}


setInterval(function() {
	console.log('checking... ' + new Date());

	checkSite();

}, interval);

function checkUrl(url, datatype, callback)
{
	$.ajaxQueue({
		type:"GET",
		dataType: datatype,
		//contentType: "application/x-www-form-urlencoded; charset=euc-kr",
		url:url,
		beforeSend : function(xhr){
		},
		success:function(res){
			callback(res);
		},
		error:function(e){
			//alert("error : " + e.responseText);
			console.error(e);
		}
	});

}

function pushBullet(title, body)
{
	var params = {};
	params.type = 'note';
	params.title = title;
	params.body = body;
	$.ajax({
		type:"POST",
		//url:'https://api.pushbullet.com/v2/users/me',
		url:'https://api.pushbullet.com/v2/pushes',
		data:params,
		beforeSend: function (xhr) {
			xhr.setRequestHeader('Authorization', 'Bearer 8yH3ytxOI7Bqu3bVbUqHKsVATSCpujVX');
			//xhr.setRequestHeader('Authorization', 'Bearer nXmkzdhFQae9zY6YRGScOPTmoKnoT77m'); // 승엽
		},
		success:function(res){
			console.log(JSON.stringify(res))
		}
	});
}
