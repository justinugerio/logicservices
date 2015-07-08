/**
 * Created by Justin.Ugerio on 7/2/2015.
 */

// LogicServices global namespace var
// Self-calling function
LogicServices.EngineerManager = (function () {

    // variable declarations
    var
        // public
        NumEngineers              = 0,
        ListEngineerSets           = [],    // array of EngineerSet objects

        // private
        SelectedEngineerIndex      = -2,    // index of Engineer

        // Class
        EngineerSet;

    // function declarations
    var
        // public
        initialize,
        getEngineerSetByIndex,
        getEngineerSetByName,
        getSelectedEngineerIndex,

        // private
        initEvents,
        selectEngineer,
        unselectEngineer;

    // functions
    /////////////////////////////////////////////

    // initialize engineers
    // takes in a ganttArea object to
    initialize = function (ganttArea) {
        var newEngineerSet;

        for (var i=0; i < ganttArea.ListEngineers.length; i++) {
            newEngineerSet = new EngineerSet(
                                                            i,
                                                            ganttArea.ListEngineers[i],
                                                            ganttArea.ListEngTableHeads[i],
                                                            ganttArea.ListGanttEngAreas[i]);

            ListEngineerSets.push(newEngineerSet);
            NumEngineers = NumEngineers + 1;
        }

        initEvents();

    };

    // initialize events for EngineerSets
    initEvents = function () {

        for (var i=0; i < ListEngineerSets.length; i++) {
            var $engTableHead = ListEngineerSets[i].$engTableHead;

            // event for click to highlight selected engineer
            $engTableHead.click(function() {
                $(this).toggleClass('selected-engineer');

                if ($(this).hasClass('selected-engineer')) {
                    selectEngineer($(this));  // set selected engineer
                }
                else
                {
                    unselectEngineer();    // unset selected engineer
                }
            });
        }
    };

    // get engineer set by Index
    // takes in an Index for the array
    getEngineerSetByIndex = function (index) {
        return ListEngineerSets[index];
    };

    // get engineer set by Engineer Name
    // takes in a string for the engineer name
    getEngineerSetByName = function (name) {

        for (var i=0; i < ListEngineerSets.length; i++) {
            if (name == ListEngineerSets[i].engName) {
                return ListEngineerSets[i];
            }
        }
    };

    // add to ListSelectedEngineers, don't do anything if already exists
    selectEngineer = function ($selectedTableHead) {
        var engName = $('span', $selectedTableHead).text();
        var indexOfSelectedEng = getEngineerSetByName(engName).index;
        var $engTableHead;

        SelectedEngineerIndex = indexOfSelectedEng; // set the selected Engineer

        for (var i=0; i < ListEngineerSets.length; i++) {   // unselect any existing selected Engineers
            if (i != indexOfSelectedEng) {
                $engTableHead = ListEngineerSets[i].$engTableHead;
                $engTableHead.removeClass('selected-engineer');
            }
        }

    };

    // unset SelectedEngineerIndex
    unselectEngineer = function() {

        SelectedEngineerIndex = -1;     // set no Engineer selected

    };

    // return selected Engineer index
    getSelectedEngineerIndex = function () {
        return SelectedEngineerIndex;
    };

    // EngineerSet Class definition
    EngineerSet = function (index, engName, engTableHead, ganttEngArea) {
        this.index = index;
        this.engName = engName;
        this.$engTableHead = engTableHead;
        this.ganttEngArea = ganttEngArea;

    };

    // return object
    /////////////////////////////////////////////
    return {

        NumEngineers: NumEngineers,
        ListEngineerSets: ListEngineerSets,
        initialize: initialize,
        getEngineerSetByIndex: getEngineerSetByIndex,
        getEngineerSetByName: getEngineerSetByName,
        getSelectedEngineerIndex: getSelectedEngineerIndex

    };

}) ();