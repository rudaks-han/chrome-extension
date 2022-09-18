window.onload = async () => {

    checking();
    setInterval(async () => {
        console.log('reload')
        location.reload();
    }, 60*1000)


}

const checking = async () => {
    await delay(2000)

    let currMinutes = new Date().getMinutes();
    let place = '매화나무 캠핑장'
    if (currMinutes % 2 == 0) {
        place = '매화나무캠핑장';
    } else {
        place = '가족캠핑장';
    }
    document.querySelector('#' + place).click();
    await delay(1000)

    console.log('place: ' + place)
    await clickDay(28); // 9/19
    /*
    await executeGoNextMonth();
    // 10월
    await clickDay(1);
    await clickDay(2);
    await clickDay(3);
    await clickDay(5);
    await clickDay(8);
    await clickDay(9);
    await clickDay(12);
    await clickDay(15);
    await clickDay(16);
    await clickDay(19);
    await clickDay(22);
    await clickDay(23);
    await clickDay(26);
    await clickDay(29);
    await clickDay(30);*/
}

const executeGoNextMonth = () => {
    return new Promise(function(resolve, reject) {
        setTimeout(() => {

            var s = document.createElement('script');
            s.src = chrome.runtime.getURL('js/goNextMonth.js');
            s.onload = function() {
                this.remove();
            };

            (document.head || document.documentElement).appendChild(s);

            resolve();
        }, 1000);
    });
}

const delay = (ms) => {
    return new Promise((resolve) =>
        setTimeout(() => {
            resolve(ms);
        }, ms)
    );
};

function clickDay(day){
    return new Promise(function(resolve, reject) {
        setTimeout(() => {

            const aLink = document.querySelectorAll('#calendarTable a');
            for (let i=0; i<aLink.length; i++) {
                if (aLink[i].textContent == day) {
                    aLink[i].click();
                    console.log('day clicked: ' + day)
                }
            }

            resolve();
        }, 1000);
    });
}


var s = document.createElement('script');
s.src = chrome.runtime.getURL('js/injected.js');
s.onload = function() {
    this.remove();
};


$(function() {
    (document.head || document.documentElement).appendChild(s);
})
