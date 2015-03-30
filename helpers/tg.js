'use strict';

var Q = require("q");
var monk = require('monk');
var _ = require('underscore');
var twitter = require('./tweet.js');

var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost:27017/fcc_with_links';

var db = monk(mongoUri);
var comments = db.get('comments');

var tweetUtils = {

  getFccFromDb: function() {
    var deferred = Q.defer();
    var response = [];
    var re = /\bif[ ][a-zA-Z  ']+,/i;
    comments.find({text: re}, function(e, docs) {
      docs = _.shuffle(docs);
      docs = docs.slice(0, 20);
      docs.forEach(function(comment) {
        var text = comment.text.match(re)[0];
        if(text.length < 120) {
          response.push(text);
        }
      });
      deferred.resolve(response);
    });
    return deferred.promise;
  },

  getTweet: function() {
    var deferred = Q.defer();
    var self = this;
    var response = [];
    twitter.findTweet('if then', function(data) {
      data.forEach(function(tweet) {
        var text = self.parseTweet(tweet.text);
        if(text) {
          response.push(text);
        }
      });
    deferred.resolve(response);
    });
    return deferred.promise;
  },

  createText: function(tweets, fcc) {
    try {
      tweets.forEach(function(tweet, i) {
        var fccText = fcc[i].replace(/if/i, 'If');
        var tweetText = tweets[i].replace(/then/i, 'then');
        var text = fccText + ' ' + tweetText;
        if(text.length < 120){
          return text;
        }        
      });
    } catch(e) {
      console.log(e);
    }
  },

  createTweets: function() {
    var deferred = Q.defer();
    var self = this;
    Q.all([this.getFcc(), this.getTweet()]).then(function(data) {
      var fcc = _.shuffle(data[0]);
      var flatTweets = _.flatten(data[1]);
      var tweets = _.shuffle(flatTweets);
      var tweetText = self.createText(tweets, fcc);
      deferred.resolve(tweetText);
    });

    return deferred.promise;
  },

  //finds a tweet from the database containing the subject word
  getSubjectTweet: function(subject) {
    console.log(subject);
    var deferred = Q.defer();
    var tweet;
    var subjectRe = new RegExp(subject, 'i');
    comments.find({text: subjectRe}, function(e, docs) {
      if(docs.length > 0) {
        var sentence = /[^.!?\s][^.!?]*(?:[.!?](?!['"]?\s|$)[^.!?]*)*[.!?]?['"]?(?=\s|$)/g;
        docs = _.shuffle(docs);
        docs = docs.slice(0, 20);
        for(var i=0; i < docs.length; i++) {
          var matchArray = docs[i].text.match(sentence);
          matchArray.forEach(function(match) {
            if(match.length < 110 && subjectRe.test(match)) {
              tweet = '"' + match + '" ' + docs[i].url;
            }

            if(!tweet && i == docs.length - 1) {
              deferred.resolve("I dont know about that. Try asking me about something else");
            }
          });
          if(tweet) {
            deferred.resolve(tweet);
          }
        }
      } else {
        deferred.resolve("I dont know about that. Try asking me about something else");
      }
    });
    return deferred.promise;
  },

  parseTweet: function(tweet) {
    var text;
    var re = /\bthen.+[.,!?]( |\z)/i;
    var re2 = /\bthen.{2,}/i;
    var reEllipsis = /(\.\.\.)|\u2026/;


    if(reEllipsis.test(tweet)) {
      return null;
    } else if(re.test(tweet)) {
      text = tweet.match(re)[0];
      return text;
    } else {
      text = tweet.match(re2);
      return text ? text: null;
    }
  }


}

module.exports = tweetUtils;





