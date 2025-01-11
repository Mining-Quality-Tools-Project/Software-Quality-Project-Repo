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

    var data = {"OkPercent": 99.83333333333333, "KoPercent": 0.16666666666666666};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.25, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.245, 500, 1500, "Homepage"], "isController": false}, {"data": [0.3275, 500, 1500, "Yoga Page"], "isController": false}, {"data": [0.31, 500, 1500, "Tops Women"], "isController": false}, {"data": [0.23, 500, 1500, "Fitness Equipment"], "isController": false}, {"data": [0.225, 500, 1500, "Bags"], "isController": false}, {"data": [0.2025, 500, 1500, "Women Bottoms"], "isController": false}, {"data": [0.2275, 500, 1500, "Watches"], "isController": false}, {"data": [0.265, 500, 1500, "Men Pants"], "isController": false}, {"data": [0.2175, 500, 1500, "Tops Men"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1800, 3, 0.16666666666666666, 4278.069444444445, 481, 56701, 1517.5, 8488.2, 12438.099999999935, 45241.08000000001, 16.397176041903894, 2945.362807091209, 2.483248761671601], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Homepage", 200, 0, 0.0, 4059.0299999999984, 808, 55360, 1522.5, 11405.900000000007, 20970.549999999996, 35643.79, 2.507082508085341, 242.7644962252739, 0.33542021836688646], "isController": false}, {"data": ["Yoga Page", 200, 0, 0.0, 4345.300000000001, 661, 52382, 1088.0, 8202.0, 20117.749999999996, 50249.96000000004, 2.3349210796675073, 587.5525630866489, 0.3693918114317736], "isController": false}, {"data": ["Tops Women", 200, 0, 0.0, 3775.885, 507, 54289, 1021.5, 8326.300000000001, 9094.999999999998, 53018.49000000002, 2.200994849672052, 513.1490097586609, 0.3396066271954924], "isController": false}, {"data": ["Fitness Equipment", 200, 0, 0.0, 4936.829999999998, 481, 48943, 1924.5, 8744.6, 17799.249999999985, 42020.270000000026, 2.009081046329409, 268.28097963733575, 0.3217668863261944], "isController": false}, {"data": ["Bags", 200, 1, 0.5, 3866.495000000001, 489, 31606, 2298.0, 8288.1, 8650.6, 29593.770000000004, 1.968407066581369, 286.74397982690317, 0.28881183566261504], "isController": false}, {"data": ["Women Bottoms", 200, 0, 0.0, 4344.874999999996, 558, 56101, 2380.0, 8007.900000000001, 11742.599999999984, 55800.280000000006, 1.9473627839498358, 419.65146922436537, 0.30617715646086285], "isController": false}, {"data": ["Watches", 200, 0, 0.0, 4338.120000000001, 490, 56616, 2038.0, 8388.0, 9124.599999999999, 52624.2100000002, 1.99568931108805, 230.81057026198414, 0.30013296280035123], "isController": false}, {"data": ["Men Pants", 200, 0, 0.0, 5211.805, 512, 55330, 1397.0, 8875.2, 21618.349999999995, 53013.96000000005, 2.080602542496307, 448.37093494150906, 0.3189986320038283], "isController": false}, {"data": ["Tops Men", 200, 2, 1.0, 3624.2849999999976, 515, 56701, 2043.0, 8455.6, 9417.4, 22926.060000000012, 1.9456199231480131, 406.95308319957195, 0.28967696629213485], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: magento.softwaretestingboard.com:443 failed to respond", 3, 100.0, 0.16666666666666666], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1800, 3, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: magento.softwaretestingboard.com:443 failed to respond", 3, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Bags", 200, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: magento.softwaretestingboard.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Tops Men", 200, 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: magento.softwaretestingboard.com:443 failed to respond", 2, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
