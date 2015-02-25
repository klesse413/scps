///**
// * author: Katelyn Lesse
// * since: 2/13/15
// */
//
//
//var CLIENT_ID = '442923093210-o3kc4mvfqnh53cut30o67trg6icntvc9.apps.googleusercontent.com';
//var SCOPES = 'https://www.googleapis.com/auth/drive';
//var API_KEY = 'AIzaSyBBRU-UpTpyEWJkdfe1hx6n2tvNEEii9hk';
//
///**
// * Called when the client library is loaded to start the auth flow.
// */
//function handleClientLoad() {
//    console.log(gapi);
//    console.log(gapi.client);
//    gapi.client.setApiKey(API_KEY);
//    window.setTimeout(checkAuth, 1);
//}
//
///**
// * Check if the current user has authorized the application.
// */
//function checkAuth() {
//    gapi.auth.authorize(
//        {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': true},
//        handleAuthResult);
//}
//
///**
// * Called when authorization server replies.
// *
// * @param {Object} authResult Authorization result.
// */
//function handleAuthResult(authResult) {
//    if (authResult && !authResult.error) {
//        // Access token has been successfully retrieved, requests can be sent to the API.
//        return true;
//    } else {
//        // No access token could be retrieved
//        gapi.auth.authorize(
//            {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
//            handleAuthResult);
//        return false;
//    }
//}