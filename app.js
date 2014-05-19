require('./tweet.js')

var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

app.listen(process.env.PORT || 4000);

app.get('/test', function(req, res) {
  tweetSearch(function(data) {
    res.send({
      test: data
    })
  })
})

var Twit = require('twit')

var Bot = new Twit({
    consumer_key: 'FPishWzIVPKZn8LAp7oBXjUl0'
  , consumer_secret: 'qBP0rt7B7V8iteQ3B3MvA73vPiA3hcFCYup2q4cBTuKWAcbahT'
  , access_token: '2499044862-9VpmtdYzNair4dRSGXrtV25U19f6OGZIW446OP4'
  , access_token_secret: 'Zedo7zADU9HpOy3qeSB6jIhSwttJcHUtHqSWOOCs9QrBK'
})

var tweetSearch = function(callback) {
  Bot.get('search/tweets', {q: 'test', count: 1}, function(err, data, response) {
    callback(data)
  })  
}