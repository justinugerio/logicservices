
// main start function
$(function() {

    // initialize Gantt table
    LogicServices.initTable(LogicServices.Engineers, LogicServices.Hours);

    // initialize Gantt area
    LogicServices.initGanttArea();

    // add timeline to Gantt area
    LogicServices.addTimeline('timeline-id', LogicServices.GanttAreaID);


    // create tasks
    $('.draggable-task').draggable({ axis: 'x', containment: '#' + LogicServices.GanttAreaID })
      .resizable({ maxHeight: 30, minHeight: 30 });
    $('.draggable-timeline').draggable({ axis: 'x', containment: '#' + LogicServices.GanttAreaID });



    /// testing
    var xvar = $('#gantt-table-container-id');
    xvar = xvar.get(0);
    console.log('Yoo hoo!' + ' ' + xvar.scrollLeft + ' ' + xvar.scrollTop + ' ' + xvar.scrollWidth + ' ' + xvar.scrollHeight);

    var yvar = LogicServices.getGanttOffset();
    console.log('Number 2: ' + yvar.x + ' ' + yvar.y);

});
