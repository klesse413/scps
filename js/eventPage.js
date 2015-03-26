/**
 * author: Katelyn Lesse
 * since: 1/27/15
 */

chrome.browserAction.onClicked.addListener(function() {
    if (localStorage.getItem("logged_in") === null) {
        chrome.browserAction.setPopup({
            popup: "/html/not_logged_in_popup.html"
        });
    } else if (localStorage.getItem("logged_in") === 0) {
        chrome.browserAction.setPopup({
            popup: "/html/not_logged_in_popup.html"
        });
    } else {
        chrome.browserAction.setPopup({
            popup: "/html/logged_in_popup.html"
        });
    }
});