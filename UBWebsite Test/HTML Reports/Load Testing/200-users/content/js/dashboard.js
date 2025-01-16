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

    var data = {"OkPercent": 80.75, "KoPercent": 19.25};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.08703125, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.06, 500, 1500, "ub-exchange student"], "isController": false}, {"data": [0.07, 500, 1500, "ub-transportation"], "isController": false}, {"data": [0.0, 500, 1500, "ub homepage"], "isController": false}, {"data": [0.105, 500, 1500, "ub-fee and scholarships"], "isController": false}, {"data": [0.1175, 500, 1500, "ub-faculties and schools"], "isController": false}, {"data": [0.07, 500, 1500, "ub-finance"], "isController": false}, {"data": [0.085, 500, 1500, "ub-health center"], "isController": false}, {"data": [0.23, 500, 1500, "ub-httc application form"], "isController": false}, {"data": [0.0625, 500, 1500, "ub-job opportunities"], "isController": false}, {"data": [0.0725, 500, 1500, "ub-sports"], "isController": false}, {"data": [0.065, 500, 1500, "ub-news"], "isController": false}, {"data": [0.12, 500, 1500, "ub-FET"], "isController": false}, {"data": [0.055, 500, 1500, "why us"], "isController": false}, {"data": [0.1, 500, 1500, "ub-Admission requirements"], "isController": false}, {"data": [0.1175, 500, 1500, "ub-announcements"], "isController": false}, {"data": [0.0625, 500, 1500, "ub-library"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3200, 616, 19.25, 4203.370312499998, 0, 36731, 2804.0, 10015.000000000002, 12997.299999999994, 22219.089999999982, 12.01061438045873, 847.9347578500625, 1.457551538906884], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ub-exchange student", 200, 47, 23.5, 3651.5, 0, 15047, 3059.0, 8401.600000000002, 10162.549999999997, 13469.530000000006, 0.7886932929522367, 51.7797403301273, 0.0989871699318569], "isController": false}, {"data": ["ub-transportation", 200, 43, 21.5, 3582.48, 0, 25597, 2623.0, 8104.1, 10132.399999999992, 25198.39000000008, 0.7880313794095282, 49.79095466800238, 0.09605286779394556], "isController": false}, {"data": ["ub homepage", 200, 0, 0.0, 12614.130000000001, 2045, 36731, 11967.5, 18199.1, 25577.349999999977, 32807.24000000001, 0.8892366792345451, 134.76929396969703, 0.10160223776410329], "isController": false}, {"data": ["ub-fee and scholarships", 200, 36, 18.0, 3243.5999999999995, 0, 21600, 2296.0, 7265.200000000002, 8773.049999999997, 16472.0, 0.7900641532092406, 51.60209502175639, 0.09173694122712764], "isController": false}, {"data": ["ub-faculties and schools", 200, 22, 11.0, 3686.724999999999, 0, 22408, 2544.0, 8161.000000000001, 11916.949999999977, 19193.40000000004, 0.7973051087324842, 59.40157034847216, 0.10048068777531942], "isController": false}, {"data": ["ub-finance", 200, 43, 21.5, 3914.4, 0, 26131, 2542.0, 8864.4, 10708.85, 25117.82, 0.7936570925166072, 49.43161828789316, 0.09430490891792792], "isController": false}, {"data": ["ub-health center", 200, 41, 20.5, 3842.3749999999995, 0, 25126, 2860.5, 8373.9, 10506.249999999998, 25072.960000000032, 0.7891663246945926, 52.05801167818192, 0.09680388871571073], "isController": false}, {"data": ["ub-httc application form", 200, 35, 17.5, 2556.094999999999, 0, 25916, 1306.5, 5679.2, 8498.349999999997, 20080.07000000005, 0.810596112381045, 41.669765771920545, 0.11951147272141432], "isController": false}, {"data": ["ub-job opportunities", 200, 29, 14.5, 4621.269999999999, 0, 26051, 3385.0, 10017.400000000001, 11073.85, 24910.450000000033, 0.8661720824076119, 67.56815979169644, 0.11137585751036158], "isController": false}, {"data": ["ub-sports", 200, 49, 24.5, 4063.245000000001, 0, 26984, 2337.0, 10341.300000000001, 11072.699999999999, 25626.090000000004, 0.8148498231775884, 50.72395985056673, 0.09192126691831946], "isController": false}, {"data": ["ub-news", 200, 44, 22.0, 4160.440000000001, 0, 26140, 2904.0, 9523.0, 13200.149999999998, 22207.48000000001, 0.8388522823073471, 57.134917068966246, 0.08945573166793194], "isController": false}, {"data": ["ub-FET", 200, 32, 16.0, 3450.1950000000006, 0, 25469, 2564.5, 7250.0, 9341.349999999995, 25032.840000000113, 0.8102447344220322, 58.95522676218102, 0.1242902762529422], "isController": false}, {"data": ["why us", 200, 77, 38.5, 2782.53, 0, 19819, 1992.5, 7279.000000000001, 10148.799999999996, 15105.790000000015, 0.9016604076406703, 50.586877903628285, 0.07364734032721257], "isController": false}, {"data": ["ub-Admission requirements", 200, 37, 18.5, 3507.6349999999993, 1, 25131, 2423.5, 8157.4000000000015, 11098.549999999992, 19691.97000000003, 0.7893968218883951, 52.072249143257764, 0.10869238759976002], "isController": false}, {"data": ["ub-announcements", 200, 40, 20.0, 3534.4149999999986, 0, 25364, 2285.5, 8662.300000000001, 10713.4, 16062.0, 0.8672049118486207, 46.182408999039566, 0.09552804107082462], "isController": false}, {"data": ["ub-library", 200, 41, 20.5, 4042.8900000000003, 0, 25111, 3185.5, 8828.0, 10375.949999999999, 19654.260000000046, 0.8391444083612349, 61.47758776401581, 0.09902559600231604], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 616, 100.0, 19.25], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3200, 616, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 616, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["ub-exchange student", 200, 47, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 47, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["ub-transportation", 200, 43, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 43, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["ub-fee and scholarships", 200, 36, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 36, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["ub-faculties and schools", 200, 22, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 22, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["ub-finance", 200, 43, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 43, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["ub-health center", 200, 41, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 41, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["ub-httc application form", 200, 35, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 35, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["ub-job opportunities", 200, 29, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 29, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["ub-sports", 200, 49, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 49, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["ub-news", 200, 44, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 44, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["ub-FET", 200, 32, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 32, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["why us", 200, 77, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 77, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["ub-Admission requirements", 200, 37, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 37, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["ub-announcements", 200, 40, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 40, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["ub-library", 200, 41, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 41, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
