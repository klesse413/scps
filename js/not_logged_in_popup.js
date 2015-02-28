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

//function start_signup_process() {
//    alert("signup process");
//}

function init() {
    var login_button = document.getElementById("login");
    //var signup_button = document.getElementById("signup");

    if(login_button.addEventListener){
        login_button.addEventListener("click", start_login_process, false);
    } else if(login_button.attachEvent){
        login_button.attachEvent("onclick", start_login_process);
    }

    //if(signup_button.addEventListener){
    //    signup_button.addEventListener("click", start_signup_process, false);
    //} else if(signup_button.attachEvent){
    //    signup_button.attachEvent("onclick", start_signup_process);
    //}
}

if(window.addEventListener) {
    window.addEventListener("load", init, false);
} else if(window.attachEvent) {
    window.attachEvent("onload", init);
} else {
    document.addEventListener("load", init, false);
}
