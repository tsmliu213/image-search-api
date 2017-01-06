var express = require('express');
var bing = require('./bing.js');
var mongodb = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/searches';

var app = express();
app.use('/', express.static(__dirname + '/public'));
app.get('/api', function(req, res) {
    var query = req.query.q;
    var offset = req.query.offset;
    addVisited(query);
    bing.imgSearch(query, offset, res);

});
app.get('/api/latest', function(req, res) {
    mongodb.connect(url, function(err, db) {
       if(err) console.log(err);
       else {
           var queries = db.collection('queries');
           queries.findOne({visited: "visited"}, {latest: {$slice: -10}}, function(err, document) {
              if(err) console.log(err)
              else {
                  res.end(JSON.stringify(document.latest));
                  db.close();
              }
           });
       }
    });
});
app.listen(process.env.PORT || 8080);

function addVisited(query) {
    mongodb.connect(url, function(err, db) {
        if(err) console.log(err);
        else {
            var queries = db.collection('queries');
            queries.findOne({visited: "visited"}, function(err, document) {
                var date = new Date();
                if(err) console.log(err);
                else if(document) {
                    var visit = {"query": query, "time_stamp": date.toISOString()};
                    queries.update({visited: "visited"}, {$addToSet: {latest: visit}}, function(err, result) {
                        if(err) console.log(err)
                        else db.close();
                    });
                }
                else {
                    queries.insert({visited: "visited", latest: [{"query": query, "time_stamp": date.toISOString()}]}, function(err, result) {
                        if(err) console.log(err)
                        else db.close();
                    });
                }
            });
        }
    });
}

