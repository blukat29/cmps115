'use strict';

collectData(function() {
  console.log(domainCount);
  console.log(dateCount);
  drawHitsPerDay(dateCount);
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
  y.domain([-1, d3.max(data, function(d) { return d.count; })]);

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


//get random color for piechart?
function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


function drawPieChart(){
  var b = [];
  for (var i=0; i<domainCount.length; ++i){
    b.push({
        "label": domainCount.domain[i],
        "value": domainCount.count[i],
        "color": getRandomColor()
      });
  }
  var a = {
  "header": {
    "title": {
      "text": "Top Hit Domains",
      "font": "open sans"
    },
  "footer": {
    "color": "#999999",
    "fontSize": 10,
    "font": "open sans",
    "location": "bottom-left"
  },
  "size": {
    "canvasWidth": 590,
    "pieOuterRadius": "80%"
  },
  "data": {
    "sortOrder": "value-desc",
    "content": b,    
    "labels": {
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
      "speed": 400,
      "size": 8
    }
  },
  "misc": {
    "gradient": {
      "enabled": true,
      "percentage": 100
    }
  },
  "callbacks": {}
};
  var pie = new d3pie("pieChart", );


}



