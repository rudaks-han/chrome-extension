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
			//xhr.setRequestHeader('Authorization', 'Bearer 8yH3ytxOI7Bqu3bVbUqHKsVATSCpujVX');
			xhr.setRequestHeader('Authorization', 'Bearer nXmkzdhFQae9zY6YRGScOPTmoKnoT77m');
		},
		success:function(res){
			console.log(JSON.stringify(res))
		}
	});

	//var params = 'device_iden=uju8k2VOqrYsjz7O3P0Jl6&email=rudaks94@gmail.com&channel_tag=&client_iden=&type=note&title=test&body=testbody';


}, 1000);

var interval = 5*1000; // The display interval, in minutes.

function checkSite() {
	var name = '웹킵스몰 뉴스마트 황사마스크 대형 KF94 50개'
	var url = 'http://www.welkeepsmall.com/shop/shopdetail.html?branduid=1000798&xcode=023&mcode=002&scode=&type=X&sort=manual&cur_code=023&GfDT=bW13UFg%3D';

	/*
	checkUrl(url, 'html', function(res) {
		if ($(res).find('.info').find('.soldout').length == 0) {
			pushBullet(name, url);
		}
	});

	name = '웹킵스몰 리얼블랙 황사마스크 대형 KF94 25개';
	url = 'http://www.welkeepsmall.com/shop/shopdetail.html?branduid=997637&xcode=023&mcode=003&scode=&type=X&sort=manual&cur_code=023&GfDT=ZmZ3UFs%3D';
	checkUrl(url, 'html', function(res) {
		if ($(res).find('.info').find('.soldout').length == 0) {
			pushBullet(name, url);
		}
	});

	name ='웹킵스몰 리얼블랙 황사마스크 대형 KF94 50개';
	url = 'http://www.welkeepsmall.com/shop/shopdetail.html?branduid=1001308&xcode=023&mcode=003&scode=&type=X&sort=manual&cur_code=023&GfDT=bml5W15F';
	checkUrl(url, 'html', function(res) {
		if ($(res).find('.info').find('.soldout').length == 0) {
			pushBullet(name, url);
		}
	});

	name = '네이버스토어 아에르 스탠다스 베이직 마스크'
	url = 'https://smartstore.naver.com/aer-shop/products/4722827602';
	checkUrl(url, 'html', function(res) {
		if ($(res).find('.prd_type3').html().indexOf('구매하실 수 없는') == -1) {
			pushBullet(name, url);
		}
	});

	name = '블리라이프 황사마스크'
	url = 'http://bling-market.com/m/html/dh_product/prod_view/1807';
	checkUrl(url, 'html', function(res) {
		if (res.indexOf('/_data/file/goodsImages/f9ffc089ea48c99878fd710a36bbf938.jpg') == -1) {
			pushBullet(name, url);
		}
	});
	 */

	name = '네이버스토어 닥터퓨리 미세먼지지';
	url = 'https://smartstore.naver.com/mfbshop/products/4072435942?NaPm=';
	checkUrl(url, 'html', function(res) {
		if ($(res).find('.prd_type3').html().indexOf('구매하실 수 없는') == -1) {
			pushBullet(name, url);
		}
	});
}

setInterval(function() {
	console.log('checking... ' + new Date());

	checkSite();

}, interval);


function checkUrl(url, datatype, callback)
{
	$.ajax({
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
