/**
 * author: Katelyn Lesse
 * since: 2/9/15
 */

var t = 3; // for now ..

function dbox_auth_flow() {
    //var client = new Dropbox.Client();
    //client.authDriver(new Dropbox.AuthDriver.ChromeExtension({
    //    receiverPath: '../html/dbox_oauth_receiver.js'
    //}));
    //client.authenticate({}, function(error) {
    //
    //});
}

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