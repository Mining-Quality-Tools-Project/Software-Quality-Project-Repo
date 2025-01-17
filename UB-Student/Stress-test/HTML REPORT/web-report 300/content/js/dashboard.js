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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6815789473684211, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.45, 500, 1500, "Academic Structure-1"], "isController": false}, {"data": [0.5, 500, 1500, "Academic Structure-2"], "isController": false}, {"data": [0.4, 500, 1500, "Homepage"], "isController": false}, {"data": [0.5, 500, 1500, "Academic Structure-0"], "isController": false}, {"data": [0.95, 500, 1500, "CA Results-1"], "isController": false}, {"data": [0.7, 500, 1500, "CA Results-2"], "isController": false}, {"data": [1.0, 500, 1500, "Final Results-1"], "isController": false}, {"data": [0.95, 500, 1500, "CA Results-0"], "isController": false}, {"data": [0.75, 500, 1500, "Final Results-2"], "isController": false}, {"data": [0.5, 500, 1500, "Login"], "isController": false}, {"data": [1.0, 500, 1500, "Login-0"], "isController": false}, {"data": [0.75, 500, 1500, "Login-1"], "isController": false}, {"data": [0.0, 500, 1500, "Academic Structure"], "isController": false}, {"data": [1.0, 500, 1500, "Final Results-0"], "isController": false}, {"data": [0.35, 500, 1500, "CA Results"], "isController": false}, {"data": [0.75, 500, 1500, "Homepage-2"], "isController": false}, {"data": [0.45, 500, 1500, "Final Results"], "isController": false}, {"data": [0.95, 500, 1500, "Homepage-1"], "isController": false}, {"data": [1.0, 500, 1500, "Homepage-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 190, 0, 0.0, 785.7894736842103, 319, 3158, 624.5, 1439.5, 2200.8499999999985, 2759.4200000000014, 3.7179813318200496, 31.23433005400857, 0.6757186466547952], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Academic Structure-1", 10, 0, 0.0, 1125.1999999999998, 883, 1604, 1062.0, 1579.6000000000001, 1604.0, 1604.0, 0.21931267407943505, 0.3048960183784021, 0.02998415465929776], "isController": false}, {"data": ["Academic Structure-2", 10, 0, 0.0, 695.5999999999999, 620, 756, 706.5, 753.7, 756.0, 756.0, 0.22407457201756745, 3.085708173680201, 0.02603991608407278], "isController": false}, {"data": ["Homepage", 10, 0, 0.0, 1331.6, 1057, 1993, 1261.0, 1950.0000000000002, 1993.0, 1993.0, 0.222246916324036, 3.6053919185465055, 0.08052109956661851], "isController": false}, {"data": ["Academic Structure-0", 10, 0, 0.0, 661.6, 591, 839, 630.0, 828.0, 839.0, 839.0, 0.2201721746405689, 0.2494137915850195, 0.030101664501640285], "isController": false}, {"data": ["CA Results-1", 10, 0, 0.0, 402.40000000000003, 362, 512, 377.5, 507.70000000000005, 512.0, 512.0, 0.2254130694497667, 0.31311284178256654, 0.02905715348375899], "isController": false}, {"data": ["CA Results-2", 10, 0, 0.0, 595.8, 381, 1068, 612.0, 1032.7, 1068.0, 1068.0, 0.22532164665059373, 3.103365601270814, 0.026184839796309232], "isController": false}, {"data": ["Final Results-1", 10, 0, 0.0, 367.4, 344, 386, 369.5, 385.3, 386.0, 386.0, 0.2254791431792559, 0.3126321166854566, 0.02950605975197294], "isController": false}, {"data": ["CA Results-0", 10, 0, 0.0, 448.9, 333, 1060, 376.5, 999.6000000000003, 1060.0, 1060.0, 0.22556051788694906, 0.2469711451707493, 0.029076160508864527], "isController": false}, {"data": ["Final Results-2", 10, 0, 0.0, 610.5, 376, 1435, 521.5, 1367.6000000000004, 1435.0, 1435.0, 0.22545372562281593, 3.105096663284861, 0.02620018881749521], "isController": false}, {"data": ["Login", 10, 0, 0.0, 871.9000000000001, 697, 1024, 858.0, 1023.9, 1024.0, 1024.0, 0.2239140170174653, 3.307848536162114, 0.04985585535154501], "isController": false}, {"data": ["Login-0", 10, 0, 0.0, 346.5, 331, 366, 345.0, 365.8, 366.0, 366.0, 0.22574382590636147, 0.22583200708835613, 0.025131636868481647], "isController": false}, {"data": ["Login-1", 10, 0, 0.0, 525.0999999999999, 362, 678, 508.5, 677.9, 678.0, 678.0, 0.22559104854719364, 3.1069439039658904, 0.025114628451543042], "isController": false}, {"data": ["Academic Structure", 10, 0, 0.0, 2485.8999999999996, 2134, 3158, 2429.0, 3114.2000000000003, 3158.0, 3158.0, 0.21235480240385635, 3.460097537215179, 0.08274371695228387], "isController": false}, {"data": ["Final Results-0", 10, 0, 0.0, 352.20000000000005, 319, 382, 353.0, 380.8, 382.0, 382.0, 0.22562158747348945, 0.24884474696538963, 0.02952469992328866], "isController": false}, {"data": ["CA Results", 10, 0, 0.0, 1447.5, 1125, 2149, 1362.5, 2118.4, 2149.0, 2149.0, 0.22183278244859025, 3.606342476541183, 0.0829706598416114], "isController": false}, {"data": ["Homepage-2", 10, 0, 0.0, 531.6, 357, 716, 534.5, 714.6, 716.0, 716.0, 0.22623922535689237, 3.1158267064093574, 0.026291472477998235], "isController": false}, {"data": ["Final Results", 10, 0, 0.0, 1330.8, 1096, 2150, 1243.5, 2079.0, 2150.0, 2150.0, 0.2219361711571752, 3.6091502896267036, 0.08387626781037774], "isController": false}, {"data": ["Homepage-1", 10, 0, 0.0, 424.40000000000003, 320, 924, 368.5, 872.5000000000002, 924.0, 924.0, 0.22626482034573264, 0.3136772841433614, 0.027841179065978824], "isController": false}, {"data": ["Homepage-0", 10, 0, 0.0, 375.09999999999997, 336, 437, 369.0, 436.0, 437.0, 437.0, 0.22586109542631283, 0.24028620835686054, 0.027791501976284588], "isController": false}]}, function(index, item){
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
