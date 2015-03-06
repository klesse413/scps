/**
 * author: Katelyn Lesse
 * since: 3/2/15
 */

function goHome(encryptedDb) {
    var s = [];
    dbox_client.readFile("share.txt", null, function (error, data) {
        if (error) {
            return didntExist();
        }
        s[0] = data;
        var headers = {
            Authorization: 'Bearer ' + localStorage.getItem("box_access_token")
        };
        var downloadURL = "https://api.box.com/2.0/files/" + localStorage.getItem("box_scps_share_file_id") + "/content";
        $.ajax({
            url: downloadURL,
            headers: headers,
            type: 'GET',
            processData: false,
            contentType: false
        }).complete(function(data) {
            s[1] = data.responseText;
            var decDb = CryptoJS.AES.decrypt(encryptedDb, secrets.combine([s[0], s[1]]));
            var result = [];
            for (var i = 0; i < decDb.length; i++) {
                result.push(decDb.charCodeAt(i));
            }
            var sql = window.SQL;
            //var Uints = new Uint8Array(decDb);
            //console.log(Uints);
            //var pwdb = new sql.Database(Uints);
            var pwdb = new sql.Database(result);
            console.log(pwdb);
            if (pwdb.exec("SELECT * FROM Pws WHERE id=0") == null) {

            }
        });
    });
}

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
        var result = JSON.parse(data.responseText);
        localStorage.setItem("box_scps_folder_id", result.id);

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
            var result = JSON.parse(data.responseText);
            console.log(data.responseText);
            localStorage.setItem("box_scps_share_file_id", result.entries[result.total_count - 1].id);
            // create empty pwdb
            var sql = window.SQL;
            var pwdb = new sql.Database();
            var sqlstr = "CREATE TABLE Pws (id int, name varchar(255), url varchar(1000), password varchar(255))";
            pwdb.run(sqlstr);
            //binaryArray = new Uint8Array(pwdb.export());
            //var buf = String.fromCharCode.apply(null, binaryArray);
            var buf = String.fromCharCode.apply(null, pwdb.export());

            //encrypt it, upload it
            var encryptedDb = CryptoJS.AES.encrypt(buf, secrets.combine([shares[0], shares[1]]));
            dbox_client.writeFile("encDB", encryptedDb, function(error, stat) {
                if (error) {
                    return console.log(error);
                }
                //window.location.replace("/html/home.html");
                return goHome(encryptedDb);
            });
        });

    });

}

if (!dbox_client.isAuthenticated()) {
    dbox_client.authenticate(function (error) {
        if (error) {
            console.log(error);
        }
        dbox_client.readFile("encDB", null, function (error, data) {
            if (error) {
                return didntExist();
            }
            return goHome(data);
        });
    });
}



