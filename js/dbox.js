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

        Chrome.prototype.auth = function () {
            //return (function() {
            if (!this.client.isAuthenticated()) {
                this.client.authenticate(function (error) {
                    if (error) {
                        //return (function() {
                        //return showError(error);
                        //console.log(error)
                        //localStorage.setItem("got_here_from", "dbox");
                        //}());
                    } else {
                        //return (function() {
                        //localStorage.setItem("got_here_from", "dbox");
                        //localStorage.setItem("successful", parseInt(localStorage.getItem("successful")) + 1);

                        //}());




                        // EVENTUALLY FIND A WAY TO MAKE THIS STUFF WORK


                    }
                });

                //});
            }
        };

        return Chrome;
    });

}).call(this);