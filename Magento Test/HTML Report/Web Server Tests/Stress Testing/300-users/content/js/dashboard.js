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

    var data = {"OkPercent": 63.407407407407405, "KoPercent": 36.592592592592595};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.17555555555555555, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.12166666666666667, 500, 1500, "Homepage"], "isController": false}, {"data": [0.18166666666666667, 500, 1500, "Yoga Page"], "isController": false}, {"data": [0.19166666666666668, 500, 1500, "Tops Women"], "isController": false}, {"data": [0.20333333333333334, 500, 1500, "Fitness Equipment"], "isController": false}, {"data": [0.17, 500, 1500, "Bags"], "isController": false}, {"data": [0.17333333333333334, 500, 1500, "Women Bottoms"], "isController": false}, {"data": [0.185, 500, 1500, "Watches"], "isController": false}, {"data": [0.2, 500, 1500, "Men Pants"], "isController": false}, {"data": [0.15333333333333332, 500, 1500, "Tops Men"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2700, 988, 36.592592592592595, 5713.31407407408, 359, 100694, 1092.5, 12879.000000000004, 31356.79999999999, 95411.60999999933, 19.44166420645607, 2209.0468881636266, 2.949158697984547], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Homepage", 300, 7, 2.3333333333333335, 20260.28666666667, 829, 100694, 2567.5, 77301.80000000005, 90976.89999999998, 100546.9, 2.21593553104895, 209.62209123837556, 0.2964679372594786], "isController": false}, {"data": ["Yoga Page", 300, 51, 17.0, 8905.506666666668, 384, 100143, 1523.5, 26700.600000000013, 44317.19999999999, 96714.54000000001, 2.2390566108146435, 468.3165399228458, 0.35422575288278535], "isController": false}, {"data": ["Tops Women", 300, 97, 32.333333333333336, 6038.519999999999, 371, 100178, 1046.0, 17914.70000000007, 30080.6, 100146.96, 2.2460469573550554, 355.59756868926314, 0.3465580266231432], "isController": false}, {"data": ["Fitness Equipment", 300, 128, 42.666666666666664, 3680.776666666667, 366, 100166, 896.5, 3796.3000000000147, 12364.949999999995, 97287.83000000002, 2.254808378867936, 174.32103403868123, 0.3611216544280678], "isController": false}, {"data": ["Bags", 300, 145, 48.333333333333336, 2541.5400000000013, 361, 84808, 945.0, 3122.1000000000017, 8499.3, 46001.880000000034, 2.266374556168316, 173.3649863427325, 0.3342017167787263], "isController": false}, {"data": ["Women Bottoms", 300, 148, 49.333333333333336, 1703.616666666666, 361, 62418, 969.0, 2297.800000000001, 4482.699999999998, 24819.93, 2.294455066921606, 252.5288001912046, 0.3607492829827916], "isController": false}, {"data": ["Watches", 300, 137, 45.666666666666664, 3291.073333333333, 366, 96945, 962.5, 3075.4000000000065, 17998.999999999967, 59139.57000000001, 2.2584409229495237, 143.74705932171491, 0.33964834192795573], "isController": false}, {"data": ["Men Pants", 300, 120, 40.0, 3377.2100000000014, 359, 100159, 985.5, 6118.4000000000115, 16925.79999999996, 71074.83000000022, 2.24943201841535, 292.43580595509013, 0.34488362001094724], "isController": false}, {"data": ["Tops Men", 300, 155, 51.666666666666664, 1621.2966666666673, 362, 39456, 883.5, 2471.800000000002, 4860.54999999999, 19484.270000000004, 2.3075858037321355, 237.73563966518853, 0.3470392712644032], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["524", 17, 1.7206477732793521, 0.6296296296296297], "isController": false}, {"data": ["404/Not Found", 971, 98.27935222672065, 35.96296296296296], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2700, 988, "404/Not Found", 971, "524", 17, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Homepage", 300, 7, "524", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Yoga Page", 300, 51, "404/Not Found", 50, "524", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["Tops Women", 300, 97, "404/Not Found", 92, "524", 5, "", "", "", "", "", ""], "isController": false}, {"data": ["Fitness Equipment", 300, 128, "404/Not Found", 126, "524", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["Bags", 300, 145, "404/Not Found", 145, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Women Bottoms", 300, 148, "404/Not Found", 148, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Watches", 300, 137, "404/Not Found", 137, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Men Pants", 300, 120, "404/Not Found", 118, "524", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["Tops Men", 300, 155, "404/Not Found", 155, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
