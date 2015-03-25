/**
 * author: Katelyn Lesse
 * since: 2/28/15
 */

var handleBoxReturn = function() {

    var BOX_URL = "https://app.box.com/api/oauth2/token";
    var BOX_CLIENT_ID = "n89fxun73qyutlvr40ex0xhicbpsube5";
    var BOX_CLIENT_SECRET = "CFvqJwUXZ8yXVKbIhVoUPoYx3A2lgoIG";

    // return a parameter value from the current URL
    function getParam(sname) {
        var params = location.search.substr(location.search.indexOf("?") + 1);
        var sval = "";
        params = params.split("&");
        // split param and value into individual pieces
        for (var i = 0; i < params.length; i++) {
            temp = params[i].split("=");
            if ([temp[0]] == sname) {
                sval = temp[1];
            }
        }
        return sval;
    }

    var c = getParam("code");

    var url_with_params = "grant_type=authorization_code&code=" + c
        + "&client_id=" + BOX_CLIENT_ID + "&client_secret=" + BOX_CLIENT_SECRET;


    $.post(BOX_URL, url_with_params, function (data, textStatus) {
        if (data["access_token"] == null) {
            chrome.storage.local.set("got_here_from", "box");
            console.log("ERROR GETTING BOX TOKEN");
        } else {
            chrome.storage.local.set("box_access_token", data["access_token"]);
            chrome.storage.local.set("box_refresh_token", data["refresh_token"]);
            chrome.storage.local.set("got_here_from", "box");
            chrome.storage.local.set("successful", parseInt(chrome.storage.local.get("successful")) + 1);
        }
        window.location.replace("/html/redirect.html");
    }, "json");
}();