var s = document.createElement('script');
s.src = chrome.extension.getURL('js/injected.js');
s.onload = function() {
    this.remove();
};
$(function() {
    (document.head || document.documentElement).appendChild(s);
})