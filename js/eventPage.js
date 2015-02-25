/**
 * author: Katelyn Lesse
 * since: 1/27/15
 */

(function() {
    var EventPageController, dbox_chrome;

    EventPageController = (function() {
        function EventPageController(dbox_chrome) {

            this.dbox_chrome = dbox_chrome;



            chrome.browserAction.onClicked.addListener((function(_this) {
                return function() {
                    return _this.onBrowserAction();
                };
            })(this));

        }

        EventPageController.prototype.onBrowserAction = function() {
            return (function() {
                if (localStorage.getItem("logged_in") === null) {
                    alert("hi");
                    chrome.browserAction.setPopup({
                        popup: "/html/not_logged_in_popup.html"
                    });
                } else {
                    chrome.browserAction.setPopup({
                        popup: "/html/logged_in_popup.html"
                    });
                }
            })();
        };

        return EventPageController;

    })();

    dbox_chrome = new Dropbox.Chrome({
        key: '280u6tt5hujnm72'
    });

    window.controller = new EventPageController(dbox_chrome);

}).call(this);