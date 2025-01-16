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

    var data = {"OkPercent": 99.47257383966245, "KoPercent": 0.5274261603375527};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6774789029535865, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.72, 500, 1500, "Academic Structure-1"], "isController": false}, {"data": [0.51, 500, 1500, "Academic Structure-2"], "isController": false}, {"data": [0.39, 500, 1500, "Homepage"], "isController": false}, {"data": [0.745, 500, 1500, "Academic Structure-0"], "isController": false}, {"data": [0.965, 500, 1500, "CA Results-1"], "isController": false}, {"data": [0.5707070707070707, 500, 1500, "CA Results-2"], "isController": false}, {"data": [0.96, 500, 1500, "Final Results-1"], "isController": false}, {"data": [0.985, 500, 1500, "CA Results-0"], "isController": false}, {"data": [0.5505050505050505, 500, 1500, "Final Results-2"], "isController": false}, {"data": [0.48, 500, 1500, "Login"], "isController": false}, {"data": [0.98, 500, 1500, "Login-0"], "isController": false}, {"data": [0.545, 500, 1500, "Login-1"], "isController": false}, {"data": [0.195, 500, 1500, "Academic Structure"], "isController": false}, {"data": [0.995, 500, 1500, "Final Results-0"], "isController": false}, {"data": [0.405, 500, 1500, "CA Results"], "isController": false}, {"data": [0.5459183673469388, 500, 1500, "Homepage-2"], "isController": false}, {"data": [0.38, 500, 1500, "Final Results"], "isController": false}, {"data": [0.965, 500, 1500, "Homepage-1"], "isController": false}, {"data": [0.98, 500, 1500, "Homepage-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1896, 10, 0.5274261603375527, 825.6640295358646, 0, 12999, 628.0, 1436.0, 1655.099999999998, 2663.0699999999924, 29.473029690657548, 246.186776193067, 5.334189919166796], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Academic Structure-1", 100, 0, 0.0, 719.4599999999999, 339, 2629, 885.5, 1014.8, 1073.4499999999994, 2627.5999999999995, 1.723543605653223, 2.3911137861944156, 0.23564072733540156], "isController": false}, {"data": ["Academic Structure-2", 100, 0, 0.0, 777.0999999999997, 362, 10335, 658.0, 811.8000000000002, 928.7499999999995, 10250.089999999956, 1.741219898661002, 23.978230398216994, 0.20234879681705004], "isController": false}, {"data": ["Homepage", 100, 2, 2.0, 1526.4300000000003, 600, 12292, 1411.0, 1598.0, 1738.5499999999993, 12195.47999999995, 1.7081461489845071, 27.281345949771964, 0.6106956104914336], "isController": false}, {"data": ["Academic Structure-0", 100, 0, 0.0, 516.2500000000003, 329, 1265, 589.5, 682.0, 707.5999999999999, 1260.0199999999975, 1.7146482399135816, 1.9428438084052058, 0.234424564050685], "isController": false}, {"data": ["CA Results-1", 100, 1, 1.0, 401.6499999999999, 0, 1346, 378.0, 451.30000000000007, 499.2999999999996, 1345.4899999999998, 1.7473047823731893, 2.443735420925722, 0.222986122031766], "isController": false}, {"data": ["CA Results-2", 99, 0, 0.0, 744.3838383838387, 359, 12235, 654.0, 726.0, 763.0, 12235.0, 1.7227877838684416, 23.72527707082572, 0.20020678347689896], "isController": false}, {"data": ["Final Results-1", 100, 1, 1.0, 413.8099999999999, 1, 1317, 384.5, 454.9, 534.8499999999997, 1316.85, 1.7410380068596898, 2.433967733124989, 0.22555283397461567], "isController": false}, {"data": ["CA Results-0", 100, 0, 0.0, 375.6800000000001, 331, 612, 364.0, 414.5, 449.0, 611.0199999999995, 1.7477628635346756, 1.9122471478694771, 0.22529755662751677], "isController": false}, {"data": ["Final Results-2", 99, 0, 0.0, 786.6161616161614, 365, 9920, 663.0, 821.0, 935.0, 9920.0, 1.7207515686649402, 23.697608872299377, 0.1999701529991483], "isController": false}, {"data": ["Login", 100, 1, 1.0, 1209.1, 658, 10980, 1022.0, 1177.8000000000002, 1251.4499999999996, 10975.549999999997, 1.7206669305022628, 25.226355078978614, 0.3812016600134212], "isController": false}, {"data": ["Login-0", 100, 0, 0.0, 379.04999999999995, 336, 657, 360.0, 409.9, 489.44999999999965, 656.7399999999999, 1.7387977952043956, 1.7407845075289943, 0.19357709829423936], "isController": false}, {"data": ["Login-1", 100, 1, 1.0, 829.9900000000001, 1, 10614, 653.0, 747.9000000000001, 820.75, 10609.429999999998, 1.731571747675365, 23.65267822743329, 0.19084490961195477], "isController": false}, {"data": ["Academic Structure", 100, 0, 0.0, 2013.33, 1057, 11148, 2128.5, 2500.5000000000005, 2906.299999999996, 11077.819999999963, 1.685601591207902, 27.460721532296127, 0.6567920262616728], "isController": false}, {"data": ["Final Results-0", 100, 0, 0.0, 371.78000000000003, 335, 682, 360.0, 408.6, 428.34999999999985, 680.169999999999, 1.74128053770743, 1.922635585897369, 0.22786288286405823], "isController": false}, {"data": ["CA Results", 100, 1, 1.0, 1514.5100000000007, 612, 12999, 1407.5, 1535.8, 1664.5499999999993, 12893.549999999947, 1.7182130584192439, 27.70861858354811, 0.6384403189432989], "isController": false}, {"data": ["Homepage-2", 98, 0, 0.0, 770.0102040816328, 359, 11521, 663.5, 740.2, 844.1499999999999, 11521.0, 1.6940070180290747, 23.329902735043476, 0.19686214369673818], "isController": false}, {"data": ["Final Results", 100, 1, 1.0, 1564.54, 683, 10658, 1421.0, 1642.9, 2402.2999999999965, 10597.969999999968, 1.7117718550471592, 27.621311131652377, 0.6427001221777162], "isController": false}, {"data": ["Homepage-1", 100, 2, 2.0, 393.55, 1, 955, 382.5, 449.70000000000005, 489.1999999999998, 952.1299999999985, 1.7364728762936723, 2.4481384739442245, 0.209394209731194], "isController": false}, {"data": ["Homepage-0", 100, 0, 0.0, 378.06, 333, 651, 361.5, 417.1, 472.49999999999966, 650.4799999999998, 1.7367141368530739, 1.8494309547585968, 0.21369724730809309], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: ubstudent.online:443 failed to respond", 10, 100.0, 0.5274261603375527], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1896, 10, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: ubstudent.online:443 failed to respond", 10, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Homepage", 100, 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: ubstudent.online:443 failed to respond", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["CA Results-1", 100, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: ubstudent.online:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Final Results-1", 100, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: ubstudent.online:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 100, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: ubstudent.online:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-1", 100, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: ubstudent.online:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["CA Results", 100, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: ubstudent.online:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Final Results", 100, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: ubstudent.online:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Homepage-1", 100, 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: ubstudent.online:443 failed to respond", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
