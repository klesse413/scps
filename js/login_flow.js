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

(function() {

    var GDRVIE_CLIENT_ID = '442923093210-o3kc4mvfqnh53cut30o67trg6icntvc9.apps.googleusercontent.com';
    var GDRIVE_SCOPES = 'https://www.googleapis.com/auth/drive';
    var GDRIVE_API_KEY = 'AIzaSyBBRU-UpTpyEWJkdfe1hx6n2tvNEEii9hk';

    var BOX_CLIENT_ID = "n89fxun73qyutlvr40ex0xhicbpsube5";
    var BOX_URL = "https://app.box.com/api/oauth2/authorize";
    var BOX_REDIRECT_URI = "chrome-extension://nkdgoofbfnpedcmcamfkcdhocfgdmjgj/html/redirect.html";

    /**
     * Called when the client library is loaded to start the auth flow.
     */
    function handleClientLoad() {
        console.log(gapi);
        console.log(gapi.client);
        gapi.client.setApiKey(GDRIVE_API_KEY);
        window.setTimeout(checkAuth, 1);
    }

    /**
     * Check if the current user has authorized the application.
     */
    function checkAuth() {
        gapi.auth.authorize(
            {'client_id': GDRVIE_CLIENT_ID, 'scope': GDRIVE_SCOPES, 'immediate': true},
            handleAuthResult);
    }

    /**
     * Called when authorization server replies.
     *
     * @param {Object} authResult Authorization result.
     */
    function handleAuthResult(authResult) {
        if (authResult && !authResult.error) {
            // Access token has been successfully retrieved, requests can be sent to the API.
            return true;
        } else {
            // No access token could be retrieved
            gapi.auth.authorize(
                {client_id: GDRVIE_CLIENT_ID, scope: GDRIVE_SCOPES, immediate: false},
                handleAuthResult);
            return false;
        }
    }

    function box_auth_flow() {
        $.ajax({
            url: BOX_URL,
            response_type: "code",
            client_id: BOX_CLIENT_ID,
            redirect_uri: BOX_REDIRECT_URI,
            state: "blah"
        }).complete(function ( data ) {
            // Log the JSON response to prove this worked
            console.log(data.responseText);
        });
    }




    var t = 4;

    var checkSuccessful = function() {
        if (localStorage.getItem("successful") >= t) {
            localStorage.setItem("logged_in", 1);
            window.open({
                url: "/html/home.html"
            });
        }
    };



    var flow = function() {

        checkSuccessful();

        if (localStorage.getItem("got_here_from") == "login") {
            chrome.runtime.getBackgroundPage(function(eventPage) {
                eventPage.controller.dbox_chrome.auth();
            });
            localStorage.setItem("got_here_from", "dbox");
            localStorage.setItem("successful", parseInt(localStorage.getItem("successful")) + 1)
        }

        checkSuccessful();

        if (localStorage.getItem("got_here_from") == "dbox") {
            console.log(gapi);
            box_auth_flow();
        }

        checkSuccessful();

        //if (localStorage.getItem("got_here_from") == "gdrive") {
        //    //onedrive_auth_flow();
        //}
    }();

}.call(this));