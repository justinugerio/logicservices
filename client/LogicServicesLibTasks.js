/**
 * Created by Justin.Ugerio on 7/1/2015.
 */

// LogicServices global namespace var
// Self-calling function
LogicServices.Task = (function () {

    // variable declarations
    var
        // public
        NumTasks              = 0,
        ListTasks               = [],

        // private
        currentTaskCounter = 1;


    // function declarations
    var
        // public
        createTask;


    // functions
    /////////////////////////////////////////////

    // create task factory method
    createTask = function (name, engineer) {

        var container = $('#' + containerID);

    };



    // return object
    /////////////////////////////////////////////
    return {

        NumTasks: NumTasks,
        ListTasks: ListTasks,
        createTask: createTask

    };

}) ();

