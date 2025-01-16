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

    var data = {"OkPercent": 58.58585858585859, "KoPercent": 41.41414141414141};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.2086868686868687, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.11454545454545455, 500, 1500, "Homepage"], "isController": false}, {"data": [0.2545454545454545, 500, 1500, "Yoga Page"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "Tops Women"], "isController": false}, {"data": [0.23272727272727273, 500, 1500, "Fitness Equipment"], "isController": false}, {"data": [0.21454545454545454, 500, 1500, "Bags"], "isController": false}, {"data": [0.19818181818181818, 500, 1500, "Women Bottoms"], "isController": false}, {"data": [0.22363636363636363, 500, 1500, "Watches"], "isController": false}, {"data": [0.23272727272727273, 500, 1500, "Men Pants"], "isController": false}, {"data": [0.18, 500, 1500, "Tops Men"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2475, 1025, 41.41414141414141, 4691.72484848485, 352, 100678, 1009.0, 2468.600000000001, 37665.2, 87458.75999999982, 19.592941791151116, 2021.6697441438873, 2.9721064045170635], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Homepage", 275, 5, 1.8181818181818181, 23374.160000000018, 905, 100678, 2031.0, 72399.0, 88353.39999999998, 100573.28, 2.2356996520438357, 212.59510933079412, 0.299112160478521], "isController": false}, {"data": ["Yoga Page", 275, 98, 35.63636363636363, 2926.1381818181826, 372, 97077, 1106.0, 1824.2000000000003, 4013.3999999999673, 59764.00000000007, 2.262853005068791, 367.9245504379649, 0.3579904168175235], "isController": false}, {"data": ["Tops Women", 275, 107, 38.90909090909091, 4133.552727272728, 367, 79171, 1009.0, 3401.4000000000005, 30449.399999999972, 72928.0, 2.2687335516817506, 324.6984630748146, 0.3500584972321451], "isController": false}, {"data": ["Fitness Equipment", 275, 128, 46.54545454545455, 2230.632727272728, 358, 100149, 929.0, 1905.0000000000002, 3840.999999999978, 46596.32000000004, 2.283446260130198, 164.87055292353776, 0.365708190098977], "isController": false}, {"data": ["Bags", 275, 138, 50.18181818181818, 2256.1272727272726, 352, 100157, 948.0, 1547.6, 2064.2, 88686.00000000012, 2.296335882962023, 169.51248136836568, 0.33861984211647017], "isController": false}, {"data": ["Women Bottoms", 275, 144, 52.36363636363637, 1299.6581818181824, 363, 47397, 974.0, 1534.2, 2242.9999999999986, 11756.36000000017, 2.302507640138988, 238.5013537044208, 0.36201536138904006], "isController": false}, {"data": ["Watches", 275, 133, 48.36363636363637, 2194.9454545454532, 355, 100170, 951.0, 1941.0000000000007, 3937.0, 93676.72000000003, 2.2897013396834383, 138.6972194569453, 0.3443496155383296], "isController": false}, {"data": ["Men Pants", 275, 122, 44.36363636363637, 2752.2799999999993, 352, 100159, 938.0, 1881.0000000000002, 4511.999999999991, 91324.0000000001, 2.2756235208447118, 274.6164847072927, 0.3488993093482614], "isController": false}, {"data": ["Tops Men", 275, 150, 54.54545454545455, 1058.0290909090904, 359, 30824, 860.0, 1516.4000000000003, 1869.1999999999998, 6627.440000000135, 2.3081507096514273, 223.87377490966736, 0.3471242278186717], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["524", 10, 0.975609756097561, 0.40404040404040403], "isController": false}, {"data": ["404/Not Found", 1015, 99.02439024390245, 41.01010101010101], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2475, 1025, "404/Not Found", 1015, "524", 10, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Homepage", 275, 5, "524", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Yoga Page", 275, 98, "404/Not Found", 98, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Tops Women", 275, 107, "404/Not Found", 107, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Fitness Equipment", 275, 128, "404/Not Found", 127, "524", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["Bags", 275, 138, "404/Not Found", 137, "524", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["Women Bottoms", 275, 144, "404/Not Found", 144, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Watches", 275, 133, "404/Not Found", 132, "524", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["Men Pants", 275, 122, "404/Not Found", 120, "524", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["Tops Men", 275, 150, "404/Not Found", 150, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
