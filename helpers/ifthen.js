var Q = require("q");
var monk = require('monk')

var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost:27017/fcc_database';

var db = monk(mongoUri)


var IfThen = function() {

  this.getFcc = function() {
    var deferred = Q.defer()
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
      deferred.resolve(response)
    })
    return deferred.proimse
  }

  this.getTweet = function() {
    var deferred = Q.defer()
    var response = []
    twitter.tweetSearch('if then', function(data) {
      data.forEach(function(tweet) {
        var text = parse.parseTweet(tweet.text)
        if(text) {
          response.push(text)
        };
      });
    deferred.resolve(text)
    });
    return deferred.promise
  }

  this.createTweets = function() {
    Q.all([this.getFcc(), this.getTweet()]).then(function(fcc, tweet) {
      console.log(this.createText(fcc, tweet))
    })
  }

  this.createText = function(tweets, fcc) {
    tweetArray = []
    tweets.forEach(function(tweet, index) {
      var fccText = fcc[index].replace(/if/i, 'If')
      var tweetText = tweet.replace(/then/i, 'then')
      var text = fccText + ' ' + tweetText
      if(text.length < 140){
        tweetArray.push(text)
      }
    })
    return tweetArray
  }

}


module.exports = IfThen


