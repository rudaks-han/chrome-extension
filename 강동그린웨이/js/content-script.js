window.onload = () => {
    setTimeout(() => {
        //$('.wrap_alex').removeClass('fold');

        const aLink = document.getElementsByTagName('a');
        console.log("aLink.length: " + aLink.length)
        for (let i=0; i<aLink.length; i++) {
            console.log(aLink[i].textContent);
            if (aLink[i].textContent == '21') {
                aLink[i].click();
            }
        }
    }, 1000);
}


var s = document.createElement('script');
s.src = chrome.runtime.getURL('js/injected.js');
s.onload = function() {
    this.remove();
};
$(function() {
    (document.head || document.documentElement).appendChild(s);
})