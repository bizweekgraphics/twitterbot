'use strict';

var Twit = require('twit');
var pFilter = require('./profanity_filter.js');

var twitter = {

  Bot: new Twit({
    consumer_key: process.env.FCCLIEFS_API_KEY,
    consumer_secret: process.env.FCCLIEFS_API_SECRET_KEY,
    access_token: process.env.FCCLIEFS_ACCESS_TOKEN,
    access_token_secret: process.env.FCCLIEFS_TOKEN_SECRET
  }),

  // findTweet: function(query, callback) {
  //   this.Bot.get('search/tweets', {q: query, count: 20}, function(err, data, response) {
  //     callback(data.statuses);
  //   });  
  // },

  postTweet: function(tweet) {
    tweet = pFilter.replaceProfanity(tweet);
    console.log(tweet);
    // this.Bot.post('statuses/update', {status: tweet}, function(err, data, response) {
    //   console.log(tweet)
    // })
  },

  tweetReply: function(tweet, status) {
    status = pFilter.replaceProfanity(status);
    // this.Bot.post('statuses/update', {status: "@" + tweet.user.screen_name + ' ' + status, in_reply_to_status_id: tweet.id_str, replies: 'all'}, function(err, data, response) {
    //   console.log(err);
    // });
  }


};

module.exports = twitter;



