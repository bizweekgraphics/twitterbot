require('./tweet.js')

var express = require('express');
var app = express()
var http = require('http')
var server = http.createServer(app)
// var io = require('socket.IO').listen(server)

var mongo = require('mongodb')
var monk = require('monk')
var db = monk('localhost:27017/fcc_database')
var _ = require('underscore')

app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next) {
  req.db = db;
  next();
})

server.listen(process.env.PORT || 4000);

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/index.html')
})

app.get('/test', function(req, res) {
  var re = /\bthen.+[.,!?]( |\z)/i
  var re2 = /\bthen.+/i
  var response = []
  tweetSearch(function(data) {
    data.statuses.forEach(function(tweet) {
      if(re.test(tweet.text)) {
        var text = tweet.text.match(re)[0]
        response.push(text)
      } else {
        var text = tweet.text.match(re2)
        if(text) {
          text = text[0]
          response.push(text)
        }
      }
    })
    res.send({
      test: response
    });
  });
});

app.get('/ifthen', function(req, res) {
  var db = req.db;
  var collection = db.get('comments');
  var re = /\bif.*?,/i
  collection.find({text: re}, function(e, docs) {
    docs = _.shuffle(docs)
    docs = docs.slice(0, 20)
    response = []
    docs.forEach(function(comment) {
      var text = comment.text.match(re)[0]
      if(text.length < 140) {
        response.push(text)
      }
    })
    res.send({
      dbstuff: response
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
  Bot.get('search/tweets', {q: 'if then', count: 20}, function(err, data, response) {
    callback(data)
  })  
}


