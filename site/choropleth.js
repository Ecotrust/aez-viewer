var num_categories=5;		//TODO: Currently this all we support
var method = "jenks";
// var method = null;		//TODO: get to choose between these
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

	map = L.map('map', {zoomControl: false});
	setZoomControl();
	if (initMapLat || initMapLng) {
		map.setView([initMapLat, initMapLng], initMapZoom);
	} else {
		map.fitBounds([
			[50.574873, -126.994063],
			[31.312113, -109.031419]
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
			(props ? capFirstLetter(props["IsoZone"]) : '') + 
			'</h4>' +  
			(props ? 
				'<b>' + capFirstLetter(prop_name) + '</b><br />' + 
				roundDigits(props[getLayerCode(property)]) + '<br />'
			: 
				'<p>Hover over a zone</p>');
	};
}

function roundDigits(number){
	if ($.inArray('.',number.toString()) != -1 && number != 0){
		var dig_str = number.toString().split('.')[1];
		if (dig_str.length > max_digits) {
			return number.toFixed(max_digits);
		}
	}
	return number;
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

function reload(queryString){
	var zoom = map.getZoom();
	var center = map.getCenter();

	queryString = queryString + "&zoom=" + zoom +
		"&lat=" + center.lat + "&lng=" + center.lng;

	window.history.pushState("", "", queryString);
	loadData();
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

function setMeasure() {
	var current_measures = getMeasures(property);
		var row = L.DomUtil.create('div', 'row');
		var span = L.DomUtil.create('div', 'col-md-12');
		var table = L.DomUtil.create('table', 'measureTable');
		var trow = L.DomUtil.create('tr', 'measureTableRow');

	for (key in current_measures){

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
	} else {
		color_scheme = schemes["reds"];
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
	if (value == null) {
		value = 0;
	}
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
		fillOpacity: getOpacity(value)
	};
}

function highlightFeature(e) {
	if (highlightedFeature) {
		resetHighlight();
	}

	var layer = e.target;

	layer.setStyle({
		weight: 1,
		color: '#666',
		dashArray: ''
	});

	if (!L.Browser.ie && !L.Browser.opera) {
		layer.bringToFront();
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
	var popDiv = L.DomUtil.create('div', 'popup');
	var topPop = L.DomUtil.create('div', 'row');

	// ---- Top of the popup
	var topPopSpan = L.DomUtil.create('div', 'col-md-12');

	var topZoneNameRow = L.DomUtil.create('div', 'row popZoneName');
	var topZoneNameSpan = L.DomUtil.create('div', 'col-md-10 col-md-offset-1');
	topZoneNameSpan.innerHTML ='Zone #' + 
		feature.properties.IsoZone.toString();
	topZoneNameRow.appendChild(topZoneNameSpan);
	topPopSpan.appendChild(topZoneNameRow);

	var topAcresRow = L.DomUtil.create('div', 'row');
	var topAcresSpan = L.DomUtil.create('div', 'col-md-10 col-md-offset-1 popAcres');
	topAcresSpan.innerHTML = '&lt;Not Available Yet&gt; acres';
	topAcresRow.appendChild(topAcresSpan);
	topPopSpan.appendChild(topAcresRow);

	var topValueRow = L.DomUtil.create('div', 'row');
	var topValueSpan = L.DomUtil.create('div', 'col-md-10 col-md-offset-1 popValue');
	if (feature.properties[getLayerCode(property)] == null) {
		topValueSpan.innerHTML = roundDigits(0).toString();
	} else {
		topValueSpan.innerHTML = roundDigits(feature.properties[getLayerCode(property)]).toString();
	}
	topValueRow.appendChild(topValueSpan);
	topPopSpan.appendChild(topValueRow);

	var topValueDescriptionRow = L.DomUtil.create('div', 'row');
	var topValueDescriptionSpan = L.DomUtil.create('div', 'col-md-10 col-md-offset-1 popDescription');
	var prop_name = mapping[property['measure']].mapping.type[property['type']].options[property['code']].name;
	topValueDescriptionSpan.innerHTML = popUpDescriptions[property.measure]['name'] +
		prop_name
	topValueDescriptionRow.appendChild(topValueDescriptionSpan);
	topPopSpan.appendChild(topValueDescriptionRow);

	topPop.appendChild(topPopSpan);
	popDiv.appendChild(topPop);

	// ---- Bottom of the popup

	var botPop = L.DomUtil.create('div', 'row well botPop');
	var botPopSpan = L.DomUtil.create('div', 'col-md-12');

	var botThemeRow = L.DomUtil.create('div', 'row')
	var botThemeSpan = L.DomUtil.create('div', 'col-md-10 col-md-offset-1 popTheme');
	botThemeSpan.innerHTML = '<i>Top five crops</i>';
	botThemeRow.appendChild(botThemeSpan);
	botPopSpan.appendChild(botThemeRow);

	//1
	var topFiveRow1Name = L.DomUtil.create('div', 'row');
	var topFiveSpan1Name = L.DomUtil.create('div', 'col-md-10 col-md-offset-1 top5Name');
	topFiveSpan1Name.innerHTML = '&ltNot yet implemented&gt;';
	topFiveRow1Name.appendChild(topFiveSpan1Name);
	botPopSpan.appendChild(topFiveRow1Name);

	var topFiveRow1Value = L.DomUtil.create('div', 'row');
	var topFiveSpan1Value = L.DomUtil.create('div', 'col-md-10 col-md-offset-1 top5Value');
	topFiveSpan1Value.innerHTML = '&ltNot yet implemented&gt; ' +
		getLabel(property).toLowerCase();
	topFiveRow1Value.appendChild(topFiveSpan1Value);
	botPopSpan.appendChild(topFiveRow1Value);

	//2
	var topFiveRow2Name = L.DomUtil.create('div', 'row');
	var topFiveSpan2Name = L.DomUtil.create('div', 'col-md-10 col-md-offset-1 top5Name');
	topFiveSpan2Name.innerHTML = '&ltNot yet implemented&gt;';
	topFiveRow2Name.appendChild(topFiveSpan2Name);
	botPopSpan.appendChild(topFiveRow2Name);

	var topFiveRow2Value = L.DomUtil.create('div', 'row');
	var topFiveSpan2Value = L.DomUtil.create('div', 'col-md-10 col-md-offset-1 top5Value');
	topFiveSpan2Value.innerHTML = '&ltNot yet implemented&gt; ' +
		getLabel(property).toLowerCase();
	topFiveRow2Value.appendChild(topFiveSpan2Value);
	botPopSpan.appendChild(topFiveRow2Value);

	//3
	var topFiveRow3Name = L.DomUtil.create('div', 'row');
	var topFiveSpan3Name = L.DomUtil.create('div', 'col-md-10 col-md-offset-1 top5Name');
	topFiveSpan3Name.innerHTML = '&ltNot yet implemented&gt;';
	topFiveRow3Name.appendChild(topFiveSpan3Name);
	botPopSpan.appendChild(topFiveRow3Name);

	var topFiveRow3Value = L.DomUtil.create('div', 'row');
	var topFiveSpan3Value = L.DomUtil.create('div', 'col-md-10 col-md-offset-1 top5Value');
	topFiveSpan3Value.innerHTML = '&ltNot yet implemented&gt; ' +
		getLabel(property).toLowerCase();
	topFiveRow3Value.appendChild(topFiveSpan3Value);
	botPopSpan.appendChild(topFiveRow3Value);

	//4
	var topFiveRow4Name = L.DomUtil.create('div', 'row');
	var topFiveSpan4Name = L.DomUtil.create('div', 'col-md-10 col-md-offset-1 top5Name');
	topFiveSpan4Name.innerHTML = '&ltNot yet implemented&gt;';
	topFiveRow4Name.appendChild(topFiveSpan4Name);
	botPopSpan.appendChild(topFiveRow4Name);

	var topFiveRow4Value = L.DomUtil.create('div', 'row');
	var topFiveSpan4Value = L.DomUtil.create('div', 'col-md-10 col-md-offset-1 top5Value');
	topFiveSpan4Value.innerHTML = '&ltNot yet implemented&gt; ' +
		getLabel(property).toLowerCase();
	topFiveRow4Value.appendChild(topFiveSpan4Value);
	botPopSpan.appendChild(topFiveRow4Value);

	//5
	var topFiveRow5Name = L.DomUtil.create('div', 'row');
	var topFiveSpan5Name = L.DomUtil.create('div', 'col-md-10 col-md-offset-1 top5Name');
	topFiveSpan5Name.innerHTML = '&ltNot yet implemented&gt;';
	topFiveRow5Name.appendChild(topFiveSpan5Name);
	botPopSpan.appendChild(topFiveRow5Name);

	var topFiveRow5Value = L.DomUtil.create('div', 'row');
	var topFiveSpan5Value = L.DomUtil.create('div', 'col-md-10 col-md-offset-1 top5Value');
	topFiveSpan5Value.innerHTML = '&ltNot yet implemented&gt; ' +
		getLabel(property).toLowerCase();
	topFiveRow5Value.appendChild(topFiveSpan5Value);
	botPopSpan.appendChild(topFiveRow5Value);

	botPop.appendChild(botPopSpan);
	popDiv.appendChild(botPop);

	return popDiv;
}

function onEachFeature(feature, layer) {
	layer.bindPopup(getPopupHtml(feature), {offset: new L.Point(135, 150)});
	layer.on({
		click: highlightFeature,
		mouseover: updateInfo,
		mouseout: resetInfo
		// click: zoomToFeature
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

function setZoomControl() {
	var zoomControl = L.control.zoom({position:'bottomright'});
	map.addControl(zoomControl);
}

function setLegend() {

	for(var i=0; $('.legend').length > 0; i++) {
		$('.legend')[0].remove();
	}

	var row = L.DomUtil.create('div', 'row');
	var span = L.DomUtil.create('div', 'col-md-12');

	var div = L.DomUtil.create('div', 'legend'),
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
	labels.push('<div class="row">');
	labels.push('	<div class="col-md-12" id="legendTable">');
	labels.push('		<table><tr>');

	for (var i = 0; i < grades.length; i++) {
		from = grades[i];
		to = grades[i + 1];

		labels.push('<td style="background:' + 
			getColor(from, color_scheme, categories, reverse_scheme) + 
			'" data-toggle="tooltip" data-placement="top" title="' + 
			( i==0 ? '<' + to : 
				( i == grades.length-1 ? '>' + from : 
					from + ' - ' + to 
				)
			) + '">&nbsp;</td> '
		);
	}

	labels.push('		</tr></table>');
	labels.push('	</div>');
	labels.push('</div>');
	labels.push('<div class="row" id="legendLabels">');
	labels.push('	<div class="col-md-2 start">');
	labels.push('		Low');
	labels.push('	</div>');
	labels.push('	<div class="col-md-2 col-md-offset-8 end">');
	labels.push('		High');
	labels.push('	</div>');
	labels.push('</div>');

	div.innerHTML = labels.join('');
	span.appendChild(div);
	row.appendChild(span)
	$('#filter-container').append(row);
}

function loadData() {
	queryStringResult = queryObj();
	readQueryString(queryStringResult)
	setUpData();
}
