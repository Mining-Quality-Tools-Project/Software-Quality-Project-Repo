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

    var data = {"OkPercent": 99.89468141126909, "KoPercent": 0.105318588730911};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6732490784623486, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.74, 500, 1500, "Academic Structure-1"], "isController": false}, {"data": [0.52, 500, 1500, "Academic Structure-2"], "isController": false}, {"data": [0.385, 500, 1500, "Homepage"], "isController": false}, {"data": [0.745, 500, 1500, "Academic Structure-0"], "isController": false}, {"data": [0.985, 500, 1500, "CA Results-1"], "isController": false}, {"data": [0.525, 500, 1500, "CA Results-2"], "isController": false}, {"data": [0.955, 500, 1500, "Final Results-1"], "isController": false}, {"data": [0.97, 500, 1500, "CA Results-0"], "isController": false}, {"data": [0.51, 500, 1500, "Final Results-2"], "isController": false}, {"data": [0.495, 500, 1500, "Login"], "isController": false}, {"data": [0.98, 500, 1500, "Login-0"], "isController": false}, {"data": [0.52, 500, 1500, "Login-1"], "isController": false}, {"data": [0.22, 500, 1500, "Academic Structure"], "isController": false}, {"data": [0.99, 500, 1500, "Final Results-0"], "isController": false}, {"data": [0.425, 500, 1500, "CA Results"], "isController": false}, {"data": [0.5202020202020202, 500, 1500, "Homepage-2"], "isController": false}, {"data": [0.385, 500, 1500, "Final Results"], "isController": false}, {"data": [0.95, 500, 1500, "Homepage-1"], "isController": false}, {"data": [0.97, 500, 1500, "Homepage-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1899, 2, 0.105318588730911, 760.6061084781452, 2, 5604, 616.0, 1433.0, 1558.0, 2326.0, 30.77197303603837, 258.20915730530527, 5.587794665138061], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Academic Structure-1", 100, 0, 0.0, 698.5099999999998, 345, 1310, 887.5, 1025.0, 1165.099999999999, 1309.6, 1.80485867956539, 2.502743244188355, 0.24675802259683066], "isController": false}, {"data": ["Academic Structure-2", 100, 0, 0.0, 641.37, 367, 1207, 625.0, 718.8, 746.55, 1204.7799999999988, 1.826417299824664, 25.15267350393593, 0.21224966667884276], "isController": false}, {"data": ["Homepage", 100, 1, 1.0, 1426.0699999999997, 645, 1944, 1406.5, 1593.1000000000001, 1687.1999999999996, 1942.6499999999992, 1.7819276893743652, 28.68398932402573, 0.6413373534364476], "isController": false}, {"data": ["Academic Structure-0", 100, 0, 0.0, 524.61, 331, 954, 594.5, 725.1000000000001, 737.9, 953.4299999999997, 1.7947199339543065, 2.0336595517238285, 0.24537186597031532], "isController": false}, {"data": ["CA Results-1", 100, 0, 0.0, 396.3800000000001, 348, 626, 389.0, 443.9, 466.9, 625.97, 1.8337856671312258, 2.54326731322893, 0.23638643365363457], "isController": false}, {"data": ["CA Results-2", 100, 0, 0.0, 625.7200000000001, 357, 928, 630.5, 676.9, 687.95, 926.3099999999991, 1.8258503898190583, 25.145525981851048, 0.2121837855356132], "isController": false}, {"data": ["Final Results-1", 100, 0, 0.0, 407.06999999999994, 341, 688, 390.5, 493.0000000000001, 597.5499999999997, 687.3899999999996, 1.8263839424323782, 2.5314323530217524, 0.23899946121673699], "isController": false}, {"data": ["CA Results-0", 100, 0, 0.0, 391.94, 333, 854, 375.0, 438.9, 512.6999999999999, 853.2899999999996, 1.8346940647647005, 2.00528119553252, 0.23650353178607467], "isController": false}, {"data": ["Final Results-2", 100, 0, 0.0, 667.4, 366, 2204, 644.5, 716.4000000000001, 765.7999999999995, 2197.5999999999967, 1.8193726802998327, 25.05555127560767, 0.21143100483953134], "isController": false}, {"data": ["Login", 100, 0, 0.0, 1063.94, 715, 5604, 1016.5, 1113.9, 1184.6999999999998, 5562.469999999978, 1.800958109714368, 26.603229089750744, 0.4009945791160897], "isController": false}, {"data": ["Login-0", 100, 0, 0.0, 383.57000000000016, 327, 640, 376.5, 412.0, 495.9499999999993, 639.3299999999997, 1.821095571095571, 1.822678359238418, 0.20273915537587414], "isController": false}, {"data": ["Login-1", 100, 0, 0.0, 680.2500000000001, 357, 5195, 628.0, 714.6, 749.8499999999999, 5153.519999999979, 1.8123493484604092, 24.957572618572957, 0.201765454809069], "isController": false}, {"data": ["Academic Structure", 100, 0, 0.0, 1865.1600000000003, 1103, 2726, 2038.0, 2379.6, 2569.349999999999, 2725.5499999999997, 1.763170886522322, 28.724515982042103, 0.6870167809789125], "isController": false}, {"data": ["Final Results-0", 100, 0, 0.0, 378.46000000000004, 336, 669, 369.0, 409.0, 434.24999999999983, 668.99, 1.827151470856934, 2.015986861638955, 0.23909989950666913], "isController": false}, {"data": ["CA Results", 100, 0, 0.0, 1414.3899999999996, 1092, 1905, 1395.0, 1548.6, 1656.2999999999997, 1904.3999999999996, 1.8025488040088686, 29.294709829073312, 0.6741954999369109], "isController": false}, {"data": ["Homepage-2", 99, 0, 0.0, 640.262626262626, 365, 964, 638.0, 705.0, 762.0, 964.0, 1.7885855720763852, 24.6317958347636, 0.20785320612997055], "isController": false}, {"data": ["Final Results", 100, 0, 0.0, 1453.3199999999995, 1070, 3262, 1413.0, 1607.1000000000001, 1666.9499999999998, 3254.7299999999964, 1.7952676744102545, 29.192700385533733, 0.6784849511687193], "isController": false}, {"data": ["Homepage-1", 100, 1, 1.0, 406.65, 2, 920, 386.0, 478.6000000000002, 644.5499999999995, 918.8899999999994, 1.8128421739603349, 2.536368021690657, 0.22083391873028535], "isController": false}, {"data": ["Homepage-0", 100, 0, 0.0, 385.24000000000007, 325, 643, 366.0, 432.00000000000006, 566.6499999999992, 642.6999999999998, 1.8133023863059403, 1.929555610584246, 0.22312119206498873], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: ubstudent.online:443 failed to respond", 2, 100.0, 0.105318588730911], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1899, 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: ubstudent.online:443 failed to respond", 2, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Homepage", 100, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: ubstudent.online:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Homepage-1", 100, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: ubstudent.online:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
