var fccResponse;
var twitResponse;
var re = /\bif.*?,/i

$(document).ready(function() {

  setInterval(function() {
    function getFcc() {
      return $.getJSON('/ifthen').pipe(function(tasks, status, jqXHR) {
        return tasks
      })
    }

    function getTwit() {
      return $.getJSON('/test').pipe(function(tasks, status, jqXHR) {
        return tasks
      })
    }

    $.when(getFcc(), getTwit()).done(function(fcc, twit) {
      createTweets(fcc.dbstuff, twit.test, tweet);
    })
      .fail(function() {
        console.log("You still don't understand promises")
    })
  }, 120000)



});


var createTweets = function(fcc, twit, callback) {
  fcc = _.shuffle(fcc)
  tweets = []
  fcc.forEach(function(comment, index) {
    var text = comment + ' ' + twit[index]
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


