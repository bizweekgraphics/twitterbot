//load server and db stuff
var express = require('express');
var app = express()
var http = require('http')
var server = http.createServer(app)
var mongo = require('mongodb')
var monk = require('monk')

var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost:27017/fcc_database';

var db = monk(mongoUri)


//load utilities
var _ = require('underscore')

//load my libs
var t = require('./helpers/tweet.js')
var twitter = new t()
var p = require('./helpers/tweet_parse.js')
var parse = new p()
var pFilter = require('./helpers/profanity_filter.js')
var profanity = new pFilter()

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

app.get('/then_tweet', function(req, res) {
  var response = []
  twitter.tweetSearch('if then', function(data) {
    data.forEach(function(tweet) {
      var text = parse.parseTweet(tweet.text)
      if(text) {
        response.push(text)
      };
    });
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
  text = profanity.replaceProfanity(text)
  twitter.Bot.post('statuses/update', { status: text}, function(err, data, response) {
    res.send({
    })    
  })
})

app.get('/find_fcc', function(req, res) {
  twitter.tweetSearch('#fcc', function(data) {
    console.log(data)
  })
})

var generate = function(filePath, length) {
  var childProcess = require('child_process')
  var python = childProcess.exec('python generate_text.py ' + filePath + ' ' + length, function(error, stdout, stderr) {
    text = stdout
    text = text.replace(/(\r\n|\n|\r)/gm,"");
  })
}



