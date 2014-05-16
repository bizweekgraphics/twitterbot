$(document).ready(function() {
  $.getJSON('/test', function(response) {
    var response = JSON.stringify(response);
    $('body').append(response);
  });
});