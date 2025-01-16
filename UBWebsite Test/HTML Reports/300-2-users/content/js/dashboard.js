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

    var data = {"OkPercent": 12.145833333333334, "KoPercent": 87.85416666666667};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.0033333333333333335, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "ub-exchange student"], "isController": false}, {"data": [0.0016666666666666668, 500, 1500, "ub-transportation"], "isController": false}, {"data": [0.0, 500, 1500, "ub homepage"], "isController": false}, {"data": [0.0033333333333333335, 500, 1500, "ub-fee and scholarships"], "isController": false}, {"data": [0.005, 500, 1500, "ub-faculties and schools"], "isController": false}, {"data": [0.0033333333333333335, 500, 1500, "ub-finance"], "isController": false}, {"data": [0.0, 500, 1500, "ub-health center"], "isController": false}, {"data": [0.01, 500, 1500, "ub-httc application form"], "isController": false}, {"data": [0.005, 500, 1500, "ub-job opportunities"], "isController": false}, {"data": [0.0, 500, 1500, "ub-sports"], "isController": false}, {"data": [0.0033333333333333335, 500, 1500, "ub-news"], "isController": false}, {"data": [0.0016666666666666668, 500, 1500, "ub-FET"], "isController": false}, {"data": [0.01, 500, 1500, "why us"], "isController": false}, {"data": [0.0016666666666666668, 500, 1500, "ub-Admission requirements"], "isController": false}, {"data": [0.005, 500, 1500, "ub-announcements"], "isController": false}, {"data": [0.0033333333333333335, 500, 1500, "ub-library"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 4800, 4217, 87.85416666666667, 17616.291874999966, 0, 35432, 20008.0, 20015.0, 20016.0, 20017.0, 12.970799487653421, 170.62665291137026, 0.26166170719365944], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ub-exchange student", 300, 260, 86.66666666666667, 17754.370000000003, 72, 20019, 20010.0, 20015.0, 20016.0, 20017.0, 1.3710650433256555, 18.875615801010476, 0.029992047822748714], "isController": false}, {"data": ["ub-transportation", 300, 261, 87.0, 17782.670000000013, 2, 20017, 20009.0, 20016.0, 20017.0, 20017.0, 1.271822351853893, 16.290081945103907, 0.0256724297000195], "isController": false}, {"data": ["ub homepage", 300, 249, 83.0, 16856.46666666667, 849, 20016, 20001.0, 20003.0, 20004.0, 20011.97, 4.290863321700326, 119.95199205564535, 0.1127608710810115], "isController": false}, {"data": ["ub-fee and scholarships", 300, 269, 89.66666666666667, 18226.716666666678, 2, 20018, 20009.0, 20015.9, 20016.95, 20018.0, 1.0303967027305514, 11.00047427764898, 0.015076930920487723], "isController": false}, {"data": ["ub-faculties and schools", 300, 273, 91.0, 18491.203333333353, 2, 20018, 20008.0, 20015.0, 20016.0, 20017.0, 0.9744974029644211, 9.783706494781567, 0.012419131942075874], "isController": false}, {"data": ["ub-finance", 300, 260, 86.66666666666667, 17639.61999999999, 1, 20019, 20009.0, 20015.0, 20015.0, 20017.0, 1.490305562317127, 19.234110626002852, 0.030829726069418435], "isController": false}, {"data": ["ub-health center", 300, 264, 88.0, 17818.96333333333, 0, 20018, 20009.0, 20015.0, 20016.0, 20017.0, 1.1762215060340164, 14.50777718272405, 0.021778476322661083], "isController": false}, {"data": ["ub-httc application form", 300, 283, 94.33333333333333, 18768.153333333314, 1, 20060, 20009.0, 20015.0, 20016.0, 20018.0, 0.8764241893076249, 5.363864391615542, 0.008875506682734444], "isController": false}, {"data": ["ub-job opportunities", 300, 255, 85.0, 16696.469999999994, 1, 35432, 20008.0, 20015.0, 20016.0, 20017.99, 2.8278676934968465, 44.98551122840216, 0.07938649410389585], "isController": false}, {"data": ["ub-sports", 300, 262, 87.33333333333333, 17537.846666666675, 1, 20022, 20007.5, 20015.9, 20016.0, 20017.99, 1.6447909470706275, 20.982285430167657, 0.034405685631106284], "isController": false}, {"data": ["ub-news", 300, 256, 85.33333333333333, 17317.88666666666, 1, 20875, 20007.0, 20015.0, 20016.0, 20017.0, 2.081179890252447, 31.326093139737356, 0.047422718853408624], "isController": false}, {"data": ["ub-FET", 300, 278, 92.66666666666667, 18661.616666666665, 1, 20018, 20009.0, 20015.0, 20016.0, 20017.99, 0.9308271329903753, 8.27854987410563, 0.012465569092195325], "isController": false}, {"data": ["why us", 300, 258, 86.0, 16302.05666666667, 1, 20449, 20002.0, 20013.9, 20016.0, 20018.99, 3.4506159349443877, 51.15977313278545, 0.09776745149009097], "isController": false}, {"data": ["ub-Admission requirements", 300, 267, 89.0, 18030.026666666658, 1, 20017, 20009.0, 20014.0, 20016.0, 20016.99, 1.0983700188919643, 12.436580572763352, 0.020412091269056718], "isController": false}, {"data": ["ub-announcements", 300, 260, 86.66666666666667, 16704.596666666657, 1, 20018, 20007.0, 20015.0, 20016.0, 20017.99, 2.399923202457521, 26.69720818933794, 0.05727941705865412], "isController": false}, {"data": ["ub-library", 300, 262, 87.33333333333333, 17272.00666666668, 1, 20018, 20008.0, 20016.0, 20016.0, 20017.99, 1.8438957830103442, 25.784967802890613, 0.04014314777595437], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 44, 1.0433957789898032, 0.9166666666666666], "isController": false}, {"data": ["500/Internal Server Error", 73, 1.7310884515058098, 1.5208333333333333], "isController": false}, {"data": ["404/Not Found", 7, 0.16599478302110504, 0.14583333333333334], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to www.ubuea.cm:443 [www.ubuea.cm/50.87.98.153] failed: connect timed out", 4093, 97.05952098648328, 85.27083333333333], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 4800, 4217, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to www.ubuea.cm:443 [www.ubuea.cm/50.87.98.153] failed: connect timed out", 4093, "500/Internal Server Error", 73, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 44, "404/Not Found", 7, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["ub-exchange student", 300, 260, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to www.ubuea.cm:443 [www.ubuea.cm/50.87.98.153] failed: connect timed out", 259, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["ub-transportation", 300, 261, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to www.ubuea.cm:443 [www.ubuea.cm/50.87.98.153] failed: connect timed out", 260, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["ub homepage", 300, 249, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to www.ubuea.cm:443 [www.ubuea.cm/50.87.98.153] failed: connect timed out", 231, "500/Internal Server Error", 17, "404/Not Found", 1, "", "", "", ""], "isController": false}, {"data": ["ub-fee and scholarships", 300, 269, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to www.ubuea.cm:443 [www.ubuea.cm/50.87.98.153] failed: connect timed out", 268, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["ub-faculties and schools", 300, 273, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to www.ubuea.cm:443 [www.ubuea.cm/50.87.98.153] failed: connect timed out", 272, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["ub-finance", 300, 260, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to www.ubuea.cm:443 [www.ubuea.cm/50.87.98.153] failed: connect timed out", 258, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 1, "500/Internal Server Error", 1, "", "", "", ""], "isController": false}, {"data": ["ub-health center", 300, 264, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to www.ubuea.cm:443 [www.ubuea.cm/50.87.98.153] failed: connect timed out", 261, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 3, "", "", "", "", "", ""], "isController": false}, {"data": ["ub-httc application form", 300, 283, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to www.ubuea.cm:443 [www.ubuea.cm/50.87.98.153] failed: connect timed out", 279, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 4, "", "", "", "", "", ""], "isController": false}, {"data": ["ub-job opportunities", 300, 255, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to www.ubuea.cm:443 [www.ubuea.cm/50.87.98.153] failed: connect timed out", 237, "500/Internal Server Error", 10, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 7, "404/Not Found", 1, "", ""], "isController": false}, {"data": ["ub-sports", 300, 262, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to www.ubuea.cm:443 [www.ubuea.cm/50.87.98.153] failed: connect timed out", 256, "500/Internal Server Error", 3, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 2, "404/Not Found", 1, "", ""], "isController": false}, {"data": ["ub-news", 300, 256, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to www.ubuea.cm:443 [www.ubuea.cm/50.87.98.153] failed: connect timed out", 248, "500/Internal Server Error", 6, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 2, "", "", "", ""], "isController": false}, {"data": ["ub-FET", 300, 278, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to www.ubuea.cm:443 [www.ubuea.cm/50.87.98.153] failed: connect timed out", 275, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 3, "", "", "", "", "", ""], "isController": false}, {"data": ["why us", 300, 258, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to www.ubuea.cm:443 [www.ubuea.cm/50.87.98.153] failed: connect timed out", 231, "500/Internal Server Error", 19, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 5, "404/Not Found", 3, "", ""], "isController": false}, {"data": ["ub-Admission requirements", 300, 267, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to www.ubuea.cm:443 [www.ubuea.cm/50.87.98.153] failed: connect timed out", 265, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["ub-announcements", 300, 260, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to www.ubuea.cm:443 [www.ubuea.cm/50.87.98.153] failed: connect timed out", 242, "500/Internal Server Error", 11, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 6, "404/Not Found", 1, "", ""], "isController": false}, {"data": ["ub-library", 300, 262, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to www.ubuea.cm:443 [www.ubuea.cm/50.87.98.153] failed: connect timed out", 251, "500/Internal Server Error", 6, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.ubuea.cm:443 failed to respond", 5, "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
