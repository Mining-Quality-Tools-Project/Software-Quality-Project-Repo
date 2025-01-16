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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6784210526315789, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.735, 500, 1500, "Academic Structure-1"], "isController": false}, {"data": [0.51, 500, 1500, "Academic Structure-2"], "isController": false}, {"data": [0.45, 500, 1500, "Homepage"], "isController": false}, {"data": [0.74, 500, 1500, "Academic Structure-0"], "isController": false}, {"data": [0.975, 500, 1500, "CA Results-1"], "isController": false}, {"data": [0.51, 500, 1500, "CA Results-2"], "isController": false}, {"data": [0.995, 500, 1500, "Final Results-1"], "isController": false}, {"data": [0.985, 500, 1500, "CA Results-0"], "isController": false}, {"data": [0.515, 500, 1500, "Final Results-2"], "isController": false}, {"data": [0.475, 500, 1500, "Login"], "isController": false}, {"data": [0.99, 500, 1500, "Login-0"], "isController": false}, {"data": [0.515, 500, 1500, "Login-1"], "isController": false}, {"data": [0.21, 500, 1500, "Academic Structure"], "isController": false}, {"data": [0.985, 500, 1500, "Final Results-0"], "isController": false}, {"data": [0.415, 500, 1500, "CA Results"], "isController": false}, {"data": [0.515, 500, 1500, "Homepage-2"], "isController": false}, {"data": [0.4, 500, 1500, "Final Results"], "isController": false}, {"data": [0.98, 500, 1500, "Homepage-1"], "isController": false}, {"data": [0.99, 500, 1500, "Homepage-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1900, 0, 0.0, 756.272105263159, 325, 3787, 614.0, 1420.0, 1579.0, 2303.99, 29.248768472906402, 245.69993794258008, 5.315771243842365], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Academic Structure-1", 100, 0, 0.0, 700.0799999999998, 342, 2562, 876.0, 1000.7, 1066.0, 2549.7299999999937, 1.7295951017866718, 2.3992727052596985, 0.23646808032239652], "isController": false}, {"data": ["Academic Structure-2", 100, 0, 0.0, 637.5400000000003, 416, 934, 625.0, 699.4000000000001, 729.1999999999998, 932.9799999999994, 1.7416747944823743, 23.985175081858717, 0.20240166068691656], "isController": false}, {"data": ["Homepage", 100, 0, 0.0, 1403.5000000000002, 1129, 1883, 1381.5, 1530.1000000000001, 1597.8999999999992, 1881.8199999999995, 1.6883336147222692, 27.39067380339355, 0.6116911826776972], "isController": false}, {"data": ["Academic Structure-0", 100, 0, 0.0, 525.2699999999999, 334, 839, 591.0, 697.5, 741.8499999999997, 838.9399999999999, 1.7192765284368339, 1.9487260698198197, 0.23505733787222335], "isController": false}, {"data": ["CA Results-1", 100, 0, 0.0, 398.23999999999995, 339, 702, 385.5, 439.8, 556.149999999999, 701.1199999999995, 1.7485574401119077, 2.4264308117677915, 0.2253999825144256], "isController": false}, {"data": ["CA Results-2", 100, 0, 0.0, 641.9099999999999, 402, 1579, 621.0, 711.0, 738.6499999999999, 1571.4599999999962, 1.7391606810553226, 23.950484464947216, 0.20210949320857755], "isController": false}, {"data": ["Final Results-1", 100, 0, 0.0, 384.3, 345, 564, 378.5, 422.20000000000005, 442.74999999999994, 562.9399999999995, 1.7401291175805245, 2.41303568787304, 0.22771220874588896], "isController": false}, {"data": ["CA Results-0", 100, 0, 0.0, 385.48999999999984, 334, 919, 366.5, 415.9, 454.9, 916.1199999999985, 1.7496282040066486, 1.9132799514478174, 0.22553801067273205], "isController": false}, {"data": ["Final Results-2", 100, 0, 0.0, 680.6000000000001, 380, 1648, 622.5, 853.5000000000002, 1328.8999999999955, 1646.5099999999993, 1.724464984738485, 23.74888044499819, 0.20040169256238252], "isController": false}, {"data": ["Login", 100, 0, 0.0, 1050.2700000000004, 734, 2148, 999.5, 1165.8000000000002, 1600.8499999999985, 2147.5299999999997, 1.7068632973185178, 25.215904872241282, 0.3800437810435762], "isController": false}, {"data": ["Login-0", 100, 0, 0.0, 380.4300000000002, 327, 983, 370.0, 419.00000000000006, 446.74999999999994, 978.2699999999976, 1.7263703064307294, 1.728191087613293, 0.19219356927060854], "isController": false}, {"data": ["Login-1", 100, 0, 0.0, 669.6700000000001, 361, 1767, 625.0, 715.9, 1063.5999999999976, 1766.92, 1.7176523128188392, 23.655829711949707, 0.19122301138803482], "isController": false}, {"data": ["Academic Structure", 100, 0, 0.0, 1863.4700000000007, 1173, 3787, 2109.5, 2396.7, 2446.7, 3775.9199999999946, 1.6815483697388556, 27.395740059947197, 0.6552126948494174], "isController": false}, {"data": ["Final Results-0", 100, 0, 0.0, 377.0100000000001, 325, 569, 362.5, 410.0, 457.1499999999998, 568.93, 1.7405228530650607, 1.921000115309639, 0.22776373272531067], "isController": false}, {"data": ["CA Results", 100, 0, 0.0, 1425.9999999999995, 1151, 2265, 1389.0, 1578.0, 1672.3499999999997, 2261.539999999998, 1.7157956144264095, 27.885968223465223, 0.6417477737551903], "isController": false}, {"data": ["Homepage-2", 100, 0, 0.0, 635.6899999999999, 397, 912, 624.0, 708.7, 727.5999999999999, 911.7599999999999, 1.7084087880548058, 23.527525134964296, 0.1985357868930878], "isController": false}, {"data": ["Final Results", 100, 0, 0.0, 1442.18, 1084, 2405, 1383.0, 1608.2, 2046.6499999999974, 2403.9799999999996, 1.703983914391848, 27.7104060700167, 0.6439861082711379], "isController": false}, {"data": ["Homepage-1", 100, 0, 0.0, 391.71999999999986, 339, 619, 379.0, 448.80000000000007, 465.9, 618.2699999999996, 1.7171803897999485, 2.3817493238602214, 0.21129368077616553], "isController": false}, {"data": ["Homepage-0", 100, 0, 0.0, 375.7999999999999, 328, 611, 364.5, 415.9, 446.95, 610.0499999999995, 1.7180949762902893, 1.829569810494124, 0.2114062177857192], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1900, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
