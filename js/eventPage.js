/**
 * author: Katelyn Lesse
 * since: 1/27/15
 */

chrome.browserAction.onClicked.addListener(function() {

    chrome.storage.local.get("logged_in", function(items) {
        if (items.logged_in === undefined) {
            chrome.browserAction.setPopup({
                popup: "/html/not_logged_in_popup.html"
            });
        } else if (items.logged_in == "0") {
            chrome.browserAction.setPopup({
                popup: "/html/not_logged_in_popup.html"
            });
        } else {
            chrome.browserAction.setPopup({
                popup: "/html/logged_in_popup.html"
            });
        }
    });
});