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

    var data = {"OkPercent": 99.86666666666666, "KoPercent": 0.13333333333333333};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.3373333333333333, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.124, 500, 1500, "Homepage"], "isController": false}, {"data": [0.316, 500, 1500, "Yoga Page"], "isController": false}, {"data": [0.332, 500, 1500, "Tops Women"], "isController": false}, {"data": [0.386, 500, 1500, "Fitness Equipment"], "isController": false}, {"data": [0.382, 500, 1500, "Bags"], "isController": false}, {"data": [0.368, 500, 1500, "Women Bottoms"], "isController": false}, {"data": [0.398, 500, 1500, "Watches"], "isController": false}, {"data": [0.366, 500, 1500, "Men Pants"], "isController": false}, {"data": [0.364, 500, 1500, "Tops Men"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2250, 3, 0.13333333333333333, 4093.1004444444447, 466, 100661, 1126.5, 3472.800000000002, 21022.849999999817, 66676.14999999997, 18.839803061258667, 3385.0159310813838, 2.8578607508289515], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Homepage", 250, 1, 0.4, 16846.247999999992, 924, 100661, 2221.0, 58000.600000000006, 78171.54999999994, 96722.33000000002, 2.216410301875083, 213.76951826322087, 0.2965314564032094], "isController": false}, {"data": ["Yoga Page", 250, 2, 0.8, 5428.587999999999, 672, 100192, 1235.0, 8361.000000000015, 37027.549999999974, 93008.79000000012, 2.2324219098815923, 557.2842688622908, 0.3531761224617363], "isController": false}, {"data": ["Tops Women", 250, 0, 0.0, 4079.3959999999993, 518, 99207, 961.5, 3603.2, 26828.499999999905, 79799.66, 2.2354161450695664, 521.1734076571945, 0.3449177255087807], "isController": false}, {"data": ["Fitness Equipment", 250, 0, 0.0, 1987.0480000000014, 484, 64028, 882.5, 1927.3, 3756.399999999988, 47729.45000000029, 2.2328206777057322, 298.1567873422512, 0.35760018666380866], "isController": false}, {"data": ["Bags", 250, 0, 0.0, 1813.26, 497, 34742, 958.0, 2425.7000000000003, 4313.899999999991, 31675.090000000022, 2.229256765794284, 326.3524360899951, 0.32872829261224307], "isController": false}, {"data": ["Women Bottoms", 250, 0, 0.0, 1457.08, 492, 31990, 1072.5, 2003.3, 2927.6999999999985, 10488.380000000032, 2.2328406198365562, 481.17311527318805, 0.351061855267271], "isController": false}, {"data": ["Watches", 250, 0, 0.0, 1792.6559999999993, 466, 45044, 985.0, 2144.4, 3192.499999999999, 31116.430000000008, 2.232302307307665, 258.1760775183718, 0.3357173391849418], "isController": false}, {"data": ["Men Pants", 250, 0, 0.0, 2182.4959999999987, 487, 65246, 1013.5, 2479.2000000000007, 4586.849999999995, 47426.760000000315, 2.2329004483664097, 481.19077057115356, 0.34234899452492806], "isController": false}, {"data": ["Tops Men", 250, 0, 0.0, 1251.1319999999998, 501, 11904, 931.0, 1979.2, 2703.9999999999995, 6011.5200000000095, 2.2384384653265883, 472.8841247845503, 0.3366401598245064], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["524", 3, 100.0, 0.13333333333333333], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2250, 3, "524", 3, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Homepage", 250, 1, "524", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Yoga Page", 250, 2, "524", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
