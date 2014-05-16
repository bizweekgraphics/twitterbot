require('./tweet.js')
var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

app.listen(process.env.PORT || 4000);

app.get('/test', function(req, res) {
  res.send({
    test: 'thing'
  })
});

