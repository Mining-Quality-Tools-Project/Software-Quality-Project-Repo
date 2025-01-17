/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6921052631578948, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.45, 500, 1500, "Academic Structure-1"], "isController": false}, {"data": [0.5, 500, 1500, "Academic Structure-2"], "isController": false}, {"data": [0.5, 500, 1500, "Homepage"], "isController": false}, {"data": [0.5, 500, 1500, "Academic Structure-0"], "isController": false}, {"data": [1.0, 500, 1500, "CA Results-1"], "isController": false}, {"data": [0.7, 500, 1500, "CA Results-2"], "isController": false}, {"data": [1.0, 500, 1500, "Final Results-1"], "isController": false}, {"data": [1.0, 500, 1500, "CA Results-0"], "isController": false}, {"data": [0.65, 500, 1500, "Final Results-2"], "isController": false}, {"data": [0.5, 500, 1500, "Login"], "isController": false}, {"data": [1.0, 500, 1500, "Login-0"], "isController": false}, {"data": [0.7, 500, 1500, "Login-1"], "isController": false}, {"data": [0.0, 500, 1500, "Academic Structure"], "isController": false}, {"data": [1.0, 500, 1500, "Final Results-0"], "isController": false}, {"data": [0.5, 500, 1500, "CA Results"], "isController": false}, {"data": [0.7, 500, 1500, "Homepage-2"], "isController": false}, {"data": [0.5, 500, 1500, "Final Results"], "isController": false}, {"data": [1.0, 500, 1500, "Homepage-1"], "isController": false}, {"data": [0.95, 500, 1500, "Homepage-0"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 190, 0, 0.0, 730.9631578947368, 281, 3584, 582.0, 1329.9, 1985.6999999999998, 2714.040000000003, 3.630873894016702, 30.50277451317625, 0.6598874429092855], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Academic Structure-1", 10, 0, 0.0, 1020.8, 811, 1558, 956.0, 1514.0000000000002, 1558.0, 1558.0, 0.22180326050792945, 0.3082285543972496, 0.030324664522568483], "isController": false}, {"data": ["Academic Structure-2", 10, 0, 0.0, 657.5, 560, 789, 618.0, 787.1, 789.0, 789.0, 0.22578969947391, 3.109900313847682, 0.026239232653706337], "isController": false}, {"data": ["Homepage", 10, 0, 0.0, 1224.8999999999999, 944, 1436, 1230.5, 1427.0, 1436.0, 1436.0, 0.21995908760970462, 3.568836196467457, 0.07969220849921914], "isController": false}, {"data": ["Academic Structure-0", 10, 0, 0.0, 661.3, 520, 1250, 591.0, 1196.8000000000002, 1250.0, 1250.0, 0.22033711578715434, 0.24994491572105323, 0.03012421504902501], "isController": false}, {"data": ["CA Results-1", 10, 0, 0.0, 358.0, 315, 442, 346.0, 438.8, 442.0, 442.0, 0.22839915035516067, 0.3169038211177854, 0.02944207797546993], "isController": false}, {"data": ["CA Results-2", 10, 0, 0.0, 524.3, 335, 669, 553.5, 668.6, 669.0, 669.0, 0.22726756210086135, 3.1299448450035228, 0.026410976455080566], "isController": false}, {"data": ["Final Results-1", 10, 0, 0.0, 362.4, 316, 409, 357.0, 408.7, 409.0, 409.0, 0.2276452376616281, 0.3159466911764706, 0.02978951352212712], "isController": false}, {"data": ["CA Results-0", 10, 0, 0.0, 345.1, 304, 398, 339.0, 398.0, 398.0, 398.0, 0.2280917841339355, 0.2494308397199033, 0.029402456548515123], "isController": false}, {"data": ["Final Results-2", 10, 0, 0.0, 556.8, 373, 726, 596.0, 720.9, 726.0, 726.0, 0.22581519284617468, 3.1095898772694426, 0.026242195262397256], "isController": false}, {"data": ["Login", 10, 0, 0.0, 888.8000000000001, 616, 1024, 971.0, 1024.0, 1024.0, 1024.0, 0.22298035543068656, 3.293925039579013, 0.0496479697638638], "isController": false}, {"data": ["Login-0", 10, 0, 0.0, 334.1, 281, 408, 319.0, 405.1, 408.0, 408.0, 0.22644414755100653, 0.22675373915898642, 0.025209602364076898], "isController": false}, {"data": ["Login-1", 10, 0, 0.0, 554.3, 334, 713, 617.0, 712.7, 713.0, 713.0, 0.22488587042076144, 3.0968804815930917, 0.025036122292936336], "isController": false}, {"data": ["Academic Structure", 10, 0, 0.0, 2342.0, 1974, 3584, 2196.5, 3488.4000000000005, 3584.0, 3584.0, 0.212300702715326, 3.4599624095068253, 0.08272263709317877], "isController": false}, {"data": ["Final Results-0", 10, 0, 0.0, 342.29999999999995, 300, 410, 329.5, 408.8, 410.0, 410.0, 0.22756235208447115, 0.2509408280993992, 0.02977866716730384], "isController": false}, {"data": ["CA Results", 10, 0, 0.0, 1228.2, 1001, 1349, 1230.5, 1347.4, 1349.0, 1349.0, 0.22300521832210873, 3.6245316890415236, 0.0834091783372731], "isController": false}, {"data": ["Homepage-2", 10, 0, 0.0, 523.1999999999999, 346, 704, 591.5, 696.5, 704.0, 704.0, 0.2243863034600368, 3.090789853812323, 0.026076142687250368], "isController": false}, {"data": ["Final Results", 10, 0, 0.0, 1262.8999999999999, 1043, 1430, 1250.5, 1420.3, 1430.0, 1430.0, 0.2220297963986767, 3.6104560075712158, 0.08391165156864051], "isController": false}, {"data": ["Homepage-1", 10, 0, 0.0, 355.9000000000001, 309, 399, 350.5, 398.6, 399.0, 399.0, 0.22596827405432277, 0.313177904822163, 0.027804689971527997], "isController": false}, {"data": ["Homepage-0", 10, 0, 0.0, 345.5, 289, 505, 325.0, 492.00000000000006, 505.0, 505.0, 0.22523029797968422, 0.23979108482173023, 0.027713884321718958], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 190, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
