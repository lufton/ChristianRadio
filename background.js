/**
 * Created by Lufton on 24.01.2017.
 */
jQuery(function($) {
    var audio = new Audio;
    $.getJSON("https://rawgit.com/lufton/ChristianRadio/master/data.json", function(data) {
        window.data = data;
    });
});