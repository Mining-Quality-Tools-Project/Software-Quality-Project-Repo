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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.54390625, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5575, 500, 1500, "ub-exchange student"], "isController": false}, {"data": [0.675, 500, 1500, "ub-transportation"], "isController": false}, {"data": [0.0, 500, 1500, "ub homepage"], "isController": false}, {"data": [0.6475, 500, 1500, "ub-fee and scholarships"], "isController": false}, {"data": [0.66, 500, 1500, "ub-faculties and schools"], "isController": false}, {"data": [0.5825, 500, 1500, "ub-finance"], "isController": false}, {"data": [0.655, 500, 1500, "ub-health center"], "isController": false}, {"data": [0.78, 500, 1500, "ub-httc application form"], "isController": false}, {"data": [0.4375, 500, 1500, "ub-job opportunities"], "isController": false}, {"data": [0.535, 500, 1500, "ub-sports"], "isController": false}, {"data": [0.47, 500, 1500, "ub-news"], "isController": false}, {"data": [0.62, 500, 1500, "ub-FET"], "isController": false}, {"data": [0.3975, 500, 1500, "why us"], "isController": false}, {"data": [0.675, 500, 1500, "ub-Admission requirements"], "isController": false}, {"data": [0.51, 500, 1500, "ub-announcements"], "isController": false}, {"data": [0.5, 500, 1500, "ub-library"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3200, 0, 0.0, 922.5465625000024, 237, 8072, 631.0, 1521.8000000000002, 3476.95, 4185.959999999999, 49.697157943780084, 4274.7375611508, 7.480053191489362], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ub-exchange student", 200, 0, 0.0, 681.9800000000002, 262, 2283, 597.0, 1006.1000000000001, 1203.5999999999997, 2203.640000000006, 3.8271652187224925, 326.05317307876305, 0.6278942936966588], "isController": false}, {"data": ["ub-transportation", 200, 0, 0.0, 590.2749999999999, 243, 3397, 563.0, 914.8000000000001, 1050.6999999999998, 1566.1500000000017, 3.8265794206558756, 305.8658921430758, 0.5941661405119963], "isController": false}, {"data": ["ub homepage", 200, 0, 0.0, 3822.885, 3082, 8072, 3649.0, 4458.5, 4902.949999999999, 6766.620000000001, 3.6453112184452747, 552.4833148694522, 0.4165052857012667], "isController": false}, {"data": ["ub-fee and scholarships", 200, 0, 0.0, 621.4949999999993, 252, 3108, 560.5, 938.9, 1167.9499999999996, 2705.4900000000016, 3.793051130329237, 300.42650341137534, 0.537101966697011], "isController": false}, {"data": ["ub-faculties and schools", 200, 0, 0.0, 579.9550000000002, 243, 1407, 557.5, 942.0, 1088.4999999999995, 1335.8400000000001, 3.787089810834864, 316.068980805372, 0.5362578345420461], "isController": false}, {"data": ["ub-finance", 200, 0, 0.0, 723.1900000000003, 260, 4158, 592.0, 1024.3, 1384.5999999999992, 3941.310000000002, 3.821534346039935, 301.07962077242763, 0.5784549058947167], "isController": false}, {"data": ["ub-health center", 200, 0, 0.0, 594.6800000000003, 253, 2027, 561.5, 939.7, 1064.3999999999999, 1743.8400000000001, 3.8278244559704495, 315.60954665400294, 0.5906213516048153], "isController": false}, {"data": ["ub-httc application form", 200, 0, 0.0, 529.76, 237, 3836, 421.5, 721.9000000000001, 967.2499999999989, 3796.230000000005, 3.788165770134101, 234.40727709603948, 0.6769866561860747], "isController": false}, {"data": ["ub-job opportunities", 200, 0, 0.0, 1088.4799999999998, 593, 4627, 917.5, 1556.8, 1818.0, 4007.2700000000023, 3.828850387671102, 348.0180090576242, 0.5758232028333493], "isController": false}, {"data": ["ub-sports", 200, 0, 0.0, 701.9300000000005, 288, 3477, 605.0, 1022.5, 1182.1499999999999, 3179.620000000012, 3.8216073680590052, 312.5665235852887, 0.5710018821416287], "isController": false}, {"data": ["ub-news", 200, 0, 0.0, 797.975, 503, 2797, 661.0, 1264.9000000000003, 1538.6, 2586.680000000003, 3.8234338259190577, 331.66934929338163, 0.5227350933873712], "isController": false}, {"data": ["ub-FET", 200, 0, 0.0, 598.115, 249, 1691, 575.5, 873.5, 978.8499999999997, 1532.6000000000004, 3.77251721210978, 325.32011134820334, 0.688926483070829], "isController": false}, {"data": ["why us", 200, 0, 0.0, 1307.5649999999996, 851, 3091, 1194.0, 1768.7, 2038.3999999999999, 2988.2500000000027, 3.827018752391887, 344.26117235337733, 0.5082759280520475], "isController": false}, {"data": ["ub-Admission requirements", 200, 0, 0.0, 619.4649999999997, 257, 3067, 558.0, 999.6, 1318.599999999999, 2856.990000000009, 3.808580732390075, 306.5015783294137, 0.6434418620151201], "isController": false}, {"data": ["ub-announcements", 200, 0, 0.0, 740.6849999999998, 477, 3164, 639.0, 1061.7, 1219.8, 2108.4900000000052, 3.8497074222359102, 254.31293173867223, 0.5300866665383431], "isController": false}, {"data": ["ub-library", 200, 0, 0.0, 762.31, 465, 3933, 645.0, 1110.4, 1417.1999999999987, 1944.2400000000025, 3.823799327011318, 350.37540448627254, 0.5675952126032425], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3200, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
