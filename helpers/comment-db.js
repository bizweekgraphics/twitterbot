'use strict';

var Q = require("q");
var monk = require('monk');
var _ = require('underscore');

var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost:27017/fcc_with_links';

var db = monk(mongoUri);
var comments = db.get('comments');

var commentDb = {

  fetchFcc: function() {
    var deferred = Q.defer();
    var response = [];
    var re = /\bif[ ][a-zA-Z  ']+,/i;
    comments.find({text: re}, function(e, docs) {
      docs = _.shuffle(docs).slice(0, 20);
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

  //finds a tweet from the database containing the subject word
  getSubjectTweet: function(subject) {
    var deferred = Q.defer();
    var self = this;
    var subjectRe = new RegExp(subject, 'i');
    comments.find({text: subjectRe}, function(e, docs) {
      if(docs.length > 0) {
        self.findTweetInDocs(docs, subjectRe).then(function(response) {
          deferred.resolve(response);
        })
      } else {
        deferred.resolve("I dont know about that. Try asking me about something else");
      }
    });
    return deferred.promise;
  },

  findTweetInDocs: function(docs, subjectRe) {
    var deferred = Q.defer();
    var sentenceRe = /[^.!?\s][^.!?]*(?:[.!?](?!['"]?\s|$)[^.!?]*)*[.!?]?['"]?(?=\s|$)/g;
    docs = _.shuffle(docs).slice(0, 20);

    docs.forEach(function(doc, i) {
      var sentences = doc.text.match(sentenceRe);
      sentences.forEach(function(sentence) {
        if(sentence.length < 110 && subjectRe.test(sentence)) {
          var tweet = '"' + sentence + '" ' + docs[i].url;
          deferred.resolve(tweet);
        }

        if(!tweet && i === docs.length - 1) {
          deferred.resolve("I don't know about that. Try asking me about something else");
        }
      })
    })

    return deferred.promise;
  }

}

module.exports = commentDb;