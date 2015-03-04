/**
 * author: Katelyn Lesse
 * since: 3/2/15
 */

//check if db file exists in dbox
    // in future, if not, check if exists in box or whichever other backup
// if not then generate key and create it
//if yes then go home

function didntExist() {
    var shares = secrets.share(secrets.random(256), 2, 2);
    // put one share on dbox
    dbox_client.writeFile("share.txt", shares[0], function(error, stat) {
        if (error) {
            return console.log(error);
        }
    });

    // first need to create folder in box
    var folderUrl = "https://api.box.com/2.0/folders";

    // put one share on box
    var uploadUrl = 'https://upload.box.com/api/2.0/files/content';

    // The Box OAuth 2 Header
    var headers = {
        Authorization: 'Bearer ' + localStorage.getItem("box_access_token")
    };

    $.ajax({
        url: folderUrl,
        headers: headers,
        type: 'POST',
        // This prevents JQuery from trying to append the form as a querystring
        processData: false,
        contentType: false,
        data: '{"name":"SCPS", "parent":{"id":"0"}}'
    }).complete(function (data) {
        // Log the JSON response to prove this worked
        var result = JSON.parse(data.responseText);
        localStorage.setItem("box_scps_folder_id", result.id);


        //console.log(localStorage.getItem("box_scps_folder_id"));

        var blob = new Blob([shares[1]], {type: "text/plain;charset=utf-8"});
        var form = new FormData();
        form.append('file', blob);
        form.append('attributes', '{"name": "share.txt", "parent":{"id":"' + localStorage.getItem("box_scps_folder_id") + '"}}');
        //form.append('parent_id', localStorage.getItem("box_scps_folder_id"));
        //form.append('name', 'share.txt');

        $.ajax({
            url: uploadUrl,
            headers: headers,
            type: 'POST',
            // This prevents JQuery from trying to append the form as a querystring
            processData: false,
            contentType: false,
            data: form
        }).complete(function (data) {
            // Log the JSON response to prove this worked
            //console.log(data.responseText);

            // create empty pwdb
            var sql = window.SQL;
            var pwdb = new sql.Database();
            var sqlstr = "CREATE TABLE Pws (id int, name varchar(255), url varchar(1000), password varchar(255))";
            pwdb.run(sqlstr);
            binaryArray = new Uint8Array(pwdb.export());
            var buf = String.fromCharCode.apply(null, binaryArray);

            //encrypt it, upload it
            console.log(secrets.combine([shares[0], shares[1]]));
            console.log(buf);
            var encryptedDb = CryptoJS.AES.encrypt(buf, secrets.combine([shares[0], shares[1]]));
            dbox_client.writeFile("encDB", encryptedDb, function(error, stat) {
                if (error) {
                    return console.log(error);
                }
                window.location.replace("/html/home.html");
            });
        });

    });


}

if (!dbox_client.isAuthenticated()) {
    dbox_client.authenticate(function (error) {
        if (error) {
            console.log(error);
        }
        dbox_client.readFile("SCPS/encDB", null, function (error, data) {
            if (error) {
                //console.log(error);
                return didntExist();
            }
            window.location.replace("/html/home.html");

        });
    });
}



