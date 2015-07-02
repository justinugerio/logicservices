
// main start function
$(function() {

    // initialize Gantt table
    LogicServices.initTable(LogicServices.Engineers, LogicServices.Hours);

    // initialize Gantt area
    LogicServices.initGanttArea();

    // add timeline to Gantt area
    LogicServices.addTimeline('timeline-id', LogicServices.GanttAreaID);
    $('.draggable-timeline').draggable({ axis: 'x', containment: '#' + LogicServices.GanttAreaID });


    // create tasks
    $('.draggable-task').draggable({ axis: 'x', containment: '#' + LogicServices.GanttAreaID })
      .resizable({ maxHeight: 30, minHeight: 30 });




    /// testing code
    /////////////////////////////////////////////



});
