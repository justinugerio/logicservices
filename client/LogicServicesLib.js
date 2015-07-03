/**
 * Created by Justin.Ugerio on 7/1/2015.
 */

// LogicServices global namespace var
// Self-calling function
LogicServices = (function () {

    // variable declarations
<<<<<<< HEAD
    var Engineers                   = ['Andy James', 'Harold Johnson', 'Lakiesha Hill'],  // default values
        Hours                       = ['8am', '9am', '10am', '11am', '12am', '1pm', '2pm', '3pm', '4pm', '5pm'],  // default values
        GanttAreaBuffer             = {leftBuffer: 3, topBuffer: 3, widthBuffer: 3, heightBuffer: 2},
        TableOffsetElementID        = 'table-offset-element-id',    // id needed to retrieve element to calculate offset;
        ColumnOffsetElementID       = 'column-offset-element-id',   // id needed to retrieve element to calculate offset;
        GanttTableContainerID       = 'gantt-table-container-id',
        GanttTableID                = 'gantt-table-id',
        GanttAreaID                 = 'gantt-area-id',
        TimelineID                  = 'timeline-id',
        GanttEngineerAreaIDPrefix   = 'gantt-engineer-area-id-';
=======
    var
        // public variables
        Engineers                   = ['Andy James', 'Harold Johnson', 'Lakwanda Hill'],  // default values
        Hours                          = ['8am', '9am', '10am', '11am', '12am', '1pm', '2pm', '3pm', '4pm', '5pm'],  // default values
        GanttArea                   = {
                                                $GanttArea : null,
                                                ListGanttEngAreas: [],
                                                $Timeline: null,
                                                Width: 0,
                                                Height: 0
                                            },

        // private
        ganttAreaBuffer            = {leftBuffer: 3, topBuffer: 3, widthBuffer: 3, heightBuffer: 2},
        tableOffsetElementID     = 'table-offset-element-id',    // id needed to retrieve element to calculate offset;
        columnOffsetElementID   = 'column-offset-element-id',   // id needed to retrieve element to calculate offset;
        ganttTableContainerID    = 'gantt-table-container-id',
        ganttTableID                 = 'gantt-table-id',
        ganttAreaID                  = 'gantt-area-id',
        timelineID                    = 'timeline-id',
        ganttEngineerAreaIDPrefix  = 'gantt-engineer-area-id-',

        // private Class
        GanttEngineerArea;
>>>>>>> 4330d84846157b5e9981b54b56b96f2b6420e60c



    // function declarations
<<<<<<< HEAD
    var initTable,
=======
    var
        // public functions
        initialize,
        convertToTwoDigitString,
        getNumberEngineers,
        getNumberHours,

        // private functions
        initTable,
>>>>>>> 4330d84846157b5e9981b54b56b96f2b6420e60c
        initGanttArea,
        initGanttEngineerAreas,
        getGanttOffset,
        getColumnOffset,
<<<<<<< HEAD
        getNumberEngineers,
        getNumberHours,
        addTimeline,
        convertToTwoDigitString;
=======
        addTimeline;

>>>>>>> 4330d84846157b5e9981b54b56b96f2b6420e60c


    // functions
    /////////////////////////////////////////////

    // initialize table, gantt area, and timeline
    initialize = function (engineers, hours) {

        // initialize table
        initTable(engineers, hours);

        // initialize Gantt area
        initGanttArea();

        // add timeline to Gantt area
        addTimeline();

    };

    // initialize table based on engineers and hours provided
    initTable = function (engineers, hours) {

        Engineers = engineers || Engineers;
        Hours = hours || Hours;

<<<<<<< HEAD
        var table = $('#' + GanttTableID);
=======
        var table = $('#' + ganttTableID);
>>>>>>> 4330d84846157b5e9981b54b56b96f2b6420e60c
        var tHeader, tBody, tRow, tHead, tData;

        if (!table) {
            return;
        }

        // table header
        tRow = $('<tr>');
        tHead = $('<th>').text('Engineer');    // initial 'Engineer' heading
        tHead.addClass('col-lg-2');
        tHead.attr('id', tableOffsetElementID);     // set this ID so that we can later retrieve it for configuring the Gantt area
        tRow.append(tHead);

        // for each hour, create a heading for the table
        for (var h = 0; h < hours.length; h++) {
            tHead = $('<th>').text(Hours[h]);
            tHead.addClass('col-lg-1');
            tRow.append(tHead);

            if (h == 0) {
<<<<<<< HEAD
                tHead.attr('id', ColumnOffsetElementID); // set this ID so that we can later retrieve it for Gantt area
=======
                tHead.attr('id', columnOffsetElementID); // set this ID so that we can later retrieve it for Gantt area
>>>>>>> 4330d84846157b5e9981b54b56b96f2b6420e60c
            }
        }

        tHeader = $('<thead>').append(tRow);    // create table header

        // table body
        tBody = $('<tbody>');

        for (var i = 0; i < engineers.length; i++) {
            tRow = $('<tr>');
            tHead = $('<th>').html('<span>' + Engineers[i] + '</span>');
            tHead.addClass('col-lg-2');
            tRow.append(tHead);

            for (var j = 0; j < hours.length; j++) {
                tData = $('<td>').addClass('col-lg-1');
                tRow.append(tData);
            }

            tBody.append(tRow);
        }

        table.append(tHeader).append(tBody);    // insert table header and table body

    };

    // creates a div element on the Gantt table for drag & drop area to work with
    initGanttArea = function () {

        var ganttContainer, ganttOffset, ganttAreaDiv, ganttOffsetX, ganttOffsetY, columnOffset,
            numEngineers, numHours;

<<<<<<< HEAD
        ganttContainer = $('#' + GanttTableContainerID);
=======
        ganttContainer = $('#' + ganttTableContainerID);
>>>>>>> 4330d84846157b5e9981b54b56b96f2b6420e60c

        if (!ganttContainer) {
            return;
        }

        ganttOffset = getGanttOffset();
        ganttOffsetX = ganttOffset.x;
        ganttOffsetY = ganttOffset.y;

        columnOffset = getColumnOffset();

        numEngineers = getNumberEngineers();
        numHours = getNumberHours();

        ganttAreaDiv = $('<div>').addClass('gantt-area');
        ganttAreaDiv.attr('id', ganttAreaID);

        ganttAreaDiv.css({
            'left': (ganttOffsetX + ganttAreaBuffer.leftBuffer) + 'px',
            'top': (ganttOffsetY + ganttAreaBuffer.topBuffer) + 'px',
            'width': ((columnOffset * numHours) + ganttAreaBuffer.widthBuffer) + 'px',
            'height': ((ganttOffsetY * numEngineers) + ganttAreaBuffer.heightBuffer) + 'px'
        });

        ganttContainer.append(ganttAreaDiv);

<<<<<<< HEAD
        initGanttEngineerAreas();
    };

    // creates divs for each engineer within the Gantt area div
    initGanttEngineerAreas = function () {

        var container = $('#' + GanttAreaID);
        var ganttEngineerArea, ganttOffset, count;

        if (!container) {
            return;
        }

        ganttOffset = getGanttOffset();

        for (var i = 0; i < Engineers.length; i++) {

            count = convertToTwoDigitString(i + 1);

            ganttEngineerArea = $('<div>').addClass('gantt-engineer-area');
            ganttEngineerArea.attr('id', GanttEngineerAreaIDPrefix + count);

            ganttEngineerArea.css({
                'height': ganttOffset.y + 1 + 'px',
                'top': ((ganttOffset.y + 1) * i) + 'px'
            });

            container.append(ganttEngineerArea);
        }

    };

=======
        GanttArea.$GanttArea = ganttAreaDiv;
        GanttArea.Width = ganttAreaDiv.outerWidth();
        GanttArea.Height = ganttAreaDiv.outerHeight();

        initGanttEngineerAreas();
    };

    // creates divs for each engineer within the Gantt area div
    initGanttEngineerAreas = function () {

        var container = $('#' + ganttAreaID);
        var ganttEngineerArea, ganttEngineerAreaObj, ganttOffset, count;

        if (!container) {
            return;
        }

        ganttOffset = getGanttOffset();

        for (var i = 0; i < Engineers.length; i++) {

            count = convertToTwoDigitString(i + 1);

            ganttEngineerArea = $('<div>').addClass('gantt-engineer-area');
            ganttEngineerArea.attr('id', ganttEngineerAreaIDPrefix + count);

            ganttEngineerArea.css({
                'height': ganttOffset.y + 1 + 'px',
                'top': ((ganttOffset.y + 1) * i) + 'px'
            });

            container.append(ganttEngineerArea);

            ganttEngineerAreaObj = new GanttEngineerArea(i, Engineers[i], ganttEngineerArea);
            GanttArea.ListGanttEngAreas.push(ganttEngineerAreaObj);

        }

    };

>>>>>>> 4330d84846157b5e9981b54b56b96f2b6420e60c
    // returns the x and y offset for the Gantt area, as object { x: xVal, y: yVal }
    getGanttOffset = function () {

        var returnVal = { x: 0, y: 0 };

        var element = $('#' + tableOffsetElementID);

        if (!element) {
            return returnVal;
        }

        element = element.get(0);
        returnVal.x = element.scrollWidth;
        returnVal.y = element.scrollHeight;

        return returnVal;
    };

    // returns the width offset for a column of the Hours
    getColumnOffset = function () {

        var element = $('#' + columnOffsetElementID);

        if (!element) {
            return 0;
        }

        element = element.get(0);
        return element.scrollWidth;

    };

    // returns the number of Engineers
    getNumberEngineers = function () {
        return Engineers.length;
    };

    // returns the number of Hours
    getNumberHours = function () {
        return Hours.length;
    };

    // add a Timeline to the specified container
    addTimeline = function () {

        var container = $('#' + ganttAreaID);
        var timeline, numEngineers, ganttOffset, heightBuffer, leftBuffer;

        if (!container) {
            return;
        }

<<<<<<< HEAD
        timeline = $('<div>').attr('id', TimelineID).addClass('timeline ui-widget-content draggable-timeline');
=======
        timeline = $('<div>').attr('id', timelineID).addClass('timeline ui-widget-content draggable-timeline');
>>>>>>> 4330d84846157b5e9981b54b56b96f2b6420e60c

        numEngineers = getNumberEngineers();
        ganttOffset = getGanttOffset();
        heightBuffer = 3;
        leftBuffer = -1;
        timeline.css({
            'left': leftBuffer,
            'height': ((ganttOffset.y * numEngineers) + heightBuffer) + 'px'
        });

        container.append(timeline); // add timeline to gantt area container
<<<<<<< HEAD
        $('.draggable-timeline').draggable({ axis: 'x', containment: '#' + GanttAreaID });  // make it draggable
=======
        $('.draggable-timeline').draggable({ axis: 'x', containment: '#' + ganttAreaID });  // make it draggable

        GanttArea.$Timeline = timeline;
>>>>>>> 4330d84846157b5e9981b54b56b96f2b6420e60c

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
<<<<<<< HEAD
=======


    // Class for Gantt Engineer Area
    GanttEngineerArea = function (num, name, $obj) {

        this.Num = num;
        this.EngineerName = name;
        this.$GanttEngineerArea = $obj;

    };
>>>>>>> 4330d84846157b5e9981b54b56b96f2b6420e60c

    // return object
    /////////////////////////////////////////////
    return {

        Engineers: Engineers,
        Hours: Hours,
<<<<<<< HEAD
=======
        GanttArea: GanttArea,
>>>>>>> 4330d84846157b5e9981b54b56b96f2b6420e60c

        initialize: initialize,
        getNumberEngineers: getNumberEngineers,
        getNumberHours: getNumberHours,

        convertToTwoDigitString: convertToTwoDigitString

    };

}) ();



