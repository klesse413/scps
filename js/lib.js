/**
 * author: Katelyn Lesse
 * since: 2/11/15
 */

function dbox_client() {
    var client = new Dropbox.Client({key: "280u6tt5hujnm72"});
    client.authDriver(new Dropbox.AuthDriver.ChromeExtension({
        receiverPath: '/html/dbox_oauth_receiver.html'
    }));
    return client;
}

var DBOX_CLIENT = dbox_client();