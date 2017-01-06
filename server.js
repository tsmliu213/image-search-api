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
    
});
app.listen(process.env.PORT || 8080);

function addVisited(query) {
    mongodb.connect(url, function(err, db) {
        if(err) console.log(err);
        else {
            var date = new Date();
            var queries = db.collection('queries');
            queries.findOne({visited: "visited"}, function(err, document) {
                if(err) console.log(err);
                else if(document) {
                    var visit = {"query": query, "time_stamp": date.toISOString()};
                    queries.update({visited: "visited"}, {$addToSet: {latest: visit}}, function(err, result) {
                        if(err) console.log(err)
                        else db.close();
                    });
                    console.log("add to existing list");
                }
                else {
                    queries.insert({visited: "visited", latest: [{"query": query, "time_stamp": date.toISOString()}]}, function(err, result) {
                        if(err) console.log(err)
                        else db.close();
                    });
                    console.log("first query inserted");
                }
            });
        }
    });
}

