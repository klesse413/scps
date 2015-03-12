/**
 * author: Katelyn Lesse
 * since: 3/1/15
 */

function go_home() {
    chrome.tabs.create({
        url: "/html/home.html"
    });
}

function init() {
    var my_pws_button = document.getElementById("my_pws");

    if(my_pws_button.addEventListener){
        my_pws_button.addEventListener("click", go_home, false);
    } else if(my_pws_button.attachEvent){
        my_pws_button.attachEvent("onclick", go_home);
    }
}

if(window.addEventListener) {
    window.addEventListener("load", init, false);
} else if(window.attachEvent) {
    window.attachEvent("onload", init);
} else {
    document.addEventListener("load", init, false);
}
