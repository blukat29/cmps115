'use strict';

collectData(function() {
  console.log(domainCount);
  console.log(dateCount);
  drawHitsPerDay(dateCount);
  // drawDayHourHeatMap(dayHourCount);
  drawDomainsRank(domainCount);
});

function drawDomainsRank (data) {
  var rankLength = (data.length < 10) ? data.length : 10;
  var e = $("#topDomains");
  for (var i = 0; i < rankLength; i ++) {
    var div = $("<div></div>")
        .html(data[i].domain + " " + data[i].count);
    e.append(div);
  }
}

function drawHitsPerDay (data) {
  var margin = {top: 0, right: 20, bottom: 30, left: 50},
      width = 960 - margin.left - margin.right,
      height = 150 - margin.top - margin.bottom;

  // Preprocess data.
  data.forEach(function(d) {
    d.date = new Date(d.date); // convert string to Date object.
    d.count = +d.count; // force its type to be number.
  });

  // Define axis types.
  var x = d3.time.scale().range([0, width]);
  var y = d3.scale.linear().range([height, 0]);
  var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(7);
  var yAxis = d3.svg.axis().scale(y).orient("left").ticks(3);

  // Define points in the line.
  var line = d3.svg.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.count); });

  // Create svg canvas.
  var svg = d3.select("#hitsPerDay")
      .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
      .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Define domains.
  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { return d.count; })]);

  // Draw line.
  svg.append("path")
      .attr("class", "line")
      .attr("d", line(data));

  // Draw x axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  // Draw y axis
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

}

function drawDayHourHeatMap (data) {
}
