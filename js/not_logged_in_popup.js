/**
 * author: Katelyn Lesse
 * since: 1/30/15
 */

function start_login_process() {
    localStorage.setItem("successful", 0);
    localStorage.setItem("got_here_from", "login");
    chrome.tabs.create({
        url: "/html/redirect.html"
    });
}

function init() {
    var login_button = document.getElementById("login");

    if(login_button.addEventListener){
        login_button.addEventListener("click", start_login_process, false);
    } else if(login_button.attachEvent){
        login_button.attachEvent("onclick", start_login_process);
    }
}

if(window.addEventListener) {
    window.addEventListener("load", init, false);
} else if(window.attachEvent) {
    window.attachEvent("onload", init);
} else {
    document.addEventListener("load", init, false);
}
