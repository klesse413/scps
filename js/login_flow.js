/**
 * author: Katelyn Lesse
 * since: 2/9/15
 */

//var GDRVIE_CLIENT_ID = '442923093210-o3kc4mvfqnh53cut30o67trg6icntvc9.apps.googleusercontent.com';
//var GDRIVE_SCOPES = 'https://www.googleapis.com/auth/drive';
//var GDRIVE_URL = 'https://accounts.google.com/o/oauth2/auth';
//var GDRIVE_REDIRECT_URI = "chrome-extension://nkdgoofbfnpedcmcamfkcdhocfgdmjgj/html/gdrive_oauth_receiver.html";


var BOX_CLIENT_ID = "n89fxun73qyutlvr40ex0xhicbpsube5";
var BOX_URL = "https://app.box.com/api/oauth2/authorize";
var BOX_REDIRECT_URI = "chrome-extension://nkdgoofbfnpedcmcamfkcdhocfgdmjgj/html/box_oauth_receiver.html";

//function gdrive_auth_flow() {
//    var url_with_params_gdrive = GDRIVE_URL + "?response_type=token&scope=" + GDRIVE_SCOPES
//    + "&state=blah&redirect_uri=" + GDRIVE_REDIRECT_URI + "&client_id=" + GDRVIE_CLIENT_ID;
//    window.location.replace(url_with_params_gdrive);
//}



window.addEventListener('storage', function(event) {
    alert("hi");
    alert(event);
});



function odrive_auth_flow() {
    //window.addEventListener('storage', storage_handler, false);
    WL.init({
        client_id: "000000004815026C",
        redirect_uri: "https://login.live.com/oauth20_desktop.srf",
        response_type: "token"
    });
    WL.login({
        scope: ["wl.signin", "onedrive.readwrite"]
    });
}

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
                chrome.storage.local.set("got_here_from", "dbox");
                chrome.storage.local.set("successful", parseInt(chrome.storage.local.get("successful")) + 1);
            }

            location.reload();
        });
    }
}

var t = 3;

var checkSuccessful = function() {
    console.log(chrome.storage.local.get("got_here_from"));
    console.log(chrome.storage.local.get("successful"));
    if (chrome.storage.local.get("successful") >= t) {
        chrome.storage.local.set("logged_in", 1);
        chrome.browserAction.setPopup({
            popup: "/html/logged_in_popup.html"
        });
        window.location.replace("/html/home.html");
    }
};

var flow = function() {

    checkSuccessful();

    if (chrome.storage.local.get("got_here_from") == "login") {
        dbox_auth_flow();
    }

    if (chrome.storage.local.get("got_here_from") == "dbox") {
        box_auth_flow();
    }

    if (chrome.storage.local.get("got_here_from") == "box") {
        odrive_auth_flow();
    }
}();