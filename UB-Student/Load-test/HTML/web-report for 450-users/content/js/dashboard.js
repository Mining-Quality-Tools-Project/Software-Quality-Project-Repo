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

    var data = {"OkPercent": 99.91808074897601, "KoPercent": 0.08191925102399064};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6432416617905208, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.48444444444444446, 500, 1500, "Academic Structure-1"], "isController": false}, {"data": [0.49666666666666665, 500, 1500, "Academic Structure-2"], "isController": false}, {"data": [0.46555555555555556, 500, 1500, "Homepage"], "isController": false}, {"data": [0.4955555555555556, 500, 1500, "Academic Structure-0"], "isController": false}, {"data": [0.99, 500, 1500, "CA Results-1"], "isController": false}, {"data": [0.49777777777777776, 500, 1500, "CA Results-2"], "isController": false}, {"data": [0.9888888888888889, 500, 1500, "Final Results-1"], "isController": false}, {"data": [0.9833333333333333, 500, 1500, "CA Results-0"], "isController": false}, {"data": [0.4977728285077951, 500, 1500, "Final Results-2"], "isController": false}, {"data": [0.46555555555555556, 500, 1500, "Login"], "isController": false}, {"data": [0.9777777777777777, 500, 1500, "Login-0"], "isController": false}, {"data": [0.49444444444444446, 500, 1500, "Login-1"], "isController": false}, {"data": [0.0, 500, 1500, "Academic Structure"], "isController": false}, {"data": [0.9844444444444445, 500, 1500, "Final Results-0"], "isController": false}, {"data": [0.46444444444444444, 500, 1500, "CA Results"], "isController": false}, {"data": [0.49888392857142855, 500, 1500, "Homepage-2"], "isController": false}, {"data": [0.46111111111111114, 500, 1500, "Final Results"], "isController": false}, {"data": [0.9888641425389755, 500, 1500, "Homepage-1"], "isController": false}, {"data": [0.9866369710467706, 500, 1500, "Homepage-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 8545, 7, 0.08191925102399064, 787.8613224107644, 0, 9376, 609.0, 1371.4000000000005, 2097.0, 2248.0, 18.739610426635902, 157.2846119281897, 3.4035832857258774], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Academic Structure-1", 450, 0, 0.0, 957.453333333333, 851, 7991, 914.0, 976.6000000000001, 1022.45, 1871.6000000000004, 1.0011190286030829, 1.3894871656540533, 0.13687174219182774], "isController": false}, {"data": ["Academic Structure-2", 450, 0, 0.0, 637.9444444444446, 573, 4300, 609.0, 650.9000000000001, 686.45, 1406.9900000000005, 1.0027676386827644, 13.809468299172384, 0.11653256738598533], "isController": false}, {"data": ["Homepage", 450, 2, 0.4444444444444444, 1379.4288888888898, 0, 3196, 1332.0, 1433.9, 2023.2999999999997, 2168.37, 1.0007182933527843, 16.174973751993097, 0.36122716277461375], "isController": false}, {"data": ["Academic Structure-0", 450, 0, 0.0, 651.7688888888886, 573, 4500, 615.0, 661.0, 683.45, 1531.1200000000008, 1.0013819070317038, 1.1355210120521875, 0.13690768260199074], "isController": false}, {"data": ["CA Results-1", 450, 0, 0.0, 382.10444444444454, 332, 1335, 361.0, 397.0, 418.79999999999995, 1110.6600000000003, 1.0032080363651767, 1.3913502706432348, 0.12931978593769855], "isController": false}, {"data": ["CA Results-2", 450, 0, 0.0, 636.9822222222223, 572, 5392, 610.0, 649.0, 668.0, 1375.7800000000002, 1.0026715626747713, 13.808336684855872, 0.11652140230302517], "isController": false}, {"data": ["Final Results-1", 450, 1, 0.2222222222222222, 378.5977777777778, 2, 1300, 361.0, 391.90000000000003, 409.0, 1117.8000000000002, 1.0032236921307134, 1.3940106709560054, 0.1309894892811122], "isController": false}, {"data": ["CA Results-0", 450, 0, 0.0, 377.7022222222222, 321, 1350, 356.0, 387.80000000000007, 427.1499999999999, 1110.88, 1.003225928708536, 1.0973610908298461, 0.12932209237258474], "isController": false}, {"data": ["Final Results-2", 449, 0, 0.0, 644.5701559020059, 575, 4987, 614.0, 659.0, 703.0, 1403.5, 1.000461237140508, 13.7780364848048, 0.11626453830050824], "isController": false}, {"data": ["Login", 450, 1, 0.2222222222222222, 1056.4511111111108, 692, 8996, 969.5, 1056.7, 1659.9499999999998, 1982.7400000000002, 1.0016850568623217, 14.772330811915824, 0.2227836257326213], "isController": false}, {"data": ["Login-0", 450, 0, 0.0, 398.47777777777793, 320, 5688, 354.0, 386.90000000000003, 417.39999999999986, 1193.3400000000006, 1.0031879082417459, 1.0042133021323316, 0.11168302884722563], "isController": false}, {"data": ["Login-1", 450, 1, 0.2222222222222222, 657.8822222222221, 3, 8637, 613.0, 667.0, 727.1499999999999, 1457.9500000000014, 1.0025151992443264, 13.781033414945497, 0.11136011933272588], "isController": false}, {"data": ["Academic Structure", 450, 0, 0.0, 2247.87333333333, 2044, 9376, 2145.5, 2290.100000000001, 2906.35, 4564.5100000000075, 0.9979951386547912, 16.260576496050156, 0.38886724640943526], "isController": false}, {"data": ["Final Results-0", 450, 0, 0.0, 378.3133333333333, 323, 1329, 353.0, 387.90000000000003, 410.45, 1186.8600000000001, 1.0032482950352586, 1.1073070021993432, 0.13128444485812954], "isController": false}, {"data": ["CA Results", 450, 0, 0.0, 1396.9777777777774, 1243, 6195, 1332.0, 1427.8000000000002, 2012.9499999999998, 2554.9900000000043, 1.0011123470522802, 16.270356820077865, 0.3744394813681869], "isController": false}, {"data": ["Homepage-2", 448, 0, 0.0, 629.7745535714288, 572, 1600, 612.0, 656.0, 675.2999999999997, 1382.51, 0.9979150702995527, 13.742584723936153, 0.11596864586488943], "isController": false}, {"data": ["Final Results", 450, 1, 0.2222222222222222, 1400.2622222222226, 623, 5693, 1332.0, 1430.7, 2058.7, 2271.5600000000004, 1.0011279374762232, 16.252645080818834, 0.3778063041304314], "isController": false}, {"data": ["Homepage-1", 449, 1, 0.22271714922049, 382.3630289532295, 1, 1439, 365.0, 405.0, 419.5, 1087.5, 1.000722124651196, 1.3904995788999188, 0.12286148579375764], "isController": false}, {"data": ["Homepage-0", 449, 0, 0.0, 371.5902004454341, 321, 1227, 353.0, 384.0, 409.5, 1112.5, 1.0007912714952802, 1.0655217725038728, 0.12314423848477081], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: ubstudent.online:443 failed to respond", 6, 85.71428571428571, 0.07021650087770626], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: ubstudent.online:80 failed to respond", 1, 14.285714285714286, 0.011702750146284377], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 8545, 7, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: ubstudent.online:443 failed to respond", 6, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: ubstudent.online:80 failed to respond", 1, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Homepage", 450, 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: ubstudent.online:443 failed to respond", 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: ubstudent.online:80 failed to respond", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Final Results-1", 450, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: ubstudent.online:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 450, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: ubstudent.online:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-1", 450, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: ubstudent.online:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Final Results", 450, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: ubstudent.online:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Homepage-1", 449, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: ubstudent.online:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
