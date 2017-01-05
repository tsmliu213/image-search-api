"use strict";
var express = require('express');
var https = require('https');

var app = express();

var options = {
    host: 'api.cognitive.microsoft.com',
    path: encodeURI('/bing/v5.0/images/search?q=cinelli mash&count=10&offset=0&mkt=en-us&safeSearch=Moderate'),
    headers: {
        'Ocp-Apim-Subscription-Key': process.env.ACC_KEY,
    }
};
https.get(options, function(res) {
    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => rawData += chunk);
    res.on('end', () => {
        try {
          let parsedData = JSON.parse(rawData);
          //console.log(parsedData);
          print(parsedData);
        } catch (e) {
          console.log(e.message);
        }
    });
})
.on('error', (e) => {
    console.log(`Got error: ${e.message}`);
});

function print(results) {
    results.value.forEach(function(item) {
        console.log(item.thumbnailUrl);
    });
}