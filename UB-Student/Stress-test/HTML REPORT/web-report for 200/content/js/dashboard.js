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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7157894736842105, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "Academic Structure-1"], "isController": false}, {"data": [0.5, 500, 1500, "Academic Structure-2"], "isController": false}, {"data": [0.45, 500, 1500, "Homepage"], "isController": false}, {"data": [0.5, 500, 1500, "Academic Structure-0"], "isController": false}, {"data": [1.0, 500, 1500, "CA Results-1"], "isController": false}, {"data": [0.8, 500, 1500, "CA Results-2"], "isController": false}, {"data": [1.0, 500, 1500, "Final Results-1"], "isController": false}, {"data": [1.0, 500, 1500, "CA Results-0"], "isController": false}, {"data": [0.8, 500, 1500, "Final Results-2"], "isController": false}, {"data": [0.5, 500, 1500, "Login"], "isController": false}, {"data": [1.0, 500, 1500, "Login-0"], "isController": false}, {"data": [0.8, 500, 1500, "Login-1"], "isController": false}, {"data": [0.0, 500, 1500, "Academic Structure"], "isController": false}, {"data": [1.0, 500, 1500, "Final Results-0"], "isController": false}, {"data": [0.5, 500, 1500, "CA Results"], "isController": false}, {"data": [0.8, 500, 1500, "Homepage-2"], "isController": false}, {"data": [0.45, 500, 1500, "Final Results"], "isController": false}, {"data": [1.0, 500, 1500, "Homepage-1"], "isController": false}, {"data": [1.0, 500, 1500, "Homepage-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 190, 0, 0.0, 698.3263157894739, 297, 2800, 534.5, 1307.4000000000003, 2000.2499999999998, 2493.3300000000013, 3.609628208294546, 30.321544849630488, 0.6560261793035317], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Academic Structure-1", 10, 0, 0.0, 1009.4, 852, 1482, 947.0, 1452.1000000000001, 1482.0, 1482.0, 0.2192357441957337, 0.3044893314405981, 0.029973636901760463], "isController": false}, {"data": ["Academic Structure-2", 10, 0, 0.0, 639.6, 543, 744, 654.5, 743.5, 744.0, 744.0, 0.22286605749944285, 3.0692399570982842, 0.02589947347893916], "isController": false}, {"data": ["Homepage", 10, 0, 0.0, 1185.1, 967, 1538, 1117.5, 1521.8000000000002, 1538.0, 1538.0, 0.21220609455903572, 3.442380740174858, 0.0768832627748069], "isController": false}, {"data": ["Academic Structure-0", 10, 0, 0.0, 623.5, 526, 747, 616.5, 743.8, 747.0, 747.0, 0.2201867183371499, 0.2498603190505549, 0.030103652897657214], "isController": false}, {"data": ["CA Results-1", 10, 0, 0.0, 347.4, 313, 387, 338.0, 386.5, 387.0, 387.0, 0.22384885725158374, 0.3099344822375932, 0.028855516755086963], "isController": false}, {"data": ["CA Results-2", 10, 0, 0.0, 482.5, 332, 764, 378.0, 759.6, 764.0, 764.0, 0.221724573734507, 3.053693030642336, 0.025766820580474935], "isController": false}, {"data": ["Final Results-1", 10, 0, 0.0, 363.2, 320, 465, 360.0, 456.40000000000003, 465.0, 465.0, 0.22125362302807708, 0.3067301203619709, 0.028953110825939772], "isController": false}, {"data": ["CA Results-0", 10, 0, 0.0, 333.9, 309, 363, 330.0, 362.7, 363.0, 363.0, 0.2239942657467969, 0.24525622144073111, 0.028874260818923036], "isController": false}, {"data": ["Final Results-2", 10, 0, 0.0, 478.4, 331, 716, 395.0, 711.9, 716.0, 716.0, 0.21962093426745438, 3.0245920541145983, 0.025522354665846746], "isController": false}, {"data": ["Login", 10, 0, 0.0, 828.3999999999999, 677, 1087, 741.0, 1081.7, 1087.0, 1087.0, 0.2161507867888639, 3.1929946205472937, 0.04812732362095798], "isController": false}, {"data": ["Login-0", 10, 0, 0.0, 339.4, 305, 369, 337.0, 368.4, 369.0, 369.0, 0.21955824880340755, 0.2199441910376323, 0.024443008167566855], "isController": false}, {"data": ["Login-1", 10, 0, 0.0, 488.6, 346, 717, 396.0, 714.6, 717.0, 717.0, 0.21770840136720876, 2.997912720701892, 0.02423706812095879], "isController": false}, {"data": ["Academic Structure", 10, 0, 0.0, 2274.1, 1989, 2800, 2281.5, 2766.3, 2800.0, 2800.0, 0.21229619565217392, 3.4594328507133154, 0.08272088092306386], "isController": false}, {"data": ["Final Results-0", 10, 0, 0.0, 341.6, 297, 406, 336.0, 405.0, 406.0, 406.0, 0.22165085557230252, 0.24433543532228036, 0.029005092428406775], "isController": false}, {"data": ["CA Results", 10, 0, 0.0, 1164.8, 968, 1496, 1100.5, 1490.4, 1496.0, 1496.0, 0.21838352514686293, 3.549158813959075, 0.08168055676879737], "isController": false}, {"data": ["Homepage-2", 10, 0, 0.0, 478.8, 355, 716, 395.0, 706.0, 716.0, 716.0, 0.2156985397208861, 2.9704048122344213, 0.025066529518345163], "isController": false}, {"data": ["Final Results", 10, 0, 0.0, 1184.2, 992, 1537, 1134.5, 1524.5, 1537.0, 1537.0, 0.21658616880725998, 3.5218095503671134, 0.08185434309415], "isController": false}, {"data": ["Homepage-1", 10, 0, 0.0, 355.8, 314, 464, 344.5, 456.70000000000005, 464.0, 464.0, 0.21749059353182976, 0.30130093357837273, 0.026761537875986865], "isController": false}, {"data": ["Homepage-0", 10, 0, 0.0, 349.5, 298, 428, 351.0, 421.70000000000005, 428.0, 428.0, 0.2176610147356507, 0.23190250691073722, 0.02678250767255077], "isController": false}]}, function(index, item){
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
