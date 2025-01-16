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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.720625, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.77, 500, 1500, "ub-exchange student"], "isController": false}, {"data": [0.8, 500, 1500, "ub-transportation"], "isController": false}, {"data": [0.0, 500, 1500, "ub homepage"], "isController": false}, {"data": [0.86, 500, 1500, "ub-fee and scholarships"], "isController": false}, {"data": [0.85, 500, 1500, "ub-faculties and schools"], "isController": false}, {"data": [0.87, 500, 1500, "ub-finance"], "isController": false}, {"data": [0.84, 500, 1500, "ub-health center"], "isController": false}, {"data": [0.95, 500, 1500, "ub-httc application form"], "isController": false}, {"data": [0.49, 500, 1500, "ub-job opportunities"], "isController": false}, {"data": [0.78, 500, 1500, "ub-sports"], "isController": false}, {"data": [0.66, 500, 1500, "ub-news"], "isController": false}, {"data": [0.87, 500, 1500, "ub-FET"], "isController": false}, {"data": [0.5, 500, 1500, "why us"], "isController": false}, {"data": [0.86, 500, 1500, "ub-Admission requirements"], "isController": false}, {"data": [0.71, 500, 1500, "ub-announcements"], "isController": false}, {"data": [0.72, 500, 1500, "ub-library"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 800, 0, 0.0, 711.1900000000003, 235, 4228, 499.5, 1165.6, 2964.8999999999996, 3172.91, 13.035260379326077, 1121.2410013422245, 1.961972173792609], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ub-exchange student", 50, 0, 0.0, 529.26, 447, 715, 500.0, 692.6, 710.25, 715.0, 1.0163634515702815, 86.58721827675576, 0.16674712877324932], "isController": false}, {"data": ["ub-transportation", 50, 0, 0.0, 538.38, 235, 1596, 484.0, 833.6999999999998, 1143.5999999999988, 1596.0, 1.0164874260505399, 81.2503017697046, 0.15783349681839437], "isController": false}, {"data": ["ub homepage", 50, 0, 0.0, 3084.7599999999998, 2869, 4228, 3056.5, 3233.2, 3303.15, 4228.0, 0.9445189564954568, 143.15134838935904, 0.10791866983395357], "isController": false}, {"data": ["ub-fee and scholarships", 50, 0, 0.0, 415.7200000000001, 245, 946, 456.5, 644.6999999999999, 756.8499999999996, 946.0, 1.015125367982946, 80.40278667774845, 0.14374333823977262], "isController": false}, {"data": ["ub-faculties and schools", 50, 0, 0.0, 423.20000000000005, 253, 728, 465.0, 615.1, 697.05, 728.0, 1.014651568651325, 84.68238393654369, 0.14367624751410366], "isController": false}, {"data": ["ub-finance", 50, 0, 0.0, 520.1600000000002, 450, 925, 488.5, 661.0999999999999, 864.8999999999995, 925.0, 1.0203248714390662, 80.38655406318873, 0.15444370612603053], "isController": false}, {"data": ["ub-health center", 50, 0, 0.0, 465.2200000000001, 248, 1638, 477.5, 689.2999999999997, 862.7499999999992, 1638.0, 1.0156821321199316, 83.74527311057732, 0.15671657897944258], "isController": false}, {"data": ["ub-httc application form", 50, 0, 0.0, 357.5800000000001, 236, 1333, 272.0, 499.79999999999995, 647.5499999999989, 1333.0, 1.019555066169124, 63.08895235619176, 0.18220564170795867], "isController": false}, {"data": ["ub-job opportunities", 50, 0, 0.0, 840.66, 691, 1605, 784.5, 959.7, 1047.2499999999998, 1605.0, 1.0063196876383689, 91.467875288059, 0.15134104677373908], "isController": false}, {"data": ["ub-sports", 50, 0, 0.0, 526.3200000000002, 456, 956, 494.5, 653.4999999999999, 739.7999999999998, 956.0, 1.0201791434575913, 83.4393960985799, 0.15242911030176898], "isController": false}, {"data": ["ub-news", 50, 0, 0.0, 553.62, 452, 1266, 508.5, 727.0999999999999, 856.1499999999994, 1266.0, 1.0143222298859902, 87.99037328959915, 0.13867686736722523], "isController": false}, {"data": ["ub-FET", 50, 0, 0.0, 432.5200000000001, 245, 740, 476.0, 556.6999999999999, 686.5999999999997, 740.0, 1.014630978713042, 87.4975545808052, 0.1852890556829481], "isController": false}, {"data": ["why us", 50, 0, 0.0, 1163.5, 1010, 1307, 1156.0, 1235.0, 1254.75, 1307.0, 1.003069392340562, 90.23128350878689, 0.1332201536702309], "isController": false}, {"data": ["ub-Admission requirements", 50, 0, 0.0, 435.43999999999994, 249, 1017, 438.5, 733.1, 788.6999999999998, 1017.0, 1.0150635429777903, 81.68882465792358, 0.17149022747573997], "isController": false}, {"data": ["ub-announcements", 50, 0, 0.0, 531.3600000000001, 458, 1135, 506.0, 592.5, 737.3499999999999, 1135.0, 1.0150223304912709, 67.0538223520605, 0.1397638169914738], "isController": false}, {"data": ["ub-library", 50, 0, 0.0, 561.34, 463, 1647, 502.0, 702.6, 997.1999999999989, 1647.0, 1.0142399285975092, 92.93508198862023, 0.15055123940119275], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 800, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
