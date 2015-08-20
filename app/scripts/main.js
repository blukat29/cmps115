'use strict';

var filter = {};

$("#btnApplyText").click(function() {
  $("#filterStatus").text("redrawing...");
  var text = $("#inputText").val();
  var duration = $("input:checked").val();
  filter.text = text;
  filter.duration = +duration;
  drawAll(filter, function() {
    $("#filterStatus").text("done.");
  });
});

drawAll(filter);
