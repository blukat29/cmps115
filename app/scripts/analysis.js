'use strict';

function drawAll(filter) {
  collectData(function() {
    drawHitsPerDay(dateCount);
    drawDayHourHeatMap(dayHourCount);
    drawWords(domainCount);
    drawPieChart(domainCount);
    console.log("done drawing");
  }, filter);
}

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
  var margin = { top: 50, right: 0, bottom: 100, left: 30 },
    width = 960 - margin.left - margin.right,
    height = 430 - margin.top - margin.bottom,
    gridSize = Math.floor(width / 24),
    legendElementWidth = gridSize*2,
    buckets = 9,
    colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"], // alternatively colorbrewer.YlGnBu[9]
    days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    times = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24"];


  var colorScale = d3.scale.quantile()
    .domain([0, buckets - 1, d3.max(data, function (d) { return d.value; })])
    .range(colors);

  var svg = d3.select("#dayHourHeatMap").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var dayLabels = svg.selectAll(".dayLabel")
    .data(days)
    .enter().append("text")
    .text(function (d) { return d; })
    .attr("x", 0)
    .attr("y", function (d, i) { return i * gridSize; })
    .style("text-anchor", "end")
    .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
    .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

  var timeLabels = svg.selectAll(".timeLabel")
    .data(times)
    .enter().append("text")
    .text(function(d) { return d; })
    .attr("x", function(d, i) { return i * gridSize; })
    .attr("y", 0)
    .style("text-anchor", "middle")
    .attr("transform", "translate(" + gridSize / 2 + ", -6)")
    .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });

  var heatMap = svg.selectAll(".hour")
    .data(data)
    .enter().append("rect")
    .attr("x", function(d) { return (d.hour - 1) * gridSize; })
    .attr("y", function(d) { return (d.day - 1) * gridSize; })
    .attr("rx", 4)
    .attr("ry", 4)
    .attr("class", "hour bordered")
    .attr("width", gridSize)
    .attr("height", gridSize)
    .style("fill", colors[0]);

  heatMap.transition().duration(1000)
    .style("fill", function(d) { return colorScale(d.value); });

  heatMap.append("title").text(function(d) { return d.value; });

  var legend = svg.selectAll(".legend")
    .data([0].concat(colorScale.quantiles()), function(d) { return d; })
    .enter().append("g")
    .attr("class", "legend");

  legend.append("rect")
    .attr("x", function(d, i) { return legendElementWidth * i; })
    .attr("y", height)
    .attr("width", legendElementWidth)
    .attr("height", gridSize / 2)
    .style("fill", function(d, i) { return colors[i]; });

  legend.append("text")
    .attr("class", "mono")
    .text(function(d) { return "" + Math.round(d); })
    .attr("x", function(d, i) { return legendElementWidth * i; })
    .attr("y", height + gridSize);
}


function drawPieChart(data){

  function getRandomColor() {
      var letters = '0123456789ABCDEF'.split('');
      var color = '#';
      for (var i = 0; i < 6; i++ ) {
          color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
  }

  var pieData = [];
  var length = (data.length > 20)? 20 : data.length;
  for(var i = 0; i < length; ++i){
    pieData.push({
      "label": data[i].domain,
      "value": data[i].count,
      "color": getRandomColor()
    });
  }

  var pie = new d3pie("pieChart", {
    "header": {
      "title": {
        "text": "Domain Count",
      "fontSize": 24,
      "font": "open sans"
      },
      "subtitle": {
        "color": "#999999",
      "fontSize": 12,
      "font": "open sans"
      },
      "titleSubtitlePadding": 9
    },
      "footer": {
        "color": "#999999",
      "fontSize": 10,
      "font": "open sans",
      "location": "bottom-left"
      },
      "size": {
        "canvasWidth": 590,
        "pieOuterRadius": "90%"
      },
      "data": {
        "sortOrder": "value-desc",
        "content": pieData
      },
      "labels": {
        "outer": {
          "pieDistance": 32
        },
        "inner": {
          "hideWhenLessThanPercentage": 3
        },
        "mainLabel": {
          "fontSize": 11
        },
        "percentage": {
          "color": "#ffffff",
          "decimalPlaces": 0
        },
        "value": {
          "color": "#adadad",
          "fontSize": 11
        },
        "lines": {
          "enabled": true
        },
        "truncation": {
          "enabled": true
        }
      },
      "effects": {
        "pullOutSegmentOnClick": {
          "effect": "linear",
          "speed": 500,
          "size": 10
        }
      },
      "misc": {
        "colors": {
          "background": "#ffffff"
        },
        "gradient": {
          "enabled": true,
          "percentage": 100
        }
      },
      "callbacks": {}
  });
}
