/**
 * Created by Lufton on 24.01.2017.
 */
jQuery(function($) {
    var audio = new Audio;
    $.ajaxSetup({ cache: false });
    $.getJSON("https://rawgit.com/lufton/ChristianRadio/master/data.json", function(data) {
        window.data = data;
    });

    window.play = function () {
        audio.src = window.data.stations[window.currentStation].streams[0].url;
        audio.play();
    };

    window.pause = function () {
        audio.pause();
        audio.src = '';
    };

    var iconFrame = 0;
    var frameCount = 6;
    setInterval(function() {
        if (audio.paused) chrome.browserAction.setIcon({path : "icons/icon0.png"});
        else chrome.browserAction.setIcon({path : "icons/icon" + iconFrame++ % frameCount + ".png"});
    }, 250);

    var updateIcon = function() {

    };
});