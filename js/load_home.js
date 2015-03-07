/**
 * author: Katelyn Lesse
 * since: 3/2/15
 */

function addPw(pwdb) {
    $('.form-add-entry').css("display", "block");
    $('#pws-container').fadeOut(100);
    $('form-add-entry').on('submit', function() {
        var addEntryStr = "INSERT"
    });
}

function homeFree(pwdb) {
    if ((pwdb.exec("SELECT * FROM Pws WHERE id=0")).length == 0) {

        document.getElementById("noPws").style.display = "block";

        var get_started_button = document.getElementById("getStarted");
        if(get_started_button.addEventListener){
            get_started_button.addEventListener("click", addPw(pwdb), false);
        } else if(get_started_button.attachEvent){
            get_started_button.attachEvent("onclick", addPw(pwdb));
        }

    } else {
        document.getElementById("Pws").style.display = "block";
    }
}

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
            decDb = decDb.toString(CryptoJS.enc.Utf8);
            var buf = new ArrayBuffer(decDb.length*2); // 2 bytes for each char
            var bufView = new Uint16Array(buf);
            for (var i=0, strLen=decDb.length; i<strLen; i++) {
                bufView[i] = decDb.charCodeAt(i);
            }
            var sql = window.SQL;
            var pwdb = new sql.Database(bufView);
            return homeFree(pwdb);
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
            localStorage.setItem("box_scps_share_file_id", result.entries[result.total_count - 1].id);
            // create empty pwdb
            var sql = window.SQL;
            var pwdb = new sql.Database();
            var sqlstr = "CREATE TABLE Pws(id int, name varchar(255), url varchar(1000), password varchar(255))";
            pwdb.run(sqlstr);
            var buf = String.fromCharCode.apply(null, pwdb.export());
            //encrypt it, upload it
            var encryptedDb = CryptoJS.AES.encrypt(buf, secrets.combine([shares[0], shares[1]]));
            dbox_client.writeFile("encDB", encryptedDb, function(error, stat) {
                if (error) {
                    return console.log(error);
                }
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
