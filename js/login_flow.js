/**
 * author: Katelyn Lesse
 * since: 2/9/15
 */

// maybe first time, do sign up, bring them here with t = 4
// get through this successfully, bring them back to a signup flow
// generate key, store it
// after that, can log in with a t less than 4
// each time log in, fetch db, store locally unencrypted, delete when log out
// when make changes, replace cloud stored db and local with new copy

var t = 4;

var checkSuccessful = function() {
    if (localStorage["successful"] >= t) {
        localStorage["logged_in"] = 1;
        window.open({
            url: "/html/home.html"
        });
    }
    console.log(localStorage["successful"]);
};

var flow = function() {

    //checkSuccessful();

    if (localStorage["got_here_from"] == "login") {
        chrome.runtime.getBackgroundPage(function(eventPage) {
            return eventPage.controller.dbox_chrome.auth();
        });
    }

    //checkSuccessful();

    if (localStorage["got_here_from"] == "dbox") {
        alert("yay");
        //gdrive_auth_flow();
    }

    //checkSuccessful();

    if (localStorage["got_here_from"] == "gdrive") {
        //onedrive_auth_flow();
    }
};

flow();

