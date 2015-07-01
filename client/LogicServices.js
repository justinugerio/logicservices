

// main start function
$(function() {

    // initialize Gantt table
    LogicServices.initTable(LogicServices.Engineers, LogicServices.Hours);


    // create tasks
    $('.draggable-task').draggable({ axis: 'x', containment: '#gantt-table-container-id' })
      .resizable({ maxHeight: 30, minHeight: 30 });
    $('.draggable-timeline').draggable({ axis: 'x', containment: '#gantt-table-container-id' });



    /// testing scroll values
    var xvar = $('#gantt-table-container-id');
    xvar = xvar.get(0);
    console.log('Yoo hoo!' + ' ' + xvar.scrollLeft + ' ' + xvar.scrollTop + ' ' + xvar.scrollWidth + ' ' + xvar.scrollHeight);

});
