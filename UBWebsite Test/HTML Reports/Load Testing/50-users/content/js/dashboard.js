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

    var data = {"OkPercent": 98.375, "KoPercent": 1.625};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.386875, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.41, 500, 1500, "ub-exchange student"], "isController": false}, {"data": [0.41, 500, 1500, "ub-transportation"], "isController": false}, {"data": [0.0, 500, 1500, "ub homepage"], "isController": false}, {"data": [0.42, 500, 1500, "ub-fee and scholarships"], "isController": false}, {"data": [0.43, 500, 1500, "ub-faculties and schools"], "isController": false}, {"data": [0.42, 500, 1500, "ub-finance"], "isController": false}, {"data": [0.42, 500, 1500, "ub-health center"], "isController": false}, {"data": [0.48, 500, 1500, "ub-httc application form"], "isController": false}, {"data": [0.36, 500, 1500, "ub-job opportunities"], "isController": false}, {"data": [0.4, 500, 1500, "ub-sports"], "isController": false}, {"data": [0.33, 500, 1500, "ub-news"], "isController": false}, {"data": [0.47, 500, 1500, "ub-FET"], "isController": false}, {"data": [0.37, 500, 1500, "why us"], "isController": false}, {"data": [0.45, 500, 1500, "ub-Admission requirements"], "isController": false}, {"data": [0.45, 500, 1500, "ub-announcements"], "isController": false}, {"data": [0.37, 500, 1500, "ub-library"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 800, 13, 1.625, 1630.7162499999977, 1, 15018, 1020.0, 3350.8, 5396.949999999991, 11084.730000000001, 12.430853378084405, 1051.8870982309343, 1.8404855656426753], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ub-exchange student", 50, 0, 0.0, 1233.4199999999998, 306, 4770, 933.5, 2376.9999999999995, 3642.3499999999935, 4770.0, 1.0755001075500108, 91.62826094993547, 0.17644923639492363], "isController": false}, {"data": ["ub-transportation", 50, 0, 0.0, 1369.8799999999997, 464, 6118, 1023.0, 3051.799999999999, 4963.749999999996, 6118.0, 1.0859649884887712, 86.8033237655293, 0.16862151676729942], "isController": false}, {"data": ["ub homepage", 50, 0, 0.0, 6141.600000000002, 1591, 15018, 4542.5, 12731.699999999999, 13612.999999999998, 15018.0, 0.9339684318670028, 141.54838832072477, 0.10671318996917904], "isController": false}, {"data": ["ub-fee and scholarships", 50, 0, 0.0, 1320.98, 304, 5844, 1014.0, 2827.899999999999, 5053.349999999994, 5844.0, 1.111827622245447, 88.06132962770452, 0.15743652854061507], "isController": false}, {"data": ["ub-faculties and schools", 50, 0, 0.0, 1307.2799999999995, 298, 5747, 937.0, 2826.7999999999993, 5273.399999999998, 5747.0, 1.1269891358247306, 94.05919563263535, 0.1595834225533066], "isController": false}, {"data": ["ub-finance", 50, 0, 0.0, 1135.6999999999998, 272, 3006, 941.0, 2311.5999999999995, 2790.6999999999985, 3006.0, 1.0606028466580404, 83.55833166509343, 0.16054046995312135], "isController": false}, {"data": ["ub-health center", 50, 2, 4.0, 1283.2600000000002, 1, 5110, 985.0, 2568.7999999999984, 4868.299999999999, 5110.0, 1.0927528630125012, 86.58376087289099, 0.16186401783372673], "isController": false}, {"data": ["ub-httc application form", 50, 0, 0.0, 1023.2400000000002, 288, 3246, 763.0, 2429.6999999999994, 3153.899999999999, 3246.0, 1.2891581797086502, 79.77235279425037, 0.2303866668815264], "isController": false}, {"data": ["ub-job opportunities", 50, 5, 10.0, 1275.8199999999997, 1, 6476, 959.0, 2981.8999999999996, 4134.749999999999, 6476.0, 0.9980637563127533, 81.84814818626863, 0.1350894888915504], "isController": false}, {"data": ["ub-sports", 50, 1, 2.0, 1226.06, 321, 3474, 1036.0, 2396.9999999999995, 2828.899999999998, 3474.0, 1.0175217240888093, 81.60021428371557, 0.14899141338855085], "isController": false}, {"data": ["ub-news", 50, 1, 2.0, 1406.6600000000003, 357, 4573, 1018.0, 2558.7, 3257.0499999999975, 4573.0, 1.010407194099222, 85.93856566383752, 0.13537877639688795], "isController": false}, {"data": ["ub-FET", 50, 1, 2.0, 1094.0200000000002, 384, 3899, 952.0, 1680.6999999999998, 3325.4499999999994, 3899.0, 1.2672986262482893, 107.15034636855579, 0.22680190063111472], "isController": false}, {"data": ["why us", 50, 2, 4.0, 1789.0000000000005, 133, 8461, 1032.0, 5209.299999999999, 6547.399999999994, 8461.0, 0.9975858422617265, 86.22826120164203, 0.12719219488837014], "isController": false}, {"data": ["ub-Admission requirements", 50, 1, 2.0, 1537.06, 345, 8181, 1049.0, 4742.699999999997, 6156.349999999998, 8181.0, 1.121629503342456, 88.50491431451613, 0.18570416601238277], "isController": false}, {"data": ["ub-announcements", 50, 0, 0.0, 1541.5199999999998, 279, 10959, 1003.5, 2700.7, 5619.999999999998, 10959.0, 1.0078410030033662, 66.57862624342384, 0.13877498185886195], "isController": false}, {"data": ["ub-library", 50, 0, 0.0, 1405.9599999999996, 442, 5081, 1108.5, 2543.1999999999994, 4314.899999999997, 5081.0, 1.006664116450905, 92.05746730858283, 0.1494267047856812], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 13, 100.0, 1.625], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 800, 13, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 13, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ub-health center", 50, 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["ub-job opportunities", 50, 5, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["ub-sports", 50, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["ub-news", 50, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["ub-FET", 50, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["why us", 50, 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["ub-Admission requirements", 50, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
