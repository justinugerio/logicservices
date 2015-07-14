/**
 * Created by Justin.Ugerio on 7/1/2015.
 */

// LogicServices global namespace var

// Self-calling function
LogicServices = (function () {

    // variable declarations
    var
        // public variables
        DEBUG = false;     // if true, then write to console where "console.log" is coded

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

        // private functions
        rearrangeTasks;


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
                        callback();
                    }
                },
                cancel: {
                    label: "Cancel",
                    className: "btn-default",
                    callback: function() {
                        // do nothing but close
                    }
                }
            }
        });
    };

    // Rearrange Schedule by operating on selected Engineer and rearranging schedule based on current position of Timeline
    rearrangeSchedule = function () {

        //showModalOK('Under Construction', 'Under Construction!');

        var selectedEngineerIndex, engineerSet, $ganttEngArea, ganttEngAreaWidth,
              $timeline, timelinePosLeft, scheduleSpaceWidth,
              //sortedTaskArray,
              taskArray, stopIndex,
              unscheduleTaskArray = [];

        // validate selected engineer
        selectedEngineerIndex = LogicServices.EngineerManager.getSelectedEngineerIndex();

        if (selectedEngineerIndex < 0) {
            showModalOK('Rearrange Schedule', 'Please select an Engineer.');
            return;
        }

        // get width of ganttEngArea
        engineerSet = LogicServices.EngineerManager.getEngineerSetByIndex(selectedEngineerIndex);
        $ganttEngArea = engineerSet.$ganttEngArea;
        ganttEngAreaWidth = $ganttEngArea.innerWidth();

        // get 'left' position of timeline, and calculate how much space left to schedule
        $timeline = LogicServices.GanttManager.GanttArea.$Timeline;
        timelinePosLeft = $timeline.position().left;
        scheduleSpaceWidth = ganttEngAreaWidth - timelinePosLeft;

        // get all task assigned to engineer
        taskArray = LogicServices.TaskManager.getTasksAssignedToEng(selectedEngineerIndex);

        // sort tasks by 'left' position
        /// do not sort because the 'left' position doesn't seem to be correct
        //taskArray = LogicServices.TaskManager.sortTasksByPosLeft(taskArray);

        // place tasks starting with 'left' position of timeline on engineer gantt area
        stopIndex = rearrangeTasks(timelinePosLeft, scheduleSpaceWidth, taskArray); // use taskArray instead of sortedTaskArray

        // unschedule all other tasks that don't fit
        if (stopIndex < taskArray.length) {

            LogicServices.showModalOK('Rearrange Schedule', 'Unscheduling ' + (taskArray.length - stopIndex) + ' tasks');

            // add to unschedule task list
            for (var i=stopIndex; i < taskArray.length; i++) {
                unscheduleTaskArray.push(taskArray[i].taskID);
            }

            // unschedule tasks in list
            LogicServices.TaskManager.unscheduleTask(unscheduleTaskArray);
            
        }

    };

    // place tasks on eng gantt area starting at timeline up to end of eng gantt are space
    rearrangeTasks = function (timelinePos, scheduleSpace, taskArray) {
        var task, $task, taskWidth,
              currSpace = scheduleSpace;

        for (var i=0; i < taskArray.length; i++) {
            task = taskArray[i];
            $task = task.$task;

            taskWidth = $task.outerWidth();

            if ((currSpace - taskWidth) > 0) {
                $task.css({ left: timelinePos });

                //currPos = currPos + taskWidth;    // no need to advance currPos since setting css left position will not overlap
                currSpace = currSpace - taskWidth;
            }
            else {
                return i;   // return index where it can't schedule
            }
        }

        return i; // return last index, which is being incremented even after the loop finishes
    };

    // Schedule and Reshuffle by attempting to schedule task and move other tasks around
    scheduleReshuffle = function () {

        showModalOK('Under Construction', 'Under Construction!');

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
        scheduleReshuffle: scheduleReshuffle

    };

}) ();

