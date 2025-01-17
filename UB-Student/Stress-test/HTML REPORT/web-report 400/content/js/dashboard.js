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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6815789473684211, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.45, 500, 1500, "Academic Structure-1"], "isController": false}, {"data": [0.5, 500, 1500, "Academic Structure-2"], "isController": false}, {"data": [0.5, 500, 1500, "Homepage"], "isController": false}, {"data": [0.5, 500, 1500, "Academic Structure-0"], "isController": false}, {"data": [1.0, 500, 1500, "CA Results-1"], "isController": false}, {"data": [0.65, 500, 1500, "CA Results-2"], "isController": false}, {"data": [1.0, 500, 1500, "Final Results-1"], "isController": false}, {"data": [1.0, 500, 1500, "CA Results-0"], "isController": false}, {"data": [0.6, 500, 1500, "Final Results-2"], "isController": false}, {"data": [0.5, 500, 1500, "Login"], "isController": false}, {"data": [1.0, 500, 1500, "Login-0"], "isController": false}, {"data": [0.65, 500, 1500, "Login-1"], "isController": false}, {"data": [0.0, 500, 1500, "Academic Structure"], "isController": false}, {"data": [1.0, 500, 1500, "Final Results-0"], "isController": false}, {"data": [0.5, 500, 1500, "CA Results"], "isController": false}, {"data": [0.6, 500, 1500, "Homepage-2"], "isController": false}, {"data": [0.5, 500, 1500, "Final Results"], "isController": false}, {"data": [1.0, 500, 1500, "Homepage-1"], "isController": false}, {"data": [1.0, 500, 1500, "Homepage-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 190, 0, 0.0, 772.2473684210527, 321, 3341, 630.0, 1433.0, 2215.3999999999996, 2559.310000000003, 3.619668133584805, 30.40617974986188, 0.6578508696728963], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Academic Structure-1", 10, 0, 0.0, 1064.3999999999999, 897, 1765, 971.5, 1702.6000000000004, 1765.0, 1765.0, 0.21962575770886408, 0.30520259103487657, 0.030026959061758764], "isController": false}, {"data": ["Academic Structure-2", 10, 0, 0.0, 672.1, 597, 734, 664.0, 733.9, 734.0, 734.0, 0.2247241511045192, 3.094653461313737, 0.026115404278747836], "isController": false}, {"data": ["Homepage", 10, 0, 0.0, 1324.1000000000001, 1098, 1455, 1339.0, 1453.3, 1455.0, 1455.0, 0.21733460836303573, 3.5252352647135528, 0.07874134736590455], "isController": false}, {"data": ["Academic Structure-0", 10, 0, 0.0, 679.1, 568, 896, 681.0, 878.3000000000001, 896.0, 896.0, 0.21980920560953093, 0.24934606761331166, 0.030052039829428057], "isController": false}, {"data": ["CA Results-1", 10, 0, 0.0, 378.7, 334, 428, 373.0, 427.7, 428.0, 428.0, 0.22638775695010416, 0.31371506553925566, 0.029182796794349364], "isController": false}, {"data": ["CA Results-2", 10, 0, 0.0, 597.6, 380, 717, 664.0, 717.0, 717.0, 717.0, 0.22464337863641468, 3.093497276199034, 0.02610601763450522], "isController": false}, {"data": ["Final Results-1", 10, 0, 0.0, 387.40000000000003, 360, 487, 373.0, 481.40000000000003, 487.0, 487.0, 0.22481508958881322, 0.31215048279040486, 0.029419162114161103], "isController": false}, {"data": ["CA Results-0", 10, 0, 0.0, 348.79999999999995, 328, 381, 348.5, 378.5, 381.0, 381.0, 0.22651595804924457, 0.24761910492219177, 0.029199322717285432], "isController": false}, {"data": ["Final Results-2", 10, 0, 0.0, 587.8, 357, 698, 621.0, 697.0, 698.0, 698.0, 0.22347367480110844, 3.077913398364173, 0.02597008525520694], "isController": false}, {"data": ["Login", 10, 0, 0.0, 934.2, 709, 1126, 994.5, 1115.1000000000001, 1126.0, 1126.0, 0.22056553001896864, 3.2585110723896067, 0.049110293793285985], "isController": false}, {"data": ["Login-0", 10, 0, 0.0, 349.59999999999997, 321, 377, 353.5, 376.7, 377.0, 377.0, 0.22364360155655946, 0.22394936429306259, 0.024897822829538847], "isController": false}, {"data": ["Login-1", 10, 0, 0.0, 584.3000000000001, 374, 762, 635.0, 753.3000000000001, 762.0, 762.0, 0.22230620456616945, 3.061616680190294, 0.024748932930218084], "isController": false}, {"data": ["Academic Structure", 10, 0, 0.0, 2417.6, 2210, 3341, 2296.0, 3255.1000000000004, 3341.0, 3341.0, 0.212021626205873, 3.4548758348351534, 0.08261389536732747], "isController": false}, {"data": ["Final Results-0", 10, 0, 0.0, 360.7, 333, 408, 358.5, 404.7, 408.0, 408.0, 0.22481508958881322, 0.24791132730828894, 0.029419162114161103], "isController": false}, {"data": ["CA Results", 10, 0, 0.0, 1325.7, 1071, 1483, 1386.5, 1479.2, 1483.0, 1483.0, 0.22105798350907443, 3.592105881247651, 0.08268086687888233], "isController": false}, {"data": ["Homepage-2", 10, 0, 0.0, 602.1999999999999, 380, 746, 635.5, 743.5, 746.0, 746.0, 0.22092124157737766, 3.0423271291284655, 0.025673464597371038], "isController": false}, {"data": ["Final Results", 10, 0, 0.0, 1336.8999999999999, 1056, 1500, 1366.5, 1493.3, 1500.0, 1500.0, 0.21954860806182488, 3.570795163893036, 0.08297393683586546], "isController": false}, {"data": ["Homepage-1", 10, 0, 0.0, 367.8, 347, 398, 362.0, 397.2, 398.0, 398.0, 0.22281143468282794, 0.30871568703905883, 0.027416250751988593], "isController": false}, {"data": ["Homepage-0", 10, 0, 0.0, 353.69999999999993, 325, 384, 350.5, 382.3, 384.0, 384.0, 0.2226973098164974, 0.2368768650899697, 0.02740220804382683], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 190, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
