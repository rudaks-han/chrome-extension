function checkCoronaMaskStartTime() {
	debug("coronamask.kr 사이트 시작시간 체크");

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

function checkWelKipsSite() {

	setTimeout(function() {
		checkUrl('http://www.welkeepsmall.com/shop/shopbrandCA.html?type=X&xcode=023', 'html', function(res) {
			var ul = res.split('<div class=\"box\">');
			for (var i=0; i<ul.length; i++) {

				var item = ul[i].substring(0, ul[i].indexOf('</ul>\n\t\t\t\t\t\t\t</div>'));
				item = item.replace(/<img.*"\s>/gi, '');
				item = item.replace(/<img.*\/>/gi, '');

				var html = '<div>'+ item + '</ul></div>';

				var list = $(html);

				var name = list.find('.dsc').text();
				var href = list.find('a').attr('href');
				var soldOut = list.find('.info').text().indexOf('SOLD OUT') > -1;
				if (href) {
					if (!soldOut) {
						sendPushBullet('웹킵스 마스크 재고있음 알림', url);
						error('[판매중] welkips : ' + href);
					} else {
						//debug('[재고없음] welkips : ' + href);
					}
				}

			}
		});
	}, 100);
}