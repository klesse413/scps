/**
 * author: Katelyn Lesse
 * since: 2/28/15
 */

var BOX_URL = "https://app.box.com/api/oauth2/token";
var BOX_CLIENT_ID = "n89fxun73qyutlvr40ex0xhicbpsube5";
var BOX_CLIENT_SECRET = "CFvqJwUXZ8yXVKbIhVoUPoYx3A2lgoIG";
//var BOX_REDIRECT_URI = "chrome-extension://nkdgoofbfnpedcmcamfkcdhocfgdmjgj/html/redirect.html";



// return a parameter value from the current URL
function getParam (sname) {
    var params = location.search.substr(location.search.indexOf("?")+1);
    var sval = "";
    params = params.split("&");
    // split param and value into individual pieces
    for (var i=0; i<params.length; i++)
    {
        temp = params[i].split("=");
        if ( [temp[0]] == sname ) { sval = temp[1]; }
    }
    return sval;
}

var c = getParam("code");

//var url_with_params = BOX_URL + "?grant_type=authorization_code&code=" + c
//    + "&client_id=" + BOX_CLIENT_ID + "&client_secret=" + BOX_CLIENT_SECRET;
//    //+ "&redirect_uri=" + BOX_REDIRECT_URI;

var url_with_params = "grant_type=authorization_code&code=" + c
    + "&client_id=" + BOX_CLIENT_ID + "&client_secret=" + BOX_CLIENT_SECRET;


$.post(BOX_URL, url_with_params, function(data, textStatus) {
    if (data["access_token"] == null) {
        localStorage.setItem("got_here_from", "box");
        console.log("ERROR GETTING BOX TOKEN");
    } else {
        localStorage.setItem("box_access_token", data["access_token"]);
        localStorage.setItem("box_refresh_token", data["refresh_token"]);
        localStorage.setItem("got_here_from", "box");
        localStorage.setItem("successful", parseInt(localStorage.getItem("successful")) + 1);
    }
    window.location.replace("/html/redirect.html");
}, "json");
