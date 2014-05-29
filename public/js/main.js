var fccResponse;
var twitResponse;
var re = /\bif.*?,/i

$(document).ready(function() {

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
    createTweets(fcc.dbstuff, twit.test);
  })
    .fail(function() {
      console.log("You still don't understand promises")
  })

  var createTweets = function(fcc, twit) {
    fcc = _.shuffle(fcc)
    fcc.forEach(function(comment, index) {
      var text = comment + ' ' + twit[index]
      if(text.length < 140){
        $('.tweets').append('<li>' + text + '</li>')
      }
    })
  }


});

