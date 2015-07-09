/**
 * Created by Justin.Ugerio on 7/1/2015.
 */

// LogicServices global namespace var
// Self-calling function
LogicServices.TaskManager = (function () {

    // variable declarations
    var
        // public
        NumTasks              = 0,
        ListTasks               = [],   // array of Task class
        ListSelectedTasks   = [],   // array of Strings of IDs - 'task-id-x'

        // private
        currentTaskCounter = 1;


    // function declarations
    var
        // public
        initialize,
        createTask,
        unscheduleTask,
        rescheduleTask,
        getTaskByID,

        // private
        selectTask,
        unselectTask,

        // Class
        Task;


    // functions
    /////////////////////////////////////////////

    // initialize TaskManager
    initialize = function () {

        // initialize create task button event
        $('#btn-create-task').click(function () {

            var selectedEngineer = LogicServices.EngineerManager.getSelectedEngineerIndex();

            // validate only 1 Engineer selected
            if (selectedEngineer < 0) {
                LogicServices.showModalOK('Create Task', 'Please select an Engineer.');
                return;
            }

            try
            {
                // create task here
                createTask(selectedEngineer);
            }
            catch (err) {
                LogicServices.showModalOK('Error Creating Task', err.message);
            }

        });

        // initialize unschedule task button event
        $('#btn-unschedule-task').click(function () {

            // validate at least 1 selected Task
            if (ListSelectedTasks.length < 1) {
                LogicServices.showModalOK('Unschedule Task', 'Please select at least one Task.');
                return;
            }

            try
            {
                // unschedule task here
                unscheduleTask(ListSelectedTasks);
            }
            catch (err) {
                LogicServices.showModalOK('Error Unscheduling Task', err.message);
            }

        });

        // initialize reschedule task button event
        $('#btn-reschedule-task').click(function () {

            var selectedEngineer = LogicServices.EngineerManager.getSelectedEngineerIndex();

            // validate only 1 Engineer selected
            if (selectedEngineer < 0) {
                LogicServices.showModalOK('Reschedule Task', 'Please select an Engineer.');
                return;
            }

            // validate at least 1 selected Task
            if (ListSelectedTasks.length < 1) {
                LogicServices.showModalOK('Unschedule Task', 'Please select at least one Task.');
                return;
            }

            try
            {
                // reschedule task here
                rescheduleTask(selectedEngineer, ListSelectedTasks);
            }
            catch (err) {
                LogicServices.showModalOK('Error Rescheduling Task', err.message);
            }

        });

    };

    // create task factory method
    createTask = function (engNum) {

        var taskID, $task, task, taskNum, $assignedArea, assignedAreaID;

        taskNum = currentTaskCounter;
        taskID = "task-id-" + taskNum;
        $assignedArea = LogicServices.EngineerManager.ListEngineerSets[engNum].ganttEngArea.$GanttEngineerArea;
        assignedAreaID = $assignedArea.attr('id');

        $task = $('<div>');  // create task div
        $task.attr('id', taskID);   // set task dom ID
        $task.addClass('ui-widget-content draggable-task'); // set class as JQuery UI draggable
        $task.html('<p><strong>' + 'Task ' + taskNum + '</strong></p>');    // set display text value

        $task.draggable({ axis: 'x', containment: '#' + assignedAreaID })
            .resizable({ maxHeight: 36, minHeight: 36 });       // set draggable axis, draggable area, and min/max size

        $task.draggable({
                stop: function () {         // the 'stop' callback is invoked when user stops dragging task
                    var $this = $(this);
                    var id = $this.attr('id');

                    if (LogicServices.DEBUG) {
                        console.log('Task ' + id + ' coordinates - Left: ' + $this.position().left + ' Top: ' + $this.position().top);
                    }
                }

        }); // set event to write left and top coordinates

        // event for click to highlight selected task
        $task.dblclick(function() {     // click or dblclick
            $(this).toggleClass('selected-task');

            if ($(this).hasClass('selected-task')) {
                selectTask($(this));  // add to ListSelectedTasks
            }
            else
            {
                unselectTask($(this));    // remove from ListSelectedTasks
            }
        });

        $assignedArea.append($task);    // add $task to gantt engineer area

        task = new Task(taskID, $assignedArea, $task);   // create task object
        ListTasks.push(task);       // add task to list of Task objects

        NumTasks++;     // increment counters
        currentTaskCounter++;

    };


    // unschedule tasks from Gantt and place in GanttStagingArea
    unscheduleTask = function (selectedTasks) {
        var $task, $taskDetach, task, taskID, $ganttStagingArea, ganttStagingAreaID;
        var listToRemove = [];

        for (var i=0; i < ListSelectedTasks.length; i++) {
            taskID = ListSelectedTasks[i];
            $task = $('#' + taskID);
            task = getTaskByID(taskID);

            if ($task[0]) {

                $taskDetach = null;
                $ganttStagingArea = LogicServices.GanttManager.GanttArea.$GanttStagingArea; // check where task is first

                if (task.$assignedArea.attr('id') == $ganttStagingArea.attr('id')) {    // if already in Gantt Staging Area, then skip
                    continue;
                }

                $taskDetach = $task.detach();   // remove from Gantt Area

                $ganttStagingArea.append($taskDetach);  // move to Gantt Staging Area
                task.$assignedArea = $ganttStagingArea;  // set task to new drag area

                ganttStagingAreaID = $ganttStagingArea.attr('id');
                $taskDetach.draggable({ axis: 'xy', containment: '#' + ganttStagingAreaID });   // set axes of motion and containment

                $taskDetach.removeClass('selected-task');   // unselect task
                $taskDetach.css({ 'top': '0px', 'left': '0px'});
                listToRemove.push($taskDetach);      // mark to remove from Selected Tasks list

            }
        }

        // remove all marked tasks from Selected Tasks list
        for (var i=0; i < listToRemove.length; i++) {
            unselectTask(listToRemove[i]);
        }

    };

    // reschedule tasks to specified engineer
    rescheduleTask = function (engNum, selectedTasks) {


    };


    // get Task object by id
    getTaskByID = function (taskID) {

        for (var i=0; i < ListTasks.length; i++) {
            if (taskID == ListTasks[i].taskID) {
                return ListTasks[i];
            }
        }
    };


    // add to ListSelectedTasks, don't do anything if already exists
    selectTask = function ($selectedTask) {
        var taskID = $selectedTask.attr('id');

        if (ListSelectedTasks.indexOf(taskID) == -1) {
            ListSelectedTasks.push(taskID);
        }
    };

    // remove from ListSelectedTasks, don't do anything if already removed
    unselectTask = function($selectedTask) {
        var taskID = $selectedTask.attr('id');
        var indexInList = ListSelectedTasks.indexOf(taskID);

        if (indexInList > -1) {
            ListSelectedTasks.splice(indexInList, 1);
        }
    };

    // Task Class
    Task = function (taskID, assignedArea, jqObject) {
        this.taskID = taskID;
        this.$assignedArea = assignedArea;
        this.$task = jqObject;
    };


    // return object
    /////////////////////////////////////////////
    return {

        NumTasks: NumTasks,
        ListTasks: ListTasks,
        initialize: initialize,
        createTask: createTask,
        getTaskByID: getTaskByID

    };

}) ();

