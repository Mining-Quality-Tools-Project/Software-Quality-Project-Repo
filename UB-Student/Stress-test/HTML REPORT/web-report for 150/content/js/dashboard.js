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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7052631578947368, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.45, 500, 1500, "Academic Structure-1"], "isController": false}, {"data": [0.5, 500, 1500, "Academic Structure-2"], "isController": false}, {"data": [0.4, 500, 1500, "Homepage"], "isController": false}, {"data": [0.5, 500, 1500, "Academic Structure-0"], "isController": false}, {"data": [0.95, 500, 1500, "CA Results-1"], "isController": false}, {"data": [0.8, 500, 1500, "CA Results-2"], "isController": false}, {"data": [0.95, 500, 1500, "Final Results-1"], "isController": false}, {"data": [0.95, 500, 1500, "CA Results-0"], "isController": false}, {"data": [0.85, 500, 1500, "Final Results-2"], "isController": false}, {"data": [0.5, 500, 1500, "Login"], "isController": false}, {"data": [1.0, 500, 1500, "Login-0"], "isController": false}, {"data": [0.85, 500, 1500, "Login-1"], "isController": false}, {"data": [0.0, 500, 1500, "Academic Structure"], "isController": false}, {"data": [1.0, 500, 1500, "Final Results-0"], "isController": false}, {"data": [0.45, 500, 1500, "CA Results"], "isController": false}, {"data": [0.85, 500, 1500, "Homepage-2"], "isController": false}, {"data": [0.45, 500, 1500, "Final Results"], "isController": false}, {"data": [1.0, 500, 1500, "Homepage-1"], "isController": false}, {"data": [0.95, 500, 1500, "Homepage-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 190, 0, 0.0, 759.9894736842108, 293, 2990, 541.0, 1348.4, 2291.0999999999995, 2879.8900000000003, 3.7344969239538495, 31.370541944297027, 0.6787202468699018], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Academic Structure-1", 10, 0, 0.0, 1099.7, 915, 1545, 1012.5, 1513.5, 1545.0, 1545.0, 0.21888064438461707, 0.3033976432026616, 0.029925088099459367], "isController": false}, {"data": ["Academic Structure-2", 10, 0, 0.0, 673.7999999999998, 590, 790, 650.5, 789.8, 790.0, 790.0, 0.22355360815523562, 3.078403044800143, 0.02597937438522758], "isController": false}, {"data": ["Homepage", 10, 0, 0.0, 1234.2, 965, 1735, 1121.0, 1729.0, 1735.0, 1735.0, 0.22459796963435452, 3.643312455080406, 0.0813728972015093], "isController": false}, {"data": ["Academic Structure-0", 10, 0, 0.0, 761.4, 611, 1350, 701.5, 1295.5000000000002, 1350.0, 1350.0, 0.2198865385461102, 0.2493049523945644, 0.030062612691851003], "isController": false}, {"data": ["CA Results-1", 10, 0, 0.0, 379.7, 343, 509, 359.5, 500.20000000000005, 509.0, 509.0, 0.22483025315886504, 0.31186415194028505, 0.028982024821259948], "isController": false}, {"data": ["CA Results-2", 10, 0, 0.0, 521.5, 335, 807, 454.0, 797.6, 807.0, 807.0, 0.22429571146599678, 3.0890601168580654, 0.026065614906692982], "isController": false}, {"data": ["Final Results-1", 10, 0, 0.0, 389.7, 313, 573, 383.0, 556.6, 573.0, 573.0, 0.22613178960698296, 0.3139345235403193, 0.029591464655601283], "isController": false}, {"data": ["CA Results-0", 10, 0, 0.0, 440.8, 305, 1192, 348.5, 1114.0000000000002, 1192.0, 1192.0, 0.22496175650139477, 0.24644736176100063, 0.02899897642400792], "isController": false}, {"data": ["Final Results-2", 10, 0, 0.0, 499.70000000000005, 355, 824, 408.0, 812.7, 824.0, 824.0, 0.22721076070162685, 3.1289850637326184, 0.026404375511224213], "isController": false}, {"data": ["Login", 10, 0, 0.0, 854.9, 687, 1130, 787.5, 1129.9, 1130.0, 1130.0, 0.22570306504762336, 3.334013381370469, 0.05025419807700989], "isController": false}, {"data": ["Login-0", 10, 0, 0.0, 362.29999999999995, 310, 410, 368.0, 409.7, 410.0, 410.0, 0.22764005554417355, 0.22781789933756744, 0.025342740558628694], "isController": false}, {"data": ["Login-1", 10, 0, 0.0, 492.29999999999995, 375, 755, 412.0, 751.5, 755.0, 755.0, 0.22779562176814963, 3.1369503718763525, 0.02536005945465728], "isController": false}, {"data": ["Academic Structure", 10, 0, 0.0, 2538.2, 2182, 2990, 2505.5, 2977.9, 2990.0, 2990.0, 0.21283841307679208, 3.467187633024008, 0.08293215509535161], "isController": false}, {"data": ["Final Results-0", 10, 0, 0.0, 362.8, 307, 414, 349.0, 413.5, 414.0, 414.0, 0.22604489251565363, 0.2495765190216777, 0.02958009335654061], "isController": false}, {"data": ["CA Results", 10, 0, 0.0, 1342.4, 1041, 2420, 1244.5, 2325.0000000000005, 2420.0, 2420.0, 0.22097005855706553, 3.5918424069163626, 0.08264798088608993], "isController": false}, {"data": ["Homepage-2", 10, 0, 0.0, 492.7, 336, 854, 392.5, 850.8, 854.0, 854.0, 0.2284252364201197, 3.145977645735301, 0.026545510873041255], "isController": false}, {"data": ["Final Results", 10, 0, 0.0, 1253.1000000000001, 1022, 1637, 1228.0, 1616.6000000000001, 1637.0, 1637.0, 0.22244961516216577, 3.617847549717489, 0.08407031354273257], "isController": false}, {"data": ["Homepage-1", 10, 0, 0.0, 372.7, 329, 447, 366.0, 442.90000000000003, 447.0, 447.0, 0.22858187802870988, 0.31671090678431013, 0.028126285773063912], "isController": false}, {"data": ["Homepage-0", 10, 0, 0.0, 367.9, 293, 507, 356.5, 496.50000000000006, 507.0, 507.0, 0.22819588334626442, 0.24268097359773627, 0.02807879033362238], "isController": false}]}, function(index, item){
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
