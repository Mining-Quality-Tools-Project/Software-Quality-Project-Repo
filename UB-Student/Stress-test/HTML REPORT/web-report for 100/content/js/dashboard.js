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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7236842105263158, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.45, 500, 1500, "Academic Structure-1"], "isController": false}, {"data": [0.5, 500, 1500, "Academic Structure-2"], "isController": false}, {"data": [0.5, 500, 1500, "Homepage"], "isController": false}, {"data": [0.5, 500, 1500, "Academic Structure-0"], "isController": false}, {"data": [1.0, 500, 1500, "CA Results-1"], "isController": false}, {"data": [0.85, 500, 1500, "CA Results-2"], "isController": false}, {"data": [1.0, 500, 1500, "Final Results-1"], "isController": false}, {"data": [1.0, 500, 1500, "CA Results-0"], "isController": false}, {"data": [0.85, 500, 1500, "Final Results-2"], "isController": false}, {"data": [0.5, 500, 1500, "Login"], "isController": false}, {"data": [1.0, 500, 1500, "Login-0"], "isController": false}, {"data": [0.85, 500, 1500, "Login-1"], "isController": false}, {"data": [0.0, 500, 1500, "Academic Structure"], "isController": false}, {"data": [1.0, 500, 1500, "Final Results-0"], "isController": false}, {"data": [0.45, 500, 1500, "CA Results"], "isController": false}, {"data": [0.8, 500, 1500, "Homepage-2"], "isController": false}, {"data": [0.5, 500, 1500, "Final Results"], "isController": false}, {"data": [1.0, 500, 1500, "Homepage-1"], "isController": false}, {"data": [1.0, 500, 1500, "Homepage-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 190, 0, 0.0, 716.5105263157898, 298, 3357, 489.5, 1290.0000000000002, 2005.9499999999994, 2699.0700000000024, 3.682313267956122, 30.93385402534982, 0.6692362107058413], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Academic Structure-1", 10, 0, 0.0, 1050.7, 756, 1595, 996.0, 1565.8000000000002, 1595.0, 1595.0, 0.21954860806182488, 0.30475233544831826, 0.03001641125845262], "isController": false}, {"data": ["Academic Structure-2", 10, 0, 0.0, 664.4, 570, 740, 676.0, 739.6, 740.0, 740.0, 0.22404445041896312, 3.085818476385715, 0.026036415624859973], "isController": false}, {"data": ["Homepage", 10, 0, 0.0, 1207.8, 978, 1424, 1221.5, 1410.9, 1424.0, 1424.0, 0.22208403659944925, 3.603617124344852, 0.08046208747890202], "isController": false}, {"data": ["Academic Structure-0", 10, 0, 0.0, 683.5999999999999, 536, 1021, 671.0, 992.1000000000001, 1021.0, 1021.0, 0.21965952773201539, 0.2492191790225151, 0.03003157605711148], "isController": false}, {"data": ["CA Results-1", 10, 0, 0.0, 360.90000000000003, 314, 392, 369.5, 390.6, 392.0, 392.0, 0.22570306504762336, 0.31285442434433264, 0.0290945357287952], "isController": false}, {"data": ["CA Results-2", 10, 0, 0.0, 513.6, 340, 799, 456.5, 791.7, 799.0, 799.0, 0.2251187501406992, 3.0999115705409603, 0.026161261002678914], "isController": false}, {"data": ["Final Results-1", 10, 0, 0.0, 373.5, 309, 447, 380.0, 441.40000000000003, 447.0, 447.0, 0.22558087074216107, 0.3125088117527634, 0.029519371757274985], "isController": false}, {"data": ["CA Results-0", 10, 0, 0.0, 352.5, 308, 381, 360.0, 379.7, 381.0, 381.0, 0.22586109542631283, 0.24721202710333146, 0.029114906832298136], "isController": false}, {"data": ["Final Results-2", 10, 0, 0.0, 456.09999999999997, 344, 627, 402.0, 623.0, 627.0, 627.0, 0.22581519284617468, 3.1098545044485593, 0.026242195262397256], "isController": false}, {"data": ["Login", 10, 0, 0.0, 791.3999999999999, 638, 978, 759.0, 972.3000000000001, 978.0, 978.0, 0.22392404496394822, 3.3080841478570466, 0.049858088136504095], "isController": false}, {"data": ["Login-0", 10, 0, 0.0, 344.20000000000005, 305, 374, 344.5, 373.1, 374.0, 374.0, 0.22595806218365871, 0.22626698922180044, 0.02515548739154013], "isController": false}, {"data": ["Login-1", 10, 0, 0.0, 446.70000000000005, 332, 639, 396.5, 634.3000000000001, 639.0, 639.0, 0.22574892204889724, 3.1089859358421568, 0.025132204212474887], "isController": false}, {"data": ["Academic Structure", 10, 0, 0.0, 2401.0, 1983, 3357, 2386.0, 3284.7000000000003, 3357.0, 3357.0, 0.21161781822029416, 3.4485024732832503, 0.08245655221669664], "isController": false}, {"data": ["Final Results-0", 10, 0, 0.0, 351.1, 299, 407, 363.0, 404.9, 407.0, 407.0, 0.22567759698494733, 0.24890652151835888, 0.029532029292952088], "isController": false}, {"data": ["CA Results", 10, 0, 0.0, 1227.7, 991, 1535, 1187.5, 1527.6, 1535.0, 1535.0, 0.22144960914143988, 3.5987291560555397, 0.08282734404411277], "isController": false}, {"data": ["Homepage-2", 10, 0, 0.0, 487.7, 350, 670, 464.0, 664.4, 670.0, 670.0, 0.22603467371894848, 3.113362746095251, 0.026267701340385616], "isController": false}, {"data": ["Final Results", 10, 0, 0.0, 1181.6, 1000, 1331, 1184.0, 1320.7, 1331.0, 1331.0, 0.22173440652786092, 3.605392788642764, 0.08380001496707244], "isController": false}, {"data": ["Homepage-1", 10, 0, 0.0, 369.29999999999995, 298, 462, 369.0, 453.8, 462.0, 462.0, 0.22611133722244833, 0.31355283091394204, 0.027822293447293447], "isController": false}, {"data": ["Homepage-0", 10, 0, 0.0, 349.9, 307, 408, 353.5, 404.5, 408.0, 408.0, 0.22597338033579645, 0.24084701884617993, 0.027805318283506204], "isController": false}]}, function(index, item){
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
