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

    var data = {"OkPercent": 99.94730899510726, "KoPercent": 0.05269100489273617};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6495671810312382, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.7020057306590258, 500, 1500, "Academic Structure-1"], "isController": false}, {"data": [0.5085959885386819, 500, 1500, "Academic Structure-2"], "isController": false}, {"data": [0.3692857142857143, 500, 1500, "Homepage"], "isController": false}, {"data": [0.7156160458452722, 500, 1500, "Academic Structure-0"], "isController": false}, {"data": [0.9399141630901288, 500, 1500, "CA Results-1"], "isController": false}, {"data": [0.5214592274678111, 500, 1500, "CA Results-2"], "isController": false}, {"data": [0.9283667621776505, 500, 1500, "Final Results-1"], "isController": false}, {"data": [0.9463519313304721, 500, 1500, "CA Results-0"], "isController": false}, {"data": [0.5164756446991404, 500, 1500, "Final Results-2"], "isController": false}, {"data": [0.45785714285714285, 500, 1500, "Login"], "isController": false}, {"data": [0.9435714285714286, 500, 1500, "Login-0"], "isController": false}, {"data": [0.5228571428571429, 500, 1500, "Login-1"], "isController": false}, {"data": [0.18428571428571427, 500, 1500, "Academic Structure"], "isController": false}, {"data": [0.9405444126074498, 500, 1500, "Final Results-0"], "isController": false}, {"data": [0.37857142857142856, 500, 1500, "CA Results"], "isController": false}, {"data": [0.5214285714285715, 500, 1500, "Homepage-2"], "isController": false}, {"data": [0.3514285714285714, 500, 1500, "Final Results"], "isController": false}, {"data": [0.9435714285714286, 500, 1500, "Homepage-1"], "isController": false}, {"data": [0.9514285714285714, 500, 1500, "Homepage-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 13285, 7, 0.05269100489273617, 819.0983063605568, 1, 8495, 621.0, 1474.0, 1945.699999999999, 2745.4199999999983, 36.57995963400766, 307.1424867600715, 6.644546555467444], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Academic Structure-1", 698, 0, 0.0, 755.1203438395409, 338, 5454, 881.0, 1089.1, 1370.999999999999, 2041.9599999999991, 1.9602611809309838, 2.7190549743733765, 0.2680044583304079], "isController": false}, {"data": ["Academic Structure-2", 698, 0, 0.0, 699.1819484240691, 370, 4370, 639.5, 838.3000000000001, 1134.1999999999998, 1550.7299999999993, 1.9620575180815687, 27.020482884351043, 0.22801254360518228], "isController": false}, {"data": ["Homepage", 700, 0, 0.0, 1533.645714285715, 1049, 5356, 1425.0, 1930.6999999999998, 2173.7499999999995, 3007.5400000000013, 1.9602956125783768, 31.80126477135252, 0.7102242893228299], "isController": false}, {"data": ["Academic Structure-0", 698, 0, 0.0, 585.4699140401138, 322, 3689, 606.0, 754.2000000000003, 1041.199999999999, 1669.169999999998, 1.95815495794736, 2.2194936009291415, 0.2677164981568656], "isController": false}, {"data": ["CA Results-1", 699, 0, 0.0, 452.8483547925606, 333, 3329, 399.0, 529.0, 767.0, 1394.0, 1.9663719453016653, 2.727672957744102, 0.2534776335740428], "isController": false}, {"data": ["CA Results-2", 699, 0, 0.0, 681.8640915593708, 366, 3270, 638.0, 786.0, 1042.0, 1496.0, 1.9646254985342602, 27.055743481813863, 0.22831097102107123], "isController": false}, {"data": ["Final Results-1", 698, 0, 0.0, 442.3939828080229, 335, 1785, 403.5, 540.5000000000001, 699.4999999999995, 1138.07, 1.9618589878718888, 2.7208650413873547, 0.25672764099104795], "isController": false}, {"data": ["CA Results-0", 699, 0, 0.0, 422.6666666666666, 324, 1833, 377.0, 501.0, 691.0, 1154.0, 1.9664161994435518, 2.1509600256984434, 0.2534833382095204], "isController": false}, {"data": ["Final Results-2", 698, 0, 0.0, 682.2736389684816, 367, 3337, 635.0, 784.2, 1057.05, 1533.07, 1.9605860410768055, 27.00030072384387, 0.22784154188294906], "isController": false}, {"data": ["Login", 700, 1, 0.14285714285714285, 1102.2057142857152, 717, 4956, 1018.5, 1440.0, 1661.4999999999993, 2170.9700000000003, 1.963192936992725, 28.969486284993913, 0.4368049508220169], "isController": false}, {"data": ["Login-0", 700, 0, 0.0, 425.79428571428605, 323, 1718, 381.0, 514.9, 738.8999999999985, 1076.8300000000002, 1.9669385725083806, 1.9688100179693888, 0.21897558326753458], "isController": false}, {"data": ["Login-1", 700, 1, 0.14285714285714285, 676.3214285714281, 1, 4291, 634.5, 803.8999999999997, 1005.9499999999999, 1454.88, 1.9654308786037582, 27.035209158697313, 0.21849515205415604], "isController": false}, {"data": ["Academic Structure", 700, 2, 0.2857142857142857, 2035.688571428572, 452, 8495, 2151.0, 2739.5999999999995, 3152.2499999999964, 5105.610000000001, 1.9553345717118953, 31.776838276372576, 0.7597162233411081], "isController": false}, {"data": ["Final Results-0", 698, 0, 0.0, 425.1819484240686, 325, 1773, 383.0, 520.2, 729.149999999998, 1095.7999999999993, 1.9623553887459761, 2.16539374059939, 0.2567925996991805], "isController": false}, {"data": ["CA Results", 700, 1, 0.14285714285714285, 1555.3357142857142, 1, 5351, 1419.0, 2004.8, 2283.8999999999996, 4011.3700000000044, 1.963490300357916, 31.871701621176804, 0.7333422610782928], "isController": false}, {"data": ["Homepage-2", 700, 0, 0.0, 674.9857142857148, 358, 2015, 639.5, 790.0, 1002.9499999999999, 1409.93, 1.9660104872616562, 27.07469071319839, 0.2284719218595089], "isController": false}, {"data": ["Final Results", 700, 2, 0.2857142857142857, 1548.298571428572, 215, 5088, 1430.5, 1991.6999999999998, 2240.5999999999995, 3053.6500000000024, 1.9621033748178045, 31.827832326879417, 0.7394184378153381], "isController": false}, {"data": ["Homepage-1", 700, 0, 0.0, 447.30857142857155, 337, 3381, 399.5, 514.6999999999999, 669.4499999999992, 1174.94, 1.9671320339021154, 2.728163495193172, 0.24204944948404936], "isController": false}, {"data": ["Homepage-0", 700, 0, 0.0, 411.2114285714285, 323, 1692, 378.0, 495.9, 576.8999999999999, 1036.7500000000002, 1.9656792404615415, 2.092324048892059, 0.24187068779116624], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: ubstudent.online:443 failed to respond", 2, 28.571428571428573, 0.015054572826496047], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: ubstudent.online:80 failed to respond", 5, 71.42857142857143, 0.03763643206624012], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 13285, 7, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: ubstudent.online:80 failed to respond", 5, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: ubstudent.online:443 failed to respond", 2, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 700, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: ubstudent.online:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-1", 700, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: ubstudent.online:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Academic Structure", 700, 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: ubstudent.online:80 failed to respond", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["CA Results", 700, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: ubstudent.online:80 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Final Results", 700, 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: ubstudent.online:80 failed to respond", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
