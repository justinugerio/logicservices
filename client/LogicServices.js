
// main start function
$(function() {

    var engineers = ['Andy James', 'Harold Johnson', 'Lakiesha Hill'],
        hours     = ['8am', '9am', '10am', '11am', '12am', '1pm', '2pm', '3pm', '4pm', '5pm'];

    // initialize Gantt table
    LogicServices.initTable(engineers, hours);

    // initialize Gantt area
    LogicServices.initGanttArea();

    // add timeline to Gantt area
    LogicServices.addTimeline();


    // create tasks
    $('.draggable-task').draggable({ axis: 'x', containment: '#gantt-area-id' })
      .resizable({ maxHeight: 30, minHeight: 30 });



    /// testing code below here
    /////////////////////////////////////////////


});
