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

    var data = {"OkPercent": 99.94728518713758, "KoPercent": 0.05271481286241434};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.680021085925145, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.725, 500, 1500, "Academic Structure-1"], "isController": false}, {"data": [0.505, 500, 1500, "Academic Structure-2"], "isController": false}, {"data": [0.41, 500, 1500, "Homepage"], "isController": false}, {"data": [0.75, 500, 1500, "Academic Structure-0"], "isController": false}, {"data": [0.98, 500, 1500, "CA Results-1"], "isController": false}, {"data": [0.52, 500, 1500, "CA Results-2"], "isController": false}, {"data": [0.9848484848484849, 500, 1500, "Final Results-1"], "isController": false}, {"data": [0.99, 500, 1500, "CA Results-0"], "isController": false}, {"data": [0.5353535353535354, 500, 1500, "Final Results-2"], "isController": false}, {"data": [0.49, 500, 1500, "Login"], "isController": false}, {"data": [0.99, 500, 1500, "Login-0"], "isController": false}, {"data": [0.55, 500, 1500, "Login-1"], "isController": false}, {"data": [0.23, 500, 1500, "Academic Structure"], "isController": false}, {"data": [0.98989898989899, 500, 1500, "Final Results-0"], "isController": false}, {"data": [0.38, 500, 1500, "CA Results"], "isController": false}, {"data": [0.545, 500, 1500, "Homepage-2"], "isController": false}, {"data": [0.4, 500, 1500, "Final Results"], "isController": false}, {"data": [0.975, 500, 1500, "Homepage-1"], "isController": false}, {"data": [0.975, 500, 1500, "Homepage-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1897, 1, 0.05271481286241434, 781.0474433315765, 135, 5226, 615.0, 1446.2, 1634.199999999998, 2531.5799999999995, 30.289966149326183, 254.35465978176694, 5.501638893546017], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Academic Structure-1", 100, 0, 0.0, 728.0200000000001, 344, 2529, 702.5, 1007.6, 1207.749999999999, 2528.2499999999995, 1.777714570148617, 2.466092872253431, 0.2430469138875062], "isController": false}, {"data": ["Academic Structure-2", 100, 0, 0.0, 716.0699999999998, 401, 2560, 645.0, 738.9, 1774.6499999999971, 2555.969999999998, 1.797300454717015, 24.750512230629592, 0.2088659708118406], "isController": false}, {"data": ["Homepage", 100, 0, 0.0, 1448.91, 1048, 2777, 1400.5, 1576.8000000000002, 2034.1499999999983, 2774.5399999999986, 1.756265477089517, 28.49314342981085, 0.6363032148439558], "isController": false}, {"data": ["Academic Structure-0", 100, 0, 0.0, 522.35, 327, 1264, 535.5, 680.9, 716.4499999999998, 1258.9499999999975, 1.7665971805108998, 2.0024655071900503, 0.2415269582729746], "isController": false}, {"data": ["CA Results-1", 100, 0, 0.0, 402.67999999999995, 341, 681, 399.5, 452.40000000000003, 491.54999999999967, 679.7799999999994, 1.808612613264365, 2.507966373369988, 0.23314146967860955], "isController": false}, {"data": ["CA Results-2", 100, 0, 0.0, 749.8299999999999, 376, 4402, 648.0, 724.1, 1842.4499999999973, 4398.119999999998, 1.8022564250441553, 24.820133400767762, 0.20944190876977978], "isController": false}, {"data": ["Final Results-1", 99, 0, 0.0, 399.32323232323233, 334, 1132, 387.0, 436.0, 473.0, 1132.0, 1.7813765182186234, 2.470408794421952, 0.23310981781376516], "isController": false}, {"data": ["CA Results-0", 100, 0, 0.0, 384.54999999999995, 324, 527, 378.5, 428.6, 448.0, 526.8699999999999, 1.8069785511645975, 1.976241620136969, 0.23293082886106142], "isController": false}, {"data": ["Final Results-2", 99, 0, 0.0, 654.1818181818179, 361, 1806, 636.0, 715.0, 750.0, 1806.0, 1.775402603923819, 24.450349532387648, 0.2063212010419282], "isController": false}, {"data": ["Login", 100, 0, 0.0, 1033.1600000000003, 730, 2182, 1005.5, 1208.5000000000002, 1298.4999999999995, 2179.2199999999984, 1.773584236383307, 26.198800918494936, 0.39489961513222066], "isController": false}, {"data": ["Login-0", 100, 0, 0.0, 385.83999999999986, 337, 634, 373.0, 450.70000000000005, 491.84999999999997, 632.8099999999994, 1.793143021087362, 1.794631469884163, 0.19962725039449147], "isController": false}, {"data": ["Login-1", 100, 0, 0.0, 647.2, 380, 1772, 624.5, 729.5, 874.1499999999994, 1769.4599999999987, 1.7848537312367252, 24.578934877380547, 0.19870441929783852], "isController": false}, {"data": ["Academic Structure", 100, 0, 0.0, 1967.0800000000002, 1103, 5215, 2178.5, 2426.8, 3513.2999999999984, 5205.429999999995, 1.7372873994544917, 28.30332983704244, 0.676931320685881], "isController": false}, {"data": ["Final Results-0", 99, 0, 0.0, 382.4141414141414, 327, 618, 375.0, 421.0, 480.0, 618.0, 1.7851346965271018, 1.9696598946500055, 0.2336016106783512], "isController": false}, {"data": ["CA Results", 100, 0, 0.0, 1537.4499999999996, 1111, 5226, 1430.0, 1589.7000000000003, 2639.4999999999977, 5221.279999999998, 1.7764198035279697, 28.87046485575471, 0.6644226413586058], "isController": false}, {"data": ["Homepage-2", 100, 0, 0.0, 652.0699999999997, 359, 2010, 629.5, 722.3000000000001, 817.6999999999999, 2007.1499999999985, 1.7852679687221051, 24.586208358624628, 0.2074676643339165], "isController": false}, {"data": ["Final Results", 100, 1, 1.0, 1423.1399999999999, 135, 2523, 1393.5, 1558.5, 1706.7999999999995, 2521.119999999999, 1.7687532058651856, 28.511852581053116, 0.6617797028936803], "isController": false}, {"data": ["Homepage-1", 100, 0, 0.0, 406.62, 343, 1280, 386.0, 441.40000000000003, 524.8499999999992, 1277.4499999999987, 1.7918899062841578, 2.485582285824359, 0.22048645331230848], "isController": false}, {"data": ["Homepage-0", 100, 0, 0.0, 389.94, 331, 845, 372.5, 446.40000000000003, 517.0999999999998, 842.1999999999986, 1.786511835640911, 1.9023908552925413, 0.21982469852612774], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: ubstudent.online:80 failed to respond", 1, 100.0, 0.05271481286241434], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1897, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: ubstudent.online:80 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Final Results", 100, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: ubstudent.online:80 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
