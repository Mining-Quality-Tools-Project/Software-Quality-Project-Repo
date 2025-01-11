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

    var data = {"OkPercent": 97.25490196078431, "KoPercent": 2.7450980392156863};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.2515686274509804, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.29, 500, 1500, "Add to Cart-153"], "isController": false}, {"data": [0.015, 500, 1500, "Add to Cart-152"], "isController": false}, {"data": [0.0, 500, 1500, "Login-102"], "isController": false}, {"data": [0.275, 500, 1500, "Add to Cart-152-1"], "isController": false}, {"data": [0.285, 500, 1500, "Add to Cart-152-0"], "isController": false}, {"data": [0.315, 500, 1500, "Search-109"], "isController": false}, {"data": [0.295, 500, 1500, "Search-107"], "isController": false}, {"data": [0.11, 500, 1500, "Login-106"], "isController": false}, {"data": [0.31, 500, 1500, "Completing Purchase-156-0"], "isController": false}, {"data": [0.3, 500, 1500, "Completing Purchase-156-1"], "isController": false}, {"data": [0.125, 500, 1500, "Completing Purchase-159"], "isController": false}, {"data": [0.19, 500, 1500, "Completing Purchase-158"], "isController": false}, {"data": [0.035, 500, 1500, "Completing Purchase-156"], "isController": false}, {"data": [0.27, 500, 1500, "Add to Cart-143"], "isController": false}, {"data": [0.16, 500, 1500, "Logout-176"], "isController": false}, {"data": [0.345, 500, 1500, "Add to Cart-125-0"], "isController": false}, {"data": [0.19, 500, 1500, "Add to Cart-125-1"], "isController": false}, {"data": [0.325, 500, 1500, "Logout-179"], "isController": false}, {"data": [0.31, 500, 1500, "Completing Purchase-169-1"], "isController": false}, {"data": [0.385, 500, 1500, "Completing Purchase-169-0"], "isController": false}, {"data": [0.37, 500, 1500, "Add to Cart-137"], "isController": false}, {"data": [0.05, 500, 1500, "Completing Purchase-169"], "isController": false}, {"data": [0.42, 500, 1500, "Completing Purchase-167"], "isController": false}, {"data": [0.455, 500, 1500, "Logout-180"], "isController": false}, {"data": [0.005, 500, 1500, "Add to Cart-134"], "isController": false}, {"data": [0.375, 500, 1500, "Add to Cart-131"], "isController": false}, {"data": [0.17, 500, 1500, "Login-97"], "isController": false}, {"data": [0.35, 500, 1500, "Add to Cart-130"], "isController": false}, {"data": [0.35, 500, 1500, "Add to Cart-134-0"], "isController": false}, {"data": [0.21, 500, 1500, "Add to Cart-134-1"], "isController": false}, {"data": [0.095, 500, 1500, "Completing Purchase-162"], "isController": false}, {"data": [0.095, 500, 1500, "Completing Purchase-161"], "isController": false}, {"data": [0.17, 500, 1500, "Completing Purchase-160"], "isController": false}, {"data": [0.0, 500, 1500, "Completing Purchase-166"], "isController": false}, {"data": [0.405, 500, 1500, "Completing Purchase-165"], "isController": false}, {"data": [0.29, 500, 1500, "Completing Purchase-164"], "isController": false}, {"data": [0.425, 500, 1500, "Completing Purchase-163"], "isController": false}, {"data": [0.455, 500, 1500, "Logout-176-1"], "isController": false}, {"data": [0.21, 500, 1500, "Add to Cart-127"], "isController": false}, {"data": [0.48, 500, 1500, "Logout-176-0"], "isController": false}, {"data": [0.39, 500, 1500, "Add to Cart-124"], "isController": false}, {"data": [0.0, 500, 1500, "Add to Cart-125"], "isController": false}, {"data": [0.305, 500, 1500, "Add to Cart-123"], "isController": false}, {"data": [0.04, 500, 1500, "Search-112"], "isController": false}, {"data": [0.3, 500, 1500, "Login-102-1"], "isController": false}, {"data": [0.235, 500, 1500, "Login-102-0"], "isController": false}, {"data": [0.26, 500, 1500, "Login-102-2"], "isController": false}, {"data": [0.09, 500, 1500, "Login-91"], "isController": false}, {"data": [0.425, 500, 1500, "Completing Purchase-173"], "isController": false}, {"data": [0.405, 500, 1500, "Completing Purchase-170"], "isController": false}, {"data": [0.47, 500, 1500, "Completing Purchase-174"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 5100, 140, 2.7450980392156863, 3637.278235294113, 451, 114465, 1464.0, 5242.500000000003, 10467.549999999977, 63446.839999999625, 19.725467899701794, 225.2688395744134, 21.031011046262027], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Add to Cart-153", 100, 0, 0.0, 1872.08, 654, 15295, 1406.5, 2636.3, 3719.249999999992, 15251.499999999978, 0.4685091570114738, 8.303816951422627, 0.3532119816531814], "isController": false}, {"data": ["Add to Cart-152", 100, 0, 0.0, 5434.090000000001, 1392, 66114, 2846.5, 6777.0, 15090.499999999989, 66043.93999999996, 0.46200899993531874, 9.47370659858579, 1.1363436203487245], "isController": false}, {"data": ["Login-102", 100, 0, 0.0, 13263.13, 1820, 114465, 5620.5, 38967.000000000065, 66327.94999999994, 114413.58999999997, 0.4593857094293511, 12.416599062795731, 1.461600235664869], "isController": false}, {"data": ["Add to Cart-152-1", 100, 0, 0.0, 2414.0299999999997, 798, 44283, 1489.0, 2845.4000000000005, 4093.9499999999953, 44080.42999999989, 0.46736397371545013, 6.558170858629408, 0.3299845244104203], "isController": false}, {"data": ["Add to Cart-152-0", 100, 0, 0.0, 3019.83, 518, 63464, 1322.0, 4657.900000000002, 6949.599999999997, 63405.33999999997, 0.46371865261908296, 3.001745031254637, 0.8131379029715091], "isController": false}, {"data": ["Search-109", 100, 0, 0.0, 2104.9, 573, 17441, 1135.0, 4108.0, 7590.199999999995, 17394.67999999998, 0.4593857094293511, 2.90904654639566, 0.3059580603816577], "isController": false}, {"data": ["Search-107", 100, 0, 0.0, 4390.009999999998, 525, 78326, 1385.0, 4380.400000000001, 23131.34999999992, 78296.35999999999, 0.4609994468006638, 2.8759027305573484, 0.3065826399133321], "isController": false}, {"data": ["Login-106", 100, 0, 0.0, 4733.04, 845, 79212, 2174.5, 10145.000000000002, 16743.199999999993, 78867.73999999982, 0.4606787640910117, 8.502038035654232, 0.4354853941797845], "isController": false}, {"data": ["Completing Purchase-156-0", 100, 0, 0.0, 2529.1, 542, 59283, 1118.0, 2943.1000000000013, 12142.799999999936, 58858.67999999978, 0.47181606722435326, 2.8863117533510736, 0.35939114495605035], "isController": false}, {"data": ["Completing Purchase-156-1", 100, 0, 0.0, 2022.9900000000011, 725, 21472, 1414.5, 2973.0000000000005, 4501.899999999995, 21381.429999999953, 0.47501425042751283, 6.731861135521565, 0.3641466665874976], "isController": false}, {"data": ["Completing Purchase-159", 100, 3, 3.0, 1993.49, 633, 6082, 1931.5, 2610.1, 2849.8999999999996, 6081.58, 0.4822507607505751, 0.7147577925694804, 0.4158470915456619], "isController": false}, {"data": ["Completing Purchase-158", 100, 0, 0.0, 2067.73, 689, 15997, 1782.0, 2718.9, 4236.399999999997, 15953.87999999998, 0.47903044238461356, 0.6539607584249479, 0.36816109194989344], "isController": false}, {"data": ["Completing Purchase-156", 100, 0, 0.0, 4552.289999999999, 1268, 60747, 2837.0, 7472.800000000001, 16037.94999999997, 60507.099999999875, 0.4699248120300752, 9.534476143973214, 0.7181956355733082], "isController": false}, {"data": ["Add to Cart-143", 100, 0, 0.0, 2305.0799999999995, 738, 46250, 1473.5, 3334.9, 5100.649999999997, 45862.3099999998, 0.45865037540533227, 8.129810812453275, 0.34622728534015806], "isController": false}, {"data": ["Logout-176", 100, 0, 0.0, 4517.700000000001, 1034, 113039, 1869.0, 5504.200000000015, 14819.29999999998, 112610.02999999978, 0.5286949165983769, 13.27708342971001, 0.9716834307013138], "isController": false}, {"data": ["Add to Cart-125-0", 100, 0, 0.0, 2272.23, 594, 39378, 1171.5, 4108.800000000002, 6456.599999999989, 39156.09999999989, 0.4567565715851737, 2.9562632388037544, 0.7794345710484847], "isController": false}, {"data": ["Add to Cart-125-1", 100, 0, 0.0, 3639.3800000000006, 820, 79355, 1671.5, 5015.800000000003, 6897.199999999999, 79139.46999999988, 0.4460323195018711, 6.258857051938233, 0.3184078374569021], "isController": false}, {"data": ["Logout-179", 100, 0, 0.0, 2311.919999999999, 663, 36043, 1329.5, 2236.500000000002, 5518.999999999988, 35943.45999999995, 0.5316716821028679, 9.813579293514668, 0.5186914164265283], "isController": false}, {"data": ["Completing Purchase-169-1", 100, 1, 1.0, 4837.950000000002, 727, 100177, 1358.5, 3153.100000000002, 19426.99999999992, 99963.4799999999, 0.5181723026540785, 7.312645897888967, 0.3906533375478014], "isController": false}, {"data": ["Completing Purchase-169-0", 100, 0, 0.0, 2510.1899999999996, 525, 50986, 929.5, 3707.7000000000003, 8082.549999999976, 50960.789999999986, 0.5142022666035911, 3.144899225997038, 0.39318395971739445], "isController": false}, {"data": ["Add to Cart-137", 100, 0, 0.0, 2475.2799999999997, 483, 58459, 1024.0, 3063.600000000003, 8699.349999999966, 58114.43999999982, 0.45340986891920687, 10.055346821710172, 0.35466924316824683], "isController": false}, {"data": ["Completing Purchase-169", 100, 1, 1.0, 7348.29, 1280, 101182, 2345.5, 8563.0, 52292.64999999997, 100987.4399999999, 0.5119488870231196, 10.355936063343437, 0.7774223821493662], "isController": false}, {"data": ["Completing Purchase-167", 100, 0, 0.0, 3160.609999999999, 524, 88873, 842.0, 3881.8000000000056, 15352.849999999995, 88406.32999999975, 0.5224687694293074, 3.3024465171578745, 0.4168525240466251], "isController": false}, {"data": ["Logout-180", 100, 0, 0.0, 1909.749999999999, 501, 68052, 901.5, 1492.9, 2333.599999999996, 67561.80999999975, 0.5314202205393915, 3.202974500132855, 0.3394031486648067], "isController": false}, {"data": ["Add to Cart-134", 100, 0, 0.0, 4563.079999999999, 1483, 37593, 3004.0, 6552.600000000002, 15908.34999999998, 37477.60999999994, 0.4485873982828074, 9.198556207440271, 1.0832378099178188], "isController": false}, {"data": ["Add to Cart-131", 100, 0, 0.0, 4041.709999999999, 491, 90354, 910.5, 4206.8, 11441.299999999997, 90231.18999999994, 0.4502334460417727, 2.8590791122071795, 0.3139323051502204], "isController": false}, {"data": ["Login-97", 100, 0, 0.0, 7920.17, 659, 82370, 1892.5, 20263.000000000004, 57591.34999999996, 82357.98, 0.5110619355959749, 7.306234260889452, 0.4187314101220927], "isController": false}, {"data": ["Add to Cart-130", 100, 0, 0.0, 3088.1699999999987, 451, 71155, 1201.5, 5850.300000000002, 16247.849999999951, 70618.02999999972, 0.4491919037651265, 2.8521843500417745, 0.3132060735237308], "isController": false}, {"data": ["Add to Cart-134-0", 100, 0, 0.0, 2015.3499999999997, 593, 24157, 1138.5, 2982.1000000000013, 5176.849999999988, 24106.569999999974, 0.45026385461880664, 2.9146449936850494, 0.7658574838918105], "isController": false}, {"data": ["Add to Cart-134-1", 100, 0, 0.0, 2547.549999999999, 769, 33673, 1577.5, 4407.200000000002, 6726.799999999989, 33469.6399999999, 0.45047885902714585, 6.321304996429955, 0.32158207612191764], "isController": false}, {"data": ["Completing Purchase-162", 100, 28, 28.0, 2917.3, 670, 58098, 1716.5, 2821.2000000000007, 6150.349999999995, 57880.78999999989, 0.4956334691369039, 0.6784467125871075, 0.42012680782307865], "isController": false}, {"data": ["Completing Purchase-161", 100, 26, 26.0, 2545.0200000000004, 635, 43729, 1868.5, 3407.0000000000005, 4117.549999999997, 43475.78999999987, 0.4887060042419681, 0.853665348484034, 0.7946245088504656], "isController": false}, {"data": ["Completing Purchase-160", 100, 5, 5.0, 2389.77, 665, 41484, 1696.0, 2915.600000000002, 5451.299999999985, 41247.40999999988, 0.48554767349832245, 0.7128209697722295, 0.40209416711579826], "isController": false}, {"data": ["Completing Purchase-166", 100, 58, 58.0, 3411.920000000001, 601, 21100, 1976.0, 7007.2, 9387.799999999992, 21017.90999999996, 0.5017158682694816, 0.6907853374164643, 0.6291046629472797], "isController": false}, {"data": ["Completing Purchase-165", 100, 0, 0.0, 1562.55, 503, 12110, 922.0, 3787.2000000000007, 6326.899999999993, 12085.359999999988, 0.49838026414154, 3.0547303295539496, 0.3849792860702716], "isController": false}, {"data": ["Completing Purchase-164", 100, 16, 16.0, 3498.48, 570, 96076, 1190.0, 3074.700000000003, 9385.049999999963, 95624.24999999977, 0.500172559533039, 0.8627683582085819, 0.3614528262250476], "isController": false}, {"data": ["Completing Purchase-163", 100, 0, 0.0, 1514.12, 505, 34430, 919.5, 1887.5000000000005, 4864.449999999981, 34155.06999999986, 0.49361752539662174, 3.0253692798984133, 0.38130025643430443], "isController": false}, {"data": ["Logout-176-1", 100, 0, 0.0, 1858.3499999999992, 509, 35290, 878.0, 1464.2000000000005, 4623.799999999972, 35251.93999999998, 0.5317734645041213, 9.907609553642647, 0.45387696091465035], "isController": false}, {"data": ["Add to Cart-127", 100, 0, 0.0, 3347.5299999999993, 638, 82300, 1648.0, 4726.400000000001, 9849.449999999957, 81852.71999999977, 0.44751539452957184, 7.932420140877847, 0.3408808669268223], "isController": false}, {"data": ["Logout-176-0", 100, 0, 0.0, 2659.21, 474, 77747, 844.0, 1458.3000000000004, 6546.099999999984, 77658.83999999995, 0.5306954232826696, 3.439797745340494, 0.522403307293878], "isController": false}, {"data": ["Add to Cart-124", 100, 0, 0.0, 2588.6299999999997, 484, 81956, 1004.5, 3739.300000000006, 9163.649999999958, 81319.25999999967, 0.4569778228662563, 2.879143253693523, 0.3190811946771223], "isController": false}, {"data": ["Add to Cart-125", 100, 0, 0.0, 5911.910000000001, 1512, 96543, 2981.0, 7952.000000000001, 12431.299999999997, 96166.80999999981, 0.4444641984088182, 9.113556088603938, 1.0757465956820302], "isController": false}, {"data": ["Add to Cart-123", 100, 0, 0.0, 3201.6100000000015, 521, 60931, 1254.5, 6195.100000000001, 14815.749999999978, 60577.669999999816, 0.4589345375775599, 2.9148124635720714, 0.3204474554374564], "isController": false}, {"data": ["Search-112", 100, 0, 0.0, 5019.79, 1329, 87039, 2598.0, 7116.3, 15930.149999999921, 86904.65999999993, 0.4572410986589119, 11.247528218920179, 0.3478425936086839], "isController": false}, {"data": ["Login-102-1", 100, 0, 0.0, 4340.820000000001, 562, 86198, 1231.5, 5841.700000000003, 15856.949999999988, 85938.92999999986, 0.4633748517200475, 2.8739874897478317, 0.44391672806383453], "isController": false}, {"data": ["Login-102-0", 100, 0, 0.0, 5478.280000000001, 518, 76315, 1576.0, 10051.100000000004, 43302.94999999978, 76212.26999999995, 0.4734624307561195, 3.0756563372946357, 0.5497527638369395], "isController": false}, {"data": ["Login-102-2", 100, 0, 0.0, 3443.5299999999997, 684, 66383, 1473.0, 4860.500000000005, 11228.399999999943, 66307.80999999997, 0.4617871161394597, 6.617553682752251, 0.4906488108981759], "isController": false}, {"data": ["Login-91", 100, 1, 1.0, 10588.519999999999, 1036, 100533, 3930.0, 19857.600000000006, 76617.74999999987, 100501.29999999999, 0.5143054048354994, 9.525187223239403, 0.4048146057591919], "isController": false}, {"data": ["Completing Purchase-173", 100, 0, 0.0, 1895.3999999999992, 552, 61152, 975.0, 1930.9, 4061.199999999997, 60640.239999999736, 0.5244636048481416, 3.3272452532765864, 0.4092250197985011], "isController": false}, {"data": ["Completing Purchase-170", 100, 1, 1.0, 3961.049999999997, 556, 100172, 940.5, 2393.000000000003, 5917.44999999998, 100164.76, 0.5210993111067107, 3.3151228801028654, 0.39794888797407013], "isController": false}, {"data": ["Completing Purchase-174", 100, 0, 0.0, 1506.28, 470, 50870, 834.0, 1332.1000000000006, 1746.4499999999998, 50460.08999999979, 0.5237219874201979, 9.757932833309766, 0.3958601740851886], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 67, 47.857142857142854, 1.3137254901960784], "isController": false}, {"data": ["500/Internal Server Error", 2, 1.4285714285714286, 0.0392156862745098], "isController": false}, {"data": ["524", 4, 2.857142857142857, 0.0784313725490196], "isController": false}, {"data": ["404/Not Found", 67, 47.857142857142854, 1.3137254901960784], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 5100, 140, "400/Bad Request", 67, "404/Not Found", 67, "524", 4, "500/Internal Server Error", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Completing Purchase-159", 100, 3, "404/Not Found", 2, "500/Internal Server Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Completing Purchase-169-1", 100, 1, "524", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Completing Purchase-169", 100, 1, "524", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Completing Purchase-162", 100, 28, "400/Bad Request", 17, "404/Not Found", 10, "500/Internal Server Error", 1, "", "", "", ""], "isController": false}, {"data": ["Completing Purchase-161", 100, 26, "404/Not Found", 15, "400/Bad Request", 11, "", "", "", "", "", ""], "isController": false}, {"data": ["Completing Purchase-160", 100, 5, "404/Not Found", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Completing Purchase-166", 100, 58, "400/Bad Request", 39, "404/Not Found", 19, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Completing Purchase-164", 100, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-91", 100, 1, "524", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Completing Purchase-170", 100, 1, "524", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
