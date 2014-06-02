$(document).ready(function() {

  // setInterval(function() {
    function getFcc() {
      return $.getJSON('/ifthen').pipe(function(tasks, status, jqXHR) {
        return tasks
      })
    }

    function getTwit() {
      return $.getJSON('/then_tweet').pipe(function(tasks, status, jqXHR) {
        return tasks
      })
    }

    $.when(getFcc(), getTwit()).done(function(fcc, twit) {
      createTweets(fcc.dbstuff, twit.test, tweet);
    })
      .fail(function() {
        console.log("You still don't understand promises")
    })
  // }, 120000)
  
});


var createTweets = function(fcc, twit, callback) {
  console.log(twit)
  twit = _.flatten(twit)
  fcc = _.flatten(fcc)
  fcc = _.shuffle(fcc)
  tweets = []
  twit.forEach(function(tweet, index) {
    console.log(fcc[index])
    var fccText = fcc[index].replace(/if/i, 'If')
    var tweetText = tweet.replace(/then/i, 'then')
    var text = fccText + ' ' + tweetText
    if(text.length < 140){
      $('.tweets').append('<li>' + text + '</li>')
      tweets.push(text)
    }
  })
  callback(tweets[0])
}

var tweet = function(tweet) {
    $.getJSON('/tweet', {text: tweet}, function() {
      console.log('success')
    })
}


