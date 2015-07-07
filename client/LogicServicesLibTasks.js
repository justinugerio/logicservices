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
        ListSelectedTasks   = [],   // array of Strings of IDs

        // private
        currentTaskCounter = 1;


    // function declarations
    var
        // public
        initialize,
        createTask,
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

            var listSelectedEngineers = LogicServices.EngineerManager.ListSelectedEngineers;

            // validate only 1 Engineer selected
            if (listSelectedEngineers.length == 0) {
                LogicServices.showModalSmallGeneric('Create Task', 'Please select an Engineer.');
                return;
            }
            else if (listSelectedEngineers.length > 1) {
                LogicServices.showModalSmallGeneric('Create Task', 'Please select only ' + '<em>one</em>' + ' Engineer.');
                return;
            }

            // keep as for loop for now in case we want to perform operation on multiple engineers
            for (var i=0; i < listSelectedEngineers.length; i++) {

                try
                {
                    createTask(currentTaskCounter, listSelectedEngineers[i]);
                    NumTasks++;
                    currentTaskCounter++;
                }
                catch (err) {
                    LogicServices.showModalSmallGeneric('Error Creating Task', err.message);
                }

            }

        });

    };

    // create task factory method
    createTask = function (taskNum, engNum) {

        var taskID, $task, task, $assignedArea, assignedAreaID;

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
                stop: function () {
                    var $this = $(this);
                    var id = $this.attr('id');

                    if (LogicServices.DEBUG) {
                        console.log('Task ' + id + ' coordinates - Left: ' + $this.position().left + ' Top: ' + $this.position().top);
                        //$this.css({ left: 0 });
                    }

                }

        }); // set event to write left and top coordinates

        // event for click to highlight selected task
        $task.dblclick(function() {
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

