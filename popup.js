/**
 * Created by Lufton on 25.01.2017.
 */
jQuery(function($) {
    var backPage = chrome.extension.getBackgroundPage();
    var $genres = $('#genres');
    var $languages = $('#languages');
    var $stations = $('#stations');
    var updateFilters = function () {
        var genres = $('#genres').val(); if (genres.length == 0) genres = [''];
        var languages = $('#languages').val(); if (languages.length == 0) languages = [''];
        var filters = [];
        $.each(genres, function(i, genre) {
            $.each(languages, function(j, language) {
                filters.push(genre + language);
            });
        });
        $stations.isotope({ filter: filters.join(',') });
    };
    $genres.multiselect({
        dropUp: true,
        nonSelectedText: 'Все жанры',
        allSelectedText: 'Все жанры',
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        maxHeight: 300,
        buttonWidth: '100%',
        onChange: function() {
            updateFilters();
        }
    });
    $languages.multiselect({
        dropUp: true,
        nonSelectedText: 'Все языки',
        allSelectedText: 'Все языки',
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        maxHeight: 300,
        buttonWidth: '100%',
        onChange: function() {
            updateFilters();
        }
    });
    $stations.isotope({
        itemSelector: 'li',
        layoutMode: 'fitRows'
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
        $(this).parent().parent().toggleClass('expanded');
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
        $genres.multiselect('deselectAll');
        $languages.multiselect('deselectAll');
        $genres.multiselect('select', filter);
        //setTimeout(function() { $stations.isotope({filter: filter}); }, 300);
    });
    var issueBody = function(station, issue) {
        return '' +
            '- **Station**: ' + station.title + '\n' +
            '- **Issue**: ' + issue + '\n' +
            '- **Data version**: ' + backPage.data.version + '\n' +
            '- **Extension version**: ' + chrome.app.getDetails().version + '\n' +
            '- **Chrome version**: ' + navigator.appVersion.match(/Chrom(e|ium)\/([\d\.]*)/)[2] + '\n' +
            '- **Description**: \n';
    };
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
        var currentLanguage = $languages.val() || backPage.currentLanguages;
        $languages.find('option').remove();

        if (backPage && backPage.data && backPage.data.languages) {
            $.each(backPage.data.languages, function (language, title) {
                $languages.append('<option value=".lang-' + language + '">' + title +'</option>');
            });
            $languages.multiselect('rebuild');
        }
    };
    var populateStations = function() {
        $stations.find('li.station').remove();
        if (backPage && backPage.data && backPage.data.stations) {
            var stations = '';
            $.each(backPage.data.stations, function(id, station) {
                stations += '<li id="' + id + '" class="station ' +
                    (id==backPage.currentStation && !backPage.paused()?'active ':'') +
                    $.map(station.genres, function(genre) { return 'genre-' + genre; }).join(' ') + ' ' +
                    $.map(station.languages, function(language) { return 'lang-' + language; }).join(' ') + '">' +
                    '<aside><img src="icons/' + id + '.png" class="img-rounded" />' +
                    '<div class="metadata">' +
                        '<div class="btn-group-vertical btn-group-xs btn-block">' +
                            '<a href="https://github.com/lufton/ChristianRadio/issues/new?title=' + encodeURIComponent(station.title + ' not working') + '&body=' + encodeURIComponent(issueBody(station, 'Not working')) + '&labels[]=' + encodeURIComponent(station.title) + '&labels[]=' + encodeURIComponent('Not working') + '" target="_blank" class="btn btn-danger btn-xs col-xs-12">Не работает</a>' +
                            '<a href="https://github.com/lufton/ChristianRadio/issues/new?title=' + encodeURIComponent(station.title + ' change suggestion') + '&body=' + encodeURIComponent(issueBody(station, 'Change suggestion')) + '&labels[]=' + encodeURIComponent(station.title) + '&labels[]=' + encodeURIComponent('Change suggestion') + '" target="_blank" class="btn btn-warning btn-xs col-xs-12">Предложить изменение</a>' +
                        '</div>' +
                        '<div class="form-group">' +
                            '<label>Потоки</label>' +
                            '<div class="clear"></div>' +
                            '<div class="btn-group btn-group-xs btn-group-justified">' + $.map(station.streams, function(stream, i) { return '<a class="btn btn-' + (i>0?'default':'primary') + ' stream" href="' + stream.url + '" data-station="' + id + '">' + stream.bitrate + 'kbps</a>'; }).join('') + '</div>' +
                        '</div>' +
                        '<div class="form-group genres">' +
                            '<label>Жанры</label>' +
                            '<div class="clear"></div>' +
                            '<div class="btn-group-vertical btn-group-xs btn-block genres">' + $.map(station.genres, function(genre) { return '<a class="btn btn-default"  data-filter=".genre-' + genre + '">' + genre + '</a>'; }).join('') + '</div>' +
                        '</div>' +
                        '<div class="form-group languages">' +
                            '<label>Языки</label>' +
                            '<div class="clear"></div>' +
                            $.map(station.languages, function(language) { return '<a class="btn btn-default flag flag-' + language +'"  data-filter=".lang-' + language + '" title="' + backPage.data.languages[language] + '"></a>'; }).join('') +
                        '</div>' +
                        '<div class="form-group">' +
                            '<label>Сайт</label>' +
                            '<p class="site"><a href="' + (station.site || '') + '" target="_blank">' + (station.site || '') + '</a></p>' +
                        '</div>' +
                    '</div>' +
                    '</aside>' +
                    '<h1>' + station.title + '</h1>' +
                    '<a class="play playpause stream" href="' + station.streams[0].url + '" data-station="' + id + '"></a>' +
                    '<div class="description">' + station.description || '' + '</div>' +
                    '</li>';
            });
            var $station = $(stations);
            $stations.append($station).isotope('appended', $station);
        }
    };

    populateGenres();
    populateLanguages();
    populateStations();
});