var Twit = require('twit')

var Twitter = function() {
  this.Bot = new Twit({
    consumer_key: 'FPishWzIVPKZn8LAp7oBXjUl0'
  , consumer_secret: 'qBP0rt7B7V8iteQ3B3MvA73vPiA3hcFCYup2q4cBTuKWAcbahT'
  , access_token: '2499044862-9VpmtdYzNair4dRSGXrtV25U19f6OGZIW446OP4'
  , access_token_secret: 'Zedo7zADU9HpOy3qeSB6jIhSwttJcHUtHqSWOOCs9QrBK'
  })

  this.tweetSearch = function(query, callback) {
    this.Bot.get('search/tweets', {q: query, count: 20}, function(err, data, response) {
      callback(data.statuses)
    });  
  };

}

module.exports = Twitter


