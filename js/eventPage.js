/**
 * Created by klesse on 1/27/15.
 */

chrome.browserAction.onClicked.addListener(
    function(tab) {
        //if (chrome.storage.sync.get("Logged_in")) {
        if (0 == 1) {
            //alert('hi');
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