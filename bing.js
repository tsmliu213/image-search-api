"use strict"
var exports = module.exports = {};
exports.imgSearch = function(query, offset, response) {
    var https = require('https');
    var num = 0;
    if((typeof offset == 'string') && offset.match(/[0-9]+/)) {
        num = offset;
    }
    var options = {
        host: 'api.cognitive.microsoft.com',
        path: encodeURI('/bing/v5.0/images/search?q=' + query + '&count=10&offset=' + num + '&mkt=en-us&safeSearch=Moderate'),
        headers: {
            'Ocp-Apim-Subscription-Key': process.env.ACC_KEY,
        }
    };
    
    https.get(options, function(res) {
        let rawData = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => rawData += chunk);
        res.on('end', () => {
            try {
              let parsedData = JSON.parse(rawData);
              response.end(filter(parsedData));
            } catch (e) {
              console.log(e.message);
            }
        });
    })
    .on('error', (e) => {
        console.log(`Got error: ${e.message}`);
    });
    
    function filter(data) {
        var results = [];
        data.value.forEach(function(item) {
            results.push({
               "url": item.contentUrl,
               "thumbnail": item.thumbnailUrl,
               "snippet": item.name,
               "context": item.hostPageUrl
            });
        });
        return JSON.stringify(results);
    }
}