require('./tweet.js')

var express = require('express');
var app = express()
var http = require('http')
var server = http.createServer(app)
// var io = require('socket.IO').listen(server)

var mongo = require('mongodb')
var monk = require('monk')
var db = monk('localhost:27017/fcc_database')

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
  tweetSearch(function(data) {
    res.send({
      test: data
    })
  })
})

app.get('/ifthen', function(req, res) {
  var db = req.db;
  var collection = db.get('comments');
  var re = /\bif.*?,/i
  collection.find({text: /\bif\b.*?,/i}, {limit: 10}, function(e, docs) {
    response = []
    docs.forEach(function(comment) {
      response.push(comment.text.match(re)[0])
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
  Bot.get('search/tweets', {q: 'if then', count: 10}, function(err, data, response) {
    callback(data)
  })  
}


