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

    var data = {"OkPercent": 96.3921568627451, "KoPercent": 3.607843137254902};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.2992156862745098, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.37, 500, 1500, "Add to Cart-153"], "isController": false}, {"data": [0.03, 500, 1500, "Add to Cart-152"], "isController": false}, {"data": [0.0, 500, 1500, "Login-102"], "isController": false}, {"data": [0.33, 500, 1500, "Add to Cart-152-1"], "isController": false}, {"data": [0.36, 500, 1500, "Add to Cart-152-0"], "isController": false}, {"data": [0.4, 500, 1500, "Search-109"], "isController": false}, {"data": [0.4, 500, 1500, "Search-107"], "isController": false}, {"data": [0.37, 500, 1500, "Login-106"], "isController": false}, {"data": [0.38, 500, 1500, "Completing Purchase-156-0"], "isController": false}, {"data": [0.33, 500, 1500, "Completing Purchase-156-1"], "isController": false}, {"data": [0.21, 500, 1500, "Completing Purchase-159"], "isController": false}, {"data": [0.23, 500, 1500, "Completing Purchase-158"], "isController": false}, {"data": [0.01, 500, 1500, "Completing Purchase-156"], "isController": false}, {"data": [0.34, 500, 1500, "Add to Cart-143"], "isController": false}, {"data": [0.19, 500, 1500, "Logout-176"], "isController": false}, {"data": [0.42, 500, 1500, "Add to Cart-125-0"], "isController": false}, {"data": [0.32, 500, 1500, "Add to Cart-125-1"], "isController": false}, {"data": [0.33, 500, 1500, "Logout-179"], "isController": false}, {"data": [0.32, 500, 1500, "Completing Purchase-169-1"], "isController": false}, {"data": [0.35, 500, 1500, "Completing Purchase-169-0"], "isController": false}, {"data": [0.41, 500, 1500, "Add to Cart-137"], "isController": false}, {"data": [0.08, 500, 1500, "Completing Purchase-169"], "isController": false}, {"data": [0.32, 500, 1500, "Completing Purchase-167"], "isController": false}, {"data": [0.39, 500, 1500, "Logout-180"], "isController": false}, {"data": [0.02, 500, 1500, "Add to Cart-134"], "isController": false}, {"data": [0.42, 500, 1500, "Add to Cart-131"], "isController": false}, {"data": [0.38, 500, 1500, "Login-97"], "isController": false}, {"data": [0.45, 500, 1500, "Add to Cart-130"], "isController": false}, {"data": [0.38, 500, 1500, "Add to Cart-134-0"], "isController": false}, {"data": [0.35, 500, 1500, "Add to Cart-134-1"], "isController": false}, {"data": [0.18, 500, 1500, "Completing Purchase-162"], "isController": false}, {"data": [0.1, 500, 1500, "Completing Purchase-161"], "isController": false}, {"data": [0.28, 500, 1500, "Completing Purchase-160"], "isController": false}, {"data": [0.0, 500, 1500, "Completing Purchase-166"], "isController": false}, {"data": [0.4, 500, 1500, "Completing Purchase-165"], "isController": false}, {"data": [0.33, 500, 1500, "Completing Purchase-164"], "isController": false}, {"data": [0.4, 500, 1500, "Completing Purchase-163"], "isController": false}, {"data": [0.39, 500, 1500, "Logout-176-1"], "isController": false}, {"data": [0.32, 500, 1500, "Add to Cart-127"], "isController": false}, {"data": [0.36, 500, 1500, "Logout-176-0"], "isController": false}, {"data": [0.44, 500, 1500, "Add to Cart-124"], "isController": false}, {"data": [0.04, 500, 1500, "Add to Cart-125"], "isController": false}, {"data": [0.44, 500, 1500, "Add to Cart-123"], "isController": false}, {"data": [0.15, 500, 1500, "Search-112"], "isController": false}, {"data": [0.41, 500, 1500, "Login-102-1"], "isController": false}, {"data": [0.37, 500, 1500, "Login-102-0"], "isController": false}, {"data": [0.44, 500, 1500, "Login-102-2"], "isController": false}, {"data": [0.27, 500, 1500, "Login-91"], "isController": false}, {"data": [0.33, 500, 1500, "Completing Purchase-173"], "isController": false}, {"data": [0.33, 500, 1500, "Completing Purchase-170"], "isController": false}, {"data": [0.39, 500, 1500, "Completing Purchase-174"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2550, 92, 3.607843137254902, 2100.522352941179, 461, 58857, 1223.0, 3456.8, 5053.499999999998, 15039.049999999663, 17.30784893980941, 197.70992739824004, 18.45686686785627], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Add to Cart-153", 50, 0, 0.0, 2155.7400000000002, 819, 32559, 1253.0, 3602.999999999999, 4234.299999999997, 32559.0, 0.4463090243684727, 7.910339306435776, 0.3364751629027939], "isController": false}, {"data": ["Add to Cart-152", 50, 0, 0.0, 3105.9, 1409, 14230, 2393.5, 5799.5999999999985, 9681.899999999974, 14230.0, 0.4441878026029405, 9.108296456491805, 1.0918170890152357], "isController": false}, {"data": ["Login-102", 50, 0, 0.0, 5924.08, 1827, 58857, 2953.5, 13565.699999999995, 31846.74999999994, 58857.0, 0.5423875901719369, 14.66012213890546, 1.725682391386885], "isController": false}, {"data": ["Add to Cart-152-1", 50, 0, 0.0, 1655.3400000000001, 767, 10288, 1302.5, 2742.6999999999994, 3811.949999999999, 10288.0, 0.44671973697141887, 6.268481284118219, 0.31540856428743735], "isController": false}, {"data": ["Add to Cart-152-0", 50, 0, 0.0, 1450.3200000000004, 608, 9000, 970.0, 2735.9, 4297.499999999996, 9000.0, 0.44784407860559267, 2.899011930006449, 0.7846018330258138], "isController": false}, {"data": ["Search-109", 50, 0, 0.0, 2263.7599999999993, 558, 53182, 855.0, 3633.3999999999996, 4129.999999999996, 53182.0, 0.4989621587098835, 3.159356273326481, 0.33231659398451224], "isController": false}, {"data": ["Search-107", 50, 0, 0.0, 1121.0800000000002, 532, 4346, 839.5, 2187.6999999999994, 3202.8999999999996, 4346.0, 0.5144932755728883, 3.2098351177675104, 0.34215812564954773], "isController": false}, {"data": ["Login-106", 50, 0, 0.0, 2502.9600000000005, 857, 39513, 1189.5, 3847.699999999998, 7912.799999999981, 39513.0, 0.532197977647685, 9.823335218201171, 0.5030934007450771], "isController": false}, {"data": ["Completing Purchase-156-0", 50, 0, 0.0, 2822.7199999999993, 610, 40100, 934.5, 3582.7, 19907.299999999865, 40100.0, 0.44745532158613965, 2.737832291508193, 0.3408351082394423], "isController": false}, {"data": ["Completing Purchase-156-1", 50, 0, 0.0, 1588.42, 802, 6184, 1282.5, 2867.0, 4189.499999999998, 6184.0, 0.44634089732374, 6.326106353551088, 0.3421656292960311], "isController": false}, {"data": ["Completing Purchase-159", 50, 5, 10.0, 2673.4799999999996, 651, 36781, 1507.5, 3681.7999999999997, 7655.849999999991, 36781.0, 0.45289444841985127, 0.6649587356545684, 0.39053300581516476], "isController": false}, {"data": ["Completing Purchase-158", 50, 1, 2.0, 1752.1599999999999, 736, 4821, 1513.5, 3116.7, 3917.349999999996, 4821.0, 0.45369992287101313, 0.619610541150583, 0.34869320244090557], "isController": false}, {"data": ["Completing Purchase-156", 50, 0, 0.0, 4411.380000000001, 1483, 41920, 2400.5, 7225.8, 21800.49999999987, 41920.0, 0.4439196327896797, 9.007987709530067, 0.6784513919100086], "isController": false}, {"data": ["Add to Cart-143", 50, 0, 0.0, 1666.2, 723, 10216, 1283.0, 2847.1, 3438.7, 10216.0, 0.4469034062977628, 7.923728322391648, 0.3373597002618854], "isController": false}, {"data": ["Logout-176", 50, 0, 0.0, 2776.82, 1051, 12209, 1900.0, 5714.099999999999, 8588.149999999987, 12209.0, 0.5054589567327133, 12.695105182849778, 0.9289782779013344], "isController": false}, {"data": ["Add to Cart-125-0", 50, 0, 0.0, 1190.7199999999998, 555, 4423, 936.5, 2597.6999999999994, 3190.8499999999967, 4423.0, 0.4546322479746133, 2.9427759362014565, 0.7778296026968785], "isController": false}, {"data": ["Add to Cart-125-1", 50, 0, 0.0, 2687.16, 754, 47463, 1260.5, 3808.0999999999985, 8901.599999999984, 47463.0, 0.4505153896057089, 6.321558034266201, 0.3216081541032942], "isController": false}, {"data": ["Logout-179", 50, 0, 0.0, 2025.66, 865, 15827, 1287.0, 2864.399999999999, 8754.099999999991, 15827.0, 0.5121586462622663, 9.452798098739065, 0.49965477306250383], "isController": false}, {"data": ["Completing Purchase-169-1", 50, 0, 0.0, 1735.6799999999998, 784, 5002, 1180.0, 3592.9, 4139.899999999998, 5002.0, 0.49682034976152617, 7.04144840210155, 0.3745559668124006], "isController": false}, {"data": ["Completing Purchase-169-0", 50, 0, 0.0, 1567.7200000000003, 567, 7935, 880.0, 3653.0999999999995, 5599.449999999986, 7935.0, 0.49682528641977763, 3.0391637281521082, 0.37989667897137297], "isController": false}, {"data": ["Add to Cart-137", 50, 0, 0.0, 1243.2, 483, 7891, 912.5, 2210.3999999999996, 2745.2499999999995, 7891.0, 0.4475594582740317, 9.925732403081, 0.350092896560058], "isController": false}, {"data": ["Completing Purchase-169", 50, 0, 0.0, 3303.600000000001, 1365, 12938, 2120.0, 7325.9, 9409.599999999988, 12938.0, 0.4927564797477087, 9.99812521558096, 0.7482776621168818], "isController": false}, {"data": ["Completing Purchase-167", 50, 0, 0.0, 1653.0799999999997, 576, 7138, 921.0, 3816.8999999999996, 4248.599999999999, 7138.0, 0.5025681231090875, 3.1773691689533514, 0.40097476228527773], "isController": false}, {"data": ["Logout-180", 50, 0, 0.0, 1111.3799999999999, 517, 4164, 780.0, 2278.5, 2975.149999999996, 4164.0, 0.5125944455265883, 3.0902336821965695, 0.32737965563905147], "isController": false}, {"data": ["Add to Cart-134", 50, 0, 0.0, 3943.2800000000007, 1428, 41168, 2439.0, 8132.5, 11462.699999999995, 41168.0, 0.4440655085438204, 9.105112248658921, 1.0733202111975557], "isController": false}, {"data": ["Add to Cart-131", 50, 0, 0.0, 1986.3400000000001, 473, 42386, 703.0, 3454.2, 5140.9999999999845, 42386.0, 0.44959985612804604, 2.8555210862332525, 0.3134905246830321], "isController": false}, {"data": ["Login-97", 50, 0, 0.0, 2884.42, 680, 43114, 950.0, 5426.999999999996, 18592.89999999994, 43114.0, 0.5920452796229856, 8.46386544142896, 0.4850839742223485], "isController": false}, {"data": ["Add to Cart-130", 50, 0, 0.0, 1290.3999999999999, 480, 8551, 752.0, 3141.2999999999993, 4597.999999999991, 8551.0, 0.44995185515149877, 2.857440347632803, 0.31373596150211924], "isController": false}, {"data": ["Add to Cart-134-0", 50, 0, 0.0, 2257.1800000000007, 560, 40059, 939.5, 4543.799999999998, 6798.999999999983, 40059.0, 0.44810094818160634, 2.900665962027926, 0.7631894313150867], "isController": false}, {"data": ["Add to Cart-134-1", 50, 0, 0.0, 1685.8600000000001, 794, 11151, 1358.0, 3101.999999999999, 3936.1999999999994, 11151.0, 0.44685947163336076, 6.269770040530155, 0.3189983142226433], "isController": false}, {"data": ["Completing Purchase-162", 50, 17, 34.0, 1591.1799999999998, 626, 12169, 1328.5, 2383.2999999999993, 2988.5999999999967, 12169.0, 0.4662308961890287, 0.6400384961023098, 0.3952035330977313], "isController": false}, {"data": ["Completing Purchase-161", 50, 17, 34.0, 2915.62, 694, 51877, 1657.5, 2679.6, 9858.849999999993, 51877.0, 0.46066815308924064, 0.7845214636809228, 0.7490356200132673], "isController": false}, {"data": ["Completing Purchase-160", 50, 6, 12.0, 1381.32, 676, 4010, 1230.0, 1970.8999999999999, 2966.4999999999986, 4010.0, 0.4559007230585468, 0.6667815204061164, 0.37754278628285903], "isController": false}, {"data": ["Completing Purchase-166", 50, 35, 70.0, 2211.1, 679, 7767, 1880.0, 4179.7, 4734.45, 7767.0, 0.4785284293739891, 0.6605374651870568, 0.6000297883947285], "isController": false}, {"data": ["Completing Purchase-165", 50, 0, 0.0, 1185.58, 519, 5823, 793.0, 2649.999999999999, 3402.2499999999995, 5823.0, 0.47175597007180126, 2.8917627427184467, 0.36441305891288556], "isController": false}, {"data": ["Completing Purchase-164", 50, 11, 22.0, 1315.9, 633, 3986, 1096.0, 2649.499999999999, 3615.9499999999994, 3986.0, 0.47520386245699403, 0.8027603998365298, 0.3434090412286871], "isController": false}, {"data": ["Completing Purchase-163", 50, 0, 0.0, 1076.32, 536, 3406, 781.5, 2144.8999999999996, 2779.6, 3406.0, 0.46671831682706216, 2.8609377041892636, 0.3605216685646545], "isController": false}, {"data": ["Logout-176-1", 50, 0, 0.0, 1340.88, 488, 3811, 991.0, 2809.7999999999997, 3437.8499999999976, 3811.0, 0.5097463502161323, 9.49811768195396, 0.4350764746961912], "isController": false}, {"data": ["Add to Cart-127", 50, 0, 0.0, 1656.3799999999999, 633, 6110, 1327.5, 3109.499999999999, 5189.9999999999945, 6110.0, 0.4487444131320565, 7.955204229191722, 0.3418170334404337], "isController": false}, {"data": ["Logout-176-0", 50, 0, 0.0, 1435.7200000000003, 504, 9116, 749.0, 3028.3999999999996, 5290.9499999999825, 9116.0, 0.509133861474859, 3.3006989135083393, 0.5011786448893143], "isController": false}, {"data": ["Add to Cart-124", 50, 0, 0.0, 1406.14, 470, 9046, 762.0, 3219.899999999999, 6636.79999999999, 9046.0, 0.4570383912248629, 2.879984574954296, 0.31912348606032903], "isController": false}, {"data": ["Add to Cart-125", 50, 0, 0.0, 3878.0799999999995, 1358, 48158, 2477.0, 7801.399999999996, 9915.049999999985, 48158.0, 0.4479283314669653, 9.184639207726764, 1.0861212206047033], "isController": false}, {"data": ["Add to Cart-123", 50, 0, 0.0, 2030.3400000000001, 461, 23578, 777.0, 4183.5, 11058.049999999996, 23578.0, 0.4609144542772861, 2.927166874078171, 0.321829916804941], "isController": false}, {"data": ["Search-112", 50, 0, 0.0, 2290.4199999999996, 1210, 8330, 1869.5, 4246.9, 6184.849999999995, 8330.0, 0.46345645826574594, 11.401445259999072, 0.352570879872086], "isController": false}, {"data": ["Login-102-1", 50, 0, 0.0, 1961.02, 546, 36944, 879.5, 2666.6999999999994, 6862.049999999984, 36944.0, 0.5712849340737186, 3.542758802786728, 0.5472954300061699], "isController": false}, {"data": ["Login-102-0", 50, 0, 0.0, 1752.96, 518, 23750, 791.5, 2393.2999999999997, 7904.899999999969, 23750.0, 0.5836008170411439, 3.7914105814123142, 0.6776380580682814], "isController": false}, {"data": ["Login-102-2", 50, 0, 0.0, 2209.4199999999996, 676, 56915, 1021.0, 1565.7, 2906.3999999999933, 56915.0, 0.5512922289847403, 7.9005129429633065, 0.5857479932962865], "isController": false}, {"data": ["Login-91", 50, 0, 0.0, 2519.44, 764, 38877, 1468.0, 2696.6999999999994, 6877.7499999999845, 38877.0, 0.5831719890830204, 10.861703587528284, 0.45902013984464296], "isController": false}, {"data": ["Completing Purchase-173", 50, 0, 0.0, 1577.7999999999997, 578, 4333, 931.0, 3958.7999999999993, 4192.85, 4333.0, 0.5048261378781147, 3.2036444187684263, 0.3939024259420056], "isController": false}, {"data": ["Completing Purchase-170", 50, 0, 0.0, 1555.7999999999997, 599, 5776, 860.5, 3669.7, 3758.0999999999995, 5776.0, 0.5012028869286287, 3.180504304079791, 0.3827545484161989], "isController": false}, {"data": ["Completing Purchase-174", 50, 0, 0.0, 1399.1799999999996, 499, 7837, 813.0, 3116.1999999999994, 4015.749999999998, 7837.0, 0.5063342413594062, 9.434213416085226, 0.3827174832150199], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 42, 45.65217391304348, 1.6470588235294117], "isController": false}, {"data": ["404/Not Found", 50, 54.34782608695652, 1.9607843137254901], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2550, 92, "404/Not Found", 50, "400/Bad Request", 42, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Completing Purchase-159", 50, 5, "404/Not Found", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Completing Purchase-158", 50, 1, "400/Bad Request", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Completing Purchase-162", 50, 17, "404/Not Found", 10, "400/Bad Request", 7, "", "", "", "", "", ""], "isController": false}, {"data": ["Completing Purchase-161", 50, 17, "400/Bad Request", 9, "404/Not Found", 8, "", "", "", "", "", ""], "isController": false}, {"data": ["Completing Purchase-160", 50, 6, "404/Not Found", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Completing Purchase-166", 50, 35, "400/Bad Request", 25, "404/Not Found", 10, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Completing Purchase-164", 50, 11, "404/Not Found", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
