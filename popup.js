/**
 * Created by Lufton on 25.01.2017.
 */
jQuery(function($) {
    var backPage = chrome.extension.getBackgroundPage();
    var $genres = $('#genres');
    var $languages = $('#languages');
    var $stations = $('#stations');
    $genres.multiselect({
        dropUp: false,
        nonSelectedText: 'Все жанры',
        allSelectedText: 'Все жанры',
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true
    });
    $stations.isotope({
        itemSelector: 'li',
        layoutMode: 'fitRows',
        transitionDuration: 0
    });
    $genres.on('change', 'input', function() {
        backPage.currentGenre = this.value;
        $stations.isotope({filter: this.value});
    });
    $languages.on('change', 'input', function() {
        backPage.currentLanguage = this.value;
        $stations.isotope({filter: this.value});
    });
    $stations.on('click', '.station', function() {
        $(this).toggleClass('expanded');
        $(this).parent().toggleClass('expanded');
    });
    $stations.on('click', 'a.stream', function() {
        backPage.currentStation = $(this).data('station');
        if ($(this).hasClass('playpause') && $(this).closest('.station').hasClass('active') && !backPage.paused()) backPage.pause(); else backPage.play(this.href);
        $('.station:not(#' + backPage.currentStation + ')').removeClass('active');
        if ($(this).hasClass('playpause')) $(this).closest('.station').toggleClass('active'); else $(this).closest('.station').addClass('active');
        return false;
    });
    $stations.on('click', '.genres a, .languages a', function() {
        var filter = $(this).data('filter');
        setTimeout(function() { $stations.isotope({filter: filter}); }, 500);
    });
    var populateGenres = function() {
        var currentGenres = $genres.val() || backPage.currentGenres;
        $genres.find('option').remove();

        if (backPage && backPage.data && backPage.data.genres) {
            $.each(backPage.data.genres, function (genre, title) {
                $genres.append('<option value=".genre-' + genre + '">' + title +'</option>');
            });
            $genres.multiselect('rebuild');
        }
    };
    var populateLanguages = function() {
        var currentLanguage = $languages.find('input:checked').val() || backPage.currentLanguage;
        $languages.find('label:nth-child(n+2)').remove();

        if (backPage && backPage.data && backPage.data.languages) {
            $.each(backPage.data.languages, function (language, title) {
                $languages.append('<label class="btn btn-default"><input type="radio" name="language" value=".lang-' + language + '">' + title +'</label>');
            });
        }
        $languages.find('input[value="*"]').click();
        $languages.find('input[value="' + currentLanguage + '"]').click();
    };
    var populateStations = function() {
        $stations.find('li').remove();
        if (backPage && backPage.data && backPage.data.stations) {
            $.each(backPage.data.stations, function(id, station) {
                var $station = $('<li id="' + id + '" class="station ' +
                    (id==backPage.currentStation && !backPage.paused()?'active ':'') +
                    $.map(station.genres, function(genre) { return 'genre-' + genre; }).join(' ') + ' ' +
                    $.map(station.languages, function(language) { return 'lang-' + language; }).join(' ') + '">' +
                    '<aside><img src="icons/' + id + '.png" class="img-rounded" />' +
                    '<div class="metadata">' +
                        '<div class="form-group">' +
                            '<label>Потоки</label>' +
                            '<div class="clear"></div>' +
                            '<div class="btn-group btn-group-xs btn-group-justified">' + $.map(station.streams, function(stream, i) { return '<a class="btn btn-' + (i>0?'default':'primary') + ' stream" href="' + stream.url + '" data-station="' + id + '">' + stream.bitrate + 'kbps</a>'; }).join('') + '</div>' +
                        '</div>' +
                        '<div class="form-group genres">' +
                            '<label>Жанры</label>' +
                            '<div class="clear"></div>' +
                            '<div class="btn-group-vertical btn-group-xs col-xs-12 genres">' + $.map(station.genres, function(genre) { return '<a class="btn btn-default"  data-filter=".genre-' + genre + '">' + genre + '</a>'; }).join('') + '</div>' +
                        '</div>' +
                        '<div class="form-group languages">' +
                            '<label>Языки</label>' +
                            '<div class="clear"></div>' +
                            $.map(station.languages, function(language) { return '<a class="btn btn-default flag flag-' + language +'"  data-filter=".lang-' + language + '" title="' + backPage.data.languages[language] + '"></a>'; }).join('') +
                        '</div>' +
                        '<div class="form-group">' +
                            '<label>Сайт</label>' +
                            '<div class="clear"></div>' +
                            '<a href="' + (station.site || '') + '" target="_blank">' + (station.site || '') + '</a>' +
                        '</div>' +
                    '</div>' +
                    '</aside>' +
                    '<h1>' + station.title + '</h1>' +
                    '<a class="play playpause stream" href="' + station.streams[0].url + '" data-station="' + id + '"></a>' +
                    '<div class="description">' + station.description || '' + '</div>' +
                    '</li>');
                $stations.append($station).isotope('appended', $station);
            });
        }
    };

    populateGenres();
    populateLanguages();
    populateStations();
});