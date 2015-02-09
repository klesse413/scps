/**
 * author: Katelyn Lesse
 * since: 1/27/15
 */

chrome.browserAction.onClicked.addListener(
    function(tab) {
        //if (chrome.storage.sync.get("Logged_in")) {
        if (1 == 0) {
            chrome.browserAction.setPopup({
                popup: "../html/logged_in_popup.html"
            });
        } else {
            chrome.browserAction.setPopup({
                popup: "../html/not_logged_in_popup.html"
            });
        }

    }
);

var client = new Dropbox.Client({key: "280u6tt5hujnm72"});

