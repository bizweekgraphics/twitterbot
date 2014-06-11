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
var Q = require("q");
var fs = require('fs')
var dom = require('dom-js')

//load my libs
var t = require('./helpers/tweet.js')
var twitter = new t()
var p = require('./helpers/tweet_parse.js')
var parse = new p()
var pFilter = require('./helpers/profanity_filter.js')
var profanity = new pFilter()
var elizabot = require('./helpers/eliza.js')
var tg = require('./helpers/tg.js')
var tweetGenerate = new tg()

app.use(express.static(__dirname + '/public'));

app.use(express.json());

app.use(function(req, res, next) {
  req.db = db;
  next();
})


server.listen(process.env.PORT || 4000);

var stream = twitter.Bot.stream('user')

stream.on('tweet', function(tweet) {
  console.log('**************tweet**************')
  var reply = tweet.in_reply_to_user_id
  if(reply && tweet.user.screen_name != 'test43523') {
    var text = tweet.text.replace(/@\w*/, '').trim()
    if(/(neutrality)/i.test(text)) {
      tweetGenerate.getSubjectTweet('neutrality').then(function(status) {
        tweetReply(tweet, status)
      })
    } else if(/(fcc)/i.test(text)) {
        tweetGenerate.getSubjectTweet('fcc').then(function(status) {
          tweetReply(tweet, status)
        })
    } else {
      var random = Math.random()
      if(random <= 0.85) {
        console.log('ALICE')
        generate_alice(text, function(status) {
          tweetReply(tweet, status)
        })
      } else {
        console.log('RUDE')
        generate_rude(text, function(status) {
          tweetReply(tweet, status)
        })
      } 
    }
  }
})

var tweetReply = function(tweet, status) {
  status = profanity.replaceProfanity(status)
  twitter.Bot.post('statuses/update', {status: "@" + tweet.user.screen_name + ' ' + status, in_reply_to_status_id: tweet.id_str, replies: 'all'}, function(err, data, response) {
  })
}


//Generates an if then tweet at the provided interval
setInterval(function() {
  tweetGenerate.createTweets().then(function(tweet) {
    postTweet(tweet)
  })
}, 2000000)


//Generates a tweet directly from the fcc comments database
setInterval(function() {
  tweetGenerate.getSubjectTweet('fcc').then(function(tweet) {
    postTweet(tweet)
  })
}, 1000000)


//Generates a tweet directly from fcc comments about net neutrality
setInterval(function() {
  tweetGenerate.getSubjectTweet('neutrality').then(function(tweet) {
    postTweet(tweet)
  })
}, 1500000)

//Calls a python script that accepts an a query and responds appropriatelyish
var generate_rude = function(query, callback) {
  var childProcess = require('child_process')
  var python = childProcess.exec('python generate_rude_text.py ' + '"'  + query + '"', function(error, stdout, stderr) {
    console.log(stdout)
    callback(stdout)
  })
}

//Calls a python script that accepts an a query and responds appropriatelyish
var generate_alice = function(query, callback) {
  var childProcess = require('child_process')
  var python = childProcess.exec('python alice.py ' + '"'  + query + '"', function(error, stdout, stderr) {
    console.log(stdout)
    callback(stdout)
  })
}

//Tweets whatever argument is passed into function
var postTweet = function(tweet) {
  tweet = profanity.replaceProfanity(tweet)
  twitter.Bot.post('statuses/update', {status: tweet}, function(err, data, response) {
    console.log(tweet)
  })
}

