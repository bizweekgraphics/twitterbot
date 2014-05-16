var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.send('Test');
});

var server = app.listen(4000, function() {
  console.log('Listening on port %d', server.address().port);
});