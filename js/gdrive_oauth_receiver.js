/**
* author: Katelyn Lesse
* since: 3/12/15
*/


// CHROME EXTENSION REDIRECT URI NOT VALID
// EVENTUALLY FIND WORKAROUND



//
//var handleGdriveReturn = function() {
//
//    var GDRIVE_URL = "https://www.googleapis.com/oauth2/v1/tokeninfo";
//
//    // return a parameter value from the current URL
//    function getParam(sname) {
//        var params = location.search.substr(location.search.indexOf("?") + 1);
//        var sval = "";
//        params = params.split("&");
//        // split param and value into individual pieces
//        for (var i = 0; i < params.length; i++) {
//            temp = params[i].split("=");
//            if ([temp[0]] == sname) {
//                sval = temp[1];
//            }
//        }
//        return sval;
//    }
//
//    var tok = getParam("access_token");
//    if (tok.length == 0) {
//        // there was an error - do something about it
//    }
//
//    var url_with_params = "access_token=" + tok;
//
//    $.post(GDRIVE_URL, url_with_params, function (data, textStatus) {
//        if (data["expires_in"] == null) {
//            chrome.storage.local.set("got_here_from", "gdrive");
//            console.log("ERROR GETTING GDRIVE TOKEN");
//        } else {
//            chrome.storage.local.set("gdrive_access_token", tok);
//            chrome.storage.local.set("got_here_from", "gdrive");
//            chrome.storage.local.set("successful", parseInt(chrome.storage.local.get("successful")) + 1);
//        }
//        window.location.replace("/html/redirect.html");
//    }, "json");
//}();