[![Build Status](https://travis-ci.org/fernandoguedes/gollum.svg?branch=master)](https://travis-ci.org/fernandoguedes/gollum)

# gollum
Gollum is specialized crawler in cinemas sites. Cinema schedules is my precious.

## Installing

`npm install gollum-nocinema`

Or just clone this project.

## Using

```javascript
let gollum = require('gollum-nocinema');
let url = 'http://cinemark.com.br/programacao/florianopolis/floripa-shopping/24/703'; // valid cinemark url

gollum
    .CinemarkCrawler
        .getSchedule(url)
            .then(function(schedule) {
                console.log('Schedule of Cinemark in JSON: ', schedule);
            })
            .catch(function(err) {
                console.log(err);
            });
```
### Using a specific cinema

```javascript
let CinemarkCrawler = require('gollum-nocinema').CinemarkCrawler;
let url = 'http://cinemark.com.br/programacao/florianopolis/floripa-shopping/24/703'; // valid cinemark url

CinemarkCrawler
    .getSchedule(url)
        .then(function(schedule) {
            console.log('Schedule of Cinemark in JSON: ', schedule);
        })
        .catch(function(err) {
            console.log(err);
        });
```
