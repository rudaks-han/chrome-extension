var naverSiteList = '';
function addNaverSite(name, url) {
    var exists = false;
    for (var i=0; i<naverShopList.length; i++) {
        if (naverShopList[i].url == url) {
            exists = true;
        }
    }

    if (!exists) {
        naverShopList.push({name: name, url: url});

        naverSiteList += "name = '" + name + "';\n";
        naverSiteList += "url = '" + url + "';\n";
        naverSiteList += 'addNaverSite(name, url);\n\n';
    }

}

function addNaverStoreMaskSite() {
    naverSiteList = '';
    welKipsMallCount = 0;

    var name = '';
    var url = '';

    name = '네이버스토어 아에르 스탠다스 베이직 마스크';
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

    /*name = '네이버스토어 마스크 블랙';
    url = 'https://smartstore.naver.com/light_market/products/4834555216';
    addNaverSite(name, url);
*/
    name = '네이버스토어 기본에';
    url = 'https://smartstore.naver.com/gibone/products/4842094192';
    addNaverSite(name, url);

    name = '네이버스토어 라록스';
    url = 'https://smartstore.naver.com/ygfac/products/3905641271';
    addNaverSite(name, url);

    name = '네이버스토어 위케어';
    url = 'https://smartstore.naver.com/wiicare/products/4242262742';
    addNaverSite(name, url);

    /*name = '네이버스토어 디즈니 유아';
    url = 'https://smartstore.naver.com/light_market/products/4835093482';
    addNaverSite(name, url);
*/
    name = '네이버스토어 [미엘물티슈] 숨쉬GO KF94 미세먼지 황사방역마스크 10매';
    url = 'https://smartstore.naver.com/gcleantec/products/4847692801';
    addNaverSite(name, url);

    name = '네이버스토어 [무신사] 스탠다드 밸브 마스크 KF 94 20팩 [블랙]';
    url = 'https://store.musinsa.com/app/product/detail/1260411/0';
    addNaverSite(name, url);

    name = '[닥터퓨리] KF94 미세먼지 황사마스크 20매 (선물용 한정판 패키지)';
    url = 'https://smartstore.naver.com/mfbshop/products/4114661363';
    addNaverSite(name, url);

    name = '[닥터퓨리] KF94 미세먼지 황사마스크 20매 (개별 낱개포장)';
    url = 'https://smartstore.naver.com/mfbshop/products/4072435942';
    addNaverSite(name, url);

    name = '[입고미정]  KF94 국대 황사 미세먼지 마스크 20매';
    url = 'https://smartstore.naver.com/korea-mask/products/4825762296';
    addNaverSite(name, url);

    name = '[닥터퓨리] KF94 스타일리시 블랙 미세먼지 황사마스크 20매 (개별 낱개포장)';
    url = 'https://smartstore.naver.com/mfbshop/products/4680268551';
    addNaverSite(name, url);

    name = '[닥터퓨리] KF94 끈조절 미세먼지 황사마스크 20매 (개별 낱개포장)';
    url = 'https://smartstore.naver.com/mfbshop/products/4735160554';
    addNaverSite(name, url);

    name = '대웅생명과학 편한숨 에브리가드 KF80소형 엠버/(5매X5)총 25매. 황사마스크 .유아마스크';
    url = 'https://smartstore.naver.com/elbonshop/products/4811559240';
    addNaverSite(name, url);

    name = '미마마스크 미세먼지 황사 보건용마스크 30개입(KF94)';
    url = 'https://smartstore.naver.com/aseado/products/4789698311';
    addNaverSite(name, url);

    name = '미마마스크 미세먼지 황사 보건용마스크 20개입(KF94)';
    url = 'https://smartstore.naver.com/aseado/products/4837245656';
    addNaverSite(name, url);

    name = '미마마스크 어린이 미세먼지 황사 보건용마스크 20개입(KF80)';
    url = 'https://smartstore.naver.com/aseado/products/4837264529';
    addNaverSite(name, url);

    name = '위케어 중국 사스 우한 코로나바이러스 예방 황사 미세먼지마스크 KF94 성인용 30매';
    url = 'https://smartstore.naver.com/wiicare/products/3922699232';
    addNaverSite(name, url);

    name = '미세먼지 황사 KF80/KF94 성인 어린이 일회용 마스크 실속형 20매';
    url = 'https://smartstore.naver.com/pyeongpyoen/products/4690028600';
    addNaverSite(name, url);

    name = '뉴크린웰 8종컬러 미세먼지 황사 KF94 대형/중형/소형 마스크 30매';
    url = 'https://smartstore.naver.com/pyeongpyoen/products/4779665558';
    addNaverSite(name, url);

    name = '평편 미세먼지 황사 마스크 KF94 대형 10매';
    url = 'https://smartstore.naver.com/pyeongpyoen/products/4751210548';
    addNaverSite(name, url);

    name = '에티카 김다미 마스크 KF94 밸브형 미세먼지 황사마스크 21매입';
    url = 'https://smartstore.naver.com/etiqa/products/4683602058';
    addNaverSite(name, url);

    name = '에티카 밸브형 큐브마스크 KF94 미세먼지 초미세먼지 황사마스크 21매입';
    url = 'https://smartstore.naver.com/etiqa/products/4691343733';
    addNaverSite(name, url);

    name = '(수량확보)당일출고 뉴크린웰 스타일황사마스크 KF94블랙 실속형20매(벌크)(개당 2700원) / KF94마스크대형벌크20매 / KF94대형마스크세트';
    url = 'https://smartstore.naver.com/jbeast/products/4835440126';
    addNaverSite(name, url);

    /*name = '(품절)(1인 최대 3매) 아기상어 유아 소형 코로나마스크 KF94 황사마스크';
    url = 'https://smartstore.naver.com/light_market/products/4834555739';
    addNaverSite(name, url);
*/
    name = '중형 1매입 5매  낱개포장 [KF94 휴그린 미세먼지 방역마스크] 초미세먼지 호흡기보호 유통기한23년2월';
    url = 'https://smartstore.naver.com/soommask/products/4828127993';
    addNaverSite(name, url);

    name = '[대형] 동국제약 황사방역용 마스크 KF94 1봉(3매)';
    url = 'https://smartstore.naver.com/dkpharm_naturesvitamin/products/4810907388';
    addNaverSite(name, url);

    name = '국제약품 황사방역용 마스크 3매입 (KF94) (대형)';
    url = 'https://smartstore.naver.com/candistore/products/4834846385';
    addNaverSite(name, url);

    name = '[3월입고 없음 4월에만나요] 품절 미세먼지 마스크 KF94 대형 (5장)';
    url = 'https://smartstore.naver.com/dapharm/products/4834738614';
    addNaverSite(name, url);

    name = 'M.ask  엠에스크 황사 방역용 마스크 KF94 (흰색/대형) 코로나19 예방마스크 국산제품 개별포장';
    url = 'https://smartstore.naver.com/dydsmall/products/4833226977';
    addNaverSite(name, url);

    name = '에티카 신민아 마스크 KF94 밸브형 미세먼지 황사마스크 7매';
    url = 'https://smartstore.naver.com/etiqa/products/4683602071';
    addNaverSite(name, url);

    name = '에티카 밸브형 큐브마스크 KF94 미세먼지 초미세먼지 황사마스크 7매입';
    url = 'https://smartstore.naver.com/etiqa/products/4691343767';
    addNaverSite(name, url);

    name = '에티카 밸브형 라운드마스크 KF94 미세먼지 초미세먼지 황사마스크 7매입';
    url = 'https://smartstore.naver.com/etiqa/products/4730528613';
    addNaverSite(name, url);

    name = '(깨끗한나라) KF94 마스크 3입 x 2팩';
    url = 'https://smartstore.naver.com/sunsuhan/products/4843564301';
    addNaverSite(name, url);

    name = '[마이케어] 끈조절 KF80 마스크 소형 (1매)';
    url = 'https://smartstore.naver.com/heattem/products/4173474004';
    addNaverSite(name, url);

    name = '[마이케어] 끈조절 KF80 마스크 대형 (1매)';
    url = 'https://smartstore.naver.com/heattem/products/4173331569';
    addNaverSite(name, url);

    name = '[마이케어] 끈조절 KF94 마스크 대형 (1매)';
    url = 'https://smartstore.naver.com/heattem/products/4173318669';
    addNaverSite(name, url);

    name = 'KF94 황사 방역 마스크 대형X(3입) 3단구조 국산 미세먼지 코로나 예방';
    url = 'https://smartstore.naver.com/matlove/products/4835320363';
    addNaverSite(name, url);

    name = '[품절] 미마마스크 필터교체형 먼지 자외선차단 패션 마스크 (+활성탄필터 5매)';
    url = 'https://smartstore.naver.com/aseado/products/3765693172';
    addNaverSite(name, url);





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
*/

   // console.error(naverSiteList)
    console.error('naverShopList.length: ' + naverShopList.length)

    /*if (testMode) {
        name = '네이버스토어 test'
        url = 'https://smartstore.naver.com/sol-sungrass/products/4851263224';
        //url = 'https://smartstore.naver.com/mooninsam/products/341195701'; // 인삼
        //url = 'https://smartstore.naver.com/dkpharm_naturesvitamin/products/4737857552'; // 마데카 파워앰플
        checkNaverStore(name, url);
        return;
    } else {
        for(var i=0; i<naverShopList.length; i++) {
            checkNaverStore(naverShopList[i].name, naverShopList[i].url);
        }
    }*/

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