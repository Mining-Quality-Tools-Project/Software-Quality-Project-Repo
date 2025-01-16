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

    var data = {"OkPercent": 99.77777777777777, "KoPercent": 0.2222222222222222};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.49160493827160495, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.40555555555555556, 500, 1500, "Homepage"], "isController": false}, {"data": [0.4855555555555556, 500, 1500, "Yoga Page"], "isController": false}, {"data": [0.4988888888888889, 500, 1500, "Tops Women"], "isController": false}, {"data": [0.5122222222222222, 500, 1500, "Fitness Equipment"], "isController": false}, {"data": [0.5011111111111111, 500, 1500, "Bags"], "isController": false}, {"data": [0.4988888888888889, 500, 1500, "Women Bottoms"], "isController": false}, {"data": [0.5222222222222223, 500, 1500, "Watches"], "isController": false}, {"data": [0.49777777777777776, 500, 1500, "Men Pants"], "isController": false}, {"data": [0.5022222222222222, 500, 1500, "Tops Men"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 4050, 9, 0.2222222222222222, 835.1651851851833, 407, 5353, 768.0, 1152.0, 1353.0, 1753.8999999999978, 8.877957675158816, 1591.8094538192756, 1.3467214442135444], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Homepage", 450, 1, 0.2222222222222222, 1328.824444444444, 778, 5353, 1265.0, 1606.5000000000002, 1778.05, 3469.7100000000028, 1.0002889723697959, 96.64653990319425, 0.13382772384244337], "isController": false}, {"data": ["Yoga Page", 450, 0, 0.0, 1010.322222222222, 625, 2875, 1004.0, 1181.8000000000002, 1265.5999999999997, 2064.1000000000045, 1.0074303585780457, 253.50682179018696, 0.15937863094691737], "isController": false}, {"data": ["Tops Women", 450, 0, 0.0, 798.9933333333338, 484, 1749, 790.0, 974.1000000000004, 1064.8, 1335.88, 1.0090296946227686, 235.25018654786837, 0.1556901286624975], "isController": false}, {"data": ["Fitness Equipment", 450, 3, 0.6666666666666666, 683.8155555555554, 465, 1842, 646.5, 841.8000000000001, 951.2999999999998, 1618.9400000000028, 1.0118635378347018, 134.22415723361567, 0.162056269731339], "isController": false}, {"data": ["Bags", 450, 3, 0.6666666666666666, 711.2133333333331, 407, 1690, 710.0, 856.9000000000001, 917.4999999999999, 1079.3500000000001, 1.0149444938133494, 147.5999263072767, 0.14966466656817945], "isController": false}, {"data": ["Women Bottoms", 450, 0, 0.0, 780.5377777777783, 489, 2125, 743.0, 928.8000000000001, 1029.0, 1564.5300000000027, 1.0148163182463974, 218.69272057807885, 0.15955608128678708], "isController": false}, {"data": ["Watches", 450, 1, 0.2222222222222222, 677.7600000000002, 408, 1921, 663.5, 829.9000000000001, 907.45, 1284.1600000000008, 1.0143176572417774, 117.05223783480935, 0.15254386642112666], "isController": false}, {"data": ["Men Pants", 450, 1, 0.2222222222222222, 759.9288888888892, 492, 1734, 736.0, 913.9000000000001, 963.0999999999998, 1267.3800000000006, 1.0098901912732021, 214.15492949844364, 0.15483667971669213], "isController": false}, {"data": ["Tops Men", 450, 0, 0.0, 765.0911111111114, 493, 1336, 739.5, 937.9000000000001, 1022.3499999999999, 1138.45, 1.0148346270595505, 214.39031184599546, 0.1526216138351277], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["520", 9, 100.0, 0.2222222222222222], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 4050, 9, "520", 9, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Homepage", 450, 1, "520", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Fitness Equipment", 450, 3, "520", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Bags", 450, 3, "520", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Watches", 450, 1, "520", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Men Pants", 450, 1, "520", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
