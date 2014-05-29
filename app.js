require('./tweet.js')

var express = require('express');
var app = express()
var http = require('http')
var server = http.createServer(app)
var io = require('socket.IO').listen(server)

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

app.get('/dbtest', function(req, res) {
  var db = req.db;
  var collection = db.get('comments');
  collection.find({},{}, function(e, docs) {
    res.send({
      dbstuff: docs
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
  Bot.get('search/tweets', {q: 'fcc since:2014-5-19', count: 100}, function(err, data, response) {
    callback(data)
  })  
}


