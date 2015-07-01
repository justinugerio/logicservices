
$(function() {
  $( ".draggable-task" ).draggable({ axis: "x", containment: "#table-container1" })
      .resizable({ maxHeight: 30, minHeight: 30 });
  $( ".draggable-timeline" ).draggable({ axis: "x", containment: "#table-container1" });
});
