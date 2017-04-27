/**
* author: Katelyn Lesse
* since: 2/25/15
*/

dbox_client = new Dropbox.Client({
    key: DROPBOX_KEY
});
dbox_client.authDriver(new Dropbox.AuthDriver.ChromeExtension({
    receiverPath: "/html/dbox_oauth_receiver.html"
}));
