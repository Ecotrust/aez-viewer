var map, selectControl;
var width = 370;
var height = $('#left-panel').height() - ($('#title').height() + $('#zone-select').height() + 45);
var margin = {top: 0, right: 0, bottom: 0, left: 0};
var selectedValue = 'acres';
var nSelected = 0;
var acresSelected = 0;
var suspendRedraw = false;
var color = d3.scale.category10();
var queryStringObject = {};

var vectors;
var treeData, treeDataTemplate, treemap, node;


function position() {
  this.style("left", function(d) { return d.x + "px"; })
      .style("top", function(d) { return d.y + "px"; })
      .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
      .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
} 

function calcCharts(feature, type) {
    attrs = feature.feature.attributes;

    // Loop through crops in treeData and
    // add or subtract based on the selected/unselected features attrs
    for (i in treeData.children) {
        var cat = treeData.children[i];
        for (j in cat.children) {
            var crop = cat.children[j];
            featAcres = attrs["acres_" + cat.name + "_" + crop.name + "_z_ac"];
            featYield = attrs["acres_" + cat.name + "_" + crop.name + "_z_ac"];

            var newacres, newyield;
            if (type === "select") {
                newacres = crop.acres + featAcres; 
                newyield = crop.yield + featYield;
            } else if (type === "unselect") {
                newacres = crop.acres - featAcres;
                newyield = crop.yield - featYield;
            }
            treeData.children[i].children[j].acres = newacres;
            treeData.children[i].children[j].yield = newyield;
        }
    }
}

function clearSelection() {
    suspendRedraw = true;
    selectControl.unselectAll();
    redrawTreemap(selectedValue);
    suspendRedraw = false;
}

function selectRegion(region) {
    suspendRedraw = true;
    selectControl.unselectAll();

    var feature;
    // TODO
    // myFeatures=myVectorLayer.getFeaturesByAttribute("myAttribute","myValue")
    // then selectControl.select(myFeature)
    for (var f in vectors.features) {
        feature = vectors.features[f];
        if (region == 1) {
            if (feature.attributes.id < 50) {
                selectControl.select(feature);
            }
        } else if (region == 2) {
            if (feature.attributes.id >= 50 && 
                feature.attributes.id <= 100) {
                selectControl.select(feature);
            }
        } else if (region == 3) {
            if (feature.attributes.id > 100) {
                selectControl.select(feature);
            }
        }
    }

    redrawTreemap(selectedValue);
    suspendRedraw = false;
}

function counter(selectedFeatures) {
    nSelected = selectedFeatures.length; 

    if (nSelected == 0) {
        document.getElementById('treemap').style.display = 'none';
    } else {
        document.getElementById('treemap').style.display = 'block';
    }

    document.getElementById('counter').innerHTML = nSelected;

    var totalAcres = 0;
    for (var i = selectedFeatures.length - 1; i >= 0; i--) {
        totalAcres += selectedFeatures[i].attributes.area_in_acres;
    };
    document.getElementById('acres').innerHTML = Math.round(totalAcres);
}

var featureSelected = function(feature) {
    counter(this.selectedFeatures);
    calcCharts(feature, 'select');
    if (!suspendRedraw) {
        redrawTreemap(selectedValue);
    }
    var featureId = feature.feature.attributes.zone_id;
    updateZones(featureId, "add");
}

var featureUnselected = function(feature) {
    counter(this.selectedFeatures);
    calcCharts(feature, 'unselect');
    if (!suspendRedraw) {
        redrawTreemap(selectedValue);
    }
    var featureId = feature.feature.attributes.zone_id;
    updateZones(featureId, "remove");
}

function queryObj() {
    keyValuePairs = location.search.slice(1).split('&');

    keyValuePairs.forEach(function(keyValuePair) {
        keyValuePair = keyValuePair.split('=');
        queryStringObject[keyValuePair[0]] = keyValuePair[1] || '';
    });
}

function readQueryString(queryStringResult) {

    if (queryStringResult.hasOwnProperty('zoom')) {
        initMapZoom = queryStringResult.zoom;
    } else {
        initMapZoom = 6;
    }

    if (queryStringResult.hasOwnProperty('lat') && queryStringResult.hasOwnProperty('lng')) {
        initMapLat = queryStringResult.lat;
        initMapLng = queryStringResult.lng;
    }

}

function init(){
    
    queryObj();
    readQueryString(queryStringObject);

    map = new OpenLayers.Map('map');

    var baseLayer = new OpenLayers.Layer.XYZ( "ESRI",
        "http://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/${z}/${y}/${x}",
        {sphericalMercator: true}
    ); 

    var styleMap = new OpenLayers.StyleMap({
        'default': new OpenLayers.Style({
            fillOpacity: 0.5,
            fillColor: 'white',
            strokeColor: '#555555',
            strokeWidth: 0.2,
            strokeOpacity: 0.8}),
        'select': new OpenLayers.Style({
            fillOpacity: 0.8,
            fillColor: '#ffff00',
            strokeColor: '#555555',
            strokeWidth: 0.5,
            strokeOpacity: 0.2})
    });

    vectors = new OpenLayers.Layer.Vector("GeoJSON", {
        styleMap: styleMap,
        projection: "EPSG:4326",
        strategies: [new OpenLayers.Strategy.Fixed()],
        protocol: new OpenLayers.Protocol.HTTP({
            url: "food_zones/food_zones.geojson",
            format: new OpenLayers.Format.GeoJSON()
        })
    });

    vectors.events.on({
        'featureselected': featureSelected,
        'featureunselected': featureUnselected,
        "loadend": function(e) {
            initTreemap();
            $('#init-modal').modal('hide');

            selectInitialZones();
            
        }
    });

    map.addLayers([baseLayer, vectors]);
    
    selectControl = new OpenLayers.Control.SelectFeature(
        vectors,
        {
            clickout: true, 
            toggle: true,
            multiple: false,
            hover: false,
            // toggleKey: "ctrlKey", // ctrl key removes from selection
            multipleKey: "ctrlKey", // shift key adds to selection
            // box: true
        }
    );            
    
    // click-drag to move map
    // Unfortunately this makes shift-select behave oddly (zooms after selection)
    // For now we turn this off
    selectControl.handlers.feature.stopDown = false;

    map.addControl(selectControl);

    if (typeof initMapLng != 'undefined' && typeof initMapLat != 'undefined'){

        map.setCenter(
            new OpenLayers.LonLat(
                initMapLng, 
                initMapLat
            ).transform("EPSG:4326", "EPSG:900913"), 
            (typeof initMapZoom === 'undefined'?6:initMapZoom)
        );
    } else {
        map.zoomToExtent(
            new OpenLayers.Bounds(
                -124,
                35,
                -105,
                47.5
            ).transform("EPSG:4326", "EPSG:900913")
        );
    }


    selectControl.activate();  

}

function selectInitialZones() {

    if (queryStringObject.hasOwnProperty('zones')) {
        var selected_zones = queryStringObject.zones.split(",");
        for (var i = 0; i <= selected_zones.length; i++) {
            if (typeof(selected_zones[i]) != "undefined" && selected_zones[i] != "") {
                var feature = vectors.getFeaturesByAttribute("zone_id",decodeURIComponent(selected_zones[i]))[0]; //returns list, but get by id should only return 1 result
                selectControl.select(feature);
            }
        }
    }
}

function resetTreemap() {
    for (var i in treeData.children) {
        var cat = treeData.children[i];
        for (var j in cat.children) {
            treeData.children[i].children[j].acres = 0;
            treeData.children[i].children[j].yield = 0;
        }
    }
}

function randomizeTreemap() {
    for (var i in treeData.children) {
        var cat = treeData.children[i];
        for (var j in cat.children) {
            var newacres = Math.floor(Math.random() * 2) + 5;
            var newyield = Math.floor(Math.random() * 2) + 5;
            treeData.children[i].children[j].acres = newacres;
            treeData.children[i].children[j].yield = newyield;
        }
    }
}

function toggleControl(element) {
    if(element.value == 'nav' && element.checked) {
        selectControl.deactivate();
    } else {
        selectControl.activate();
    }
}

function redrawTreemap(v) {
    selectedValue = v;
    var value = function(d) { return d[v]; };

    node
        .data(treemap.value(value).nodes)
      .transition()
        .duration(1500)
        .call(position)
        .text(function(d) { 
            if (d.dy < 12) { return null; }
            return d.children ? null : d.fullname; 
      });

    return true;
}

function getFullName(cat, crop) {
    var name = types[cat.toLowerCase()].options[crop.toLowerCase()].name;
    return name;
}

function initTreemap() {
    // Create the following data structure based on the crop available 
    // treeDataTemplate = {
    //     children: [
    //       { name: "br",
    //         children:[
    //           { name: "br01", fullname: "br01", acres: 0, yield: 0},
    //           { name: "br02", fullname: "br02", acres: 0, yield: 0}
    //       ]},
    //       { name: "fc", 
    //         children:[
    //           { name: "fc02", fullname: "fc02", acres: 0, yield: 0},
    //           { name: "fc34", fullname: "fc34", acres: 0, yield: 0}
    //       ]}
    //     ]
    // };
    treeDataTemplate = {children: []};

    
    var attrs = map.layers[1].features[0].attributes;
    var start = "acres_";
    var end = "_z_ac";
    for(var k in attrs) {
        if (k.lastIndexOf(start, 0) === 0 &&  // startswith
            k.indexOf(end, k.length - end.length) !== -1 // endswith
            ) {
            var newk = k.replace(start,"").replace(end,"");
            var parts = newk.split("_");
            var catname = parts[0];
            // Ignore fs
            if (catname == "fs") { continue; }
            
            var cropname = parts[1];
            var fullname = getFullName(catname, cropname);
            // Ignore crops ending with ", All" 
            var bad = ", All"
            if (fullname.indexOf(bad, fullname.length - bad.length) !== -1) {
                continue;
            }

            var catidx = false;
            for (a in treeDataTemplate.children) {
                if (treeDataTemplate.children[a].name == 'catname') {
                    catidx = a;
                } 
            }
            if (catidx === false) {
                treeDataTemplate.children.push({name: catname, children: []});
                catidx = treeDataTemplate.children.length - 1;
            }
            treeDataTemplate.children[catidx].children.push(
                { name: cropname, 
                  fullname: fullname,
                  acres: 0,
                  yield: 0}
            );
        }
    }

    treeData = JSON.parse( JSON.stringify( treeDataTemplate ) );  // copy

    // randomize to get good sticky structure
    randomizeTreemap();

    treemap = d3.layout.treemap()
        .size([width, height])
        //.mode('squarify')
        .mode('dice')
        .ratio(1.6)  // 1.618 == .5 * (1 + Math.sqrt(5))
        .sticky(true)
        .value(function (d) { return d.acres; });


    // var div = d3.select("body").append("div")
    var div = d3.select("#treemap")
        .style("position", "relative")
        .style("z-index", "9999")
        //.attr("id", "treemap")
        .style("display", "none")
        .style("width", (width + margin.left + margin.right) + "px")
        .style("height", (height + margin.top + margin.bottom) + "px")
        .style("left", margin.left + "px")
        .style("top", margin.top + "px");

    node = div.datum(treeData).selectAll(".node")
      .data(treemap.nodes)
    .enter().append("div")
      .attr("class", "node")
      .call(position)
      .style("background", 
            function(d) {return d.children ? null : color(d.parent.name); })

    resetTreemap();
}

function viewByCrop(querystring) {
    var zoom = map.getZoom();
    var center = map.getCenter();
    center.transform("EPSG:900913","EPSG:4326");

    qlist = querystring.slice(1).split('&');
    var updated_querystring = "?";
    for (var i = 0; i < qlist.length; i++) {
        switch(qlist[i].split('=')[0]) {
            case 'zoom':
                updated_querystring += (updated_querystring.length == 1?'':'&') + 'zoom=' + zoom;
                break;
            case 'lat':
                updated_querystring += (updated_querystring.length == 1?'':'&') + 'lat=' + center.lat;
                break;
            case 'lng':
                updated_querystring += (updated_querystring.length == 1?'':'&') + 'lng=' + center.lon;
                break;
            default:
                updated_querystring += (updated_querystring.length == 1?'':'&') + qlist[i];
        }
    }

    window.location.assign('explore_by_crop.html' + updated_querystring);
}

function updateZones(zoneId, action){
    var keys = Object.keys(queryStringObject);
    if (queryStringObject.hasOwnProperty('zones')) {
        var zoneList = queryStringObject.zones.split(',');
    } else {
        var zoneList = [];
    }
    var zoneIdIndex = zoneList.indexOf(zoneId);
    if (action == "remove") {
        if (zoneIdIndex != -1) {
            zoneList.splice(zoneIdIndex,1);
        }
    } else {
        if (zoneIdIndex == -1) {
            zoneList.push(zoneId);
        }
    }

    queryStringObject.zones = zoneList.toString();

    updateHref(false);
}

function updateHref(reload){
    var keys = Object.keys(queryStringObject);
    var queryString = "?";

    for (var i = 0; i < keys.length; i ++) {
        var key = keys[i]
        queryString = queryString + "&" + key + "=" + queryStringObject[key].toString();
    }

    window.history.pushState("", "", queryString);
    if (reload) {
        window.location.reload();
    }
}
