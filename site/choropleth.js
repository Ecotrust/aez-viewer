var num_categories=5;		//TODO: Currently this all we support
var method = "jenks";
// var method = null;		//TODO: get to choose between these
var min_value = 0.00001; //Something nearly impossibly small
var initMapZoom, initMapLat, initMapLng;
var data;
var property, mapping, map, esri, info;
var categories;
var primaryUnit, secondaryUnit;
var color_scheme, reverse_scheme;
var geojson;
var first_load = true;

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
		initMapZoom = 5;
	}

	if (queryStringResult.hasOwnProperty('lat') && queryStringResult.hasOwnProperty('lng')) {
		initMapLat = queryStringResult.lat;
		initMapLng = queryStringResult.lng;
	} else {
		initMapLat = 41;
		initMapLng = -116;
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
	if (queryStringResult.hasOwnProperty('unit')){
		property.unit = queryStringResult['unit'];
	}
	return property;
}

function setUpData() {

	property = getProperty();

	mapping = dataMap;

	$.ajax({
        type: 'GET',
        url: getAjaxLocation(property.measure, property.type, property.code, property.unit, 'json'),
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
            alert("error");
        },
        success: function(ret_data, textStatus, request) {
        	data_obj = JSON.parse(ret_data);
			setData(data_obj);
        }
     });
}

function buildMap(){

	if (map){
		map.remove();
	}

	map = L.map('map').setView([initMapLat, initMapLng], initMapZoom);

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
			capFirstLetter(primaryUnit) + ' ' + (property.label ? capFirstLetter(property.label) : capFirstLetter(property.measure)) : '');
		var secondary_name = (property ?
			capFirstLetter(secondaryUnit) + ' ' + (property.label ? capFirstLetter(property.label) : capFirstLetter(property.measure)) : '');
		var secondary_property = (property ?
			{measure:property.measure, type: property.type, code:property.code, unit:secondaryUnit}
			: {measure:'', type:'', code:'', unit:secondaryUnit});
		this._div.innerHTML = '<h4>Zone Info: ' + 
			(props ? capFirstLetter(props["IsoZone"]) : '') + 
			'</h4>' +  
			(props ? 
				'<b>' + capFirstLetter(prop_name) + '</b><br />' + 
				props[getLayerCode(property)] + '<br />' +
				'<b>' + capFirstLetter(secondary_name) + '</b><br />' +
				props[getLayerCode(secondary_property)]
			: 
				'Hover over a zone');
	};
}

function setData(ret_obj){
	data = featureData;
	var attribute = '';
	for (var i = 0; i < data.features.length; i++){
		uid = data.features[i].properties[UID_key]
		if (ret_obj.hasOwnProperty(uid.toString())){
			for (var unit in ret_obj[uid.toString()]){
				attribute = encodeLayer(property.measure, property.type, property.code, unit)
				data.features[i].properties[attribute] = ret_obj[uid.toString()][unit];
			}
		}
	}
	buildMap();
	finishLoad();
}

function finishLoad(){
	info.addTo(map);
	updateUnits();
	if (first_load){
		setUnits();
		setMeasure();
		setTypes();
		first_load = false;
	}
	setColorScheme();
	getLegendInfo();
	loadGeoJson();
	setLegend();
}

function reload(queryString){
	var zoom = map.getZoom();
	var center = map.getCenter();

	queryString = queryString + "&zoom=" + zoom +
		"&lat=" + center.lat + "&lng=" + center.lng;

	window.history.pushState("", "", queryString);
	loadData();
}

function selectUnit(value){
	if (!property){
		var property = getProperty();
	} 

	queryString = "?unit=" + value;
	for (key in queryStringResult) {
		if (key != 'unit'){
			queryString = queryString + "&" + key + "=" + queryStringResult[key];
		}
	}
	reload(queryString);
}

function selectMeasure(value){
	if (!property){
		var property = getProperty();
	} 
	var layer_string = encodeLayer(value, property.type, property.code, property.unit);
	
	queryString = "?property=" + layer_string;
	for (key in queryStringResult) {
		if (key != 'property'){
			queryString = queryString + "&" + key + "=" + queryStringResult[key];
		}
	}
	reload(queryString);
}

function selectCrop(value){
	if (!property){
		var property = getProperty();
	} 
	var val_parts = value.split("_");
	var layer_string = encodeLayer(property.measure, val_parts[0], val_parts[1], property.unit);
	
	queryString = "?property=" + layer_string;
	for (key in queryStringResult) {
		if (key != 'property'){
			queryString = queryString + "&" + key + "=" + queryStringResult[key];
		}
	}
	reload(queryString);
}

function selectScheme(value){
	queryString = "?scheme=" + value;
	for (key in queryStringResult) {
		if (key != 'scheme'){
			queryString = queryString + "&" + key + "=" + queryStringResult[key];
		}
	}
	reload(queryString);
}

function selectReverse(value){
	queryString = "?reverse=" + value;
	for (key in queryStringResult) {
		if (key != 'reverse'){
			queryString = queryString + "&" + key + "=" + queryStringResult[key];
		}
	}
	reload(queryString);
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
			if (value != 0){
				range.push(value);
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
	if (exp>0){
		var mask = Math.pow(10,exp);
	} else if (dev > 20) {
		var mask = 10;
	} else {
		var mask = 0;
	}
	if (mask != 0) {
		dev = Math.round(dev/mask)*mask;
		high = Math.round(high/mask)*mask;
	}

	return {dev:dev, high:high};
}

function getCategories(range, count){
	if (count == 0){
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

function roundCategories(categories){
	for (var i = 1; i < categories.length; i++){
		var dev = categories[i] - categories[i-1];
		if (dev > 1){
			var digits = parseInt(Math.log(dev)/Math.LN10);
			var exp = digits - 1;
			if (exp>0){
				var mask = Math.pow(10,exp);
			} else if (dev > 20) {
				var mask = 10;
			} else {
				var mask = 0;
			}
			if (mask != 0) {
				dev = Math.floor(dev/mask)*mask;
			}
		}
		if (i == 1 && (categories[i] - dev) < (categories[i]*0.1)) {
			categories[i] = dev;
		} else {
			categories[i] = Math.floor(categories[i-1] + dev);
		}
	}
	return categories;
}

function getJenksCategories(range, count){
	var new_range = [];
	var slice_count = 1;
	for (var i = 0; i < range.length; i++) {
		if (range[i] != 0) {
			new_range.push(range[i]);
		}
	}
	if (new_range.length < count) {
		if (new_range.length <= 1) {
			return [0,0,0,0,0];
		}
		slice_count = 0;
		categories = new_range.sort(function(a,b) { return a - b;});
	} else {
		categories = ss.jenks(new_range, count);
	}
	// categories = roundCategories(categories);

	return categories.reverse().slice(slice_count, categories.length);
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


function updateUnits() {
	if (queryStringResult.hasOwnProperty('unit') && units.hasOwnProperty(queryStringResult['unit']) >= 0){
		primaryUnit = queryStringResult['unit'];
	} else {
		primaryUnit = defaultPrimaryUnit;
	}

	secondaryUnit = (primaryUnit == defaultPrimaryUnit ? defaultSecondaryUnit : defaultPrimaryUnit);
}


function setUnits() {

	var unitSelect=document.getElementById("unitSelect");
	// var unitButton=document.getElementById("unitButton");
	// var unitMenu=document.getElementById("unitMenu");

	for (key in units){
		var unitOpt = document.createElement("option");
		unitOpt.value = key;
		unitOpt.innerHTML = units[key].name;

		// var unitMenuItem = document.createElement("li");

		// unitMenuItem.onclick=function(){selectUnit(key);};
		// unitMenuItem.appendChild(document.createTextNode(units[key].name));


		if (key == property.unit){
			unitOpt.selected = true;
			// unitButton.appendChild(document.createTextNode("Unit: " + units[key].name));
		}

		unitSelect.appendChild(unitOpt);
		// unitMenu.appendChild(unitMenuItem);
	}
	// unitMenu.setAttribute('style', "margin-left:" + unitButton.offsetWidth + "px; margin-top:-38px;");
}


function setMeasure() {
	var measureSelect=document.getElementById("measureSelect");

	for (key in mapping){
		var measureOpt = document.createElement("option");
		measureOpt.value = key;
		measureOpt.innerHTML = capFirstLetter(key);

		if (mapping[key].data == null){
			measureOpt.disabled = true;
		}

		if (key == property.measure){
			measureOpt.selected = true;
		}

		measureSelect.appendChild(measureOpt);
	}
}


function setTypes() {
	var cropSelect=document.getElementById("cropSelect");

	var types = mapping[property.measure].mapping.type;

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

			if (!getLayerCode({measure: property.measure, type:key, code:subKey, unit:primaryUnit})){
				typeOpt.disabled = true;
			}
			oGroup.appendChild(typeOpt);
		}
		cropSelect.appendChild(oGroup);
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

	var schemeSelect=document.getElementById("schemeSelect");

	for (key in schemes){
		var opt = document.createElement("option");
		opt.value = key;
		opt.innerHTML = schemes[key].name;

		if (schemes[key].name == color_scheme.name){
			opt.selected = true;
		}

		schemeSelect.appendChild(opt);
	}

	if (queryStringResult.hasOwnProperty('reverse') && 
		queryStringResult['reverse'] == "true") {
		reverse_scheme = true;
	} else {
		reverse_scheme = false;
	}

	var reverseSelect=document.getElementById("reverseSelect");

	reverse_opts = ['Normal', 'Reverse'];
	for (key in reverse_opts){
		var opt = document.createElement("option");
		opt.value = (reverse_opts[key]=='Reverse');
		opt.innerHTML = reverse_opts[key];

		if ((reverse_opts[key] == 'Normal' && !reverse_scheme) || (reverse_opts[key] == 'Reverse' && reverse_scheme)){
			opt.selected = true;
		}

		reverseSelect.appendChild(opt);
	}
}


function getLegendInfo() {
	var layer_code = getLayerCode(property);
	if (!layer_code) {
		alert("Layer " + encodeLayer(property.measure, property.type, property.code, property.unit) + " does not exist. Please select another.")
	}

	var range=getRange(data,layer_code,method);
	if (method == "jenks"){
		categories=getJenksCategories(range, num_categories);	
	} else {
		categories=getCategories(range, num_categories);
	}
	if (categories==false || num_categories==0){
		alert("Pleace specify the number of categories in your settings.");
	}
}


// get color depending on population density value
function getColor(value, scheme, categories, reverse) {

	if (reverse==true){
		return 	value >= categories[0] ? scheme.list[4] :
				value >= categories[1] ? scheme.list[3] :
				value >= categories[2] ? scheme.list[2] :
				value >= categories[3] ? scheme.list[1] :
									 	scheme.list[0];
	} else {
		return 	value >= categories[0] ? scheme.list[0] :
				value >= categories[1] ? scheme.list[1] :
				value >= categories[2] ? scheme.list[2] :
				value >= categories[3] ? scheme.list[3] :
									 	scheme.list[4];
	}
}

function getOpacity(value) {
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
		fillOpacity: getOpacity(value),
		fillColor: getColor(value, color_scheme, categories, reverse_scheme)
	};
}

function highlightFeature(e) {
	var layer = e.target;

	layer.setStyle({
		weight: 1,
		color: '#666',
		dashArray: '',
		fillOpacity: 0.7
	});

	if (!L.Browser.ie && !L.Browser.opera) {
		layer.bringToFront();
	}

	info.update(layer.feature.properties);
}


function resetHighlight(e) {
	geojson.resetStyle(e.target);
	info.update();
}

function zoomToFeature(e) {
	map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
		click: zoomToFeature
	});
}

function loadGeoJson() {
	geojson = L.geoJson(data, {
		style: style,
		onEachFeature: onEachFeature
	}).addTo(map);
}


//TODO: Get link to Ag census for attribution
// map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census Bureau</a>');

function setLegend() {

	var legend = L.control({position: 'bottomright'});

	legend.onAdd = function (map) {

		var div = L.DomUtil.create('div', 'info legend'),
			grades = [],
			labels = [],
			from, to;
			for (var index = categories.length-1; index > -1; index--){
				grades.push(categories[index]);
			}

		if (property) {
			if (property.label) {
				labels.push('<b>' + property.label + '</b>');
			} else {
				labels.push('<b>' + capFirstLetter(property.measure) + '</b>');
			}
		}
		labels.push('<br />');

		for (var i = 0; i < grades.length; i++) {
			from = grades[i];
			to = grades[i + 1];

			if (i == 0) {
				labels.push('Low <i style="background:' + 
					getColor(from, color_scheme, categories, reverse_scheme) + 
					'" data-toggle="tooltip" data-placement="top" title="<' + to + '"></i> ');
			} else {
				if (i == grades.length -1){
					labels.push('<i style="background:' + 
						getColor(from, color_scheme, categories, reverse_scheme) + 
						'" data-toggle="tooltip" data-placement="top" title="' + from + '+"></i> ' +	"High");
				} else {
					labels.push('<i style="background:' + 
						getColor(from, color_scheme, categories, reverse_scheme) + 
						'" data-toggle="tooltip" data-placement="top" title="' + from + '-' + to + '"></i> ' +	"");
				}
			}
		}

		div.innerHTML = '<h4>' + 
			mapping[property['measure']].mapping.type[property['type']].options[property['code']].name + 
			'</h4>' + 
			labels.join('');
		return div;
	};

	legend.addTo(map);
}


function loadData() {
	queryStringResult = queryObj();
	readQueryString(queryStringResult)

	setUpData();

	// info.addTo(map);

	// updateUnits();


	// setColorScheme();

	// getLegendInfo();

	// loadGeoJson();

	// setLegend();
}
