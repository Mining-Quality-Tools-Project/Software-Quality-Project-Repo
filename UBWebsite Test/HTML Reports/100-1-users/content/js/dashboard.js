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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.664375, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.68, 500, 1500, "ub-exchange student"], "isController": false}, {"data": [0.77, 500, 1500, "ub-transportation"], "isController": false}, {"data": [0.0, 500, 1500, "ub homepage"], "isController": false}, {"data": [0.82, 500, 1500, "ub-fee and scholarships"], "isController": false}, {"data": [0.81, 500, 1500, "ub-faculties and schools"], "isController": false}, {"data": [0.695, 500, 1500, "ub-finance"], "isController": false}, {"data": [0.78, 500, 1500, "ub-health center"], "isController": false}, {"data": [0.89, 500, 1500, "ub-httc application form"], "isController": false}, {"data": [0.49, 500, 1500, "ub-job opportunities"], "isController": false}, {"data": [0.66, 500, 1500, "ub-sports"], "isController": false}, {"data": [0.625, 500, 1500, "ub-news"], "isController": false}, {"data": [0.75, 500, 1500, "ub-FET"], "isController": false}, {"data": [0.495, 500, 1500, "why us"], "isController": false}, {"data": [0.81, 500, 1500, "ub-Admission requirements"], "isController": false}, {"data": [0.705, 500, 1500, "ub-announcements"], "isController": false}, {"data": [0.65, 500, 1500, "ub-library"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1600, 0, 0.0, 728.1912500000007, 246, 4269, 517.0, 1189.7000000000003, 3089.2499999999973, 3255.99, 24.829683887087015, 2135.742293583855, 3.7371826456028185], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ub-exchange student", 100, 0, 0.0, 551.15, 460, 890, 512.5, 714.8, 763.75, 889.2499999999997, 1.9571003601064663, 166.73224099611517, 0.32108677782996714], "isController": false}, {"data": ["ub-transportation", 100, 0, 0.0, 477.45000000000016, 252, 1074, 491.5, 689.3000000000004, 760.7999999999995, 1072.289999999999, 1.9490137990176972, 155.78834638969556, 0.30263007230841193], "isController": false}, {"data": ["ub homepage", 100, 0, 0.0, 3183.4900000000007, 2925, 4269, 3159.5, 3301.0, 3360.6499999999996, 4268.5199999999995, 1.8843747644531545, 285.5940174928865, 0.21530453851662018], "isController": false}, {"data": ["ub-fee and scholarships", 100, 0, 0.0, 433.2100000000002, 247, 1545, 473.0, 586.9000000000001, 748.8999999999997, 1537.7999999999963, 1.9301293186643507, 152.87576074237597, 0.2733093273499324], "isController": false}, {"data": ["ub-faculties and schools", 100, 0, 0.0, 449.42000000000013, 246, 1835, 477.0, 687.0, 758.1999999999998, 1824.4399999999946, 1.9231878762236283, 160.50899721378156, 0.27232640825432236], "isController": false}, {"data": ["ub-finance", 100, 0, 0.0, 536.63, 458, 897, 507.0, 627.3000000000001, 751.2999999999998, 895.7599999999993, 1.965717880169838, 154.8684305094158, 0.2975451869397704], "isController": false}, {"data": ["ub-health center", 100, 0, 0.0, 458.69, 246, 770, 489.0, 702.5, 737.0999999999998, 769.8799999999999, 1.9402405898331394, 159.9763419492142, 0.2993730597594102], "isController": false}, {"data": ["ub-httc application form", 100, 0, 0.0, 373.21000000000004, 246, 771, 299.5, 549.6, 573.55, 770.7099999999998, 1.9206760779794487, 118.8498038809661, 0.3432458225295304], "isController": false}, {"data": ["ub-job opportunities", 100, 0, 0.0, 828.4299999999997, 678, 2013, 764.0, 959.5000000000001, 1134.249999999999, 2012.81, 2.0121129197770578, 182.8874079772732, 0.3026029195758466], "isController": false}, {"data": ["ub-sports", 100, 0, 0.0, 561.5299999999996, 448, 954, 522.5, 730.6, 775.6499999999996, 953.1099999999996, 1.9821212661790648, 162.11719508780797, 0.29615679074745793], "isController": false}, {"data": ["ub-news", 100, 0, 0.0, 570.3199999999999, 457, 1164, 525.5, 731.8, 790.55, 1162.9799999999996, 2.0027638140634076, 173.73330665067795, 0.27381536520398153], "isController": false}, {"data": ["ub-FET", 100, 0, 0.0, 478.6099999999999, 250, 1531, 500.0, 712.9, 785.1499999999996, 1527.209999999998, 1.920233500393648, 165.59163594293068, 0.35066764118516813], "isController": false}, {"data": ["why us", 100, 0, 0.0, 1173.5200000000004, 973, 1526, 1191.5, 1278.3, 1317.1999999999998, 1524.6799999999994, 2.0028440385347195, 180.16481841715236, 0.2660027238678924], "isController": false}, {"data": ["ub-Admission requirements", 100, 0, 0.0, 454.7899999999998, 247, 1603, 476.0, 745.0, 825.1499999999999, 1597.469999999997, 1.9409937888198758, 156.20356020720106, 0.3279218022127329], "isController": false}, {"data": ["ub-announcements", 100, 0, 0.0, 550.4299999999998, 461, 1599, 509.0, 688.3000000000004, 841.4999999999994, 1593.099999999997, 2.0125988689194356, 132.9538732779701, 0.2771254301930082], "isController": false}, {"data": ["ub-library", 100, 0, 0.0, 570.18, 472, 1069, 519.0, 765.5, 794.8499999999999, 1068.0199999999995, 1.9916351324437365, 182.49329379107746, 0.2956333399721171], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1600, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
