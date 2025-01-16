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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6876315789473684, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.75, 500, 1500, "Academic Structure-1"], "isController": false}, {"data": [0.495, 500, 1500, "Academic Structure-2"], "isController": false}, {"data": [0.455, 500, 1500, "Homepage"], "isController": false}, {"data": [0.745, 500, 1500, "Academic Structure-0"], "isController": false}, {"data": [0.99, 500, 1500, "CA Results-1"], "isController": false}, {"data": [0.52, 500, 1500, "CA Results-2"], "isController": false}, {"data": [0.995, 500, 1500, "Final Results-1"], "isController": false}, {"data": [0.985, 500, 1500, "CA Results-0"], "isController": false}, {"data": [0.505, 500, 1500, "Final Results-2"], "isController": false}, {"data": [0.5, 500, 1500, "Login"], "isController": false}, {"data": [0.98, 500, 1500, "Login-0"], "isController": false}, {"data": [0.515, 500, 1500, "Login-1"], "isController": false}, {"data": [0.225, 500, 1500, "Academic Structure"], "isController": false}, {"data": [0.99, 500, 1500, "Final Results-0"], "isController": false}, {"data": [0.46, 500, 1500, "CA Results"], "isController": false}, {"data": [0.515, 500, 1500, "Homepage-2"], "isController": false}, {"data": [0.465, 500, 1500, "Final Results"], "isController": false}, {"data": [0.985, 500, 1500, "Homepage-1"], "isController": false}, {"data": [0.99, 500, 1500, "Homepage-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1900, 0, 0.0, 736.3815789473686, 323, 5786, 608.0, 1383.0, 1473.7999999999993, 2214.95, 30.52895430297577, 256.4540431281734, 5.548436596182274], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Academic Structure-1", 100, 0, 0.0, 669.3799999999998, 338, 1313, 681.0, 972.8, 1117.8499999999995, 1312.79, 1.784981168448673, 2.476905411616657, 0.24404039412384199], "isController": false}, {"data": ["Academic Structure-2", 100, 0, 0.0, 664.1000000000001, 413, 4027, 617.0, 668.0, 711.4999999999999, 4002.139999999987, 1.807305127324646, 24.8897685068045, 0.210028623194954], "isController": false}, {"data": ["Homepage", 100, 0, 0.0, 1384.5599999999997, 1055, 1758, 1375.0, 1495.8, 1545.6999999999998, 1756.8399999999995, 1.7668781030796685, 28.665561171528527, 0.6401482189868721], "isController": false}, {"data": ["Academic Structure-0", 100, 0, 0.0, 501.32, 326, 728, 586.5, 653.4000000000001, 687.9, 727.9499999999999, 1.773804455796793, 2.0109815125230597, 0.2425123279409678], "isController": false}, {"data": ["CA Results-1", 100, 0, 0.0, 379.00000000000006, 341, 648, 370.5, 409.8, 438.84999999999997, 646.6499999999993, 1.8171906232963837, 2.5200032936580046, 0.23424722878429946], "isController": false}, {"data": ["CA Results-2", 100, 0, 0.0, 630.4100000000001, 352, 989, 618.5, 684.9000000000001, 730.2999999999998, 988.7399999999999, 1.8103479488757739, 24.930718832597126, 0.21038223234005576], "isController": false}, {"data": ["Final Results-1", 100, 0, 0.0, 379.9000000000001, 336, 614, 372.0, 424.70000000000005, 447.79999999999995, 612.4499999999991, 1.8136970400464305, 2.515689896347214, 0.23733926109982587], "isController": false}, {"data": ["CA Results-0", 100, 0, 0.0, 369.7800000000001, 330, 617, 358.0, 401.8, 449.84999999999997, 616.6899999999998, 1.8162005085361426, 1.9866998785415908, 0.2341195968034871], "isController": false}, {"data": ["Final Results-2", 100, 0, 0.0, 645.6100000000006, 354, 1795, 621.0, 689.6, 720.5999999999999, 1792.3899999999987, 1.8049889895671636, 24.85639056351756, 0.2097594626547778], "isController": false}, {"data": ["Login", 100, 0, 0.0, 1001.9799999999999, 712, 1379, 989.0, 1070.9, 1175.3499999999992, 1378.1799999999996, 1.7849174475680498, 26.368355365908076, 0.39742302543507363], "isController": false}, {"data": ["Login-0", 100, 0, 0.0, 375.84999999999997, 323, 670, 361.5, 409.40000000000003, 456.34999999999985, 669.7399999999999, 1.8047283883775491, 1.8066318128496663, 0.20091702761234437], "isController": false}, {"data": ["Login-1", 100, 0, 0.0, 625.9799999999998, 350, 1026, 624.5, 671.5, 691.0, 1023.2599999999986, 1.7963318902800482, 24.738752997628843, 0.1999822612225835], "isController": false}, {"data": ["Academic Structure", 100, 0, 0.0, 1835.67, 1134, 5786, 2077.5, 2248.4, 2509.5999999999985, 5754.439999999984, 1.7437095677343981, 28.410443893965024, 0.6794337085215088], "isController": false}, {"data": ["Final Results-0", 100, 0, 0.0, 369.0999999999999, 328, 547, 359.0, 409.70000000000005, 459.95, 546.8399999999999, 1.8123493484604092, 2.0002744010185403, 0.23716290302118637], "isController": false}, {"data": ["CA Results", 100, 0, 0.0, 1379.4600000000007, 1124, 1759, 1363.5, 1477.2, 1627.2999999999993, 1758.5799999999997, 1.785778063502268, 29.02222442654202, 0.6679228499232116], "isController": false}, {"data": ["Homepage-2", 100, 0, 0.0, 622.4099999999997, 366, 730, 618.5, 680.9, 688.8499999999999, 730.0, 1.7960092674078196, 24.734906225866126, 0.20871592072415093], "isController": false}, {"data": ["Final Results", 100, 0, 0.0, 1394.9000000000003, 1059, 2506, 1365.0, 1479.0, 1593.85, 2503.449999999999, 1.7803731662156388, 28.951858153218915, 0.6728558743412619], "isController": false}, {"data": ["Homepage-1", 100, 0, 0.0, 388.8599999999999, 340, 694, 375.0, 458.10000000000014, 485.6499999999999, 692.3699999999992, 1.8039795789511663, 2.5019646465102015, 0.22197404975375679], "isController": false}, {"data": ["Homepage-0", 100, 0, 0.0, 372.98000000000013, 329, 592, 361.5, 415.9, 441.1499999999998, 591.6699999999998, 1.7972035512742173, 1.9136356641565724, 0.2211402807231947], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1900, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
