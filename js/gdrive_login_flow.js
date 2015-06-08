/**
 * author: Katelyn Lesse
 * since: 6/5/15
 */

var GDRIVE_API_KEY = "AIzaSyBBRU-UpTpyEWJkdfe1hx6n2tvNEEii9hk";
var GDRIVE_CLIENT_ID = "442923093210-o3kc4mvfqnh53cut30o67trg6icntvc9.apps.googleusercontent.com";
var GDRIVE_SCOPES = "https://www.googleapis.com/auth/drive";

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

function handleClientLoad() {
    //gapi.client.setApiKey(GDRIVE_API_KEY);
    //window.setTimeout(checkAuth,1);
    window.setTimeout(handleGdriveAuth,1);
}

function checkAuth() {
    gapi.auth.authorize({client_id: GDRIVE_CLIENT_ID, scope: GDRIVE_SCOPES, immediate: true}, handleAuthResult);
}

function handleAuthResult(authResult) {

    if (authResult && !authResult.error) {
        localStorage.setItem("got_here_from", "gdrive");
        localStorage.setItem("successful", parseInt(localStorage.getItem("successful")) + 1);
        checkSuccessful();
    } else {
        handleGdriveAuth();
        console.log(authResult.error);
    }
    //location.reload();
}

function handleGdriveAuth() {
    gapi.auth.authorize({client_id: GDRIVE_CLIENT_ID, scope: GDRIVE_SCOPES, immediate: false}, handleAuthResult);
    //return false;
}