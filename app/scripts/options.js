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

/*
//get random color for piechart?
function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getpieData(){
  var pieData = [];
  for (var i=0; i<domainCount.length; ++i){
    pieData.push({
        "label": domainCount.domain[i],
        "value": domainCount.count[i],
        "color": getRandomColor()
      });
  } 
}

function drawPieChart(){

var pie = new d3pie("pieChart", {
  "header": {
    "title": {
      "text": "Top hits domains",
      "fontSize": 24,
      "font": "open sans"
    },
    "subtitle": {
      "color": "#999999",
      "fontSize": 12,
      "font": "open sans"
    },
    "location": "top-left",
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
    "content": [  
        "label": domainCount.domain[0],
        "value": domainCount.count[0],
        "color": #000FFF
    ]
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
      "speed": 400,
      "size": 8
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
*/

function drawPieChart(){
var pie = new d3pie("pieChart", {"header":{"title":{"text":"Lots of Programming Languages","fontSize":24,"font":"open sans"},"subtitle":{"text":"A full pie chart to show off label collision detection and resolution.","color":"#999999","fontSize":12,"font":"open sans"},"titleSubtitlePadding":9},"footer":{"color":"#999999","fontSize":10,"font":"open sans","location":"bottom-left"},"size":{"canvasWidth":590,"pieOuterRadius":"90%"},"data":{"sortOrder":"value-desc","content":[{"label":"JavaScript","value":264131,"color":"#2484c1"},{"label":"Ruby","value":218812,"color":"#0c6197"},{"label":"Java","value":157618,"color":"#4daa4b"},{"label":"PHP","value":114384,"color":"#90c469"},{"label":"Python","value":95002,"color":"#daca61"},{"label":"C+","value":78327,"color":"#e4a14b"},{"label":"C","value":67706,"color":"#e98125"},{"label":"Objective-C","value":36344,"color":"#cb2121"},{"label":"Shell","value":28561,"color":"#830909"},{"label":"Cobol","value":24131,"color":"#923e99"},{"label":"C#","value":100,"color":"#ae83d5"},{"label":"Coldfusion","value":68,"color":"#bf273e"},{"label":"Fortran","value":218812,"color":"#ce2aeb"},{"label":"Coffeescript","value":157618,"color":"#bca44a"},{"label":"Node","value":114384,"color":"#618d1b"},{"label":"Basic","value":95002,"color":"#1ee67b"},{"label":"Cola","value":36344,"color":"#b0ec44"},{"label":"Perl","value":32170,"color":"#a4a0c9"},{"label":"Dart","value":28561,"color":"#322849"},{"label":"Go","value":264131,"color":"#86f71a"},{"label":"Groovy","value":218812,"color":"#d1c87f"},{"label":"Processing","value":157618,"color":"#7d9058"},{"label":"Smalltalk","value":114384,"color":"#44b9b0"},{"label":"Scala","value":95002,"color":"#7c37c0"},{"label":"Visual Basic","value":78327,"color":"#cc9fb1"},{"label":"Scheme","value":67706,"color":"#e65414"},{"label":"Rust","value":36344,"color":"#8b6834"},{"label":"FoxPro","value":32170,"color":"#248838"}]},"labels":{"outer":{"pieDistance":32},"inner":{"hideWhenLessThanPercentage":3},"mainLabel":{"fontSize":11},"percentage":{"color":"#ffffff","decimalPlaces":0},"value":{"color":"#adadad","fontSize":11},"lines":{"enabled":true},"truncation":{"enabled":true}},"effects":{"pullOutSegmentOnClick":{"effect":"linear","speed":400,"size":8}},"misc":{"gradient":{"enabled":true,"percentage":100}}});
}



