/**
 * author: Katelyn Lesse
 * since: 5/25/15
 */


checkSuccessful();

if (localStorage.getItem("got_here_from") === "login") {
    dbox_auth_flow();
    checkSuccessful();
} else if (localStorage.getItem("got_here_from") === "dbox") {
    box_auth_flow();
    checkSuccessful();
} else if (localStorage.getItem("got_here_from") === "box") {
    //handleGdriveAuth();
    window.setTimeout(checkAuth, 10);
    checkSuccessful();
} else if (localStorage.getItem("got_here_from") == "gdrive") {
    checkSuccessful();
}