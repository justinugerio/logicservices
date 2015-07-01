
$(function() {
  $( ".draggable-task" ).draggable({ axis: "x", containment: "#gantt-table-container-id" })
      .resizable({ maxHeight: 30, minHeight: 30 });
  $( ".draggable-timeline" ).draggable({ axis: "x", containment: "#gantt-table-container-id" });
});
