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
        $(this).toggleClass('expanded');
        $(this).parent().toggleClass('expanded');
    });
    $('#stations').on('click', 'a.stream', function() {
        backPage.currentStation = $(this).data('station');
        if ($(this).hasClass('playpause') && !backPage.paused()) backPage.pause(); else backPage.play($(this).attr('src'));
        $('.station:not(#' + backPage.currentStation + ')').removeClass('active');
        if ($(this).hasClass('playpause')) $(this).closest('.station').toggleClass('active'); else $(this).closest('.station').addClass('active');
        return false;
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
    var populateLanguages = function() {
        var currentLanguage = $('#languages input:checked').val() || backPage.currentLanguage;
        $('#languages label:nth-child(n+2)').remove();

        if (backPage && backPage.data && backPage.data.languages) {
            $.each(backPage.data.languages, function (language, title) {
                $('#languages').append('<label class="btn btn-default"><input type="radio" name="language" value=".lang-' + language + '">' + title +'</label>');
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
                    (id==backPage.currentStation && !backPage.paused()?'active ':'') +
                    $.map(station.genres, function(genre) { return 'genre-' + genre; }).join(' ') + ' ' +
                    $.map(station.languages, function(language) { return 'lang-' + language; }).join(' ') + '">' +
                    '<aside><img src="icons/' + id + '.png" class="img-rounded" />' +
                    '<div class="metadata">' +
                        '<div class="form-group">' +
                            '<label>Потоки (kbps)</label>' +
                            '<div class="clear"></div>' +
                            '<div class="btn-group btn-group-xs" data-toggle="buttons">' + $.map(station.streams, function(stream, i) { return '<a class="btn btn-' + (i>0?'default':'primary') + ' stream" src="' + stream.url + '" data-station="' + id + '">' + stream.bitrate + '</a>'; }).join('') + '</div>' +
                        '</div>' +
                        '<div class="form-group">' +
                            '<label>Жанры</label>' +
                            '<div class="clear"></div>' +
                            '<div class="btn-group btn-group-xs" data-toggle="buttons">' + $.map(station.genres, function(genre) { return '<button class="btn btn-default"  data-filter=".genre-' + genre + '">' + genre + '</button>'; }).join('') + '</div>' +
                        '</div>' +
                        '<div class="form-group">' +
                            '<label>Языки</label>' +
                            '<div class="clear"></div>' +
                            '<div class="btn-group btn-group-xs" data-toggle="buttons">' + $.map(station.languages, function(language) { return '<button class="btn btn-default"  data-filter=".lang-' + language + '">' + backPage.data.languages[language] + '</button>'; }).join('') + '</div>' +
                        '</div>' +
                    '</div>' +
                    '</aside>' +
                    '<h1>' + station.title + '</h1>' +
                    '<a class="play playpause stream" data-station="' + id + '"></a>' +
                    '<div class="description">' + station.description + '</div>' +
                    '</li>');
                $('#stations').append($station).isotope('appended', $station);
            });
        }
    };

    populateGenres();
    populateLanguages();
    populateStations();
});