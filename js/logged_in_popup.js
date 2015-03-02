/**
 * author: Katelyn Lesse
 * since: 3/1/15
 */

function go_home() {
    chrome.tabs.create({
        url: "/html/home.html"
    });
}

function start_signout_process() {
    chrome.browserAction.setPopup({
        popup: "/html/not_logged_in_popup.html"
    });
    localStorage.setItem("logged_in", 0);
    localStorage.setItem("successful", 0);
    localStorage.setItem("got_here_from", "login");
    window.close();
}

function init() {
    var my_pws_button = document.getElementById("my_pws");
    var signout_button = document.getElementById("signout");

    if(my_pws_button.addEventListener){
        my_pws_button.addEventListener("click", go_home, false);
    } else if(my_pws_button.attachEvent){
        my_pws_button.attachEvent("onclick", go_home);
    }

    if(signout_button.addEventListener){
        signout_button.addEventListener("click", start_signout_process, false);
    } else if(signout_button.attachEvent){
        signout_button.attachEvent("onclick", start_signout_process);
    }
}

if(window.addEventListener) {
    window.addEventListener("load", init, false);
} else if(window.attachEvent) {
    window.attachEvent("onload", init);
} else {
    document.addEventListener("load", init, false);
}
