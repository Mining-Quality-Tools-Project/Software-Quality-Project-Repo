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

    var data = {"OkPercent": 95.4375, "KoPercent": 4.5625};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.2846875, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.225, 500, 1500, "ub-exchange student"], "isController": false}, {"data": [0.245, 500, 1500, "ub-transportation"], "isController": false}, {"data": [0.0, 500, 1500, "ub homepage"], "isController": false}, {"data": [0.345, 500, 1500, "ub-fee and scholarships"], "isController": false}, {"data": [0.305, 500, 1500, "ub-faculties and schools"], "isController": false}, {"data": [0.34, 500, 1500, "ub-finance"], "isController": false}, {"data": [0.24, 500, 1500, "ub-health center"], "isController": false}, {"data": [0.42, 500, 1500, "ub-httc application form"], "isController": false}, {"data": [0.265, 500, 1500, "ub-job opportunities"], "isController": false}, {"data": [0.335, 500, 1500, "ub-sports"], "isController": false}, {"data": [0.26, 500, 1500, "ub-news"], "isController": false}, {"data": [0.315, 500, 1500, "ub-FET"], "isController": false}, {"data": [0.23, 500, 1500, "why us"], "isController": false}, {"data": [0.325, 500, 1500, "ub-Admission requirements"], "isController": false}, {"data": [0.385, 500, 1500, "ub-announcements"], "isController": false}, {"data": [0.32, 500, 1500, "ub-library"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1600, 73, 4.5625, 2197.6993750000015, 0, 19583, 1391.0, 4813.0, 7075.899999999992, 12185.220000000003, 11.341565419567035, 934.7627605348079, 1.628321782805478], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ub-exchange student", 100, 4, 4.0, 2147.480000000001, 0, 12394, 1571.0, 4475.600000000001, 6647.399999999991, 12366.129999999986, 0.7905200831627128, 64.71971709015486, 0.12450691309812727], "isController": false}, {"data": ["ub-transportation", 100, 7, 7.0, 1936.0799999999997, 0, 8380, 1463.5, 4490.000000000003, 6039.649999999998, 8370.719999999996, 0.7775324231020434, 57.909620177841106, 0.11227902285556558], "isController": false}, {"data": ["ub homepage", 100, 0, 0.0, 6561.570000000003, 1813, 19583, 5583.5, 12335.6, 13652.799999999992, 19552.909999999985, 0.837065249236178, 126.86058187806051, 0.09564124429749299], "isController": false}, {"data": ["ub-fee and scholarships", 100, 5, 5.0, 1593.6999999999996, 1, 7963, 1104.5, 3555.1000000000004, 4360.999999999996, 7959.979999999999, 0.7753019801212572, 58.41646781382286, 0.10429477320478826], "isController": false}, {"data": ["ub-faculties and schools", 100, 3, 3.0, 1923.3400000000006, 2, 10787, 1286.5, 4324.800000000001, 6743.299999999995, 10758.849999999986, 0.7740297537037323, 62.709245035566674, 0.10631570786956052], "isController": false}, {"data": ["ub-finance", 100, 4, 4.0, 1763.0299999999993, 1, 9154, 1209.5, 3143.8, 6210.999999999989, 9140.739999999993, 0.8074087829927414, 61.13245137380605, 0.11732658877863274], "isController": false}, {"data": ["ub-health center", 100, 5, 5.0, 2190.9500000000003, 0, 13443, 1567.0, 4212.700000000001, 6308.749999999989, 13439.189999999999, 0.7755485066813503, 60.82712520891338, 0.11368147544225653], "isController": false}, {"data": ["ub-httc application form", 100, 7, 7.0, 1592.1099999999997, 1, 9980, 928.5, 3898.8, 4738.249999999994, 9955.009999999987, 0.771992125680318, 44.536278503396765, 0.12830599596634115], "isController": false}, {"data": ["ub-job opportunities", 100, 3, 3.0, 2333.14, 1, 14160, 1410.0, 4428.1, 8293.749999999984, 14159.56, 0.8282602393672092, 73.07447289000704, 0.12082569780925166], "isController": false}, {"data": ["ub-sports", 100, 3, 3.0, 1798.6499999999999, 49, 9216, 1274.5, 3800.2000000000007, 5822.9499999999825, 9215.6, 0.8128032772228138, 64.53422276448619, 0.11780091247327909], "isController": false}, {"data": ["ub-news", 100, 5, 5.0, 1935.07, 1, 9039, 1408.0, 4133.200000000001, 5091.349999999997, 9006.899999999983, 0.8199678572599954, 67.65655684734658, 0.10649973146052674], "isController": false}, {"data": ["ub-FET", 100, 5, 5.0, 1851.3599999999997, 1, 8497, 1189.0, 5033.700000000005, 6155.499999999999, 8493.829999999998, 0.7726721320342139, 63.37805434879193, 0.13404805103113096], "isController": false}, {"data": ["why us", 100, 10, 10.0, 1963.0, 1, 8210, 1410.5, 4196.0, 4950.9, 8186.829999999988, 0.8577800651912849, 69.61907193558072, 0.10253152341739578], "isController": false}, {"data": ["ub-Admission requirements", 100, 3, 3.0, 1987.8700000000006, 0, 9955, 1307.5, 4327.000000000001, 7088.099999999993, 9948.379999999997, 0.7761082826275922, 60.632345440460846, 0.12718626065208616], "isController": false}, {"data": ["ub-announcements", 100, 6, 6.0, 1627.2599999999995, 1, 11910, 933.5, 3888.5000000000005, 5792.39999999999, 11877.409999999983, 0.824565454005739, 51.3029728547899, 0.10672646999406313], "isController": false}, {"data": ["ub-library", 100, 3, 3.0, 1958.5800000000002, 1, 9772, 1221.0, 4689.4, 5558.799999999997, 9739.829999999984, 0.8151287903488751, 72.49989492480437, 0.11736580942288881], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 73, 100.0, 4.5625], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1600, 73, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 73, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["ub-exchange student", 100, 4, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["ub-transportation", 100, 7, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["ub-fee and scholarships", 100, 5, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["ub-faculties and schools", 100, 3, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["ub-finance", 100, 4, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["ub-health center", 100, 5, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["ub-httc application form", 100, 7, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["ub-job opportunities", 100, 3, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["ub-sports", 100, 3, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["ub-news", 100, 5, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["ub-FET", 100, 5, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["why us", 100, 10, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["ub-Admission requirements", 100, 3, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["ub-announcements", 100, 6, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["ub-library", 100, 3, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 3, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
