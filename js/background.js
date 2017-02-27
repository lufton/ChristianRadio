/**
 * Created by Lufton on 24.01.2017.
 */
jQuery(function($) {
    var audio = new Audio;
    window.paused = function () {
        return audio.paused;
    };
    $.ajaxSetup({ cache: false });
    $.getJSON("https://rawgit.com/lufton/ChristianRadio/master/data.json", function(data) {
        window.data = data;
    });

    window.play = function (stream) {
        audio.src = stream || window.data.stations[window.currentStation].streams[0].url;
        audio.play();
    };

    window.pause = function () {
        audio.pause();
        audio.src = '';
    };

    window.setVolume = function(volume) {
        audio.volume = volume / 100;
        window.volume = volume;
    };

    var iconFrame = 0;
    var frameCount = 6;
    setInterval(function() {
        if (window.paused()) chrome.browserAction.setIcon({path : "icons/icon0.png"});
        else chrome.browserAction.setIcon({path : "icons/icon" + iconFrame++ % frameCount + ".png"});
    }, 250);
});