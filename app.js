//load server and db stuff
var express = require('express');
var app = express()
var http = require('http')
var server = http.createServer(app)
var mongo = require('mongodb')
var monk = require('monk')
var db = monk('localhost:27017/fcc_database')

//load utilities
var _ = require('underscore')

//load my libs
var t = require('./tweet.js')
var twitter = new t()


app.use(express.static(__dirname + '/public'));

app.use(express.json());

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
  var re2 = /\bthen.{2,}/i
  var reEllipsis = /(\.\.\.)/
  var response = []
  tweetSearch(function(data) {
    data.statuses.forEach(function(tweet) {
      if(re.test(tweet.text)) {
        var text = tweet.text.match(re)[0]
        response.push(text)
      } else if(reEllipsis.test(tweet.text)) {
        return
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
  var re = /\bif[ ][a-zA-Z  ']+,/i
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

app.get('/tweet', function(req, res) {
  var text = (req.query['text'])
  twitter.Bot.post('statuses/update', { status: text}, function(err, data, response) {
    res.send({
    })    
  })
})

var tweetSearch = function(callback) {
  twitter.Bot.get('search/tweets', {q: 'if then', count: 20}, function(err, data, response) {
    callback(data)
  })  
}




