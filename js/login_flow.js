/**
 * author: Katelyn Lesse
 * since: 2/9/15
 */

var t = 3; // for now ..

function dbox_auth_flow() {
    var client = new Dropbox.Client({key: "280u6tt5hujnm72"});
    client.authDriver(new Dropbox.AuthDriver.ChromeExtension({
        receiverPath: '/html/dbox_oauth_receiver.html'
    }));
    client.authenticate(function(error, client) {
        if (error) {
            // Replace with a call to your own error-handling code.
            //
            // Don't forget to return from the callback, so you don't execute the code
            // that assumes everything went well.
            return showError(error);
        }

        // Replace with a call to your own application code.
        //
        // The user authorized your app, and everything went well.
        // client is a Dropbox.Client instance that you can use to make API calls.
        // doSomethingCool(client);

        client.getAccountInfo(function(error, accountInfo) {
            if (error) {
                return showError(error);  // Something went wrong.
            }

            alert("Hello, " + accountInfo.name + "!");
        });
    });
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

var dbox_token = null;
if (localStorage["dbox_token"] != null) {
    if (localStorage["dbox_token"].length > 0) {
        dbox_token = localStorage["dbox_token"];
    }
} else {
    // in future, will need to know if already tried dbox and failed
    // for now, just seeing if can get this working
    dbox_auth_flow();

}