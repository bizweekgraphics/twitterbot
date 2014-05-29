var response;
var re = /\bif.*?,/i

$(document).ready(function() {
  // $.getJSON('/test', function(data) {
  //   response = data
  //   console.log(data)
  //   // response.test.statuses.forEach(function(status) {
  //   //   $('body').append(status.text)
  //   //   $('body').append('<br>')
  //   //   $('body').append('<br>')
  //   // })
  // });
  $.getJSON('/ifthen', function(data) {
    response = data
    console.log(data.dbstuff)
  })
});

