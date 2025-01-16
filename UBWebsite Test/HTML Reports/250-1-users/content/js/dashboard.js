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

    var data = {"OkPercent": 98.7, "KoPercent": 1.3};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.376, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.388, 500, 1500, "ub-exchange student"], "isController": false}, {"data": [0.446, 500, 1500, "ub-transportation"], "isController": false}, {"data": [0.0, 500, 1500, "ub homepage"], "isController": false}, {"data": [0.446, 500, 1500, "ub-fee and scholarships"], "isController": false}, {"data": [0.422, 500, 1500, "ub-faculties and schools"], "isController": false}, {"data": [0.39, 500, 1500, "ub-finance"], "isController": false}, {"data": [0.45, 500, 1500, "ub-health center"], "isController": false}, {"data": [0.536, 500, 1500, "ub-httc application form"], "isController": false}, {"data": [0.304, 500, 1500, "ub-job opportunities"], "isController": false}, {"data": [0.37, 500, 1500, "ub-sports"], "isController": false}, {"data": [0.352, 500, 1500, "ub-news"], "isController": false}, {"data": [0.418, 500, 1500, "ub-FET"], "isController": false}, {"data": [0.284, 500, 1500, "why us"], "isController": false}, {"data": [0.462, 500, 1500, "ub-Admission requirements"], "isController": false}, {"data": [0.412, 500, 1500, "ub-announcements"], "isController": false}, {"data": [0.336, 500, 1500, "ub-library"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 4000, 52, 1.3, 1396.7685000000015, 0, 11243, 1093.0, 2850.7000000000003, 3899.8999999999996, 4994.499999999989, 52.41639584862145, 4453.6066652156605, 7.788224144793742], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ub-exchange student", 250, 6, 2.4, 1176.5320000000002, 0, 4851, 1004.5, 1981.5, 2446.1499999999996, 4277.310000000005, 3.966491083328045, 330.0050857852859, 0.6351343847179032], "isController": false}, {"data": ["ub-transportation", 250, 3, 1.2, 1080.8880000000001, 1, 3635, 948.0, 1967.0000000000005, 2224.2, 3400.1000000000026, 3.9498838734141217, 312.03224734567806, 0.6059523021898157], "isController": false}, {"data": ["ub homepage", 250, 0, 0.0, 4229.372000000002, 2039, 11243, 4118.5, 5267.0, 6008.999999999999, 7808.700000000001, 4.482777170112428, 679.4076766438344, 0.5121923133819865], "isController": false}, {"data": ["ub-fee and scholarships", 250, 3, 1.2, 1063.952000000001, 0, 3966, 897.0, 1881.0, 2252.4499999999994, 3241.9100000000008, 3.9008862813631255, 305.3558010567501, 0.5457431334649233], "isController": false}, {"data": ["ub-faculties and schools", 250, 0, 0.0, 1163.204000000001, 285, 5062, 1019.5, 2068.7, 2662.699999999999, 4141.720000000007, 3.8988786824909156, 325.3986633912837, 0.5520873134386551], "isController": false}, {"data": ["ub-finance", 250, 3, 1.2, 1208.4920000000002, 0, 4076, 1031.5, 2109.2000000000003, 2740.9999999999995, 3871.6700000000037, 3.994120654396728, 310.99743053225654, 0.597323864271792], "isController": false}, {"data": ["ub-health center", 250, 0, 0.0, 1133.9519999999998, 262, 3915, 956.0, 2011.2, 2390.199999999999, 3704.6100000000006, 3.9415390921847164, 324.9885972505794, 0.6081671646144386], "isController": false}, {"data": ["ub-httc application form", 250, 4, 1.6, 884.4520000000001, 0, 4348, 752.0, 1527.7, 1852.3999999999996, 3583.440000000005, 3.8837364651784188, 236.60247457123552, 0.6829611257398518], "isController": false}, {"data": ["ub-job opportunities", 250, 4, 1.6, 1502.5239999999992, 0, 4673, 1276.5, 2673.1, 3137.25, 3966.780000000003, 4.487444131320565, 401.49758631598786, 0.6640716151208917], "isController": false}, {"data": ["ub-sports", 250, 5, 2.0, 1229.648, 0, 4493, 1068.0, 2174.0, 2596.5999999999976, 3834.45, 4.028943933216226, 323.09753896996017, 0.5899412630336336], "isController": false}, {"data": ["ub-news", 250, 5, 2.0, 1323.0400000000002, 0, 4646, 1107.0, 2247.9, 3115.35, 4519.85, 4.116581590647127, 350.1249929246254, 0.5515576115593611], "isController": false}, {"data": ["ub-FET", 250, 1, 0.4, 1175.0, 283, 5680, 986.0, 1979.6000000000004, 2871.5499999999993, 4041.82, 3.8940203423622686, 334.487433752979, 0.7082705828180247], "isController": false}, {"data": ["why us", 250, 13, 5.2, 1526.2279999999998, 0, 3916, 1321.0, 2426.9, 2993.2, 3671.6400000000003, 4.652894100130281, 397.2735131095292, 0.5858284477945283], "isController": false}, {"data": ["ub-Admission requirements", 250, 1, 0.4, 1080.8159999999991, 1, 5247, 918.5, 1833.4, 2221.5999999999995, 4106.560000000015, 3.9138943248532287, 313.7490215264188, 0.6585891634050881], "isController": false}, {"data": ["ub-announcements", 250, 3, 1.2, 1140.1559999999993, 0, 4497, 951.5, 1935.0, 2540.749999999998, 3999.7400000000002, 4.201610056973832, 274.3285203452463, 0.5715995056805768], "isController": false}, {"data": ["ub-library", 250, 1, 0.4, 1430.040000000001, 234, 6113, 1212.5, 2407.1, 3301.3499999999995, 5504.070000000001, 4.065635621473061, 371.07763039001645, 0.6010788164121579], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 52, 100.0, 1.3], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 4000, 52, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 52, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["ub-exchange student", 250, 6, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["ub-transportation", 250, 3, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["ub-fee and scholarships", 250, 3, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["ub-finance", 250, 3, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["ub-httc application form", 250, 4, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["ub-job opportunities", 250, 4, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["ub-sports", 250, 5, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["ub-news", 250, 5, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["ub-FET", 250, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["why us", 250, 13, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["ub-Admission requirements", 250, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["ub-announcements", 250, 3, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["ub-library", 250, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
