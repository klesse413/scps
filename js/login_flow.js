/**
 * author: Katelyn Lesse
 * since: 2/9/15
 */

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
            } else {
                localStorage.setItem("got_here_from", "dbox");
                localStorage.setItem("successful", parseInt(localStorage.getItem("successful")) + 1);
            }
            location.reload();
        });
    }
}

// eventually, have user choose n and t on signup - for now both are 2
var t = 3;

var checkSuccessful = function() {
    console.log(localStorage.getItem("got_here_from"));
    console.log(localStorage.getItem("successful"));
    if (localStorage.getItem("successful") >= t) {
        localStorage.setItem("logged_in", 1);
        chrome.browserAction.setPopup({
            popup: "/html/logged_in_popup.html"
        });
        window.location.replace("/html/home.html");
    }
};

checkSuccessful();

if (localStorage.getItem("got_here_from") === "login") {
    dbox_auth_flow();
    //checkSuccessful();
} else if (localStorage.getItem("got_here_from") === "dbox") {
    box_auth_flow();
    //checkSuccessful();
} else if (localStorage.getItem("got_here_from") === "box") {
    //handleGdriveAuth();
    window.location.replace("/html/gdrive_redirect.html");
}
//} else if (localStorage.getItem("got_here_from") == "gdrive") {
//    checkSuccessful();
//}
