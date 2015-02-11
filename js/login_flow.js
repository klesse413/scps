/**
 * author: Katelyn Lesse
 * since: 2/9/15
 */

var t = 3; // for now ..

function dbox_auth_flow() {

    var client = DBOX_CLIENT;

    client.authenticate(function(error, client) {
        if (error) {
            return showError(error);
        }
    });

    localStorage["got_here_from"] = "dbox";
    localStorage["successful"]++;
}

function gdrive_auth_flow() {

}

var showError = function(error) {
    switch (error.status) {
        case Dropbox.ApiError.INVALID_TOKEN:
            // If you're using dropbox.js, the only cause behind this error is that
            // the user token expired.
            // Get the user through the authentication flow again.
            dbox_auth_flow();
            break;

        case Dropbox.ApiError.NOT_FOUND:
            // The file or folder you tried to access is not in the user's Dropbox.
            // Handling this error is specific to your application.

            // not sure how to handle this one, would be a huge problem if delete
            // enough to have less than threshold
            break;

        case Dropbox.ApiError.OVER_QUOTA:
            // The user is over their Dropbox quota.
            // Tell them their Dropbox is full. Refreshing the page won't help.
            break;

        case Dropbox.ApiError.RATE_LIMITED:
            // Too many API requests. Tell the user to try again later.
            // Long-term, optimize your code to use fewer API calls.
            break;

        case Dropbox.ApiError.NETWORK_ERROR:
            // An error occurred at the XMLHttpRequest layer.
            // Most likely, the user's network connection is down.
            // API calls will not succeed until the user gets back online.
            break;

        case Dropbox.ApiError.INVALID_PARAM:
        case Dropbox.ApiError.OAUTH_ERROR:
        case Dropbox.ApiError.INVALID_METHOD:
        default:
        // Caused by a bug in dropbox.js, in your application, or in Dropbox.
        // Tell the user an error occurred, ask them to refresh the page.
    }
};

function checkSuccessful() {
    if (localStorage["successful"] >= t) {
        localStorage["logged_in"] = 1;
        window.open({
            url: "/html/home.html"
        });
    }
}

function flow() {

    checkSuccessful();

    if (localStorage["got_here_from"] == "login") {
        dbox_auth_flow();
    }

    checkSuccessful();

    if (localStorage["got_here_from"] == "dbox") {
        gdrive_auth_flow();
    }
}


flow();
