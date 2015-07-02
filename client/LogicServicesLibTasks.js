/**
 * Created by Justin.Ugerio on 7/1/2015.
 */

// LogicServices global namespace var
// Self-calling function
LogicServices.Task = (function () {

    // variable declarations
    var currentTaskCounter = 1,
        numTasks           = 0;


    // function declarations
    var addTask;


    // functions
    /////////////////////////////////////////////
    addTask = function (name, containerID) {

        var container = $('#' + containerID);

    };



    // return object
    /////////////////////////////////////////////
    return {

        addTask: addTask

    };

}) ();
