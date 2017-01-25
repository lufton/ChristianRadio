/**
 * Created by Lufton on 24.01.2017.
 */
jQuery(function($) {
    var audio = new Audio;
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
    }
});