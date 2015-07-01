/**
 * Created by Justin.Ugerio on 7/1/2015.
 */

// LogicServices global namespace var
// Self-calling function
LogicServices = (function () {

    // variable declarations
    var Engineers = ['Andy James', 'Harold Johnson', 'Lakesha Hill'],
          Hours = ['8am', '9am', '10am', '11am', '12am', '1pm','2pm','3pm','4pm', '5pm'];

    // function declarations
    var initTable;


    // functions
    /////////////////////////////////////////////

    initTable = function (engineers, hours) {

        var table = $('#gantt-table-id');
        var tHeader, tBody, tRow, tHead, tData;

        if (!table) {
            return;
        }

        // table header
        tRow = $('<tr>');
        tHead = $('<th>').text('Engineer');    // initial 'Engineer' heading
        tHead.addClass('col-lg-2');
        tRow.append(tHead);

        // for each hour, create a heading for the table
        for (var i = 0; i < hours.length; i++) {
            tHead = $('<th>').text(Hours[i]);
            tHead.addClass('col-lg-1');
            tRow.append(tHead);
        }

        tHeader = $('<thead>').append(tRow);    // create table header

        // table body
        tBody = $('<tbody>');

        for (var i = 0; i < engineers.length; i++) {
            tRow = $('<tr>');
            tHead = $('<th>').html('<span>' + Engineers[i] + '</span>')
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


    // return object
    /////////////////////////////////////////////
    return {

        Engineers: Engineers,

        Hours: Hours,

        initTable: initTable

    };

}) ();



