function addNaverSite(name, url) {
    var exists = false;
    for (var i=0; i<naverShopList.length; i++) {
        if (naverShopList[i].url == url) {
            exists = true;
        }
    }

    if (!exists) {
        naverShopList.push({name: name, url: url});
    }
}

function checkMaskSite() {
    welKipsMallCount = 0;

    var name = '';
    var url = '';

    name = '네이버스토어 아에르 스탠다스 베이직 마스크'
    url = 'https://smartstore.naver.com/aer-shop/products/4722827602';
    addNaverSite(name, url);

    name = '네이버스토어 닥터퓨리 뽑아쓰는';
    url = 'https://smartstore.naver.com/mfbshop/products/4072573492';
    addNaverSite(name, url);

    name = '네이버스토어 닥터퓨리 미세먼지';
    url = 'https://smartstore.naver.com/mfbshop/products/4072435942?site_preference=device&NaPm=';
    addNaverSite(name, url);

    name = '네이버스토어 상공양행 마스크';
    url = 'https://smartstore.naver.com/sangkong/products/4762917002';
    addNaverSite(name, url);

    name = '네이버스토어 국대 마스크';
    url = 'https://smartstore.naver.com/korea-mask/products/4825762296#DEFAULT';
    addNaverSite(name, url);

    name = '네이버스토어 에티카 마스크';
    url = 'https://smartstore.naver.com/etiqa/products/4817982860';
    addNaverSite(name, url);

    name = '네이버스토어 공감이 뉴네퓨어 마스크';
    url = 'https://smartstore.naver.com/gonggami/products/4705579501';
    addNaverSite(name, url);

    name = '네이버스토어 동국제약';
    url = 'https://smartstore.naver.com/dkpharm_naturesvitamin/products/4810907388?NaPm=';
    addNaverSite(name, url);

    name = '네이버스토어 금아덴탈';
    url = 'https://smartstore.naver.com/kumaelectron/products/4754238400';
    addNaverSite(name, url);

    name = '네이버스토어 마이케어';
    url = 'https://smartstore.naver.com/heattem/products/4172159700';
    addNaverSite(name, url);

    name = '네이버스토어 마이케어2';
    url = 'https://smartstore.naver.com/heattem/products/4824368953';
    addNaverSite(name, url);

    name = '네이버스토어 금아스토어';
    url = 'https://smartstore.naver.com/kumaelectron/products/4754244746';
    addNaverSite(name, url);

    name = '네이버스토어 닥터퓨리';
    url = 'https://smartstore.naver.com/mfbshop/products/4735164530';
    addNaverSite(name, url);

    name = '네이버스토어 금아스토어';
    url = 'https://smartstore.naver.com/kumaelectron/products/4754246120';
    addNaverSite(name, url);

    name = '네이버스토어 금아스토어 메디라인';
    url = 'https://smartstore.naver.com/kumaelectron/products/4754248104';
    addNaverSite(name, url);

    name = '네이버스토어 금아스토어 블랙';
    url = 'https://smartstore.naver.com/kumaelectron/products/4813999869';
    addNaverSite(name, url);

    name = '네이버스토어 휴그린 중형';
    url = 'https://smartstore.naver.com/soommask/products/4828127993?NaPm=#DEFAULT';
    addNaverSite(name, url);

    name = '네이버스토어 미마마스크';
    url = 'https://smartstore.naver.com/aseado/products/4837257765';
    addNaverSite(name, url);

    name = '네이버스토어 미마마스크 어린이';
    url = 'https://smartstore.naver.com/aseado/products/4837266971';
    addNaverSite(name, url);

    name = '네이버스토어 일반마스크 비포장 50매';
    url = 'https://smartstore.naver.com/neulhaerangmask/products/4632987981';
    addNaverSite(name, url);

    name = '네이버스토어 해피키친';
    url = 'https://smartstore.naver.com/carmang1825/products/4834056954';
    addNaverSite(name, url);

    name = '네이버스토어 착한마스크';
    url = 'https://smartstore.naver.com/shyman/products/4843275185';
    addNaverSite(name, url);

    name = '네이버스토어 미마몰';
    url = 'https://smartstore.naver.com/aseado/products/3765693172#coronamaskkr';
    addNaverSite(name, url);

    name = '네이버스토어 마스크 블랙';
    url = 'https://smartstore.naver.com/light_market/products/4834555216';
    addNaverSite(name, url);

    name = '네이버스토어 기본에';
    url = 'https://smartstore.naver.com/gibone/products/4842094192';
    addNaverSite(name, url);

    name = '네이버스토어 라록스';
    url = 'https://smartstore.naver.com/ygfac/products/3905641271';
    addNaverSite(name, url);

    name = '네이버스토어 위케어';
    url = 'https://smartstore.naver.com/wiicare/products/4242262742';
    addNaverSite(name, url);

    name = '네이버스토어 디즈니 유아';
    url = 'https://smartstore.naver.com/light_market/products/4835093482';
    addNaverSite(name, url);

    name = '네이버스토어 [미엘물티슈] 숨쉬GO KF94 미세먼지 황사방역마스크 10매';
    url = 'https://smartstore.naver.com/gcleantec/products/4847692801';
    addNaverSite(name, url);


    debug('naverShopList 개수 : ' + naverShopList.length);


    name = '웹킵스몰 스마트블랙 KF94 45개';
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

    if (testMode) {
        name = '네이버스토어 test'
        //url = 'https://smartstore.naver.com/sol-sungrass/products/4851263224';
        //url = 'https://smartstore.naver.com/mooninsam/products/341195701'; // 인삼
        url = 'https://smartstore.naver.com/dkpharm_naturesvitamin/products/4737857552'; // 마데카 파워앰플
        checkNaverStore(name, url);
        return;
    } else {
        for(var i=0; i<naverShopList.length; i++) {
            checkNaverStore(naverShopList[i].name, naverShopList[i].url);
        }
    }

    // https://smartstore.naver.com/mooninsam/products/341195701

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
            sendPushBullet(name, url);
        }
    });
     */


    /*name = '블리라이프 황사마스크'
    url = 'http://bling-market.com/m/html/dh_product/prod_view/1807';
    checkUrl(url, 'html', function(res) {
        if (res.indexOf('/_data/file/goodsImages/f9ffc089ea48c99878fd710a36bbf938.jpg') == -1) {
            sendPushBullet(name, url);
            console.log('[판매중] ' + name + ' : ' + url);
        } else {
            console.log('[재고없음] ' + name);
        }
    });*/

    /*name = '네이버스토어 마데카 파워 앰플';
     url = 'https://smartstore.naver.com/dkpharm_naturesvitamin/products/4737857552';
     checkNaverStore(name, url);*/

}