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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6736842105263158, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "Academic Structure-1"], "isController": false}, {"data": [0.5, 500, 1500, "Academic Structure-2"], "isController": false}, {"data": [0.5, 500, 1500, "Homepage"], "isController": false}, {"data": [0.5, 500, 1500, "Academic Structure-0"], "isController": false}, {"data": [1.0, 500, 1500, "CA Results-1"], "isController": false}, {"data": [0.6, 500, 1500, "CA Results-2"], "isController": false}, {"data": [1.0, 500, 1500, "Final Results-1"], "isController": false}, {"data": [1.0, 500, 1500, "CA Results-0"], "isController": false}, {"data": [0.6, 500, 1500, "Final Results-2"], "isController": false}, {"data": [0.5, 500, 1500, "Login"], "isController": false}, {"data": [1.0, 500, 1500, "Login-0"], "isController": false}, {"data": [0.6, 500, 1500, "Login-1"], "isController": false}, {"data": [0.0, 500, 1500, "Academic Structure"], "isController": false}, {"data": [0.95, 500, 1500, "Final Results-0"], "isController": false}, {"data": [0.5, 500, 1500, "CA Results"], "isController": false}, {"data": [0.6, 500, 1500, "Homepage-2"], "isController": false}, {"data": [0.45, 500, 1500, "Final Results"], "isController": false}, {"data": [1.0, 500, 1500, "Homepage-1"], "isController": false}, {"data": [1.0, 500, 1500, "Homepage-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 190, 0, 0.0, 742.6578947368422, 304, 3006, 591.0, 1351.3, 2044.5499999999988, 2634.720000000001, 3.6685910679461684, 30.81578785406731, 0.6667422911316638], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Academic Structure-1", 10, 0, 0.0, 972.0, 795, 1446, 948.5, 1406.0, 1446.0, 1446.0, 0.22006557954270373, 0.30538397317400584, 0.030087090953104023], "isController": false}, {"data": ["Academic Structure-2", 10, 0, 0.0, 658.6999999999999, 537, 790, 649.0, 786.5, 790.0, 790.0, 0.22392905927402199, 3.08405422162259, 0.026023005911727168], "isController": false}, {"data": ["Homepage", 10, 0, 0.0, 1244.1000000000001, 987, 1391, 1247.0, 1385.7, 1391.0, 1391.0, 0.21829294913774286, 3.5412488403187075, 0.07908855872080331], "isController": false}, {"data": ["Academic Structure-0", 10, 0, 0.0, 648.1, 570, 811, 611.0, 809.5, 811.0, 811.0, 0.22026916892442566, 0.25003992378686757, 0.030114925438886317], "isController": false}, {"data": ["CA Results-1", 10, 0, 0.0, 362.8, 307, 487, 344.0, 478.40000000000003, 487.0, 487.0, 0.22605511223636324, 0.31303334878043265, 0.029139916811718694], "isController": false}, {"data": ["CA Results-2", 10, 0, 0.0, 598.7, 363, 740, 623.0, 735.2, 740.0, 740.0, 0.2245021664459062, 3.0914649888871426, 0.026089607233459804], "isController": false}, {"data": ["Final Results-1", 10, 0, 0.0, 355.5, 330, 409, 346.5, 406.3, 409.0, 409.0, 0.22486058643640944, 0.3120379817638064, 0.029425115803202014], "isController": false}, {"data": ["CA Results-0", 10, 0, 0.0, 342.5, 321, 413, 328.5, 408.3, 413.0, 413.0, 0.22612667616398707, 0.2472377213214843, 0.029149141849263958], "isController": false}, {"data": ["Final Results-2", 10, 0, 0.0, 567.5, 381, 743, 581.5, 735.8000000000001, 743.0, 743.0, 0.22402437385187507, 3.084929390317667, 0.02603408250817689], "isController": false}, {"data": ["Login", 10, 0, 0.0, 929.1, 725, 1100, 939.5, 1092.4, 1100.0, 1100.0, 0.22150847269908072, 3.2718791532838627, 0.04932024587440469], "isController": false}, {"data": ["Login-0", 10, 0, 0.0, 345.4, 315, 409, 329.0, 408.8, 409.0, 409.0, 0.2243309329923503, 0.22428711835700024, 0.024974342149539], "isController": false}, {"data": ["Login-1", 10, 0, 0.0, 582.9, 376, 772, 578.0, 762.1, 772.0, 772.0, 0.22323421734083398, 3.074179335208501, 0.024852246852397536], "isController": false}, {"data": ["Academic Structure", 10, 0, 0.0, 2280.8, 2000, 3006, 2193.5, 2965.2000000000003, 3006.0, 3006.0, 0.21313327223512862, 3.4730732752189946, 0.08304704650568001], "isController": false}, {"data": ["Final Results-0", 10, 0, 0.0, 375.7, 309, 762, 327.0, 723.2000000000002, 762.0, 762.0, 0.22494657518839276, 0.2482759953885952, 0.029436368237543583], "isController": false}, {"data": ["CA Results", 10, 0, 0.0, 1304.6000000000001, 1019, 1489, 1348.5, 1483.4, 1489.0, 1489.0, 0.22100912767697306, 3.591052997988817, 0.08266259365261786], "isController": false}, {"data": ["Homepage-2", 10, 0, 0.0, 556.8000000000001, 339, 656, 593.5, 652.7, 656.0, 656.0, 0.22187215726298506, 3.0557689534290344, 0.02578397140067893], "isController": false}, {"data": ["Final Results", 10, 0, 0.0, 1299.2, 1056, 1789, 1258.5, 1751.2000000000003, 1789.0, 1789.0, 0.22038567493112948, 3.583892906336088, 0.08329028925619834], "isController": false}, {"data": ["Homepage-1", 10, 0, 0.0, 347.0, 315, 410, 331.0, 408.5, 410.0, 410.0, 0.22266755733689603, 0.308559827989312, 0.027398547094188378], "isController": false}, {"data": ["Homepage-0", 10, 0, 0.0, 339.1, 304, 423, 334.0, 416.6, 423.0, 423.0, 0.22300521832210873, 0.23729149012086884, 0.027440095223228225], "isController": false}]}, function(index, item){
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
