/**
 * author: Katelyn Lesse
 * since: 2/25/15
 */

(function() {
    Dropbox.Chrome = (function() {
        function Chrome(clientOptions) {
            this.clientOptions = clientOptions;
            this.client = new Dropbox.Client(this.clientOptions);
            this.client.authDriver(new Dropbox.AuthDriver.ChromeExtension({
                receiverPath: '/html/dbox_oauth_receiver.html'
            }));
        }

        Chrome.prototype.auth = function() {
            if (this.client.isAuthenticated()) {
                localStorage["got_here_from"] = "dbox";
                return true;
            } else {
                this.client.authenticate(function(error, client) {
                    if (error) {
                        //return showError(error);
                        return false;
                    }
                });

                localStorage["got_here_from"] = "dbox";
                localStorage["successful"]++;
            }
        };

        return Chrome;

    })();

}).call(this);