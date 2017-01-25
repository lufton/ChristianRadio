/**
 * Created by Lufton on 25.01.2017.
 */
jQuery(function($) {
    var backPage = chrome.extension.getBackgroundPage();
    $('#stations').isotope({
        itemSelector: 'li',
        layoutMode: 'fitRows'
    });
    $('#genres').on('change', 'input', function() {
        backPage.currentGenre = this.value;
        $('#stations').isotope({filter: this.value});
    });
    $('#languages').on('change', 'input', function() {
        backPage.currentLanguage = this.value;
        $('#stations').isotope({filter: this.value});
    });
    $('#stations').on('click', '.station', function() {
        backPage.currentStation = this.id;
        if ($(this).hasClass('active')) backPage.pause(); else backPage.play();
        $('.station:not(#' + this.id + ')').removeClass('active');
        $(this).toggleClass('active');
    });
    var populateGenres = function() {
        var currentGenre = $('#genres input:checked').val() || backPage.currentGenre;
        $('#genres label:nth-child(n+2)').remove();

        if (backPage && backPage.data && backPage.data.genres) {
            $.each(backPage.data.genres, function (genre, title) {
                $('#genres').append('<label class="btn btn-default"><input type="radio" name="genre" value=".genre-' + genre + '">' + title +'</label>');
            });
        }
        $('#genres input[value="*"]').click();
        $('#genres input[value="' + currentGenre + '"]').click();
    };
    var populateStations = function() {
        //$('#stations li').remove();
        if (backPage && backPage.data && backPage.data.stations) {
            $.each(backPage.data.stations, function(id, station) {
                $station = $('<li id="' + id + '" class="station ' +
                    (id==backPage.currentStation?'active ':'') +
                    $.map(station.genres, function(genre) { return 'genre-' + genre; }).join(' ') + ' ' +
                    $.map(station.languages, function(language) { return 'lang-' + language; }).join(' ') + '">' +
                    '<img src="icons/' + id + '.png" class="img-rounded" />' +
                    '<span>' + station.title + '</span>' +
                    '<div class="play"></div>' +
                    '</li>');
                $('#stations').append($station).isotope('appended', $station);
            });
        }
    };

    populateGenres();
    populateStations();
});