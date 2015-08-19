function drawWords(domains) {
  var fill = d3.scale.category20();
  /* Word count logging */
  var logging = [2.302585092994046, 2.995732273553991, 3.4011973816621555, 3.6888794541139363, 3.912023005428146, 4.0943445622221, 4.248495242049359, 4.382026634673881, 4.499809670330265, 4.605170185988092];
  function sizing(num) {
    str = num.toString();
    return logging[str[0]] * str.length * 4;
  }

  var layout = d3.layout.cloud()
        .size([1000, 500])
        .words(domains.map(function(d) {
          return {text: d.domain, size: sizing(d.count), test: "haha"};
        }))
        .padding(1.4)
        .rotate(function() { return (Math.floor(((Math.random()*2)-1)*4)+1)*18; })
        .font("Impact")
        .fontSize(function(d) { return d.size; })
        .on("end", draw);
  layout.start();
  function draw(words) {
    d3.select("body").append("svg")
      .attr("width", layout.size()[0])
      .attr("height", layout.size()[1])
      .append("g")
      .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
      .selectAll("text")
      .data(words)
    .enter().append("a")
      .attr("xlink:href", function(d) { return "http://" + d.text; })
      .attr("xlink:show", "new")
    .append("text")
      .style("font-size", function(d) { return d.size + "px"; })
      .style("font-family", "Impact")
      .style("fill", function(d, i) { return fill(i); })
      .attr("text-anchor", "middle")
      .attr("transform", function(d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .text(function(d) { return d.text; });
  }
}
