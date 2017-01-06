var express = require('express');
var bing = require('./bing.js');
var mongodb = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/searches';

var app = express();
app.use('/', express.static(__dirname + '/public'));
app.get('/api', function(req, res) {
    var query = req.query.q;
    var offset = req.query.offset;
    bing.imgSearch(query, offset, res);
    
    mongodb.connect(url, function(err, db){
       
       db.close(); 
    });
});
app.get('/api/latest', function(req, res) {
    
});
app.listen(process.env.PORT || 8080);

