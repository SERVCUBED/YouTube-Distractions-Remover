// ==UserScript==
// @name          YouTube Distractions Remover
// @author        Ben Blain (SERVCUBED)
// @namespace     https://servc.eu/yt-dist
// @homepage      https://servc.eu/yt-dist
// @supportURL    https://servc.eu/yt-dist
// @description   Remove annoying YouTube distractions such as comments, search box, guide which may cause procrastination.
// @include       *.youtube.com/*
// @run-at        document-end
// @updateURL     https://servc.eu/js-ext/yt-dist-rem.user.js
// @downloadURL   https://servc.eu/js-ext/yt-dist-rem.user.js
// @grant         none
// @version       0.9.5
// ==/UserScript==

/*
 * YouTube Distractions Remover by SERV CUBED 2014/2015
 *
 * Thank you to all the contributors to this script.
 *
 * Original author: Ben Blain
 *
 * Feel free to help improve this script by contributing via GitHub.
 *
 * https://servc.eu/yt-dist
 *
 * TODO:
 *      * Firefox extension
 *      * Chrome extension
 *      * (Possibly) IE addon
 *      * Cleanup code (and make more human readable)
 *      * Update bookmarklet with cleaner code
 *      * Option to permanently hide guide
 *      * Add your own request...
 *
 */

var btnShown = false;
var active = false;
// Links to restore when disabled
var restoreUserPhotoHref = null;
var restoreUserTextHref = null;
var userPhoto = null;
var userText = null;

// Check if video page and button is shown.
function ytDistCheckBtnStatus() {
    if (document.location.href.indexOf("watch") >= 0) {
        if (!btnShown) {
            btnShown = true;
            btn = document.createElement("a");
            btn.className = "yt-uix-button yt-uix-button-default yt-uix-button-size-default";
            btn.onclick = function () {
                ytDistToggle();
            };
            btn.id = "yt-dist-rem-btn";
            btn.innerHTML = "<span id=\"yt-dist-rem-btn-text\" class=\"yt-uix-button-content\">Remove Distractions</span>";
            btn.style.marginRight = "10px";

            // Determine where to put button if the user is signed in or not
            var user = document.getElementById("yt-masthead-user");
            if (user == null) user = document.getElementById("yt-masthead-signin");
            user.insertBefore(btn, document.getElementById("upload-btn"));

            // Save references to elements for later use
            userPhoto = document.getElementsByClassName("yt-user-photo")[0];
            userText = document.getElementsByClassName("yt-user-info")[0].children[0];
        }
    }
    else {
        if (btnShown) {
            // Not on a watch page. Remove button
            btnShown = false;
            btn = document.getElementById("yt-dist-rem-btn");
            btn.parentNode.removeChild(btn);
        }
        // Not on a watch page. Remove distractions
        if (active) ytDistRevert();
    }
}

function ytDistToggle() {
    if (active) ytDistRevert();
    else ytDistRemove();
}

// Button clicked
function ytDistRemove() {
    active = true;
    // Hide YouTube elements
    css = document.createElement("style");
    css.id = "yt-dist-rem-style";
    css.type = "text/css";
    css.innerHTML = ".comments-iframe-container, #watch-discussion, .watch-sidebar, #appbar-guide-button-container, " +
        "#guide-container, .appbar-menu, #masthead-search, .branded-page-related-channels, #watch8-secondary-actions, " +
        "#sb-button-notify, .yt-uix-redirect-link, .watch-extras-section, #upload-btn, #yt-masthead-account-picker " +
        ", #footer-container, .signin-container { display:none !important;} .watch-time-text:after {content:\" | Links hidden...\"}";
    document.body.appendChild(css);

    // Replace search with text
    head = document.createElement("div");
    head.id = "yt-dist-rem-head";
    head.style.marginTop = "10px";
    head.innerHTML = "<h2>YouTube distractions remover by <a href=\"https://servc.eu\" target=\"_blank\">SERV CUBED</a>. <a href=\"https://servc.eu/yt-dist\" target=\"_blank\">About.</a></h2>";
    document.getElementById('yt-masthead-content').appendChild(head);

    // Prevent autoplay with sidebar hidden
    //auto = document.getElementById('autoplay-checkbox');
    //if (auto.checked == true) auto.checked = false;

    // Change hrefs
    document.getElementById("logo-container").href = "#";
    restoreUserPhotoHref = userPhoto.href;
    userPhoto.href = "#";
    restoreUserTextHref = userText.href;
    userText.href = "#";

    // Set button text
    document.getElementById("yt-dist-rem-btn-text").innerHTML = "Undo";
}

// User clicked undo button or navigated to non-video page
function ytDistRevert() {
    active = false;
    // Remove style element
    style = document.getElementById("yt-dist-rem-style");
    style.parentNode.removeChild(style);

    // Remove header
    head = document.getElementById("yt-dist-rem-head");
    head.parentNode.removeChild(head);

    // Restore hrefs
    document.getElementById("logo-container").href = "/";
    userPhoto.href = restoreUserPhotoHref;
    userText.href = restoreUserTextHref;

    // Change button text
    document.getElementById("yt-dist-rem-btn-text").innerHTML = "Remove Distractions";
}

// AJAX load done
// See https://youtube.github.io/spfjs/api/ for more details on YouTube's SPF API
document.addEventListener("spfdone", function () {
    ytDistCheckBtnStatus();
});

// Check if already on watch page
ytDistCheckBtnStatus();
/*EOF*/
