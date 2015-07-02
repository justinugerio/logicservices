/**
 * Created by Justin.Ugerio on 7/2/2015.
 */

// LogicServices global namespace var
// Self-calling function
LogicServices.Engineer = (function () {

    // variable declarations
    var
        // public
        NumEngineers              = 0,
        ListEngineers               = [];


    // function declarations
    var
        // public
        createEngineer;


    // functions
    /////////////////////////////////////////////

    // create engineer factory method
    createEngineer = function (name) {

        var container = $('#');

    };



    // return object
    /////////////////////////////////////////////
    return {

        NumEngineers: NumEngineers,
        ListEngineers: ListEngineers,
        createEngineers: createEngineer

    };

}) ();