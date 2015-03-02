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
    client.writeFile("SCPS/share.txt", shares[0], function(error, stat) {
        if (error) {
            return console.log(error);
        }
    });

    // put one share on box
    //shares[1]


    // create empty pwdb, encrypt it, upload it
    //var sql = window.SQL;

}



client.readFile("SCPS/pwdb", function(error, data) {
    if (error) {
        return console.log(error);
    }

    if (data == null) {
        return didntExist();
    }
});

