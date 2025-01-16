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

    var data = {"OkPercent": 91.9845992299615, "KoPercent": 8.015400770038502};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5941547077353868, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4880668257756563, 500, 1500, "Academic Structure-1"], "isController": false}, {"data": [0.49282296650717705, 500, 1500, "Academic Structure-2"], "isController": false}, {"data": [0.34545454545454546, 500, 1500, "Homepage"], "isController": false}, {"data": [0.49761336515513127, 500, 1500, "Academic Structure-0"], "isController": false}, {"data": [0.986810551558753, 500, 1500, "CA Results-1"], "isController": false}, {"data": [0.49760191846522783, 500, 1500, "CA Results-2"], "isController": false}, {"data": [0.9855769230769231, 500, 1500, "Final Results-1"], "isController": false}, {"data": [0.9916067146282974, 500, 1500, "CA Results-0"], "isController": false}, {"data": [0.4987951807228916, 500, 1500, "Final Results-2"], "isController": false}, {"data": [0.35818181818181816, 500, 1500, "Login"], "isController": false}, {"data": [0.9891304347826086, 500, 1500, "Login-0"], "isController": false}, {"data": [0.4963768115942029, 500, 1500, "Login-1"], "isController": false}, {"data": [0.0, 500, 1500, "Academic Structure"], "isController": false}, {"data": [0.9927884615384616, 500, 1500, "Final Results-0"], "isController": false}, {"data": [0.35, 500, 1500, "CA Results"], "isController": false}, {"data": [0.4975786924939467, 500, 1500, "Homepage-2"], "isController": false}, {"data": [0.3527272727272727, 500, 1500, "Final Results"], "isController": false}, {"data": [0.9878934624697336, 500, 1500, "Homepage-1"], "isController": false}, {"data": [0.9903147699757869, 500, 1500, "Homepage-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 8571, 687, 8.015400770038502, 9254.518025901289, 0, 6722526, 613.0, 2158.0, 3309.0, 32343.000000000524, 1.2005380360172615, 9.518034438675281, 0.20087920659297223], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Academic Structure-1", 419, 1, 0.2386634844868735, 1033.1169451073981, 846, 42905, 904.0, 978.0, 1043.0, 1754.8, 0.9092250538157073, 1.2676312388516857, 0.12401143475279494], "isController": false}, {"data": ["Academic Structure-2", 418, 1, 0.23923444976076555, 16709.787081339713, 570, 6720490, 612.0, 655.1, 682.3999999999996, 1576.77, 0.05856672922191158, 0.8051108193205194, 0.0067898119864377385], "isController": false}, {"data": ["Homepage", 550, 139, 25.272727272727273, 14307.48, 0, 6721084, 1346.0, 3323.9, 3344.45, 20732.81000000001, 0.07710716353588218, 0.9856828316869786, 0.020945027367785748], "isController": false}, {"data": ["Academic Structure-0", 419, 0, 0.0, 639.2720763723149, 571, 1745, 610.0, 665.0, 711.0, 1388.6000000000006, 1.0008503645101805, 1.134956139643707, 0.13683501077287624], "isController": false}, {"data": ["CA Results-1", 417, 0, 0.0, 384.5995203836928, 330, 1469, 360.0, 398.2, 440.49999999999983, 1163.2399999999998, 1.0026834405747758, 1.390383571500707, 0.12925216226159217], "isController": false}, {"data": ["CA Results-2", 417, 1, 0.23980815347721823, 16742.275779376498, 571, 6720355, 609.0, 647.8, 681.1999999999996, 1411.56, 0.05843699126009632, 0.8033244267429254, 0.0067747321252524745], "isController": false}, {"data": ["Final Results-1", 416, 1, 0.2403846153846154, 474.04567307692326, 333, 37362, 360.0, 403.0, 417.5999999999999, 1272.3299999999992, 0.9200099962624594, 1.281317539045136, 0.12010252941931004], "isController": false}, {"data": ["CA Results-0", 417, 0, 0.0, 366.297362110312, 325, 1105, 354.0, 384.0, 412.09999999999997, 1072.6399999999999, 1.0027461296884994, 1.0967183547328656, 0.12926024328015812], "isController": false}, {"data": ["Final Results-2", 415, 1, 0.24096385542168675, 16821.70843373494, 567, 6720495, 611.0, 647.4000000000001, 678.4, 1394.8799999999999, 0.05816773865837723, 0.799633940083585, 0.006743438941885383], "isController": false}, {"data": ["Login", 550, 137, 24.90909090909091, 13960.901818181821, 0, 6720917, 974.5, 3322.9, 3339.45, 5089.870000000026, 0.07709687376382172, 0.9046053265599291, 0.012905786691593722], "isController": false}, {"data": ["Login-0", 414, 0, 0.0, 369.3091787439617, 321, 1204, 352.0, 389.0, 408.0, 1083.9500000000003, 1.0015337497520358, 1.002554334415506, 0.11149887448411336], "isController": false}, {"data": ["Login-1", 414, 1, 0.24154589371980675, 16866.599033816427, 571, 6720514, 610.0, 657.0, 717.5, 1455.2500000000014, 0.05803581566815625, 0.7977958805014519, 0.006445412216202759], "isController": false}, {"data": ["Academic Structure", 550, 133, 24.181818181818183, 19966.95272727273, 2015, 6722526, 2167.0, 48003.200000000004, 50642.7, 60845.580000000045, 0.07703841905958501, 1.0039494391165373, 0.022816476232947372], "isController": false}, {"data": ["Final Results-0", 416, 0, 0.0, 362.87980769230796, 320, 1156, 354.0, 382.3, 404.29999999999995, 985.539999999993, 1.0019895272825368, 1.105861638734603, 0.13111972329673824], "isController": false}, {"data": ["CA Results", 550, 134, 24.363636363636363, 14837.476363636366, 1, 6721090, 1342.0, 3317.0, 3341.2499999999995, 51849.370000000024, 0.07706780271146949, 0.9964386585217442, 0.02183843176549865], "isController": false}, {"data": ["Homepage-2", 413, 2, 0.48426150121065376, 16977.702179176755, 572, 6720354, 609.0, 655.0, 696.4999999999998, 1451.2000000000003, 0.05790654248587599, 0.7946350002443151, 0.006696785824099834], "isController": false}, {"data": ["Final Results", 550, 136, 24.727272727272727, 14299.567272727272, 0, 6721499, 1343.0, 3323.0, 3339.45, 22223.830000000005, 0.0770819627926767, 0.9933802459268489, 0.021983140738209755], "isController": false}, {"data": ["Homepage-1", 413, 0, 0.0, 382.8765133171915, 330, 1268, 361.0, 405.6, 417.29999999999995, 1139.9, 1.0013213562691687, 1.3887736616721824, 0.12320946375968288], "isController": false}, {"data": ["Homepage-0", 413, 0, 0.0, 365.2203389830509, 321, 1281, 352.0, 380.0, 397.5999999999999, 1115.2000000000003, 1.001425758707312, 1.0661057502873341, 0.1232223101534388], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.NoRouteToHostException/Non HTTP response message: No route to host: connect", 2, 0.29112081513828236, 0.02333450005833625], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to ubstudent.online:80 [ubstudent.online/162.144.117.68] failed: Connection refused: connect", 582, 84.71615720524018, 6.790339516975849], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 10, 1.455604075691412, 0.11667250029168125], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 85, 12.372634643377001, 0.9917162524792906], "isController": false}, {"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: No such host is known (ubstudent.online)", 1, 0.14556040756914118, 0.011667250029168125], "isController": false}, {"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: ubstudent.online", 7, 1.0189228529839884, 0.08167075020417687], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 8571, 687, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to ubstudent.online:80 [ubstudent.online/162.144.117.68] failed: Connection refused: connect", 582, "Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 85, "Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 10, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: ubstudent.online", 7, "Non HTTP response code: java.net.NoRouteToHostException/Non HTTP response message: No route to host: connect", 2], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Academic Structure-1", 419, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Academic Structure-2", 418, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Homepage", 550, 139, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to ubstudent.online:80 [ubstudent.online/162.144.117.68] failed: Connection refused: connect", 129, "Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 5, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: ubstudent.online", 3, "Non HTTP response code: java.net.NoRouteToHostException/Non HTTP response message: No route to host: connect", 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 1], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["CA Results-2", 417, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Final Results-1", 416, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Final Results-2", 415, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Login", 550, 137, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to ubstudent.online:80 [ubstudent.online/162.144.117.68] failed: Connection refused: connect", 131, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: ubstudent.online", 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 1, "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-1", 414, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Academic Structure", 550, 133, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to ubstudent.online:80 [ubstudent.online/162.144.117.68] failed: Connection refused: connect", 72, "Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 60, "Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["CA Results", 550, 134, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to ubstudent.online:80 [ubstudent.online/162.144.117.68] failed: Connection refused: connect", 123, "Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 9, "Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 1, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: No such host is known (ubstudent.online)", 1, "", ""], "isController": false}, {"data": ["Homepage-2", 413, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["Final Results", 550, 136, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to ubstudent.online:80 [ubstudent.online/162.144.117.68] failed: Connection refused: connect", 127, "Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 6, "Non HTTP response code: java.net.NoRouteToHostException/Non HTTP response message: No route to host: connect", 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 1, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: ubstudent.online", 1], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
