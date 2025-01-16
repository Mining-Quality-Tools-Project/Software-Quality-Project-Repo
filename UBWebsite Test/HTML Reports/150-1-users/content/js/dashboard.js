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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5914583333333333, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6, 500, 1500, "ub-exchange student"], "isController": false}, {"data": [0.7033333333333334, 500, 1500, "ub-transportation"], "isController": false}, {"data": [0.0, 500, 1500, "ub homepage"], "isController": false}, {"data": [0.7466666666666667, 500, 1500, "ub-fee and scholarships"], "isController": false}, {"data": [0.7033333333333334, 500, 1500, "ub-faculties and schools"], "isController": false}, {"data": [0.5866666666666667, 500, 1500, "ub-finance"], "isController": false}, {"data": [0.7133333333333334, 500, 1500, "ub-health center"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "ub-httc application form"], "isController": false}, {"data": [0.45666666666666667, 500, 1500, "ub-job opportunities"], "isController": false}, {"data": [0.5733333333333334, 500, 1500, "ub-sports"], "isController": false}, {"data": [0.5366666666666666, 500, 1500, "ub-news"], "isController": false}, {"data": [0.68, 500, 1500, "ub-FET"], "isController": false}, {"data": [0.43666666666666665, 500, 1500, "why us"], "isController": false}, {"data": [0.7466666666666667, 500, 1500, "ub-Admission requirements"], "isController": false}, {"data": [0.57, 500, 1500, "ub-announcements"], "isController": false}, {"data": [0.5433333333333333, 500, 1500, "ub-library"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2400, 0, 0.0, 802.2691666666673, 238, 5375, 545.0, 1287.8000000000002, 3212.5499999999984, 3563.9199999999983, 35.59563360227812, 3061.785451258083, 5.357594754835073], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ub-exchange student", 150, 0, 0.0, 600.1800000000001, 272, 1610, 530.0, 841.8, 933.6499999999999, 1339.7000000000048, 2.7203482045701852, 231.7573732771128, 0.446307127312296], "isController": false}, {"data": ["ub-transportation", 150, 0, 0.0, 517.6066666666669, 251, 1316, 517.5, 802.9, 950.8499999999999, 1198.190000000002, 2.722026639567379, 217.57835892416432, 0.4226584332922005], "isController": false}, {"data": ["ub homepage", 150, 0, 0.0, 3411.866666666666, 3013, 5375, 3324.0, 3814.4, 4109.949999999999, 5106.740000000005, 2.8022193577313232, 424.7025232525827, 0.32017545395953595], "isController": false}, {"data": ["ub-fee and scholarships", 150, 0, 0.0, 471.94666666666683, 255, 1419, 502.5, 670.0000000000002, 795.8999999999997, 1274.1600000000026, 2.7056277056277054, 214.29786847267317, 0.3831211106601732], "isController": false}, {"data": ["ub-faculties and schools", 150, 0, 0.0, 492.85333333333324, 255, 1390, 511.5, 760.3000000000001, 841.5499999999997, 1219.660000000003, 2.6929982046678638, 224.75656067661578, 0.38133275359066426], "isController": false}, {"data": ["ub-finance", 150, 0, 0.0, 605.426666666667, 280, 2794, 538.0, 788.6, 991.6999999999997, 1925.9800000000155, 2.726677815749291, 214.81996257634697, 0.4127295521886134], "isController": false}, {"data": ["ub-health center", 150, 0, 0.0, 518.74, 247, 1789, 512.5, 782.3000000000001, 851.1499999999999, 1719.6400000000012, 2.7255382938130284, 224.7253345882166, 0.4205420414281821], "isController": false}, {"data": ["ub-httc application form", 150, 0, 0.0, 387.88, 238, 1162, 304.0, 578.9, 617.5999999999999, 1083.4600000000014, 2.69478827946751, 166.7515162394679, 0.4815881397876507], "isController": false}, {"data": ["ub-job opportunities", 150, 0, 0.0, 964.686666666667, 708, 3003, 827.0, 1412.7, 1590.6, 2668.950000000006, 2.9077656728569767, 264.2985780117183, 0.4373006968945063], "isController": false}, {"data": ["ub-sports", 150, 0, 0.0, 629.8066666666666, 465, 2055, 541.0, 924.8000000000001, 1059.35, 1695.4500000000064, 2.7368766763369643, 223.84835935646905, 0.4089278627730034], "isController": false}, {"data": ["ub-news", 150, 0, 0.0, 698.9999999999999, 473, 2910, 555.0, 1194.8000000000002, 1273.85, 2269.9500000000116, 2.8111998200832113, 243.8612437157971, 0.3843437254020016], "isController": false}, {"data": ["ub-FET", 150, 0, 0.0, 514.3533333333334, 252, 1207, 515.5, 734.9000000000001, 811.1999999999998, 1150.900000000001, 2.686390744488422, 231.66036367574367, 0.4905811222845067], "isController": false}, {"data": ["why us", 150, 0, 0.0, 1193.3399999999995, 965, 1941, 1107.5, 1542.9, 1645.1499999999999, 1896.6300000000008, 2.9535698814633955, 265.6909169111566, 0.3922709998818572], "isController": false}, {"data": ["ub-Admission requirements", 150, 0, 0.0, 488.21999999999986, 259, 1720, 497.5, 783.6000000000001, 870.9499999999991, 1639.9300000000014, 2.7156694125101835, 218.5445567801213, 0.4587996175432244], "isController": false}, {"data": ["ub-announcements", 150, 0, 0.0, 648.1133333333332, 460, 2690, 544.0, 1005.9000000000001, 1156.3499999999995, 2113.7000000000103, 2.864891707093472, 189.2559398754727, 0.3944821588868941], "isController": false}, {"data": ["ub-library", 150, 0, 0.0, 692.286666666667, 474, 2931, 566.0, 1079.1000000000001, 1268.8, 2291.970000000011, 2.752950245012572, 252.2533148675372, 0.4086410519940536], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2400, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
