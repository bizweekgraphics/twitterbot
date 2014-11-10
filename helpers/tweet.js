var Twit = require('twit')

var Twitter = function() {
  this.Bot = new Twit({
    consumer_key: process.env.FCCLIEFS_API_KEY
  , consumer_secret: process.env.FCCLIEFS_API_SECRET_KEY
  , access_token: process.env.FCCLIEFS_ACCESS_TOKEN
  , access_token_secret: process.env.FCCLIEFS_TOKEN_SECRET
  })

  this.tweetSearch = function(query, callback) {
    this.Bot.get('search/tweets', {q: query, count: 20}, function(err, data, response) {
      callback(data.statuses)
    });  
  };

}

module.exports = Twitter


