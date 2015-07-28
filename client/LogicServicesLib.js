/**
 * Created by Justin.Ugerio on 7/1/2015.
 */

// LogicServices global namespace var

// Self-calling function
LogicServices = (function () {

    // variable declarations
    var
        // public variables
        DEBUG = true;     // if true, then write to console where "console.log" is coded

        // private variables


    // function declarations
    var
        // public functions
        initialize,
        convertToTwoDigitString,
        showModalOK,
        showModalOKCancel,
        rearrangeSchedule,
        scheduleReshuffle,
        keypressUnschedule,
        keypressPin,
        showAbout,

        // private functions
        findStartPosition,
        rearrangeTasks,
        keypressUnscheduleCallback,
        keypressPinCallback;


    // functions definitions
    /////////////////////////////////////////////

    // initialize
    initialize = function () {

        /// initialize button event handlers

        // Clear All click event handler
        $('#btn-clear-tasks').click(function () {
            LogicServices.TaskManager.clearAllTasks();
        });

        // Schedule Update - Rearrange Schedule click event handler
        $('#btn-rearrange-schedule').click(function () {
            rearrangeSchedule();
        });

        // Scheduling Workflow - Schedule & Reshuffle click event handler
        $('#btn-schedule-reshuffle').click(function () {
            scheduleReshuffle();
        });

        // Unschedule tasks with keypress
        // Pin selected tasks
        $('body').keypress(function (event) {
            keypressUnschedule(event);
            keypressPin(event);
        });

        // About message
        $('#about-id').click(function () {
            showAbout();
        })

    };

    // utility function that takes in a number and returns leading 0 if less than 10
    convertToTwoDigitString = function (num) {
        if (num < 10 && num > 0) {
            return '0' + num.toString();
        }
        else
        {
            return num.toString();
        }
    };

    // shows small, generic modal with title and message, using bootbox.js
    showModalOK = function (title, message) {
        bootbox.dialog({
            message: message,
            title: title,
            buttons: {
                ok: {
                    label: "OK",
                    className: "btn-primary",
                    callback: function() {
                        // do nothing but close
                    }
                }
            }
        });
    };

    // shows ok/cancel buttons on modal with title and message, using bootbox.js
    showModalOKCancel = function (title, message, callback) {
        bootbox.dialog({
            message: message,
            title: title,
            buttons: {
                ok: {
                    label: "OK",
                    className: "btn-primary",
                    callback: function() {
                        callback(); // if OK pressed, then call callback()
                    }
                },
                cancel: {
                    label: "Cancel",
                    className: "btn-default",
                    callback: function() {
                        // if Cancel pressed, don't do anything
                    }
                }
            }
        });
    };

    // Rearrange Schedule by operating on selected Engineer and rearranging schedule based on current position of Timeline
    rearrangeSchedule = function () {

        var selectedEngineerIndex, $ganttEngArea, ganttEngAreaWidth,
              $timeline, timelinePosLeft,
              taskArray, sortedTaskArray, stopIndex,
              unscheduleTaskArray = [],
              selectedTask, selectedTaskID, selectedTaskEndPosition;

        if (LogicServices.TaskManager.ListSelectedTasks.length != 1) {
            showModalOK('Rearrange Schedule', 'Please select only <strong><em>one</em></strong> Task.');
            return;
        }

        selectedTask = LogicServices.TaskManager.getTaskByID(LogicServices.TaskManager.ListSelectedTasks[0]);
        selectedTaskID = selectedTask.taskID;

        if (!selectedTask.scheduled) {
            showModalOK('Rearrange Schedule', 'Please select a <strong><em>Scheduled</em></strong> Task.');
            return;
        }

        // get width of ganttEngArea
        $ganttEngArea = selectedTask.$assignedArea;
        ganttEngAreaWidth = $ganttEngArea.innerWidth();

        // get 'left' position of timeline
        $timeline = LogicServices.GanttManager.GanttArea.$Timeline;
        timelinePosLeft = $timeline.position().left;

        // get 'left' position of end of selected Task
        selectedTaskEndPosition = selectedTask.posLeft + selectedTask.width;

        // get all task assigned to engineer
        selectedEngineerIndex = LogicServices.EngineerManager.getEngineerIndexByGanttEngAreaID($ganttEngArea.attr('id'));
        taskArray = LogicServices.TaskManager.getTasksAssignedToEng(selectedEngineerIndex);

        // sort tasks by 'left' position
        sortedTaskArray = LogicServices.TaskManager.sortTasksByPosLeft(taskArray);

        // place tasks starting with 'left' position of timeline on engineer gantt area
        stopIndex = rearrangeTasks(selectedTaskID, selectedTaskEndPosition, timelinePosLeft, ganttEngAreaWidth, sortedTaskArray); // use sortedTaskArray

        // unschedule all other tasks that don't fit
        if (stopIndex < sortedTaskArray.length) {

            LogicServices.showModalOK('Rearrange Schedule', 'Unscheduling ' + (sortedTaskArray.length - stopIndex) + ' tasks');

            // add to unschedule task list
            for (var i=stopIndex; i < sortedTaskArray.length; i++) {
                unscheduleTaskArray.push(sortedTaskArray[i].taskID);
            }

            // unschedule tasks in list
            LogicServices.TaskManager.unscheduleTask(unscheduleTaskArray);
        }

    };

    // place tasks on eng gantt area starting at timeline up to end of eng gantt are space
    rearrangeTasks = function (taskID, taskEndPos, timelinePos, ganttWidth, taskArray) {
        var task, $task, taskWidth, startPosition, scheduleSpaceWidth, currSpace, currPos;

        startPosition = findStartPosition(taskEndPos, timelinePos, taskArray);

        // and calculate how much space left to schedule
        scheduleSpaceWidth = ganttWidth - startPosition;
        currPos = startPosition;
        currSpace = scheduleSpaceWidth;

        for (var j=0; j < taskArray.length; j++) {
            task = taskArray[j];

            if (task.posLeft > taskEndPos) {  // (was startPosition) select tasks that are after timeline or selected task end position
                if (task.taskID != taskID) {    // do not move selected task
                    if (task.pinned == false) { // do not move pinned tasks
                        $task = task.$task;
                        $task.css('position', 'static');    // reset positions to clear and correct
                        $task.css( {left: 0, top: 0} );
                    }
                }
            }

        }

        for (var i=0; i < taskArray.length; i++) {
            task = taskArray[i];

            if (task.posLeft > taskEndPos) {  // (was startPosition) select tasks that are after timeline or selected task end position

                if (task.taskID != taskID) {  // do not move selected task
                    if (task.pinned == false) { // do not move pinned tasks
                        $task = task.$task;

                        taskWidth = $task.outerWidth();
                        $task.css('position', 'absolute');  // set back to absolute

                        if ((currSpace - taskWidth) > 0) {
                            $task.css({ left: currPos });
                            task.posLeft = currPos;

                            currPos = currPos + taskWidth;    // advance currPos
                            currSpace = currSpace - taskWidth;  // shrink currSpace
                        }
                        else {
                            return i;   // return index where it can't schedule
                        }
                    }
                }
            }
        }

        return i; // return last index, which is being incremented even after the loop finishes
    };

    // find start position by using selected task, timeline, or any other task overlapping timeline
    findStartPosition = function (taskEndPos, timelinePos, taskArray) {
        var startPosition, task, taskPosWithWidth;

        startPosition = (taskEndPos > timelinePos) ? taskEndPos : timelinePos;  // initially set startPos to the greater of the two

        for (var i = 0; i < taskArray.length; i++) {
            task = taskArray[i];
            taskPosWithWidth = task.posLeft + task.width;

            if ( (task.posLeft < timelinePos) && (taskPosWithWidth > startPosition) ) { // if task is overlapping timeline AND the endPos > current startPosition
                startPosition = taskPosWithWidth;   // set new startPos
            }
        }

        return startPosition;
    };

    // Schedule and Reshuffle by attempting to schedule task and move other tasks around
    scheduleReshuffle = function () {

        showModalOK('Under Construction', 'Under Construction!');

    };

    // Unschedule selected assignments when key 'u' is pressed
    keypressUnschedule = function (event) {

        // 'u' char code is 117
        if (event.which == 117) {

            // validate at least 1 selected Task
            if (LogicServices.TaskManager.ListSelectedTasks.length < 1) {
                LogicServices.showModalOK('Unschedule Task', 'Please select at least one Task.');
                return;
            }

            showModalOKCancel('Unschedule Selected Tasks', 'Are you sure you wish to unschedule selected tasks?', keypressUnscheduleCallback);
        }

    };

    // callback function to unschedule tasks
    keypressUnscheduleCallback = function () {
        try
        {
            // unschedule task here
            LogicServices.TaskManager.unscheduleTask(LogicServices.TaskManager.ListSelectedTasks);
        }
        catch (err) {
            LogicServices.showModalOK('Error Unscheduling Task', err.message);
        }
    };

    // Pin tasks from Selected Tasks List when key 'p' is pressed
    keypressPin = function (event) {
        // 'p' char code is 112
        if (event.which == 112) {

            // validate at least 1 selected Task
            if (LogicServices.TaskManager.ListSelectedTasks.length < 1) {
                LogicServices.showModalOK('Pin Task', 'Please select at least one Task.');
                return;
            }

            showModalOKCancel('Pin Selected Tasks', 'Are you sure you wish to pin/unpin selected tasks?', keypressPinCallback);
        }

    };

    // callback for Pinning tasks
    keypressPinCallback = function () {
        try
        {
            // pin tasks here
            LogicServices.TaskManager.pinTask(LogicServices.TaskManager.ListSelectedTasks);
        }
        catch (err) {
            LogicServices.showModalOK('Error Pinning Task', err.message);
        }

    };

    // show About screen
    showAbout = function () {
        showModalOK('About', '<img class="img-responsive center-block" src="favicon.png" alt="Image Here"><br>' +
        '<div class="text-center"><em><strong>Copyright &copy; Justin Ugerio, 2015</strong></em></div>');
    };


    // return object
    /////////////////////////////////////////////
    return {

        // properties
        DEBUG: DEBUG,

        // methods
        initialize: initialize,
        showModalOK: showModalOK,
        showModalOKCancel: showModalOKCancel,
        convertToTwoDigitString: convertToTwoDigitString,
        rearrangeSchedule: rearrangeSchedule,
        scheduleReshuffle: scheduleReshuffle,
        keypressUnschedule: keypressUnschedule,
        keypressPin: keypressPin,
        showAbout: showAbout

    };

}) ();

