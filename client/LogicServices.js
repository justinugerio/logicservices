
// main start function
$(function() {

    var engineers = ['Andy James', 'Harold Johnson', 'Lakwanda Hill'],
          hours      = ['8am', '9am', '10am', '11am', '12am', '1pm', '2pm', '3pm', '4pm', '5pm'];

    // initialize
    LogicServices.initialize();
    LogicServices.GanttManager.initialize(engineers, hours);
    LogicServices.EngineerManager.initialize(LogicServices.GanttManager.GanttArea);
    LogicServices.TaskManager.initialize(LogicServices.GanttManager.GanttArea);


    /// testing code below here
    /////////////////////////////////////////////
    // console.log('GanttArea Width and Height: ' + LogicServices.GanttArea.Width + ' ' + LogicServices.GanttArea.Height);

});
