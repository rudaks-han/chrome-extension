window.onload = async () => {
    /*setTimeout(() => {
        const aLink = document.querySelectorAll('#calendarTable a');
        for (let i=0; i<aLink.length; i++) {
            if (aLink[i].textContent == '21') {
                aLink[i].click();
            }
        }
    }, 1000);*/

    await delay(2000)
    //const nextLink = document.querySelector('.calendar_paginate > .next > a');
    //nextLink.click();
    console.log($('.calendar_paginate > .next > a').length)
    //$('.calendar_paginate > .next > a')[0].click();
    $($('.calendar_paginate > .next > a'))[0].dispatchEvent(new MouseEvent("click"))
    console.error('clicked')
    //console.log(model)
    //goNextMonth();
    //goNext();
    //nextLink.dispatchEvent(new PointerEvent('click', {bubbles: true}))

    /*await delay(2000);

    await clickDay(19); // 9/19
    await clickDay(20);

    const nextLink = document.querySelector('.calendar_paginate > .next > a > img');
    console.log('nextLink.length: ' + nextLink.length)
    console.log(nextLink)*/
    //nextLink.click();

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

async function goNext() {
    chrome.runtime.sendMessage({action: "goNextMonth"}, function(response) {});
}

/*function goNext() {
    chrome.tabs.query({active: true, currentWindow: true}).then(([tab]) => {
        chrome.scripting.executeScript(
            {
                target: {tabId: tab.id},
                files: ['myscript.js'],
                // function: () => {}, // files or function, both do not work.
            })
    })
}*/
/*const clickDay = async (day) => {
    const result = delay(3000)
    console.log('click day: ' + day)
    const aLink = document.querySelectorAll('#calendarTable a');
    for (let i=0; i<aLink.length; i++) {
        if (aLink[i].textContent == day) {
            aLink[i].click();
            console.log('day clicked: ' + day)
        }
    }
}*/

var s = document.createElement('script');
s.src = chrome.runtime.getURL('js/injected.js');
s.onload = function() {
    this.remove();
};


$(function() {
    (document.head || document.documentElement).appendChild(s);
})