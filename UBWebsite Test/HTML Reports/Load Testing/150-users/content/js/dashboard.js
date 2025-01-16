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

    var data = {"OkPercent": 99.125, "KoPercent": 0.875};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.38104166666666667, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4, 500, 1500, "ub-exchange student"], "isController": false}, {"data": [0.48, 500, 1500, "ub-transportation"], "isController": false}, {"data": [0.0, 500, 1500, "ub homepage"], "isController": false}, {"data": [0.42333333333333334, 500, 1500, "ub-fee and scholarships"], "isController": false}, {"data": [0.39666666666666667, 500, 1500, "ub-faculties and schools"], "isController": false}, {"data": [0.4533333333333333, 500, 1500, "ub-finance"], "isController": false}, {"data": [0.45, 500, 1500, "ub-health center"], "isController": false}, {"data": [0.53, 500, 1500, "ub-httc application form"], "isController": false}, {"data": [0.30666666666666664, 500, 1500, "ub-job opportunities"], "isController": false}, {"data": [0.42, 500, 1500, "ub-sports"], "isController": false}, {"data": [0.34, 500, 1500, "ub-news"], "isController": false}, {"data": [0.4, 500, 1500, "ub-FET"], "isController": false}, {"data": [0.2866666666666667, 500, 1500, "why us"], "isController": false}, {"data": [0.44, 500, 1500, "ub-Admission requirements"], "isController": false}, {"data": [0.41, 500, 1500, "ub-announcements"], "isController": false}, {"data": [0.36, 500, 1500, "ub-library"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2400, 21, 0.875, 1569.8795833333354, 0, 16171, 1097.0, 3385.5000000000005, 4423.549999999998, 7474.799999999996, 13.67801942278758, 1166.861952451785, 2.0407164183251267], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ub-exchange student", 150, 1, 0.6666666666666666, 1359.8866666666659, 1, 6743, 1073.5, 2514.7000000000003, 3805.2999999999975, 6390.5900000000065, 0.9297136481963555, 78.69180452576856, 0.1515142711044998], "isController": false}, {"data": ["ub-transportation", 150, 3, 2.0, 1121.366666666667, 101, 4541, 944.5, 2178.8, 3077.6999999999985, 4377.290000000003, 0.9412709668107857, 73.77091092282205, 0.1432312910629459], "isController": false}, {"data": ["ub homepage", 150, 0, 0.0, 5107.646666666666, 1904, 16171, 4402.0, 8426.500000000002, 9649.899999999998, 14083.570000000038, 0.9630756784868155, 145.95766163820778, 0.11003892029585685], "isController": false}, {"data": ["ub-fee and scholarships", 150, 0, 0.0, 1272.1266666666672, 282, 6672, 1012.0, 2360.1000000000004, 3144.699999999999, 5653.020000000019, 0.9518249657343012, 75.38865814294189, 0.134779902374486], "isController": false}, {"data": ["ub-faculties and schools", 150, 1, 0.6666666666666666, 1386.2733333333329, 0, 4861, 1013.5, 2879.2, 3958.2499999999995, 4852.84, 0.9509258848365358, 78.84751794476388, 0.13375490717378485], "isController": false}, {"data": ["ub-finance", 150, 0, 0.0, 1262.8333333333337, 259, 10353, 944.0, 2486.7000000000007, 2937.4499999999994, 7562.28000000005, 0.9277585353785255, 73.0932387663904, 0.14043220017936664], "isController": false}, {"data": ["ub-health center", 150, 0, 0.0, 1372.6533333333325, 304, 7516, 1022.5, 2967.8, 4137.949999999998, 7260.490000000004, 0.9495473824143825, 78.29185080632399, 0.14651219377096916], "isController": false}, {"data": ["ub-httc application form", 150, 2, 1.3333333333333333, 1056.0266666666669, 1, 6776, 723.0, 2108.3, 3061.2499999999973, 5848.310000000017, 0.9532464396245479, 58.22540961793883, 0.16808415736192225], "isController": false}, {"data": ["ub-job opportunities", 150, 1, 0.6666666666666666, 1600.2533333333338, 522, 5539, 1256.5, 2823.1000000000004, 4189.299999999999, 5169.250000000006, 0.9625194910196931, 86.91563536713701, 0.1437888817769393], "isController": false}, {"data": ["ub-sports", 150, 0, 0.0, 1258.9933333333333, 288, 5002, 962.0, 2418.0, 3279.199999999999, 4756.690000000004, 0.9286603146301146, 75.9546192724875, 0.1387549102914136], "isController": false}, {"data": ["ub-news", 150, 2, 1.3333333333333333, 1462.6866666666665, 1, 5365, 1164.5, 2771.0, 4136.299999999997, 5318.590000000001, 0.9317291028691045, 79.77246811351255, 0.1256863737724469], "isController": false}, {"data": ["ub-FET", 150, 0, 0.0, 1434.6533333333327, 260, 7538, 1031.0, 2785.7000000000003, 4005.9499999999975, 7146.320000000007, 0.9498179515592844, 81.90844150704447, 0.17345308295076775], "isController": false}, {"data": ["why us", 150, 5, 3.3333333333333335, 1571.9400000000003, 1, 5083, 1351.0, 2805.7, 3720.8499999999995, 4927.450000000003, 0.9711314976789958, 84.51069539489444, 0.1246791219676419], "isController": false}, {"data": ["ub-Admission requirements", 150, 3, 2.0, 1166.4866666666667, 1, 4367, 892.5, 2535.3, 3032.2999999999997, 4259.390000000002, 0.9508776600802541, 75.03095181070879, 0.15743339696289677], "isController": false}, {"data": ["ub-announcements", 150, 1, 0.6666666666666666, 1316.3400000000004, 32, 7122, 1000.5, 2454.5000000000005, 3723.1499999999965, 5955.630000000021, 0.9264177279296417, 60.80378100990341, 0.12671295602912658], "isController": false}, {"data": ["ub-library", 150, 2, 1.3333333333333333, 1367.9066666666665, 3, 4850, 1137.0, 2531.0000000000005, 3065.199999999999, 4707.200000000003, 0.9304287415641127, 84.1434686228414, 0.13626904277491067], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 21, 100.0, 0.875], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2400, 21, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 21, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["ub-exchange student", 150, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["ub-transportation", 150, 3, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ub-faculties and schools", 150, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ub-httc application form", 150, 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["ub-job opportunities", 150, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["ub-news", 150, 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["why us", 150, 5, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["ub-Admission requirements", 150, 3, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["ub-announcements", 150, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["ub-library", 150, 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 2, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
