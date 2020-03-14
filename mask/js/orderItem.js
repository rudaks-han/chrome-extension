
document.querySelector('._generalPaymentsTab > div > .ajax_radio').click(); // 일반결제
setTimeout(function() {
    document.querySelectorAll('._generalPaymentsList > li')[3].querySelector('.ajax_radio').click();
}, 100);

setTimeout(function() {
    document.querySelector('.agree_required > .checkbox-applied > .checkbox-mark').click(); // 전체 동의하기
}, 200);
setTimeout(function() {
    document.querySelector('.btn_payment').click(); // 결제하기/

    console.error('### 구입완료');
}, 300);



