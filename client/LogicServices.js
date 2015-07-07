
// main start function
$(function() {

    var engineers = ['Andy James', 'Harold Johnson', 'Lakwanda Hill'],
          hours      = ['8am', '9am', '10am', '11am', '12am', '1pm', '2pm', '3pm', '4pm', '5pm'];

    // initialize
    LogicServices.initialize(engineers, hours);
    LogicServices.EngineerManager.initialize(LogicServices.GanttArea);

    // create tasks
    $('.draggable-task').draggable({ axis: 'x', containment: '#gantt-area-id' })
      .resizable({ maxHeight: 31, minHeight: 32 });



    /// testing code below here
    /////////////////////////////////////////////
    // console.log('GanttArea Width and Height: ' + LogicServices.GanttArea.Width + ' ' + LogicServices.GanttArea.Height);

});
