/**
 * Created by Lufton on 24.01.2017.
 */
jQuery(function($) {
    $.getJSON("https://rawgit.com/lufton/ChristianRadio/master/data.json", function(data) {
        var audio = new Audio(data.stations[0].streams[0].url);
        audio.play();
    });
});