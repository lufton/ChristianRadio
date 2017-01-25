/**
 * Created by Lufton on 25.01.2017.
 */
jQuery(function($) {
    var backPage = chrome.extension.getBackgroundPage();
    $('#stations').isotope({
        
    });
    $('#genres').on('change', 'input', function() {
        backPage.currentGenre = this.value;
    });
    var populateGenres = function() {
        var currentGenre = $('#genres input:checked').val() || backPage.currentGenre;
        $('#genres label:nth-child(n+2)').remove();

        if (backPage && backPage.data && backPage.data.genres) {
            $.each(backPage.data.genres, function (genre, title) {
                $('#genres').append('<label class="btn btn-default"><input type="radio" name="genre" value="' + genre + '">' + title +'</label>');
            });
        }
        $('#genres input[value="*"]').click();
        $('#genres input[value="' + currentGenre + '"]').click();
    };
    var populateStations = function() {
        $('#stations li').remove();
        if (backPage && backPage.data && backPage.data.stations) {
            $.each(backPage.data.stations, function() {
                
            })
        }
    };

    populateGenres();
    populateStations();
});