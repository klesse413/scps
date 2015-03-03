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

//(function() {



    var GDRVIE_CLIENT_ID = '442923093210-o3kc4mvfqnh53cut30o67trg6icntvc9.apps.googleusercontent.com';
    var GDRIVE_SCOPES = 'https://www.googleapis.com/auth/drive';
    var GDRIVE_API_KEY = 'AIzaSyBBRU-UpTpyEWJkdfe1hx6n2tvNEEii9hk';

    var BOX_CLIENT_ID = "n89fxun73qyutlvr40ex0xhicbpsube5";
    var BOX_URL = "https://app.box.com/api/oauth2/authorize";
    var BOX_REDIRECT_URI = "chrome-extension://nkdgoofbfnpedcmcamfkcdhocfgdmjgj/html/box_oauth_receiver.html";

    function box_auth_flow() {

        var url_with_params = BOX_URL + "?redirect_uri=" + BOX_REDIRECT_URI + "&response_type=code&client_id=" + BOX_CLIENT_ID
            + "&state=blah";
        window.location.replace(url_with_params);
    }

    function dbox_auth_flow() {
        if (!dbox_client.isAuthenticated()) {
            dbox_client.authenticate(function (error) {
                if (error) {
                    console.log(error);
                } else  {

                }
                localStorage.setItem("got_here_from", "dbox");
                localStorage.setItem("successful", parseInt(localStorage.getItem("successful")) + 1);
                location.reload();
            });
        }
    }

    var t = 2;

    var checkSuccessful = function() {
        console.log(localStorage.getItem("got_here_from"));
        console.log(localStorage.getItem("successful"));
        if (localStorage.getItem("successful") >= t) {
            localStorage.setItem("logged_in", 1);
            chrome.browserAction.setPopup({
                popup: "/html/logged_in_popup.html"
            });
            window.location.replace("/html/almost_home.html");
        }
    };

    var flow = function() {

        checkSuccessful();

        if (localStorage.getItem("got_here_from") == "login") {
            //chrome.runtime.getBackgroundPage(function(eventPage) {
            //    eventPage.controller.dbox_chrome.auth();
            //});
            //localStorage.setItem("got_here_from", "dbox");
            //localStorage.setItem("successful", parseInt(localStorage.getItem("successful")) + 1);
            dbox_auth_flow();
        }

        checkSuccessful();

        if (localStorage.getItem("got_here_from") == "dbox") {
            box_auth_flow();
        }

        checkSuccessful();

        if (localStorage.getItem("got_here_from") == "box") {
            //alert("YAYAYAY");
        }
    }();

//}.call(this));