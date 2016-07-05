'use strict';

// Require node_modules dependencies
let path = require('path');
let cheerio = require('cheerio');

// Require other classes, files or configs
let MainCrawler = require(path.join(__dirname, '../modules', 'main.crawler.class'));

module.exports = class CinesystemCrawler extends MainCrawler {

    getSchedule(url, city) {
        return new Promise((resolve, reject) => {
            this._mineSite(url, city)
                .then(function(schedule) {
                    return resolve(schedule);
                });

        });
    }

    _mineSite(url, city) {
        let _this = this;
        let headers = _this._getHeaders(city);

        return new Promise((resolve, reject) => {
            super.getStaticPage(url, headers)
                .then(function($) {
                    let movies = [];
                    let dom = '#programacao tr';
                    let cinema = {
                        name: 'cinesystem',
                        city: String,
                        place: String,
                        sessions: []
                    };

                    let city = $('#cinema_info h1').text()
                    let place = $('#cinema_info h2').text().trim();

                    cinema.city = city;
                    cinema.place = place;

                    $(dom).each(function() {
                        let special;
                        let title = $(this).find('.filme_nome').text();
                        let normalized = _this.stringNormalize(title); // super
                        let type = $(this).find('.atributos').text();

                        $(this).find('.obs').remove()

                        if (type.length > 8) {
                            let typeArr = type.split('    ');
                            special = true;
                            type = typeArr[1].trim();
                        } else {
                            special = false;
                            type = type.trim();
                        }

                        type = type == 'LEG' ? 'legendado' : 'dublado';

                        let hours = $(this).find('.horarios').text();
                        hours = hours.replace(/ /g,'').split('-');

                        let movie = {
                            title: title,
                            normalized: normalized,
                            type: type,
                            censorship: null,
                            special: special,
                            hours: hours
                        };

                        movies.push(movie);
                    });

                    cinema.sessions = movies;
                    return resolve(cinema);

                });
        });
    }

    // @TODO: Get all codes from cookies
    _getCityCookie(city) {
        let cities = {
            'florianopolis': 8
        };

        return `sec_cidade=${cities[city]}`;
    }

    _getHeaders(city) {
        let cookie = this._getCityCookie(city);
        let headers = {
            'Cookie': cookie
        };

        return headers
    }

    getCinemasURLs() {
        let _this = this;
        return new Promise((resolve, reject) => {
            const url = 'http://cinespaco.com.br/_services/cidades.php';
            super.getStaticPage(url)
                .then(($) => {
                    let placesArr = [];
                    let cinemaObj = {
                        place: String,
                        place_label: String,
                        city: String,
                        city_label: String,
                        url: String
                    };

                    $('li').each(function() {
                        let place = _this.stringNormalize($(this).find('a').text());
                        let place_normalized = $(this).find('a').text().toLowerCase();
                        cinemaObj.place_label = place_normalized;
                        cinemaObj.place = place;
                        cinemaObj.city_label = place_normalized;
                        cinemaObj.city = place;
                        cinemaObj.url = $(this).find('a').attr('href');
                        placesArr.push(cinemaObj);
                    });

                    _this.writeUrlsFile('cinespaco', placesArr)
                        .then(function(data) {
                            return resolve(data);
                        })
                        .catch(function(err) {
                            return reject(err);
                        });
                })
                .catch(function(err) {
                    return reject(err);
                });
        });
    }

}
