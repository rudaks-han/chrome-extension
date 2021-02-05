var s = document.createElement('script');
s.src = chrome.runtime.getURL('js/injected.js');
s.onload = function() {
    this.remove();
};

$(function() {
    (document.head || document.documentElement).appendChild(s);
})

document.addEventListener('errorTriggeredEvent', function (e) {
    var data = e.detail;
    console.log('received', data);
});