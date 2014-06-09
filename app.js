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
    if(Math.random() > 0.5) {
      console.log('RUDE')
      generate_rude(text, function(status) {
        twitter.Bot.post('statuses/update', {status: "@" + tweet.user.screen_name + ' ' + status, in_reply_to_status_id: tweet.id_str, replies: 'all'}, function(err, data, response) {
        })
      })
    } else {
      console.log('ELIZA')
      var status = elizabot.reply(text)
      twitter.Bot.post('statuses/update', {status: "@" + tweet.user.screen_name + ' ' + status, in_reply_to_status_id: tweet.id_str, replies: 'all'}, function(err, data, response) {
      })
    }
  }
})




setInterval(function() {
  tweetGenerate.createTweets().then(function(tweet) {
    postTweet(tweet)
  })
}, 2000000)

setInterval(function() {
  tweetGenerate.fccTweet().then(function(tweet) {
    postTweet(tweet)
  })
}, 1000000)

// var generate = function(filePath, length) {
//   var childProcess = require('child_process')
//   var python = childProcess.exec('python generate_text.py ' + filePath + ' ' + length, function(error, stdout, stderr) {
//     text = stdout
//     text = text.replace(/(\r\n|\n|\r)/gm,"");
//   })
// }

var generate_rude = function(query, callback) {
  var childProcess = require('child_process')
  var python = childProcess.exec('python generate_rude_text.py ' + '"'  + query + '"', function(error, stdout, stderr) {
    console.log(stdout)
    callback(stdout)
  })
}



var postTweet = function(tweet) {
  tweet = profanity.replaceProfanity(tweet)
  twitter.Bot.post('statuses/update', {status: tweet}, function(err, data, response) {
    console.log(tweet)
  })
}

