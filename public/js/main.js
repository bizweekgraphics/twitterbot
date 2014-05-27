// var response;

// $(document).ready(function() {
//   $.getJSON('/test', function(data) {
//     response = data
//     response.test.statuses.forEach(function(status) {
//       $('body').append(status.text)
//       $('body').append('<br>')
//       $('body').append('<br>')
//     })
//   });
// });

var project

var width = 800;
var height = 600;

var svg = d3.select('.container').append('svg')
  .attr('width', '100%')
  .attr('height', '100%')
  .attr('id', 'chart')

var projection = d3.geo.albersUsa()
  .scale(1000)
  .translate([width/2, height/2])

var path = d3.geo.path()
  .projection(projection)

d3.json('/js/usa.json', function(error, json) {
  svg.append('g')
  .attr('id', 'usa')
  .selectAll('path')
  .data(json.features)
  .enter().append('path')
  .attr('d', path)
  .style('fill', 'lightgrey') 
  .style('stroke', 'grey')
})