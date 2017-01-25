/**
 * Created by Lufton on 25.01.2017.
 */
jQuery(function($) {
    var backPage = chrome.extension.getBackgroundPage();
    $('#stations').isotope({
        
    });
    var populateGenres = function() {
        var currentGenre = $('#genres input:checked').val();
        $('#genres label:nth-child(n+2)').remove();

        if (backPage.data && backPage.data.stations) {
            $.each(backPage.data.stations, function (i, station) {
                
            });
        }
        $('#genres input[value="*"]').click();
        $('#genres input[value="' + currentGenre + '"]').click();
    };
});