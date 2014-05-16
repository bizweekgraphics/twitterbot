var Twit = require('twit')

var Bot = new Twit({
    consumer_key: 'FPishWzIVPKZn8LAp7oBXjUl0'
  , consumer_secret: 'qBP0rt7B7V8iteQ3B3MvA73vPiA3hcFCYup2q4cBTuKWAcbahT'
  , access_token: '2499044862-9VpmtdYzNair4dRSGXrtV25U19f6OGZIW446OP4'
  , access_token_secret: 'Zedo7zADU9HpOy3qeSB6jIhSwttJcHUtHqSWOOCs9QrBK'
})

Bot.get('search/tweets', {q: 'test', count: 10}, function(err, data, response) {
  debugger;
})
