var naverSiteList = '';
var naverExcludeSiteList = [
    'https://www.i-ete.com/products/33',
    'https://smartstore.naver.com/cleanairtech/products/4818777369'
];

function addNaverSite(name, url) {
    if (naverExcludeSiteList.indexOf(url) > -1) {
        console.error('excluded naver site: ' + url);
        return;
    }

    var exists = naverShopList.some(el => el.url == url);

    if (!exists) {
        naverShopList.push({name: name, url: url});

       /* naverSiteList += "name = '" + name + "';\n";
        naverSiteList += "url = '" + url + "';\n";
        naverSiteList += 'addNaverSite(name, url);\n\n';*/
    }

}

var NAVER_STORES = [
    { name: '네이버스토어 아에르 스탠다스 베이직 마스크', url: 'https://smartstore.naver.com/aer-shop/products/4722827602' },
    { name: '네이버스토어 닥터퓨리 뽑아쓰는', url: 'https://smartstore.naver.com/mfbshop/products/4072573492' },
    { name: '네이버스토어 닥터퓨리 미세먼지', url: 'https://smartstore.naver.com/mfbshop/products/4072435942?site_preference=device&NaPm=' },
    { name: '네이버스토어 상공양행 마스크', url: 'https://smartstore.naver.com/sangkong/products/4762917002' },
    { name: '네이버스토어 국대 마스크', url: 'https://smartstore.naver.com/korea-mask/products/4825762296#DEFAULT' },
    { name: '네이버스토어 에티카 마스크', url: 'https://smartstore.naver.com/etiqa/products/4817982860' },
    { name: '네이버스토어 공감이 뉴네퓨어 마스크', url: 'https://smartstore.naver.com/gonggami/products/4705579501' },
    { name: '네이버스토어 동국제약', url: 'https://smartstore.naver.com/dkpharm_naturesvitamin/products/4810907388?NaPm=' },
    { name: '네이버스토어 마이케어2', url: 'https://smartstore.naver.com/heattem/products/4824368953' },
    { name: '네이버스토어 닥터퓨리', url: 'https://smartstore.naver.com/mfbshop/products/4735164530' },
    { name: '네이버스토어 금아스토어 블랙', url: 'https://smartstore.naver.com/kumaelectron/products/4813999869' },
    { name: '네이버스토어 휴그린 중형', url: 'https://smartstore.naver.com/soommask/products/4828127993?NaPm=#DEFAULT' },
    { name: '네이버스토어 미마마스크', url: 'https://smartstore.naver.com/aseado/products/4837257765' },
    { name: '네이버스토어 미마마스크 어린이', url: 'https://smartstore.naver.com/aseado/products/4837266971' },
    { name: '네이버스토어 일반마스크 비포장 50매', url: 'https://smartstore.naver.com/neulhaerangmask/products/4632987981' },
    { name: '네이버스토어 해피키친', url: 'https://smartstore.naver.com/carmang1825/products/4834056954' },
    { name: '네이버스토어 착한마스크', url: 'https://smartstore.naver.com/shyman/products/4843275185' },
    { name: '네이버스토어 기본에', url: 'https://smartstore.naver.com/gibone/products/4842094192' },
    { name: '네이버스토어 위케어', url: 'https://smartstore.naver.com/wiicare/products/4242262742' },
    { name: '네이버스토어 [미엘물티슈] 숨쉬GO KF94 미세먼지 황사방역마스크 10매', url: 'https://smartstore.naver.com/gcleantec/products/4847692801' },
    { name: '네이버스토어 [무신사] 스탠다드 밸브 마스크 KF 94 20팩 [블랙]', url: 'https://store.musinsa.com/app/product/detail/1260411/0' },
    { name: '[닥터퓨리] KF94 미세먼지 황사마스크 20매 (선물용 한정판 패키지)', url: 'https://smartstore.naver.com/mfbshop/products/4114661363' },
    { name: '[닥터퓨리] KF94 미세먼지 황사마스크 20매 (개별 낱개포장)', url: 'https://smartstore.naver.com/mfbshop/products/4072435942' },
    { name: '[입고미정]  KF94 국대 황사 미세먼지 마스크 20매', url: 'https://smartstore.naver.com/korea-mask/products/4825762296' },
    { name: '[닥터퓨리] KF94 스타일리시 블랙 미세먼지 황사마스크 20매 (개별 낱개포장)', url: 'https://smartstore.naver.com/mfbshop/products/4680268551' },
    { name: '[닥터퓨리] KF94 끈조절 미세먼지 황사마스크 20매 (개별 낱개포장)', url: 'https://smartstore.naver.com/mfbshop/products/4735160554' },
    { name: '대웅생명과학 편한숨 에브리가드 KF80소형 엠버/(5매X5)총 25매. 황사마스크 .유아마스크', url: 'https://smartstore.naver.com/elbonshop/products/4811559240' },
    { name: '미마마스크 미세먼지 황사 보건용마스크 30개입(KF94)', url: 'https://smartstore.naver.com/aseado/products/4789698311' },
    { name: '미마마스크 미세먼지 황사 보건용마스크 20개입(KF94)', url: 'https://smartstore.naver.com/aseado/products/4837245656' },
    { name: '미마마스크 어린이 미세먼지 황사 보건용마스크 20개입(KF80)', url: 'https://smartstore.naver.com/aseado/products/4837264529' },
    { name: '위케어 중국 사스 우한 코로나바이러스 예방 황사 미세먼지마스크 KF94 성인용 30매', url: 'https://smartstore.naver.com/wiicare/products/3922699232' },
    { name: '미세먼지 황사 KF80/KF94 성인 어린이 일회용 마스크 실속형 20매', url: 'https://smartstore.naver.com/pyeongpyoen/products/4690028600' },
    { name: '뉴크린웰 8종컬러 미세먼지 황사 KF94 대형/중형/소형 마스크 30매', url: 'https://smartstore.naver.com/pyeongpyoen/products/4779665558' },
    { name: '평편 미세먼지 황사 마스크 KF94 대형 10매', url: 'https://smartstore.naver.com/pyeongpyoen/products/4751210548' },
    { name: '에티카 김다미 마스크 KF94 밸브형 미세먼지 황사마스크 21매입', url: 'https://smartstore.naver.com/etiqa/products/4683602058' },
    { name: '에티카 밸브형 큐브마스크 KF94 미세먼지 초미세먼지 황사마스크 21매입', url: 'https://smartstore.naver.com/etiqa/products/4691343733' },
    { name: '위케어 중국 사스 우한 코로나바이러스 예방 블랙 황사 미세먼지마스크 KF94 성인용 60매', url: 'https://smartstore.naver.com/wiicare/products/4242272411' },
    { name: '위케어 중국 사스 우한 코로나바이러스 예방 황사 미세먼지마스크 KF94 아동용 60매', url: 'https://smartstore.naver.com/wiicare/products/3924755533' },
    { name: '[대형] 동국제약 황사방역용 마스크 KF94 1봉(3매)', url: 'https://smartstore.naver.com/dkpharm_naturesvitamin/products/4810907388' },
    { name: '[3월입고 없음 4월에만나요] 품절 미세먼지 마스크 KF94 대형 (5장)', url: 'https://smartstore.naver.com/dapharm/products/4834738614' },
    { name: '에티카 신민아 마스크 KF94 밸브형 미세먼지 황사마스크 7매', url: 'https://smartstore.naver.com/etiqa/products/4683602071' },
    { name: '에티카 밸브형 큐브마스크 KF94 미세먼지 초미세먼지 황사마스크 7매입', url: 'https://smartstore.naver.com/etiqa/products/4691343767' },
    { name: '에티카 밸브형 라운드마스크 KF94 미세먼지 초미세먼지 황사마스크 7매입', url: 'https://smartstore.naver.com/etiqa/products/4730528613' },
    { name: '(깨끗한나라) KF94 마스크 3입 x 2팩', url: 'https://smartstore.naver.com/sunsuhan/products/4843564301' },
    { name: '[걸리버] KF94 휴그린 미세먼지 방역마스크 (5매)', url: 'https://smartstore.naver.com/soommask/products/4828127993' },
    { name: '끈조절 미세먼지 황사마스크 대형/소형 색상랜덤 KF94 10매', url: 'https://smartstore.naver.com/pyeongpyoen/products/4761816560' },
    { name: '이편한 황사 방역 마스크 KF94 KF80 독감 감기 예방 미세먼지 황사 차단 일회용', url: 'https://smartstore.naver.com/sintech/products/598573259' },
    { name: '이편한 미세먼지 마스크 황사 마스크 KF80 KF94', url: 'https://smartstore.naver.com/mdamayo/products/3803685971' },
    { name: 'KF94 샤인웰 캐스터 미세먼지 황사마스크 [흰색 10매]', url: 'https://smartstore.naver.com/shinewell_healthcare/products/4861603330' },
    { name: 'KF94 미세먼지 황사 마스크 30매 [5개입X6지퍼팩] 대형', url: 'https://smartstore.naver.com/cucofarm/products/4818644134' },
    { name: 'KF94 미세먼지 황사 마스크 5개 (지퍼팩) 대형', url: 'https://smartstore.naver.com/cucofarm/products/4818677202' },
];

function addNaverStoreMaskSite() {
    naverSiteList = '';
    welKipsMallCount = 0;

    for (var i=0; i<NAVER_STORES.length; i++) {
        var site = NAVER_STORES[i];
        addNaverSite(site['name'], site['url']);
    }


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