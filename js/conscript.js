// Watches for the Live Login Popup to store token and closes the window.
$(window).load(function() {


    if (window.location.origin == "https://login.live.com") {
        var hash = window.location.hash;
        // get access token
        var start = hash.indexOf("#access_token=");
        if ( start >= 0 ) {
            start = start + "#access_token=".length;

            var end = hash.indexOf("&token_type");

            var access_token = hash.substring(start, end);

            // Store it
            chrome.storage.local.set("odrive_access_token", access_token);
            chrome.storage.local.set("got_here_from", "odrive");
            chrome.storage.local.set("successful", parseInt(chrome.storage.local.get("successful")) + 1);

            alert(chrome.storage.local.get("got_here_from"));

            // Close the window
            window.close();
        }


    }
});