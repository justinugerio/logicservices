/**
 * Created by Justin.Ugerio on 7/1/2015.
 */

// LogicServices global namespace var
// Self-calling function
LogicServices.Task = (function () {

    // variable declarations
<<<<<<< HEAD
    var currentTaskCounter = 1,
        numTasks           = 0;


    // function declarations
    var addTask;
=======
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
>>>>>>> 4330d84846157b5e9981b54b56b96f2b6420e60c


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

