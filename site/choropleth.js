var num_categories=5;       //TODO: Currently this all we support
var method = "jenks";
// var method = null;       //TODO: get to choose between these
var min_value = 0.00001; //Something nearly impossibly small
var initMapZoom, initMapLat, initMapLng;
var data;
var max_digits = 5;
var property, mapping, map, esri, info;
var categories;
var primaryUnit;
var color_scheme, reverse_scheme;
var geojson;
var first_load = true;
var measureSelect=document.getElementById("measureSelect");
var typeSelect = document.getElementById("typeSelect");
var highlightedFeature = false;
var defaultMapZoom = 6;
var selectedFeature = null;

var schemes = {
    //Darkest to most pale
    "reds":{
        "name":"Reds",
        "list":['#DE0A09', '#FA3A3E', '#F56B69', '#FAAFAC', '#FFD1CF' ]
    },
    "oranges":{
        "name":"Oranges",
        "list":['#DE520A', "#FA7836", "#F58B55", "#FAAC83", "#FFD1BA"]
    },
    "yellows":{
        "name":"Yellows",
        "list":["#DED404", "#FAF13D", "#F5EE5C", "#FAF68A", "#FFFCC1"]
    },
    "greens":{
        "name":"Greens",
        "list":["#0E5404", "#2A851E", "#5ED64C", "#87E077", "#C4FFBA"]
    },
    "ltblues":{
        "name":"Light Blues",
        "list":["#065438", "#218561", "#51D6A5", "#7DE0BA", "#C1FFE7"]
    },
    "blues":{
        "name":"Blues",
        "list":["#030654", "#1B1F85", "#484ED6", "#747AE0", "#B6BAFF"]
    },
    "purples":{
        "name":"Purples",
        "list":["#380354", "#5E1385", "#A03AD6", "#B465E0", "#DFA5FF"]
    },
    "pinks":{
        "name":"Pinks",
        "list":["#540542", "#850F68", "#D635B2", "#E05FC7", "#FF9FEB"]
    },

    //dark to lighter color
    "red_yellow":{
        "name":"Red Fade To Yellow",
        "list":['#800026', '#BD0026', '#FC4E2A', '#FEB24C', '#FFEDA0' ]
    },
    "blue_yellow":{
        "name":"Blue Fade To Yellow",
        "list":['#1506FF', '#53A2B8', '#93FFB5', '#B6D65D', '#FFE083' ]
    },

    //polar saturation
    "blue_red":{
        "name":"Blue To Red",
        "list":["#0000FF", "#7A42D6", "#F7DEFF", "#FF59D5", "#FF000D"]
    },
    "green_blue":{
        "name":"Green To Blue",
        "list":["#12FF08", "#3BD689", "#D5FDFF", "#51A0FF", "#0E03FF"]
    },
    "yellow_blue":{
        "name":"Yellow To Blue",
        "list":["#FFE009", "#74D62C", "#C4FFE0", "#3FC9FF", "#1A0EFF"]
    },
    "red_green":{
        "name":"Red To Green",
        "list":["#FF0007", "#D66F33", "#FFEFCC", "#FFF747", "#4FFF16"]
    }
};

var queryStringResult = queryObj();

readQueryString(queryStringResult);
setUpData();

function queryObj() {
    var result = {};
    keyValuePairs = location.search.slice(1).split('&');

    keyValuePairs.forEach(function(keyValuePair) {
        keyValuePair = keyValuePair.split('=');
        result[keyValuePair[0]] = keyValuePair[1] || '';
    });

    return result;
}

function readQueryString(queryStringResult) {

    if (queryStringResult.hasOwnProperty('zoom')) {
        initMapZoom = queryStringResult.zoom;
    } else {
        initMapZoom = defaultMapZoom;
    }

    if (queryStringResult.hasOwnProperty('lat') && queryStringResult.hasOwnProperty('lng')) {
        initMapLat = queryStringResult.lat;
        initMapLng = queryStringResult.lng;
    }

    if (queryStringResult.hasOwnProperty('feature')) {
        initFeature = queryStringResult.feature;
    }
}

function getProperty() {

    if (queryStringResult.hasOwnProperty('property')){
        var property_object = parseLayer(queryStringResult['property']);
        if (property_object != 0){
            var property = property_object;
        } else {
            var property=getDefaultLayer();
        }
    } else {
        var property=getDefaultLayer();
    }
    return property;
}

function setUpData() {

    property = getProperty();

    mapping = dataMap;
    measure_keys = Object.keys(mapping);
    measure_keys.push(total_key);
    mapped_measures = {};
    
    for (var i = 0; i < measure_keys.length; i++) {
        mapped_measures[measure_keys[i]] = false;
    }

    for (i = 0; i < measure_keys.length; i++) {
        getMeasureData(measure_keys[i]);
    }

}

function getMeasureData(measure) {
    $.ajax({
        type: 'GET',
        url: getAjaxLocation(measure, property.type, property.code, property.unit, 'json'),
        beforeSend: function(xhr){
            if (xhr.overrideMimeType) {
                xhr.overrideMimeType("application/json");
            }
        },
        async: true,
        dataType: 'text',
        crossDomain: false,
        data: {},
        error: function(textStatus, errorThrown) {
            setMeasureData(measure, null);
        },
        success: function(ret_data, textStatus, request) {
            data_obj = JSON.parse(ret_data);
            setMeasureData(measure, data_obj);
        }
     });
}

function setMeasureData(measure, measure_data){
    mapped_measures[measure] = measure_data;

    var allMeasuresCollected = true;
    for (var i = 0; i < measure_keys.length; i++) {
        if (mapped_measures[measure_keys[i]] === false) {
            allMeasuresCollected = false;
        }
    }
    if (allMeasuresCollected) {
        setData(mapped_measures);
    }

}

function buildMap(){

	if (map){
		map.remove();
	}

	map = L.map('map', {zoomControl: false});
	setZoomControl();
	if (initMapLat || initMapLng) {
		map.setView([initMapLat, initMapLng], initMapZoom);
	} else {
		map.fitBounds([
			[45.5, -124],
			[42.5, -113]
		]);
	}


	esri = L.tileLayer('http://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', 
	{
	    maxZoom: 12,
	    tileSize: 256,
		continuousWorld: false
	}).addTo(map);


	info = L.control();

	info.onAdd = function (map) {
		this._div = L.DomUtil.create('div', 'info');
		this.update();
		return this._div;
	};

	info.update = function (props) {
		var prop_name = (property ? 
			mapping[property['measure']].mapping.type[property['type']].options[property['code']].name + '<br />' +
			(property ? getLabel(property) : '') : capFirstLetter(primaryUnit));
		this._div.innerHTML = '<h4>Zone Info: ' + 
			(props ? capFirstLetter(props[UID_key]) : '') + 
			'</h4>' +  
			(props ? 
				'<b>' + capFirstLetter(prop_name) + '</b><br />' + 
				roundDigits(props[getLayerCode(property)]) + ' ' + getQuanity(property['measure'], property['type'], property['code']) + '<br />'
			: 
				'<p>Hover over a zone</p>');
	};
}

function roundDigits(number){
    if (typeof(number) === undefined || number === null) {
        number = 0;
    }
    if ($.inArray('.',number.toString()) != -1 && number !== 0){
        var dig_str = number.toString().split('.')[1];
        if (dig_str.length > max_digits) {
            return parseFloat(number).toFixed(max_digits);
        }
    }
    return number;
}

function setData(ret_obj){
    data = featureData;
    var attribute = '';
    for (var i = 0; i < data.features.length; i++){
        data.features[i].properties[total_key] = {};
        for (var key_index = 0; key_index < required_total_keys.length; key_index++) {
            var req_key = required_total_keys[key_index];
            if (ret_obj[total_key].hasOwnProperty(req_key)) {
                data.features[i].properties[total_key][req_key] = ret_obj[total_key][req_key];
            }
        }
        uid = data.features[i].properties[UID_key];
        for (var meas_index = 0; meas_index < Object.keys(ret_obj).length; meas_index++) {
            meas = Object.keys(ret_obj)[meas_index];
            if (ret_obj[meas] && ret_obj[meas].hasOwnProperty(uid.toString())){
                for (var unit in ret_obj[meas][uid.toString()]){
                    attribute = encodeLayer(meas, property.type, property.code, unit);
                    data.features[i].properties[attribute] = ret_obj[meas][uid.toString()][unit];
                    if (ret_obj[total_key].hasOwnProperty(attribute)) {
                        data.features[i].properties[total_key][attribute] = ret_obj[total_key][attribute];
                    }
                }
            }
        }
    }
    buildMap();
    finishLoad();
}

function finishLoad(){
    info.addTo(map);
    if (first_load){
        first_load = false;
    } else {
        clearMeasures();
        clearTypes();
    }
    setMeasure();
    setTypes();
    setColorScheme();
    getLegendInfo();
    loadGeoJson();
    setLegend();
}

function updateStatus(key, value, reload){
    var center = map.getCenter();
    queryString = "?";
    if (key) {
        queryStringResult[key] = value;
    }
    queryStringResult.zoom = map.getZoom();
    queryStringResult.lat = center.lat;
    queryStringResult.lng = center.lng;
    for (key in queryStringResult) {
        if (key && key.length > 0) {
            queryString = queryString + (queryString.length > 1 ?"&":"") + key + "=" + queryStringResult[key];
        }
    }

    updateHref(queryString, reload);

    return queryString;
}

function updateHref(queryString, reload){
    window.history.pushState("", "", queryString);
    if (reload) {
        loadData();
    }
}

function selectMeasure(value){
    if (!property){
        property = getProperty();
    }
    var layer_string = encodeLayer(value, property.type, property.code, property.unit);
    
    updateStatus('property',layer_string, true);
}

function selectCrop(value){
    if (!property){
        property = getProperty();
    }
    var val_parts = value.split("_");
    var layer_string = encodeLayer(property.measure, val_parts[0], val_parts[1], property.unit);
    
    updateStatus('property',layer_string, true);
}

function selectFeature(value){
    updateStatus('feature',value, false);
}

function getLayerCode(prop_obj){
    var code_candidate = encodeLayer(prop_obj.measure, prop_obj.type, prop_obj.code, prop_obj.unit);
    if (Object.keys(data.features[0].properties).indexOf(code_candidate) >= 0 ){
        return code_candidate;
    } else {
        return false;
    }
}

function getRange(data,property,method) {
	if (method == "jenks"){
		var range = []
		for(var i=0; i<data.features.length; i++){
			var value=data.features[i].properties[property];
			if (value > 0){
				range.push(value);
			}
			if (value < 0) {
				data.features[i].properties[property] = null;
			}
		}
		return range;
		
	} else {
		var low=data.features[0].properties[property];
		var high=data.features[0].properties[property];

		for(var i=0; i<data.features.length; i++){
			var value=data.features[i].properties[property];
			if (value < low || low == 0){
				low = value;
			} else if (value > high){
				high = value;
			}
		}
		return {low:low, high:high};
	}
}

function simplifyNumber(high, dev){
    //leave to 2 digits untouched, unless less than 100, then just top digit
    var digits = parseInt(Math.log(dev)/Math.LN10);
    var exp = digits - 1;
    var mask;
    if (exp>0){
        mask = Math.pow(10,exp);
    } else if (dev > 20) {
        mask = 10;
    } else {
        mask = 0;
    }
    if (mask !== 0) {
        dev = Math.round(dev/mask)*mask;
        high = Math.round(high/mask)*mask;
    }

    return {dev:dev, high:high};
}

function getCategories(range, count){
    if (count === 0){
        alert("number of categories cannot be set to 0");
        return false;
    }
    var diff = range['high'] - range['low'];
    var dev = 0;
    if (diff < 20){
        dev = parseFloat(diff/(count-1));
    } else {
        dev = parseInt(diff/(count-1));
    }
    var simplevals = simplifyNumber(range['high']-(dev/2), dev);
    var high_bar = simplevals['high'];
    dev = simplevals['dev'];
    categories = [high_bar];
    for (var i = 1; i < count-1; i++) {
        categories.push(categories[categories.length-1]-dev);
    }
    categories.push(min_value);
        //TODO: This assumes only positive values
    return categories;
}

function getJenksCategories(range, count){
    var new_range = [];
    var slice_count = 1;
    for (var i = 0; i < range.length; i++) {
        if (range[i] !== 0) {
            new_range.push(range[i]);
        }
    }
    new_range = new_range.sort().filter(function(item) {
        return item !== null && item !== undefined;
    });
    new_range.sort(function(a,b) { return a - b;}).filter(function(item, pos) {
        return !pos || item != new_range[pos - 1];
    });
    if (new_range.length < count) {
        if (new_range.length <= 1) {
            return [0,0,0,0,0];
        }
        slice_count = 0;
    }
    count = new_range.length < count ? new_range.length : count;
    categories = ss.jenks(new_range, count);
    while (categories.indexOf(undefined) != -1 || categories.indexOf(null) != -1) {
        count = count -1;
        categories = ss.jenks(new_range, count);
    }

    categories.reverse().slice(slice_count, categories.length);
    categories = categories.filter(function(item, position){return(item != categories[position-1]);});
    if (categories.length < num_categories && categories.indexOf("0") == -1){
        if (categories.length > 1) {
            var cur_min = parseFloat(categories[categories.length-1]);
            var cur_min_diff = parseFloat(categories[categories.length-2]) - cur_min;
            cur_min = cur_min + cur_min_diff*0.1;
            categories[categories.length-1] = cur_min.toString();
        }
        categories.push("0");
    }
    while (categories.length > num_categories) {
        categories = categories.slice(0,categories.length-1);
    }
    return categories;
}

function capFirstLetter(string){
    //Shamelessly ripped from http://stackoverflow.com/questions/1026069/capitalize-the-first-letter-of-string-in-javascript
    if (string){
        string = string.toString();
        return string.charAt(0).toUpperCase() + string.slice(1);
    } else {
        return '';
    }
}

function setMeasure() {
    var current_measures = getMeasures(property);
    var row = L.DomUtil.create('div', 'row');
    var span = L.DomUtil.create('div', 'col-md-12');
    var table = L.DomUtil.create('table', 'measureTable');
    var trow = L.DomUtil.create('tr', 'measureTableRow');

    for (var key in current_measures){

        var td = L.DomUtil.create('td', 'measureTableCell');
        var label = document.createElement("label");

        var measureButton = document.createElement("input");
        measureButton.type = 'radio';
        measureButton.value = key;
        measureButton.name = 'measure';
        measureButton.setAttribute('onclick', 'selectMeasure(this.value)');

        if (key == property.measure){
            measureButton.setAttribute('checked', true);
        }
        
        label.appendChild(measureButton);
        label.innerHTML += current_measures[key]['name'];

        td.appendChild(label);
        trow.appendChild(td);
    }
    table.appendChild(trow);
    span.appendChild(table);
    row.appendChild(span);
    measureSelect.appendChild(row);
}

function clearMeasures() {
    while (measureSelect.firstChild){
        measureSelect.removeChild(measureSelect.firstChild);
    }
}

function setTypes() {
    var types = getTypes(property);
    var key, subKey;

    for (key in types){
        var oGroup = document.createElement("optgroup");
        oGroup.value = key;
        oGroup.label = types[key].name;
        for (subKey in types[key].options){
            var typeOpt = document.createElement("option");
            typeOpt.value = key + "_" + subKey;
            typeOpt.innerHTML = capFirstLetter(types[key].options[subKey].name);

            if (key == property.type && subKey == property.code){
                typeOpt.selected = true;
            }

            typeOpt.disabled = !types[key].options[subKey].available;

            oGroup.appendChild(typeOpt);
        }
        typeSelect.appendChild(oGroup);
    }
    $("#typeSelect").select2();
}

function clearTypes() {
    while (typeSelect.firstChild){
        typeSelect.removeChild(typeSelect.firstChild);
    }
}

function setColorScheme() {

    if (property.measure == "acres"){
        color_scheme = schemes["greens"];
    } else if (property.measure == "farms") {
        color_scheme = schemes["reds"];
    } else if (property.measure == "yield") {
        color_scheme = schemes["purples"];
    } else {
        color_scheme = schemes["reds"];
    }
}

function getLegendInfo() {
    var i, layer_code;
    var desired_measure_available = true;
    var new_property = property;
    var original_measure = property.measure;
    var measure_list = [property.measure].concat(Object.keys(measures));
    for (i = 0; i < measure_list.length; i++) {
        new_property.measure = measure_list[i];
        layer_code = getLayerCode(new_property);
        if (!layer_code) {
            desired_measure_available = false;
        } else {
            break;
        }
    }
    if (!desired_measure_available) {
        alert("'" + capFirstLetter(original_measure) + "' data was not available for " + types[property.type]['options'][property.code]['name'] + ". " +
            "You are now seeing '" + measure_list[i] + "' data instead.");
        updateStatus('property', layer_code, true);
    }



    var range=getRange(data,layer_code,method);
    if (method == "jenks"){
        categories=getJenksCategories(range, num_categories);
    } else {
        categories=getCategories(range, num_categories);
    }
    if (categories===false || num_categories===0){
        alert("Pleace specify the number of categories in your settings.");
    }
}

// get color depending on population density value
function getColor(value, scheme, categories, reverse) {
    if (value == null) {
        value = 0;
    }
    if (reverse==true){
        return  parseFloat(value) >= parseFloat(categories[0]) ? scheme.list[4] :
                categories.length > 1 && parseFloat(value) >= parseFloat(categories[1]) ? scheme.list[3] :
                categories.length > 2 && parseFloat(value) >= parseFloat(categories[2]) ? scheme.list[2] :
                categories.length > 3 && parseFloat(value) >= parseFloat(categories[3]) ? scheme.list[1] :
                                        scheme.list[0];
    } else {
        return  parseFloat(value) >= parseFloat(categories[0]) ? scheme.list[0] :
                categories.length > 1 && parseFloat(value) >= parseFloat(categories[1]) ? scheme.list[1] :
                categories.length > 2 && parseFloat(value) >= parseFloat(categories[2]) ? scheme.list[2] :
                categories.length > 3 && parseFloat(value) >= parseFloat(categories[3]) ? scheme.list[3] :
                                        scheme.list[4];
    }
}

function getOpacity(value) {
    if (value == null) {
        value = 0;
    }
    if (value == 0){
        return 0;
    } else {
        return 0.7;
    }
}

function style(feature) {
	value = feature.properties[getLayerCode(property)];
	return {
		weight: 0,
		opacity: 0.7,
		color: 'white',
		dashArray: '',
		fillColor: getColor(value, color_scheme, categories, reverse_scheme),
		fillOpacity: getOpacity(value),
		zindex: 1998
	};
}

function facilitiesStyle(feature) {
	if (feature.properties.Crops == 'Yes'){
		if (feature.properties.Livestock == 'Yes') {
			var facilityColor = '#00FF00';
		} else {
			var facilityColor = '#FFFF00';
		}
	} else {
		if (feature.properties.Livestock == 'Yes'){
			var facilityColor = '#0000FF';
		} else {
			var facilityColor = '#FFFFFF';
		}
	}
	return {
		radius: 6,
		fillColor: facilityColor,
		color: '#000',
		weight: 1,
		opacity: 1,
		fillOpacity: 1,
		zindex: 1999
	}
}

function highlightFeature(layer) {
    if (highlightedFeature) {
        resetHighlight();
    }

    layer.setStyle({
        weight: 3,
        color: '#444',
        dashArray: ''
    });

	if (!L.Browser.ie && !L.Browser.opera && layer._map) {
		layer.bringToFront();
		if (typeof facilities != 'undefined') {
			facilities.bringToFront();
		}
	}

    highlightedFeature = layer;

}

function updateInfo(e) {
    var layer = e.target;
    info.update(layer.feature.properties);
}

function resetHighlight() {
    geojson.resetStyle(highlightedFeature);
    highlightedFeature = false;
}

function resetInfo(e) {
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function getPopupHtml(feature) {
    var popDiv = document.createElement("div");
    var topPop = document.createElement("div");
    topPop.classList.add("row");

    // ---- Top of the popup
    var topPopSpan = document.createElement('div');
    topPopSpan.classList.add('col-md-12');

    var topZoneNameRow = document.createElement('div');
    topZoneNameRow.classList.add('row');
    topZoneNameRow.classList.add('popZoneName');
    var topZoneNameSpan = document.createElement('div');
    topZoneNameSpan.classList.add('col-md-12');
    topZoneNameSpan.innerHTML =feature.properties[UID_key].toString() + ' County';      //TODO: Replace with "Region Name"
    topZoneNameRow.appendChild(topZoneNameSpan);
    topPopSpan.appendChild(topZoneNameRow);

    var layer_code = getLayerCode(property);
    var layer_code_val = getDisplayValue(feature.properties,layer_code);
    var prop_name = mapping[property['measure']].mapping.type[property['type']].options[property['code']].name;

    // var topAcresRow = document.createElement('div');
    // topAcresRow.classList.add('row');
    // var topAcresSpan = document.createElement('div');
    // topAcresSpan.classList.add('col-md-12');
    // topAcresSpan.classList.add('popAcres');
    // topAcresSpan.innerHTML = Humanize.intComma(feature.properties['area_in_acres']) + ' acres -- ' + Humanize.intComma(feature.properties['ag_acres']) + ' in agriculture (' + Humanize.intComma((feature.properties['ag_acres']*1.0)/(feature.properties['area_in_acres']*1.0)*100) + '%)';
    // topAcresRow.appendChild(topAcresSpan);
    // topPopSpan.appendChild(topAcresRow);

    var topPropRow = document.createElement('div');
    topPropRow.classList.add('row');
    var topPropSpan = document.createElement('div');
    topPropSpan.classList.add('col-md-12');
    topPropSpan.classList.add('popCropName');
    topPropSpan.innerHTML = prop_name;
    topPropRow.appendChild(topPropSpan);
    topPopSpan.appendChild(topPropRow);

    //Popup display
    var layer_code_parts = layer_code.split('_');
    var type_code = layer_code_parts[1];
    var crop_code = layer_code_parts[2];

    if (type_code != 'mt') {
        pop_up_list = [['acres','z_ac','acres','count'],['farms','z_fm','farms','count'],['qnty','z_qt','yield','count']];
    } else {
        pop_up_list = [['acres','','acres','count'],['farms','','farms','count'],['qnty','','yield','count']];
    }

    var perspective_val;
    for (var item_id = 0; item_id < pop_up_list.length; item_id++) {
        var item = pop_up_list[item_id];

        var pu_code_list = [item[0], type_code, crop_code, item[1]];
        while (pu_code_list.indexOf('') != -1){
            pu_code_list.pop(pu_code_list.indexOf(''));
        }
        var pu_code = pu_code_list.join('_');

        var pu_code_val = getDisplayValue(feature.properties,pu_code);
        if (pu_code_val == -999) {
            pu_code_val = null;
        }

        if (feature.properties[total_key].hasOwnProperty(pu_code)) {
            perspective_val = getDisplayValue(feature.properties[total_key], pu_code);
        } else {
            perspective_val = false;
        }

        var quantity_text;
        if (showQuantity(item[2])){
            quantity_text = types[property['type']]['options'][property['code']]['qty'];
        } else {
            quantity_text = "";
        }

        if (quantity_text === undefined) {
            quantity_text = "No data available";
        }

        var valueRow = document.createElement('div');
        valueRow.classList.add('row');
        var valueSpan = document.createElement('div');
        valueSpan.classList.add('col-md-10');
        valueSpan.classList.add('col-md-offset-1');
        valueSpan.classList.add('popValue');
        if (pu_code_val === null) {
            valueSpan.innerHTML = 'N/A';
            // valueSpan.innerHTML = quantity_text;
        } else {
            if (pu_code_val < 0.001) {
                valueSpan.innerHTML = '0';
            } else {
                valueSpan.innerHTML = Humanize.intComma(pu_code_val);
            }
            if (pop_up_list[item_id][0] == "qnty") {
                valueSpan.innerHTML += ' ' + quantity_text;
            }
        }
        valueRow.appendChild(valueSpan);
        topPopSpan.appendChild(valueRow);

        valDescription = popUpDescriptions[item[2]][item[3]]['name'];
        if (valDescription.length > 0) {
            var valueDescriptionRow = document.createElement('div');
            valueDescriptionRow.classList.add('row');
            var valueDescriptionSpan = document.createElement('div');
            valueDescriptionSpan.classList.add('col-md-10');
            valueDescriptionSpan.classList.add('col-md-offset-1');
            valueDescriptionSpan.classList.add('popDescription');
            valueDescriptionSpan.innerHTML = valDescription;
            valueDescriptionRow.appendChild(valueDescriptionSpan);
            topPopSpan.appendChild(valueDescriptionRow);
        }

        if (perspective_val) {
            var perspectiveRow = document.createElement('div');
            perspectiveRow.classList.add('row');
            var perspectiveSpan = document.createElement('div');
            perspectiveSpan.classList.add('col-md-10');
            perspectiveSpan.classList.add('col-md-offset-1');
            perspectiveSpan.classList.add('popDescription');

            var perspective_prefix;
            if (pu_code_val !== 0 && perspective_val !== 0 && pu_code_val !==null && perspective_val !== null) {
                var perpective_pctg = (pu_code_val.toPrecision(20)/perspective_val.toPrecision(20))*100;
                perspective_prefix = Humanize.intComma(perpective_pctg) + '% of ';
            } else {
                perspective_prefix = 'Of ';
            }
            perspectiveSpan.innerHTML = perspective_prefix + prop_name + ' ' + getLabel({'unit': item[3], 'measure': item[2]}).toLowerCase() + perspective_text;

            perspectiveRow.appendChild(perspectiveSpan);
            topPopSpan.appendChild(perspectiveRow);
        }
    }

    topPop.appendChild(topPopSpan);
    popDiv.appendChild(topPop);
    
    return popDiv;
}

function onEachFeature(feature, layer) {
    layer.on({
        click: featureClicked,
        mouseover: updateInfo,
        mouseout: resetInfo
    });

    if (feature.properties.zone_id == decodeURIComponent(queryStringResult.feature)) {
        selectedFeature = layer;
        var stats = getPopupHtml(layer.feature);
        updateStats(stats);
    }
}

function onEachFacilityFeature(feature, layer) {
	layer.on({
		click: facilityClicked
	});
}

function featureClicked(e) {
    highlightFeature(e.target);
    var stats = getPopupHtml(e.target.feature);
    updateStats(stats);
    selectFeature(e.target.feature.properties.zone_id);
}

function facilityClicked(e) {
	var props = e.target.feature.properties;
	var name = props.NameOp;
	var crops = props.Crops;
	var livestock = props.Livestock;
	var handling = props.Handling;
	var wildCrps = props.WildCrps;
	var products = props.Products;
	var facilityPopupHtml = '<h3>' + name + '</h3>\
	Crops: ' + crops + '<br/>\
	Livestock: ' + livestock + '<br />\
	Handling: ' + handling + '<br />\
	Wild Crops: ' + wildCrps + '<br />\
	Products: ' + products;
	e.target.bindPopup(facilityPopupHtml).openPopup();
}

function updateStats(stats) {
    $('#zoneStats').empty();
    $('#zoneStats').append(stats);
    $('#zoneStats').show();
}

function killWaiting(layer) {
    initModal.modal('hide');
}

function loadGeoJson() {
	geojson = L.geoJson(data, {
		style: style,
		onEachFeature: onEachFeature
	}).addTo(map);
	if (selectedFeature != null) {
		highlightFeature(selectedFeature);
	}
	facilities = L.geoJson(facilities_layer, {
		style: facilitiesStyle,
		pointToLayer: function (feature, latlng) {
			return L.circleMarker(latlng, facilitiesStyle);
		},
		onEachFeature: onEachFacilityFeature
	}).addTo(map);

	killWaiting(geojson.getLayers());
}

//TODO: Get link to Ag census for attribution
// map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census Bureau</a>');

function setZoomControl() {
    var zoomControl = L.control.zoom({position:'bottomright'});
    map.addControl(zoomControl);
}

function setLegend() {
    for(var i=0; $('.legend-row').length > 0; i++) {
        $('.legend-row')[0].remove();
    }

    var row = L.DomUtil.create('div', 'row legend-row');
	var span = L.DomUtil.create('div', 'col-md-12');

    var div = L.DomUtil.create('div', 'legend chorolegend'),
        grades = [],
        labels = [],
        from, to;
        for (var index = categories.length-1; index > -1; index--){
            grades.push(categories[index]);
        }

    if (property) {
        var current_measures = getMeasures(property);
        var label = current_measures[property.measure]['name'];
        if (property.label) {
            labels.push('<b>' + property.label + '</b>');
        } else {
            labels.push('<b>' + capFirstLetter(label) + '</b>');
        }
    }
    labels.push('<br />');
    labels.push('<div class="row">');
    labels.push('   <div class="col-md-12" id="legendTable">');
    labels.push('       <table><tr>');

    var layer_code = getLayerCode(property);
    for (var i = 0; i < grades.length; i++) {
        var from_obj = {};
        var to_obj = {};
        from_obj[layer_code] = grades[i];
        to_obj[layer_code] = grades[i+1];
        from_label_raw = getDisplayValue(from_obj, layer_code);
        from_label = significantDigitDecider(from_label_raw);
        from = grades[i];
        to_label_raw = getDisplayValue(to_obj, layer_code);
        to_label = significantDigitDecider(to_label_raw);
        to = grades[i+1];

        labels.push('<td style="background:' + 
            getColor(from, color_scheme, categories, reverse_scheme) + 
            '" data-toggle="tooltip" data-placement="top" title="' + 
            ( i==0 ? '<' + to_label : 
                ( i == grades.length-1 ? '>' + from_label : 
                    from_label + ' - ' + to_label 
                )
            // ) + '">&nbsp;</td> '
            ) + legendTooltipUnits(property.measure, property.type, property.code) + '">&nbsp;</td> '
        );
    }

    labels.push('       </tr></table>');
    labels.push('   </div>');
    labels.push('</div>');
    labels.push('<div class="row" id="legendLabels">');
    labels.push('   <div class="col-md-2 start">');
    labels.push('       Low');
    labels.push('   </div>');
    labels.push('   <div class="col-md-2 col-md-offset-8 end">');
    labels.push('       High');
    labels.push('   </div>');
    labels.push('</div>');

    div.innerHTML = labels.join('');
    span.appendChild(div);
    row.appendChild(span)
    $('#filter-container').append(row);

    var row2 = L.DomUtil.create('div', 'row legend-row');
    var span2 = L.DomUtil.create('div', 'col-md-12');
    var div2 = L.DomUtil.create('div', 'info legend pointlegend');
    div2.innerHTML = '<h4>Facilities</h4>\
    <i style="background: #FFFF00; border: solid 1px">&nbsp;&nbsp;&nbsp;&nbsp;</i> Crops Only<br />\
    <i style="background: #0000FF; border: solid 1px">&nbsp;&nbsp;&nbsp;&nbsp;</i> Livestock Only<br />\
    <i style="background: #00FF00; border: solid 1px">&nbsp;&nbsp;&nbsp;&nbsp;</i> Both<br />\
    <i style="background: #FFFFFF; border: solid 1px">&nbsp;&nbsp;&nbsp;&nbsp;</i> Neither<br />';
    span2.appendChild(div2);
    row2.appendChild(span2);
    $('#filter-container').append(row2);
}

function significantDigitDecider(num) {
    var ret_val = 0;
    switch (num){
        case (num < 0.01):
            ret_val = 0;
            break;
        case (num < 1):
            ret_val = Humanize.formatNumber(num,2);
            break;
        default:
            ret_val = Humanize.intComma(num);
    };
    return ret_val;
}

function loadData() {
    queryStringResult = queryObj();
    readQueryString(queryStringResult)

    setUpData();
}

function viewByZone(querystring) {
    updated_querystring = updateStatus(false,null,false);

    window.location.assign('./explore_by_zone.html' + updated_querystring);
}
