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
        createAssignment,
        constructTask,
        unscheduleTask,
        rescheduleTask,
        rescheduleTaskDragAndDrop,
        getTaskByID,
        clearAllTasks,
        getTasksAssignedToEng,
        sortTasksByPosLeft,
        pinTask,

        // private
        selectTask,
        unselectTask,
        isSelectTask,
        getIndexOfLowestPosLeft,

        // Class
        Task;


    // functions
    /////////////////////////////////////////////

    // initialize TaskManager
    initialize = function () {

        // initialize create task button event
        $('#btn-create-task').click(function () {

            try
            {
                // create task here
                createTask();

                // update number of tasks badge
                $('#num-tasks-badge-id').text(NumTasks);
            }
            catch (err) {
                LogicServices.showModalOK('Error Creating Task', err.message);
            }

        });

        // initialize create assignment button event
        $('#btn-create-assignment').click(function () {

            var selectedEngineer = LogicServices.EngineerManager.getSelectedEngineerIndex();

            // validate only 1 Engineer selected
            if (selectedEngineer < 0) {
                LogicServices.showModalOK('Create Assignment', 'Please select an Engineer.');
                return;
            }

            try
            {
                // create task here
                createAssignment(selectedEngineer);

                // update number of tasks badge
                $('#num-tasks-badge-id').text(NumTasks);
            }
            catch (err) {
                LogicServices.showModalOK('Error Creating Assignment', err.message);
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
    createTask = function () {

        var $task, task, taskNum, $ganttStagingArea;

        taskNum = currentTaskCounter;
        $ganttStagingArea = LogicServices.GanttManager.GanttArea.$GanttStagingArea;

        $task = constructTask(taskNum);

        $ganttStagingArea.append($task);    // add $task to gantt engineer area

        task = new Task(taskNum, $task.attr('id'), $task, $ganttStagingArea);   // create task object
        $task.css({ left: task.posLeft, top: task.posTop });    // set left and top default positions
        ListTasks.push(task);       // add task to list of Task objects

        NumTasks++;     // increment counters
        currentTaskCounter++;

    };

    // create task assigned to specified engineer
    createAssignment = function (engNum) {

        var $task, task, taskNum, $assignedArea, assignedAreaID;

        taskNum = currentTaskCounter;
        $assignedArea = LogicServices.EngineerManager.ListEngineerSets[engNum].ganttEngArea.$GanttEngineerArea;
        assignedAreaID = $assignedArea.attr('id');
        //height = $assignedArea.innerHeight();

        $task = constructTask(taskNum);

        $assignedArea.append($task);    // add $task to gantt engineer area

        $task.draggable({
            axis: 'x',
            containment: '#' + assignedAreaID });  // set draggable axis and draggable area

        task = new Task(taskNum, $task.attr('id'), $task, $assignedArea);   // create task object
        $task.css({ left: task.posLeft, top: task.posTop });    // set left and top default positions
        ListTasks.push(task);       // add task to list of Task objects

        NumTasks++;     // increment counters
        currentTaskCounter++;

    };

    // construct task with taskID
    constructTask = function (taskNum) {

        var $task, height = 38;     // height of draggable tasks, in pixels
        var taskID = "task-id-" + taskNum;

        $task = $('<div>');  // create task div
        $task.attr('id', taskID);   // set task dom ID
        $task.addClass('ui-widget-content draggable-task'); // set class as JQuery UI draggable
        $task.html('<strong class="text-nowrap">' + 'Task ' + taskNum + '</strong>');    // set display text value

        $task.draggable({   distance: 10,
            snap: '.gantt-engineer-area',
            snapMode: 'inner',
            revert: 'invalid',
            axis: 'xy',
            containment: false
        });  // set draggable axis and draggable area

        $task.resizable({
            maxHeight: height,
            minHeight: height,

            stop: function (event, ui) {
                var $this = $(this);
                var id = $this.attr('id');
                var task = getTaskByID(id);

                task.width = ui.size.width;

                if (LogicServices.DEBUG) {
                    console.log('Task ' + id + ' Width: ' + task.width);
                }
            }

        }); // set min/max resize

        $task.css({
            height: height + 'px'
        });

        $task.draggable({
            stop: function () {         // the 'stop' callback is invoked when user stops dragging task
                var $this = $(this);
                var id = $this.attr('id');
                var task = getTaskByID(id);
                var $ganttEngArea = task.$assignedArea;
                var ganttEngAreaID = $ganttEngArea.attr('id');

                if (ganttEngAreaID != 'gantt-staging-area-id') {
                    task.posLeft = $this.position().left;
                    task.posTop = $this.position().top;
                }
                else{
                    task.posLeft = 0;
                    task.posTop = 0;
                }

                if (LogicServices.DEBUG) {
                    console.log('Task ' + id + ' coordinates - Left: ' + $this.position().left + ' Top: ' + $this.position().top);
                }
            }

        }); // set event to write left and top coordinates

        // event for click to highlight selected task
        $task.click(function() {     // click or dblclick
            $(this).toggleClass('selected-task');

            if ($(this).hasClass('selected-task')) {
                selectTask($(this));  // add to ListSelectedTasks
            }
            else
            {
                unselectTask($(this));    // remove from ListSelectedTasks
            }
        });

        return $task;
    };

    // unschedule tasks from Gantt and place in GanttStagingArea
    unscheduleTask = function (selectedTasks) {
        var $task, $taskDetach, task, taskID, $ganttStagingArea, ganttStagingAreaID;
        var listToRemove = [];

        for (var i=0; i < selectedTasks.length; i++) {
            taskID = selectedTasks[i];
            $task = $('#' + taskID);
            task = getTaskByID(taskID);

            if ($task[0]) {

                // check if task is pinned
                if (task.pinned) {
                    continue;   // don't unschedule if pinned
                }

                $taskDetach = null;
                $ganttStagingArea = LogicServices.GanttManager.GanttArea.$GanttStagingArea; // check where task is first

                if (task.$assignedArea.attr('id') == $ganttStagingArea.attr('id')) {    // if already in Gantt Staging Area, then skip
                    continue;
                }

                $taskDetach = $task.detach();   // remove from Gantt Area

                $ganttStagingArea.append($taskDetach);  // move to Gantt Staging Area
                task.$assignedArea = $ganttStagingArea;  // set task to new drag area

                ganttStagingAreaID = $ganttStagingArea.attr('id');

                $taskDetach.draggable( {  axis: 'xy',
                                                            containment: false // '#' + ganttStagingAreaID
                                                        } );   // set axes of motion and containment

                //$taskDetach.resizable( { containment: '#' + ganttStagingAreaID } );  // set containment and max/min for resizing

                $taskDetach.removeClass('selected-task');   // unselect task
                $taskDetach.css({ top: '0px', left: '0px'});    // place to top/left as much as possible
                listToRemove.push($taskDetach);      // mark to remove from Selected Tasks list

            }
        }

        // remove all marked tasks from Selected Tasks list
        for (var j=0; j < listToRemove.length; j++) {
            unselectTask(listToRemove[j]);
        }

    };

    // reschedule tasks to specified engineer
    rescheduleTask = function (engNum, selectedTasks) {
        var $task, $taskDetach, task, taskID, $ganttStagingArea,
                engineerSet, $ganttEngArea, ganttEngAreaID;
        var listToRemove = [];

        for (var i=0; i < selectedTasks.length; i++) {
            taskID = selectedTasks[i];
            $task = $('#' + taskID);
            task = getTaskByID(taskID);

            if ($task[0]) {

                $taskDetach = null;
                $ganttStagingArea = LogicServices.GanttManager.GanttArea.$GanttStagingArea; // check where task is first

                if (task.$assignedArea.attr('id') != $ganttStagingArea.attr('id')) {    // if not in Gantt Staging Area, then skip
                    continue;
                }

                $taskDetach = $task.detach();   // remove from Gantt Staging Area

                engineerSet = LogicServices.EngineerManager.getEngineerSetByIndex(engNum);  // get selected Engineer Set object
                $ganttEngArea = engineerSet.ganttEngArea.$GanttEngineerArea;    // get $GanttEngineerArea jqobject
                $ganttEngArea.append($taskDetach);  // move to Gantt Engineer Area
                task.$assignedArea = $ganttEngArea;  // set task to new drag area

                ganttEngAreaID = $ganttEngArea.attr('id');
                $taskDetach.draggable({
                    axis: 'x',
                    containment: '#' + ganttEngAreaID
                });   // set axes of motion and containment

                $taskDetach.removeClass('selected-task');   // unselect task
                $taskDetach.css({ top: '0px', left: '0px'});    // schedule to top/left as much as possible
                listToRemove.push($taskDetach);      // mark to remove from Selected Tasks list

            }
        }

        // remove all marked tasks from Selected Tasks list
        for (var j=0; j < listToRemove.length; j++) {
            unselectTask(listToRemove[j]);
        }

    };


    // reschedule task to GanttEngArea from drag & drop
    rescheduleTaskDragAndDrop = function ($ganttEngArea, $task) {

        var $newTask, task, assignedAreaID, taskWidth, dropPositionLeft, isSelected;

        task = LogicServices.TaskManager.getTaskByID($task.attr('id'));
        assignedAreaID = task.$assignedArea.attr('id');

        if (assignedAreaID == 'gantt-staging-area-id') {

            dropPositionLeft = $task.offset().left - $ganttEngArea.offset().left;   // task.offset.left - ganttengarea.offset.left => offset is global location from window

            taskWidth = task.width;
            isSelected = isSelectTask($task);
            $task.remove(); // remove old task

            // create new one and replace it
            $newTask = LogicServices.TaskManager.constructTask(task.taskNum, $ganttEngArea.attr('id'));
            $newTask.css('width', taskWidth);
            $newTask.css('left', dropPositionLeft);

            $newTask.draggable({
                axis: 'x',
                containment: '#' + $ganttEngArea.attr('id')
            });   // set axes of motion and containment

            if (isSelected) {
                $newTask.addClass('selected-task');
            }

            // set task properties
            task.$task = $newTask;
            task.$assignedArea = $ganttEngArea;
            task.posLeft = dropPositionLeft;

            $ganttEngArea.append($newTask); // add it to ganttEngArea

        }

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

    // returns boolean if task is selected
    isSelectTask = function($task) {
        var taskID = $task.attr('id');
        var indexInList = ListSelectedTasks.indexOf(taskID);

        return indexInList > -1;

    };

    // clear all tasks by removing task and resetting counters
    clearAllTasks = function () {

        var task, $task;

        for (var i=0; i < ListTasks.length; i++) {
            task = ListTasks[i];
            $task = $('#' + task.taskID).remove();
        }

        ListTasks = [];
        ListSelectedTasks = [];
        NumTasks = 0;
        currentTaskCounter = 1;

        // update number of tasks badge
        $('#num-tasks-badge-id').text('');

    };

    // return array of Task objects assigned to specified Engineer Index
    getTasksAssignedToEng = function (engIndex) {
        var taskArray = [], engineerSet, $ganttEngArea, ganttEngAreaID,
              $taskGanttEngArea;

        engineerSet = LogicServices.EngineerManager.getEngineerSetByIndex(engIndex);
        $ganttEngArea = engineerSet.$ganttEngArea;
        ganttEngAreaID = $ganttEngArea.attr('id');  // get ganttEngAreaID of specified eng index

        for (var i=0; i < ListTasks.length; i++) {
            $taskGanttEngArea = ListTasks[i].$assignedArea;

            if ($taskGanttEngArea.attr('id') == ganttEngAreaID) { // if task ganttEngArea matches
                taskArray.push(ListTasks[i]);
            }
        }

        return taskArray;
    };

    // sorts elements in taskArray by position left, returns sorted array
    sortTasksByPosLeft = function (taskArray) {

        var task, sortedArray = [], lowestIndex;

        while (taskArray.length > 0) {

            // find minimum index in task array
            lowestIndex = getIndexOfLowestPosLeft(taskArray);
            task = taskArray[lowestIndex];

            // pop task of index from task array
            taskArray.splice(lowestIndex, 1);

            // push popped task into sortedArray
            sortedArray.push(task);

        }

        return sortedArray;

    };

    // get the index of element with lowest left position
    getIndexOfLowestPosLeft = function (taskArray) {

        var lowestIndex = -1, leftValue, lowestLeftValue;

        if (taskArray.length == 0) {
            return lowestIndex;
        }

        if (taskArray.length == 1) {
            return 0;
        }

        lowestIndex = 0;
        lowestLeftValue = taskArray[lowestIndex].posLeft;  // task.posLeft

        for (var i=0; i < taskArray.length; i++) {
            leftValue = taskArray[i].posLeft;  // task.posLeft

            if (leftValue < lowestLeftValue) {
                lowestIndex = i;
                lowestLeftValue = leftValue;
            }
        }

        return lowestIndex;

    };

    // Pin tasks from selected tasks list
    pinTask = function () {

        var $task, task, taskID;

        for (var i=0; i < ListSelectedTasks.length; i++) {
            taskID = ListSelectedTasks[i];
            $task = $('#' + taskID);
            task = getTaskByID(taskID);

            if ($task[0]) {

                if (task.pinned) {  // if task is already pinned, unpin it
                    task.pinned = false;

                    $task.resizable({ disabled: false });
                    $task.draggable( { disabled: false } );
                }
                else {  // otherwise pin it
                    task.pinned = true;

                    $task.resizable({ disabled: true });
                    $task.draggable( { disabled: true } );
                }

                $task.toggleClass('pinned-task');
            }
        }

    };

    ////////////////////////////////////////////////////////////////////////
    // Task class
    Task = function (taskNum, taskID, task, assignedArea) {
        this.taskNum = taskNum;
        this.taskID = taskID;
        this.$task = task;
        this.$assignedArea = assignedArea;
        this.posLeft = 0;
        this.posTop = 0;
        this.width = 80;    // default task width
        this.pinned = false;
    };


    ///////////////////////////////////////////////////////////////////////
    // return object
    return {

        NumTasks: NumTasks,
        ListTasks: ListTasks,
        ListSelectedTasks: ListSelectedTasks,
        initialize: initialize,
        createTask: createTask,
        createAssignment: createAssignment,
        constructTask: constructTask,
        unscheduleTask: unscheduleTask,
        rescheduleTask: rescheduleTask,
        rescheduleTaskDragAndDrop: rescheduleTaskDragAndDrop,
        getTaskByID: getTaskByID,
        clearAllTasks: clearAllTasks,
        getTasksAssignedToEng: getTasksAssignedToEng,
        sortTasksByPosLeft: sortTasksByPosLeft,
        pinTask: pinTask

    };

}) ();

