/**
 * author: Katelyn Lesse
 * since: 3/2/15
 */

//check if db file exists in dbox
    // in future, if not, check if exists in box or whichever other backup
// if not then generate key and create it
//if yes then go home

function didntExist() {
    var shares = secrets.share(secrets.random(256), t, 2);
    // put one share on dbox
    chrome.runtime.getBackgroundPage(function(eventPage) {
        eventPage.controller.dbox_chrome.client.writeFile("SCPS/share.txt", shares[0], function(error, stat) {
            if (error) {
                return console.log(error);
            }
        });
    });

    // put one share on box
    var uploadUrl = 'https://upload.box.com/api/2.0/files/content';

    // The Box OAuth 2 Header. Add your access token.
    var headers = {
        Authorization: localStorage.getItem("box_access_token")
    };

    $.ajax({
        url: uploadUrl,
        headers: headers,
        type: 'POST',
        // This prevents JQuery from trying to append the form as a querystring
        processData: false,
        contentType: false,
        data: shares[1]
    }).complete(function ( data ) {
        // Log the JSON response to prove this worked
        console.log(data.responseText);
    });


    // create empty pwdb
    var sql = window.SQL;
    var pwdb = new sql.Database();
    var sqlstr = "CREATE TABLE pws ()";
    pwdb.run(sqlstr);
    var binaryArray = pwdb.export();

    //encrypt it, upload it
    CryptoJS.AES.encrypt(binaryArray, secrets.combine(shares[0], shares[1]));
    

}



client.readFile("SCPS/pwdb", function(error, data) {
    if (error) {
        return console.log(error);
    }

    if (data == null) {
        return didntExist();
    }
});

