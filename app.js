'use strict';

var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);

//helpers
var twitter = require('./helpers/tweet.js');
var commentDb = require('./helpers/comment-db.js');
var pFilter = require('./helpers/profanity_filter.js');
var chatBot = require('./helpers/chat-bot.js');

// app.use(function(req, res, next) {
//   req.db = db;
//   next();
// });

server.listen(process.env.PORT || 4000);

var stream = twitter.Bot.stream('user');

stream.on('connected', function(request) {
  console.log('connected to streaming twitter api');
});

stream.on('disconnect', function(msg) {
  console.log(msg);
});

stream.on('tweet', function(tweet) {
  var reply = tweet.in_reply_to_user_id && tweet.user.screen_name.toLowerCase() != 'fccliefs';
  if(reply) { handleReply(tweet, reply); }
});

function handleReply(tweet, reply) {
  var text = tweet.text.replace(/@\w*/, '').trim();
  if(/(tell me about)/i.test(text)) {
    var query = text.split(/(tell me about)/i).pop().replace('the', '').trim();
    commentDb.getSubjectTweet(query).then(function(status) {
      console.log(tweet, status);
      twitter.tweetReply(tweet, status);
    });
  } else {
    chatBot.generateResponse(text).then(function(status) {
      twitter.tweetReply(tweet, status);
    });
  }
}


//Generates an if then tweet at the provided interval
// setInterval(function() {
//   commentDb.createTweets().then(function(tweet) {
    // twitter.postTweet(tweet)
//   })
// }, 2000000)


//Generates a tweet directly from the fcc comments database
// setInterval(function() {
  commentDb.getSubjectTweet('fcc').then(function(tweet) {
    console.log(tweet);
    twitter.postTweet(tweet);
  });
// }, 40000000)


//Generates a tweet directly from fcc comments about net neutrality
// setInterval(function() {
  commentDb.getSubjectTweet('neutrality').then(function(tweet) {
    twitter.postTweet(tweet);
  });
// }, 50000000)



