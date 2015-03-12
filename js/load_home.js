/**
 * author: Katelyn Lesse
 * since: 3/2/15
 */

function start_signout_process() {
    chrome.browserAction.setPopup({
        popup: "/html/not_logged_in_popup.html"
    });
    localStorage.setItem("logged_in", 0);
    localStorage.setItem("successful", 0);
    localStorage.setItem("got_here_from", "login");
    localStorage.setItem("box_access_token", null);
    localStorage.setItem("box_refresh_token", null);
    dbox_client.signOut(null, function() {
        chrome.tabs.getCurrent(function(tab) {
            chrome.tabs.remove(tab.id);
        });
    });
}

function addPw(pwdb, s) {
    var formSelector = $('.form-add-entry');
    formSelector.css("display", "block");
    $('#pws-container').fadeOut(1);
    formSelector.submit(function() {
        event.preventDefault();
        var addEntryStr = "INSERT OR REPLACE INTO Pws VALUES (NULL, \"";
        addEntryStr += $('.form-add-entry input[name=name]').val() + "\", \"";
        addEntryStr += $('.form-add-entry input[name=url]').val() + "\", \"";
        addEntryStr += $('.form-add-entry input[name=user]').val() + "\", \"";
        addEntryStr += $('.form-add-entry input[name=pw]').val() + "\");";
        $.when(res = pwdb.exec(addEntryStr)).done(function() {
            var buf = String.fromCharCode.apply(null, pwdb.export());
            var encryptedDb = CryptoJS.AES.encrypt(buf, secrets.combine([s[0], s[1]]));
            dbox_client.writeFile("encDB", encryptedDb, function(error, stat) {
                if (error) {
                    return console.log(error);
                }

                formSelector.css("display", "none");
                $('#pws-container').fadeIn(1000);
                formSelector.each(function(){
                    this.reset();
                });
                pwdb.close();
                location.reload();
            });
        });

    });

}

function editPw(pwdb, s, data, index) {
    var formSelector = $('.form-add-entry');
    formSelector.css("display", "block");
    $('#pws-container').fadeOut(1);
    $('.form-add-entry input[name=name]').val(data[index]["name"]);
    $('.form-add-entry input[name=url]').val(data[index]["url"]);
    $('.form-add-entry input[name=user]').val(data[index]["username"]);
    $('.form-add-entry input[name=pw]').val(data[index]["pw"]);
    formSelector.submit(function() {
        event.preventDefault();
        var addEntryStr = "INSERT OR REPLACE INTO Pws VALUES (";
        addEntryStr += data[index]["id"] + ", \"";
        addEntryStr += $('.form-add-entry input[name=name]').val() + "\", \"";
        addEntryStr += $('.form-add-entry input[name=url]').val() + "\", \"";
        addEntryStr += $('.form-add-entry input[name=user]').val() + "\", \"";
        addEntryStr += $('.form-add-entry input[name=pw]').val() + "\");";
        $.when(res = pwdb.exec(addEntryStr)).done(function() {
            var buf = String.fromCharCode.apply(null, pwdb.export());
            var encryptedDb = CryptoJS.AES.encrypt(buf, secrets.combine([s[0], s[1]]));
            dbox_client.writeFile("encDB", encryptedDb, function(error, stat) {
                if (error) {
                    return console.log(error);
                }

                formSelector.css("display", "none");
                $('#pws-container').fadeIn(1000);

                formSelector.each(function(){
                    this.reset();
                });
                pwdb.close();
                location.reload();
            });
        });


    });
}

function deleteEntry(pwdb, s, data, index) {
    var deleteString = "DELETE FROM Pws WHERE id=" + data[index]["id"] + ";";
    pwdb.exec(deleteString);
    var buf = String.fromCharCode.apply(null, pwdb.export());
    var encryptedDb = CryptoJS.AES.encrypt(buf, secrets.combine([s[0], s[1]]));
    dbox_client.writeFile("encDB", encryptedDb, function(error, stat) {
        if (error) {
            return console.log(error);
        }
        pwdb.close();
        location.reload();
    });
}

function copyToClipboard(text){
    var copyDiv = document.createElement('div');
    copyDiv.contentEditable = true;
    document.body.appendChild(copyDiv);
    copyDiv.innerHTML = text;
    copyDiv.unselectable = "off";
    copyDiv.focus();
    document.execCommand('SelectAll');
    document.execCommand("Copy", false, null);
    document.body.removeChild(copyDiv);
}

function homeFree(s) {
    document.getElementById("Pws").style.display = "none";
    document.getElementById("noPws").style.display = "none";

    dbox_client.readFile("encDB", null, function (error, dat) {
        if (error) {
            return didntExist();
        }

        var decDb = CryptoJS.AES.decrypt(dat, secrets.combine([s[0], s[1]]));

        decDb = decDb.toString(CryptoJS.enc.Utf8);
        var buf = new ArrayBuffer(decDb.length*2); // 2 bytes for each char
        var bufView = new Uint16Array(buf);
        for (var j=0, strLen=decDb.length; j<strLen; j++) {
            bufView[j] = decDb.charCodeAt(j);
        }
        var sql = window.SQL;
        var pwdb = new sql.Database(bufView);

        var numEntries = pwdb.exec("SELECT * FROM Pws").length;
        if (numEntries == 0) {

            document.getElementById("noPws").style.display = "block";

            $('#getStarted').click(function() {
                addPw(pwdb, s);
            });

        } else {
            document.getElementById("Pws").style.display = "block";

            var selectStmt = pwdb.prepare("SELECT * FROM Pws");
            var data = [];
            while (selectStmt.step()) {
                var row = selectStmt.getAsObject();
                data.push({
                    "name": row["name"],
                    "url":row["url"],
                    "username":row["username"],
                    "pw":row["password"],
                    "id":row["id"]
                });
            }

            for (var i = 0; i < data.length; i++) {
                (function() {
                    const index = i;
                    var rowString = "<tr><td>"
                    rowString += data[i]["name"] + "</td><td>";
                    rowString += data[i]["url"] + "</td><td>";
                    rowString += data[i]["username"] + "</td><td>";
                    rowString += "<button type='button' class='btn btn-default' id='copyButton" + i + "'>Copy Password</button></td><td>";
                    rowString += "<button type='button' class='btn btn-default glyphicon glyphicon-pencil' id='editButton" + i + "'> </button></td><td>";
                    rowString += "<button type='button' class='btn btn-default glyphicon glyphicon-trash' id='delButton" + i + "'> </button></td>";
                    var rowToAdd = $(rowString);
                    $('#table').append(rowToAdd);

                    var copyButtonStringId = "#copyButton" + i;
                    var editButtonStringId = "#editButton" + i;
                    var delButtonStringId = "#delButton" + i;

                    $(copyButtonStringId).click(function() {
                        copyToClipboard(data[index]["pw"]);
                    });

                    $(editButtonStringId).click(function() {
                        editPw(pwdb, s, data, index);
                    });

                    $(delButtonStringId).click(function() {
                        deleteEntry(pwdb, s, data, index);
                    });

                })();
            }

            $('#addPassword').click(function() {
                addPw(pwdb, s);
            });
        }

    });

}

function goHome(encryptedDb) {
    $('#signout').click(function() {
        start_signout_process();
    });
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
            return homeFree(s);
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
        if (localStorage.getItem("box_scps_folder_id") != null) {
            localStorage.setItem("box_scps_folder_id", null);
        }
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
            if (localStorage.getItem("box_scps_share_file_id") != null) {
                localStorage.setItem("box_Scps_share_file_id", null);
            }
            localStorage.setItem("box_scps_share_file_id", result.entries[result.total_count - 1].id);
            // create empty pwdb
            var sql = window.SQL;
            var pwdb = new sql.Database();
            var sqlstr = "CREATE TABLE Pws(id INTEGER PRIMARY KEY, name varchar(255), url varchar(1000), username varchar(255), password varchar(255))";
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
