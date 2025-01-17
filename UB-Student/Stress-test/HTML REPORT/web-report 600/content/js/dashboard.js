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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7026315789473684, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.45, 500, 1500, "Academic Structure-1"], "isController": false}, {"data": [0.5, 500, 1500, "Academic Structure-2"], "isController": false}, {"data": [0.5, 500, 1500, "Homepage"], "isController": false}, {"data": [0.5, 500, 1500, "Academic Structure-0"], "isController": false}, {"data": [1.0, 500, 1500, "CA Results-1"], "isController": false}, {"data": [0.75, 500, 1500, "CA Results-2"], "isController": false}, {"data": [1.0, 500, 1500, "Final Results-1"], "isController": false}, {"data": [1.0, 500, 1500, "CA Results-0"], "isController": false}, {"data": [0.75, 500, 1500, "Final Results-2"], "isController": false}, {"data": [0.5, 500, 1500, "Login"], "isController": false}, {"data": [1.0, 500, 1500, "Login-0"], "isController": false}, {"data": [0.75, 500, 1500, "Login-1"], "isController": false}, {"data": [0.0, 500, 1500, "Academic Structure"], "isController": false}, {"data": [1.0, 500, 1500, "Final Results-0"], "isController": false}, {"data": [0.4, 500, 1500, "CA Results"], "isController": false}, {"data": [0.75, 500, 1500, "Homepage-2"], "isController": false}, {"data": [0.5, 500, 1500, "Final Results"], "isController": false}, {"data": [1.0, 500, 1500, "Homepage-1"], "isController": false}, {"data": [1.0, 500, 1500, "Homepage-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 190, 0, 0.0, 760.2578947368421, 314, 3418, 621.5, 1429.7, 2254.8999999999996, 2849.2500000000023, 3.75004934275451, 31.504346479887896, 0.6815467966683773], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Academic Structure-1", 10, 0, 0.0, 1120.6, 951, 1634, 1043.5, 1603.4, 1634.0, 1634.0, 0.22057039504157752, 0.30673070560469373, 0.030156108697090674], "isController": false}, {"data": ["Academic Structure-2", 10, 0, 0.0, 706.6999999999999, 617, 783, 721.0, 779.1, 783.0, 783.0, 0.2256317689530686, 3.1071081058212995, 0.026220879399819496], "isController": false}, {"data": ["Homepage", 10, 0, 0.0, 1248.5, 1009, 1432, 1275.0, 1429.7, 1432.0, 1432.0, 0.22696838330420574, 3.682517689348374, 0.08223170918541048], "isController": false}, {"data": ["Academic Structure-0", 10, 0, 0.0, 688.8, 603, 1080, 649.0, 1044.9, 1080.0, 1080.0, 0.22010432945216032, 0.24963785959544824, 0.030092388792287546], "isController": false}, {"data": ["CA Results-1", 10, 0, 0.0, 384.5, 317, 470, 377.0, 465.70000000000005, 470.0, 470.0, 0.22779043280182235, 0.3160147351936219, 0.02936361047835991], "isController": false}, {"data": ["CA Results-2", 10, 0, 0.0, 563.5, 332, 811, 563.0, 805.3000000000001, 811.0, 811.0, 0.22794620469569182, 3.1391575963072715, 0.02648984214725325], "isController": false}, {"data": ["Final Results-1", 10, 0, 0.0, 374.29999999999995, 320, 417, 380.0, 415.0, 417.0, 417.0, 0.2293788420956051, 0.3183079439627489, 0.030016371914854578], "isController": false}, {"data": ["CA Results-0", 10, 0, 0.0, 358.59999999999997, 317, 392, 362.0, 391.7, 392.0, 392.0, 0.22755717373990217, 0.24889065877801797, 0.02933354192740926], "isController": false}, {"data": ["Final Results-2", 10, 0, 0.0, 529.1999999999999, 332, 714, 509.5, 711.5, 714.0, 714.0, 0.22982165839308696, 3.165209812810259, 0.02670779037966538], "isController": false}, {"data": ["Login", 10, 0, 0.0, 876.1, 669, 1081, 855.5, 1077.7, 1081.0, 1081.0, 0.22852441783404556, 3.376001936744441, 0.050882389908361705], "isController": false}, {"data": ["Login-0", 10, 0, 0.0, 363.5, 332, 425, 357.0, 424.3, 425.0, 425.0, 0.23029800561927133, 0.2304779259361614, 0.025638645156832944], "isController": false}, {"data": ["Login-1", 10, 0, 0.0, 512.0999999999999, 336, 692, 489.5, 689.1, 692.0, 692.0, 0.23034044317501265, 3.172309767586493, 0.025643369650343206], "isController": false}, {"data": ["Academic Structure", 10, 0, 0.0, 2518.0, 2236, 3418, 2417.0, 3355.5, 3418.0, 3418.0, 0.21258503401360543, 3.4641810825892856, 0.08283342633928571], "isController": false}, {"data": ["Final Results-0", 10, 0, 0.0, 370.3, 314, 497, 362.5, 487.70000000000005, 497.0, 497.0, 0.22845654756465322, 0.25219461071004295, 0.02989568102896829], "isController": false}, {"data": ["CA Results", 10, 0, 0.0, 1307.6, 978, 1533, 1280.5, 1533.0, 1533.0, 1533.0, 0.22423535743115974, 3.6443939058435735, 0.08386927919544354], "isController": false}, {"data": ["Homepage-2", 10, 0, 0.0, 524.3, 348, 715, 532.5, 709.5, 715.0, 715.0, 0.2308988893763421, 3.1801361293264683, 0.02683297640213351], "isController": false}, {"data": ["Final Results", 10, 0, 0.0, 1274.6000000000001, 967, 1444, 1295.0, 1443.2, 1444.0, 1444.0, 0.22509848058525606, 3.661015756893641, 0.08507139842431063], "isController": false}, {"data": ["Homepage-1", 10, 0, 0.0, 370.5, 326, 464, 365.0, 456.20000000000005, 464.0, 464.0, 0.23078165747386398, 0.32007432611756015, 0.028396961759479356], "isController": false}, {"data": ["Homepage-0", 10, 0, 0.0, 353.19999999999993, 328, 378, 353.5, 376.7, 378.0, 378.0, 0.23050503653504828, 0.24549686801281606, 0.02836292441739852], "isController": false}]}, function(index, item){
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
