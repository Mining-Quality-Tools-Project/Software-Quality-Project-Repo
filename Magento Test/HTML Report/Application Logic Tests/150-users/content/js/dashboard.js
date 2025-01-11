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

    var data = {"OkPercent": 96.57839538542213, "KoPercent": 3.421604614577871};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.27667802831672783, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.2866666666666667, 500, 1500, "Add to Cart-153"], "isController": false}, {"data": [0.02666666666666667, 500, 1500, "Add to Cart-152"], "isController": false}, {"data": [0.0, 500, 1500, "Login-102"], "isController": false}, {"data": [0.3233333333333333, 500, 1500, "Add to Cart-152-1"], "isController": false}, {"data": [0.31666666666666665, 500, 1500, "Add to Cart-152-0"], "isController": false}, {"data": [0.38666666666666666, 500, 1500, "Search-109"], "isController": false}, {"data": [0.33, 500, 1500, "Search-107"], "isController": false}, {"data": [0.22333333333333333, 500, 1500, "Login-106"], "isController": false}, {"data": [0.33, 500, 1500, "Completing Purchase-156-0"], "isController": false}, {"data": [0.3433333333333333, 500, 1500, "Completing Purchase-156-1"], "isController": false}, {"data": [0.12333333333333334, 500, 1500, "Completing Purchase-159"], "isController": false}, {"data": [0.17666666666666667, 500, 1500, "Completing Purchase-158"], "isController": false}, {"data": [0.023333333333333334, 500, 1500, "Completing Purchase-156"], "isController": false}, {"data": [0.37333333333333335, 500, 1500, "Add to Cart-143"], "isController": false}, {"data": [0.08, 500, 1500, "Logout-176"], "isController": false}, {"data": [0.3566666666666667, 500, 1500, "Add to Cart-125-0"], "isController": false}, {"data": [0.2866666666666667, 500, 1500, "Add to Cart-125-1"], "isController": false}, {"data": [0.31333333333333335, 500, 1500, "Logout-179"], "isController": false}, {"data": [0.375, 500, 1500, "Completing Purchase-169-1"], "isController": false}, {"data": [0.34797297297297297, 500, 1500, "Completing Purchase-169-0"], "isController": false}, {"data": [0.37666666666666665, 500, 1500, "Add to Cart-137"], "isController": false}, {"data": [0.05, 500, 1500, "Completing Purchase-169"], "isController": false}, {"data": [0.43, 500, 1500, "Completing Purchase-167"], "isController": false}, {"data": [0.44, 500, 1500, "Logout-180"], "isController": false}, {"data": [0.01, 500, 1500, "Add to Cart-134"], "isController": false}, {"data": [0.43666666666666665, 500, 1500, "Add to Cart-131"], "isController": false}, {"data": [0.31666666666666665, 500, 1500, "Login-97"], "isController": false}, {"data": [0.38, 500, 1500, "Add to Cart-130"], "isController": false}, {"data": [0.35333333333333333, 500, 1500, "Add to Cart-134-0"], "isController": false}, {"data": [0.27666666666666667, 500, 1500, "Add to Cart-134-1"], "isController": false}, {"data": [0.09666666666666666, 500, 1500, "Completing Purchase-162"], "isController": false}, {"data": [0.08666666666666667, 500, 1500, "Completing Purchase-161"], "isController": false}, {"data": [0.14, 500, 1500, "Completing Purchase-160"], "isController": false}, {"data": [0.0, 500, 1500, "Completing Purchase-166"], "isController": false}, {"data": [0.38, 500, 1500, "Completing Purchase-165"], "isController": false}, {"data": [0.33666666666666667, 500, 1500, "Completing Purchase-164"], "isController": false}, {"data": [0.39666666666666667, 500, 1500, "Completing Purchase-163"], "isController": false}, {"data": [0.43288590604026844, 500, 1500, "Logout-176-1"], "isController": false}, {"data": [0.2866666666666667, 500, 1500, "Add to Cart-127"], "isController": false}, {"data": [0.4563758389261745, 500, 1500, "Logout-176-0"], "isController": false}, {"data": [0.44666666666666666, 500, 1500, "Add to Cart-124"], "isController": false}, {"data": [0.01, 500, 1500, "Add to Cart-125"], "isController": false}, {"data": [0.35333333333333333, 500, 1500, "Add to Cart-123"], "isController": false}, {"data": [0.05333333333333334, 500, 1500, "Search-112"], "isController": false}, {"data": [0.4241379310344828, 500, 1500, "Login-102-1"], "isController": false}, {"data": [0.3275862068965517, 500, 1500, "Login-102-0"], "isController": false}, {"data": [0.3159722222222222, 500, 1500, "Login-102-2"], "isController": false}, {"data": [0.27, 500, 1500, "Login-91"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "Completing Purchase-173"], "isController": false}, {"data": [0.3433333333333333, 500, 1500, "Completing Purchase-170"], "isController": false}, {"data": [0.45666666666666667, 500, 1500, "Completing Purchase-174"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 7628, 261, 3.421604614577871, 3827.9552962768757, 442, 193253, 1351.5, 4109.100000000004, 9592.599999999933, 78169.53, 21.798583149249424, 247.91846798904643, 23.208914199335013], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Add to Cart-153", 150, 0, 0.0, 1973.3133333333335, 639, 29014, 1365.5, 2314.8, 4257.799999999988, 21522.100000000133, 0.47667471717300114, 8.448503862058281, 0.3593680484937079], "isController": false}, {"data": ["Add to Cart-152", 150, 0, 0.0, 4116.506666666669, 1277, 75884, 2592.0, 5763.200000000004, 9320.549999999977, 60294.83000000028, 0.475913992823217, 9.758179548666964, 1.1678483214513473], "isController": false}, {"data": ["Login-102", 150, 6, 4.0, 17041.046666666665, 1705, 193253, 3845.5, 71765.60000000002, 100193.4, 165380.9900000005, 0.4748593624854772, 12.495438753233001, 1.4754863499697675], "isController": false}, {"data": ["Add to Cart-152-1", 150, 0, 0.0, 1998.0133333333335, 710, 24266, 1341.5, 2430.1000000000004, 5560.399999999989, 23695.82000000001, 0.4767777452862574, 6.689772218438902, 0.336631161955043], "isController": false}, {"data": ["Add to Cart-152-0", 150, 0, 0.0, 2118.406666666666, 535, 74098, 1062.5, 2592.8000000000006, 4150.649999999997, 52741.75000000038, 0.4770248911588207, 3.0877175233503684, 0.8337687013633371], "isController": false}, {"data": ["Search-109", 150, 1, 0.6666666666666666, 4309.74, 534, 100461, 918.0, 3863.0, 22858.15, 85426.71000000027, 0.47565743785535575, 3.0168232355883724, 0.3167952857591334], "isController": false}, {"data": ["Search-107", 150, 0, 0.0, 3701.9533333333334, 520, 97421, 1050.0, 4735.100000000002, 16605.449999999895, 79566.92000000032, 0.4769884854979601, 2.97548584755289, 0.3172159752188582], "isController": false}, {"data": ["Login-106", 150, 0, 0.0, 4660.200000000001, 839, 89270, 1545.5, 5339.800000000002, 17590.89999999999, 87813.95000000003, 0.4759351332142438, 8.783302321532258, 0.44990743061658983], "isController": false}, {"data": ["Completing Purchase-156-0", 150, 0, 0.0, 1876.6866666666665, 530, 22730, 998.5, 2684.1000000000004, 5673.249999999999, 21175.010000000028, 0.4770704060505249, 2.9184937386497003, 0.3633934733587983], "isController": false}, {"data": ["Completing Purchase-156-1", 150, 0, 0.0, 2310.733333333333, 709, 59305, 1292.5, 2744.2000000000003, 4589.449999999989, 43179.31000000029, 0.4766156476094548, 6.755465167935523, 0.36537430016935746], "isController": false}, {"data": ["Completing Purchase-159", 150, 8, 5.333333333333333, 3005.2933333333317, 901, 100216, 2002.0, 3427.2000000000007, 4450.249999999999, 68181.37000000058, 0.47812422304813756, 0.7288468380848256, 0.41228875874170456], "isController": false}, {"data": ["Completing Purchase-158", 150, 1, 0.6666666666666666, 2832.1266666666666, 670, 51484, 1858.5, 3474.9, 7044.599999999995, 49779.07000000003, 0.4773208932901411, 0.651477760625163, 0.36684720997982523], "isController": false}, {"data": ["Completing Purchase-156", 150, 0, 0.0, 4187.613333333332, 1268, 60321, 2708.0, 5884.800000000001, 15652.249999999976, 44129.010000000286, 0.47546595663750474, 9.647848120324584, 0.7266642794313427], "isController": false}, {"data": ["Add to Cart-143", 150, 0, 0.0, 1485.8600000000001, 659, 13127, 1288.5, 2172.9, 3128.0999999999995, 9081.170000000071, 0.47679441578380233, 8.448868442686132, 0.3599239095711711], "isController": false}, {"data": ["Logout-176", 150, 3, 2.0, 5963.620000000002, 997, 101089, 2019.0, 6089.300000000001, 33754.99999999997, 101049.22, 0.4926415769785306, 12.246572471886587, 0.9026181539242186], "isController": false}, {"data": ["Add to Cart-125-0", 150, 0, 0.0, 2187.386666666666, 538, 52771, 1067.0, 3777.9000000000005, 5538.499999999999, 37245.070000000276, 0.47612396998514495, 3.081876683296619, 0.8141657891437387], "isController": false}, {"data": ["Add to Cart-125-1", 150, 1, 0.6666666666666666, 3741.146666666666, 729, 100155, 1445.5, 5364.500000000002, 15901.349999999957, 69822.24000000054, 0.4758264312066006, 6.657834055928639, 0.33967687618361825], "isController": false}, {"data": ["Logout-179", 150, 0, 0.0, 3253.493333333334, 649, 71378, 1373.0, 2568.3000000000015, 6751.799999999992, 68355.74000000005, 0.4954844847291682, 9.144766166420027, 0.48338769555121003], "isController": false}, {"data": ["Completing Purchase-169-1", 148, 0, 0.0, 1437.8851351351352, 700, 6596, 1305.5, 2231.5, 2543.999999999999, 5209.7899999999745, 0.48157488001301557, 6.825057324290246, 0.3630623118848125], "isController": false}, {"data": ["Completing Purchase-169-0", 148, 0, 0.0, 2092.364864864864, 539, 49800, 1039.0, 1840.3, 3018.6499999999915, 42938.529999999875, 0.4818131801948739, 2.9472112162771467, 0.36841769540291625], "isController": false}, {"data": ["Add to Cart-137", 150, 1, 0.6666666666666666, 3676.9466666666667, 453, 100289, 885.0, 1886.5000000000007, 5893.149999999945, 95216.5400000001, 0.47713110608533016, 10.53630045760849, 0.37322462497495057], "isController": false}, {"data": ["Completing Purchase-169", 150, 2, 1.3333333333333333, 4822.58, 1280, 100450, 2569.0, 4356.800000000001, 7983.799999999999, 100439.29, 0.48716008405135314, 9.804794446862202, 0.7348822554375185], "isController": false}, {"data": ["Completing Purchase-167", 150, 0, 0.0, 2022.8533333333346, 514, 82754, 918.0, 1823.0, 2353.5499999999925, 57711.98000000045, 0.4923957680225058, 3.112659331063936, 0.3928587328851438], "isController": false}, {"data": ["Logout-180", 150, 0, 0.0, 1600.3266666666668, 505, 61240, 905.5, 1954.8000000000004, 2561.3999999999996, 39268.18000000039, 0.4958022079724995, 2.988083058231969, 0.3166549257949362], "isController": false}, {"data": ["Add to Cart-134", 150, 0, 0.0, 7542.566666666666, 1271, 110841, 2696.0, 12437.300000000017, 40920.14999999997, 109694.52000000002, 0.4757736078864233, 9.755124527794694, 1.1508052914351234], "isController": false}, {"data": ["Add to Cart-131", 150, 0, 0.0, 2037.353333333333, 456, 34719, 896.5, 2748.1000000000004, 7210.999999999962, 34485.93000000001, 0.47688688243148725, 3.0281789229907163, 0.33251683013289246], "isController": false}, {"data": ["Login-97", 150, 11, 7.333333333333333, 12669.63333333333, 656, 100230, 1299.0, 62614.40000000001, 100160.45, 100229.49, 0.5779901356350186, 8.000026942769344, 0.47356808964627006], "isController": false}, {"data": ["Add to Cart-130", 150, 1, 0.6666666666666666, 4945.68666666667, 452, 100213, 815.0, 6364.900000000003, 26581.25, 99393.43000000001, 0.4768277602764329, 3.0334037465549195, 0.3324756062864972], "isController": false}, {"data": ["Add to Cart-134-0", 150, 0, 0.0, 4459.266666666666, 527, 99401, 1077.0, 4274.600000000001, 29884.699999999943, 97980.14000000003, 0.4768990118652474, 3.0867971601458675, 0.8130848719287704], "isController": false}, {"data": ["Add to Cart-134-1", 150, 0, 0.0, 3083.1666666666674, 688, 76517, 1431.0, 3932.200000000002, 11012.399999999994, 58651.70000000032, 0.4766459378644355, 6.687851427077938, 0.34026189509658433], "isController": false}, {"data": ["Completing Purchase-162", 150, 50, 33.333333333333336, 1907.3066666666666, 549, 24884, 1563.5, 2411.8, 2778.999999999999, 19421.390000000098, 0.4811038446611906, 0.6595695664131783, 0.40781068082608735], "isController": false}, {"data": ["Completing Purchase-161", 150, 44, 29.333333333333332, 2477.4866666666667, 610, 69500, 2017.5, 3403.2000000000007, 3837.199999999999, 37096.64000000058, 0.4794430789195271, 0.8299078540367509, 0.7795632093759889], "isController": false}, {"data": ["Completing Purchase-160", 150, 13, 8.666666666666666, 2734.0733333333337, 560, 100219, 1690.0, 3168.4000000000024, 4980.699999999996, 60379.33000000071, 0.47876211268145086, 0.7215281667719944, 0.3964748745643265], "isController": false}, {"data": ["Completing Purchase-166", 150, 83, 55.333333333333336, 3394.5, 545, 11697, 2367.5, 6967.1, 7763.349999999998, 10911.600000000013, 0.48108995740750243, 0.6622065451486889, 0.6032417044055012], "isController": false}, {"data": ["Completing Purchase-165", 150, 0, 0.0, 1505.5800000000006, 499, 23489, 917.0, 1911.7, 3588.699999999993, 22880.57000000001, 0.48288339331818153, 2.9599054373474893, 0.37300855870574373], "isController": false}, {"data": ["Completing Purchase-164", 150, 19, 12.666666666666666, 2020.9800000000002, 560, 62099, 1224.5, 2153.0, 3739.1499999999915, 47508.41000000026, 0.4828911659890094, 0.8340655925155088, 0.34896431917174503], "isController": false}, {"data": ["Completing Purchase-163", 150, 0, 0.0, 1918.4333333333343, 497, 50621, 922.5, 2610.3, 5414.9499999999825, 40994.24000000017, 0.4815192896627439, 2.9515878499842705, 0.37195484191721717], "isController": false}, {"data": ["Logout-176-1", 149, 2, 1.342281879194631, 3536.355704697989, 461, 100422, 892.0, 2048.0, 13871.0, 100288.0, 0.49038645085274585, 9.067077574446587, 0.41855249809111317], "isController": false}, {"data": ["Add to Cart-127", 150, 1, 0.6666666666666666, 4072.6600000000003, 665, 100247, 1390.5, 4215.3, 11597.549999999937, 91980.92000000014, 0.476128503909015, 8.407301053672379, 0.36267600883694506], "isController": false}, {"data": ["Logout-176-0", 149, 0, 0.0, 1792.8389261744971, 484, 54830, 917.0, 1594.0, 4670.5, 38393.0, 0.49036062897800947, 3.178489854841735, 0.48269874415022807], "isController": false}, {"data": ["Add to Cart-124", 150, 0, 0.0, 1446.0133333333329, 447, 19917, 770.0, 2216.8000000000006, 5240.249999999995, 16445.430000000062, 0.4762025702240057, 3.000451325946373, 0.3325047243263321], "isController": false}, {"data": ["Add to Cart-125", 150, 1, 0.6666666666666666, 5928.8200000000015, 1337, 100932, 2635.0, 11373.100000000002, 26145.199999999993, 76960.98000000043, 0.474919501144556, 9.719224498999502, 1.1511356116804867], "isController": false}, {"data": ["Add to Cart-123", 150, 0, 0.0, 3308.4599999999987, 442, 51648, 1059.0, 5754.6, 18917.699999999993, 49578.420000000035, 0.476128503909015, 3.023719779727083, 0.33245300810053297], "isController": false}, {"data": ["Search-112", 150, 0, 0.0, 3892.86, 1255, 98461, 2309.5, 4470.6, 7526.699999999974, 69333.88000000053, 0.47452586956865594, 11.613205066354533, 0.36099184804099904], "isController": false}, {"data": ["Login-102-1", 145, 1, 0.6896551724137931, 3593.648275862069, 513, 100221, 880.0, 2872.4000000000005, 13186.099999999864, 90030.61999999982, 0.4609144542772861, 2.8639773897619776, 0.4415596480918142], "isController": false}, {"data": ["Login-102-0", 145, 0, 0.0, 5115.455172413794, 511, 98030, 929.0, 5001.400000000001, 20440.99999999999, 95957.23999999996, 0.5372877713303245, 3.490260877529884, 0.6238624610466366], "isController": false}, {"data": ["Login-102-2", 144, 0, 0.0, 5502.881944444443, 635, 98069, 1289.0, 8110.0, 35507.5, 88960.55000000024, 0.45747543452223993, 6.556499481964666, 0.48606764917987993], "isController": false}, {"data": ["Login-91", 150, 12, 8.0, 12996.113333333333, 795, 100628, 1431.0, 41561.40000000003, 100443.45, 100554.56, 0.5991755344645767, 10.653855919255106, 0.471616680447704], "isController": false}, {"data": ["Completing Purchase-173", 150, 0, 0.0, 2063.1800000000003, 556, 65054, 1034.5, 1856.4, 3471.7499999999804, 47773.670000000304, 0.49277266754270693, 3.1263827149720766, 0.3844974232095927], "isController": false}, {"data": ["Completing Purchase-170", 150, 0, 0.0, 1555.2599999999995, 544, 32837, 1033.0, 1884.5, 2764.499999999999, 23949.740000000158, 0.49040923015559046, 3.1122627696433414, 0.37451173631022633], "isController": false}, {"data": ["Completing Purchase-174", 150, 0, 0.0, 3340.6266666666656, 459, 98912, 785.5, 1848.6, 3744.5499999999997, 96368.63000000005, 0.4933025951005186, 9.191120173034108, 0.3728673912185561], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 101, 38.69731800766284, 1.324069218668065], "isController": false}, {"data": ["500/Internal Server Error", 4, 1.5325670498084292, 0.05243838489774515], "isController": false}, {"data": ["524", 45, 17.24137931034483, 0.5899318300996329], "isController": false}, {"data": ["404/Not Found", 111, 42.52873563218391, 1.455165180912428], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 7628, 261, "404/Not Found", 111, "400/Bad Request", 101, "524", 45, "500/Internal Server Error", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-102", 150, 6, "524", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Search-109", 150, 1, "524", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Completing Purchase-159", 150, 8, "404/Not Found", 7, "524", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["Completing Purchase-158", 150, 1, "400/Bad Request", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Logout-176", 150, 3, "524", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Add to Cart-125-1", 150, 1, "524", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Add to Cart-137", 150, 1, "524", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Completing Purchase-169", 150, 2, "524", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-97", 150, 11, "524", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Add to Cart-130", 150, 1, "524", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Completing Purchase-162", 150, 50, "400/Bad Request", 27, "404/Not Found", 21, "500/Internal Server Error", 2, "", "", "", ""], "isController": false}, {"data": ["Completing Purchase-161", 150, 44, "404/Not Found", 29, "400/Bad Request", 15, "", "", "", "", "", ""], "isController": false}, {"data": ["Completing Purchase-160", 150, 13, "404/Not Found", 12, "524", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["Completing Purchase-166", 150, 83, "400/Bad Request", 58, "404/Not Found", 23, "500/Internal Server Error", 2, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Completing Purchase-164", 150, 19, "404/Not Found", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Logout-176-1", 149, 2, "524", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Add to Cart-127", 150, 1, "524", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Add to Cart-125", 150, 1, "524", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-102-1", 145, 1, "524", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-91", 150, 12, "524", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
