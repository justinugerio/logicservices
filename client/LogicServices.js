
// main start function
$(function() {

<<<<<<< HEAD
    var engineers = ['Andy James', 'Harold Johnson', 'Lakiesha Hill'],
        hours     = ['8am', '9am', '10am', '11am', '12am', '1pm', '2pm', '3pm', '4pm', '5pm'];

    // initialize Gantt table
    LogicServices.initTable(engineers, hours);
=======
    var engineers = ['Andy James', 'Harold Johnson', 'Lakwanda Hill'],
          hours      = ['8am', '9am', '10am', '11am', '12am', '1pm', '2pm', '3pm', '4pm', '5pm'];
>>>>>>> 4330d84846157b5e9981b54b56b96f2b6420e60c

    // initialize
    LogicServices.initialize(engineers, hours);

<<<<<<< HEAD
    // add timeline to Gantt area
    LogicServices.addTimeline();
=======
>>>>>>> 4330d84846157b5e9981b54b56b96f2b6420e60c


    // create tasks
    $('.draggable-task').draggable({ axis: 'x', containment: '#gantt-area-id' })
      .resizable({ maxHeight: 30, minHeight: 30 });



    /// testing code below here
    /////////////////////////////////////////////
<<<<<<< HEAD

=======
    // console.log('GanttArea Width and Height: ' + LogicServices.GanttArea.Width + ' ' + LogicServices.GanttArea.Height);
>>>>>>> 4330d84846157b5e9981b54b56b96f2b6420e60c

});
