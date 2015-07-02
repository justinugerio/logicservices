/**
 * Created by Justin.Ugerio on 7/1/2015.
 */

// LogicServices global namespace var
// Self-calling function
LogicServices = (function () {

    // variable declarations
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



    // function declarations
    var initTable,
        initGanttArea,
        initGanttEngineerAreas,
        getGanttOffset,
        getColumnOffset,
        getNumberEngineers,
        getNumberHours,
        addTimeline,
        convertToTwoDigitString;


    // functions
    /////////////////////////////////////////////

    // initialize table based on engineers and hours provided
    initTable = function (engineers, hours) {

        Engineers = engineers;
        Hours = hours;

        var table = $('#' + GanttTableID);
        var tHeader, tBody, tRow, tHead, tData;

        if (!table) {
            return;
        }

        // table header
        tRow = $('<tr>');
        tHead = $('<th>').text('Engineer');    // initial 'Engineer' heading
        tHead.addClass('col-lg-2');
        tHead.attr('id', TableOffsetElementID);     // set this ID so that we can later retrieve it for configuring the Gantt area
        tRow.append(tHead);

        // for each hour, create a heading for the table
        for (var h = 0; h < hours.length; h++) {
            tHead = $('<th>').text(Hours[h]);
            tHead.addClass('col-lg-1');
            tRow.append(tHead);

            if (h == 0) {
                tHead.attr('id', ColumnOffsetElementID); // set this ID so that we can later retrieve it for Gantt area
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

        ganttContainer = $('#' + GanttTableContainerID);

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
        ganttAreaDiv.attr('id', GanttAreaID);

        ganttAreaDiv.css({
            'left': (ganttOffsetX + GanttAreaBuffer.leftBuffer) + 'px',
            'top': (ganttOffsetY + GanttAreaBuffer.topBuffer) + 'px',
            'width': ((columnOffset * numHours) + GanttAreaBuffer.widthBuffer) + 'px',
            'height': ((ganttOffsetY * numEngineers) + GanttAreaBuffer.heightBuffer) + 'px'
        });

        ganttContainer.append(ganttAreaDiv);

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

    // returns the x and y offset for the Gantt area, as object { x: xVal, y: yVal }
    getGanttOffset = function () {

        var returnVal = { x: 0, y: 0 };

        var element = $('#' + TableOffsetElementID);

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

        var element = $('#' + ColumnOffsetElementID);

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

        var container = $('#' + GanttAreaID);
        var timeline, numEngineers, ganttOffset, heightBuffer, leftBuffer;

        if (!container) {
            return;
        }

        timeline = $('<div>').attr('id', TimelineID).addClass('timeline ui-widget-content draggable-timeline');

        numEngineers = getNumberEngineers();
        ganttOffset = getGanttOffset();
        heightBuffer = 3;
        leftBuffer = -1;
        timeline.css({
            'left': leftBuffer,
            'height': ((ganttOffset.y * numEngineers) + heightBuffer) + 'px'
        });

        container.append(timeline); // add timeline to gantt area container
        $('.draggable-timeline').draggable({ axis: 'x', containment: '#' + GanttAreaID });  // make it draggable

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

    // return object
    /////////////////////////////////////////////
    return {

        Engineers: Engineers,
        Hours: Hours,

        initTable: initTable,
        initGanttArea: initGanttArea,
        addTimeline: addTimeline,

        getGanttOffset: getGanttOffset,
        getNumberEngineers: getNumberEngineers,
        getNumberHours: getNumberHours,

        convertToTwoDigitString: convertToTwoDigitString

    };

}) ();



