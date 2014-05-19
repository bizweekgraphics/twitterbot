$(document).ready(function() {
  $.getJSON('/test', function(response) {
    console.log(response)
    var response = JSON.stringify(response);
    $('body').append(response);
  });
});