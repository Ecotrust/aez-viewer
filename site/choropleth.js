var map = L.map('map').setView([41, -116], 5);

var cloudmade = L.tileLayer('http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png', {
	attribution: 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade',
	key: 'BC9A493B41014CAABB98F0471D759707',
	styleId: 22677
}).addTo(map);

// control that shows state info on hover
var info = L.control();

info.onAdd = function (map) {
	this._div = L.DomUtil.create('div', 'info');
	this.update();
	return this._div;
};

info.update = function (props) {
	this._div.innerHTML = '<h4>US Population Density</h4>' +  (props ?
		'<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>'
		: 'Hover over a state');
};

info.addTo(map);

function queryObj() {
	var result = {};
	keyValuePairs = location.search.slice(1).split('&');

	keyValuePairs.forEach(function(keyValuePair) {
		keyValuePair = keyValuePair.split('=');
		result[keyValuePair[0]] = keyValuePair[1] || '';
	});

	return result;
}

var queryStringResult = queryObj();

function addProperty(properties, property){
	if(!properties.hasOwnProperty(property)){
		properties[property] = 1;
	} else {
		properties[property] = properties[property] + 1;
	}
	return properties;
}

function parseData(data){
	var properties = {};
	for (var i=0; i < data.features.length; i++){
		var feat = data.features[i];
		for (var property in feat.properties) {
			if (feat.properties.hasOwnProperty(property)){
				var n = feat.properties[property];
				if (!isNaN(parseFloat(n)) && isFinite(n)){
					properties = addProperty(properties,property)
				}
			}
		}
	}
	return properties;
}

function getProperties(prop_obj, feature_count){
	representative = [];
	partial = [];
	for (var property_key in prop_obj){
		if (prop_obj.hasOwnProperty(property_key)){
			if (prop_obj[property_key] == feature_count){
				representative.push(property_key);
			} else {
				partial.push(property_key);
			}
		}
	}
	return {"representative":representative.sort(), "partial":partial.sort()};
}

function selectProperty(value){
	queryString = "?property=" + value;
	for (key in queryStringResult) {
		if (key != 'property'){
			queryString = queryString + "&" + key + "=" + queryStringResult[key];
		}
	}
	window.location.assign(queryString);
}

function selectScheme(value){
	queryString = "?scheme=" + value;
	for (key in queryStringResult) {
		if (key != 'scheme'){
			queryString = queryString + "&" + key + "=" + queryStringResult[key];
		}
	}
	window.location.assign(queryString);
}

function selectReverse(value){
	queryString = "?reverse=" + value;
	for (key in queryStringResult) {
		if (key != 'reverse'){
			queryString = queryString + "&" + key + "=" + queryStringResult[key];
		}
	}
	window.location.assign(queryString);
}

function getRange(data,property) {
	var low=data.features[0].properties[property];
	var high=data.features[0].properties[property];
	for(var i=0; i<data.features.length; i++){
		var value=data.features[i].properties[property];
		if (value < low){
			low = value;
		} else if (value > high){
			high = value;
		}
	}
	return {"low":low,"high":high};
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

	return {"dev":dev, "high":high};
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
	var categories = [high_bar];
	for (var i = 1; i < count-1; i++) {
		categories.push(categories[categories.length-1]-dev);
	}
	categories.push(0);
		//TODO: This assumes only positive values
	return categories;
}

function capFirstLetter(string)
{
    //Shamelessly ripped from http://stackoverflow.com/questions/1026069/capitalize-the-first-letter-of-string-in-javascript
    return string.charAt(0).toUpperCase() + string.slice(1);
}

var data = statesData;
var property_object = parseData(data);
var properties = getProperties(property_object, data.features.length);

if (queryStringResult.hasOwnProperty('property') && properties.representative.indexOf(queryStringResult['property']) >= 0){
	var property = queryStringResult['property'];
} else {
	var property=properties.representative[0];
}

var propertySelect=document.getElementById("propertySelect");

for (key in properties.representative){
	var opt = document.createElement("option");
	opt.value = properties.representative[key];
	opt.innerHTML = capFirstLetter(properties.representative[key]);

	if (properties.representative[key] == property){
		opt.selected = true;
	}

	propertySelect.appendChild(opt);
}

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

if (queryStringResult.hasOwnProperty('scheme') && schemes.hasOwnProperty(queryStringResult['scheme']) >= 0){
	var color_scheme = schemes[queryStringResult['scheme']];
} else {
	var color_scheme = schemes["reds"];
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
	var reverse_scheme = true;
} else {
	var reverse_scheme = false;
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

var range=getRange(data,property);
var num_categories=5;		//TODO: Currently this all we support
var categories=getCategories(range, num_categories);
if (categories==false || num_categories==0){
	return false;
}

// get color depending on population density value
function getColor(value, scheme, categories, reverse) {

	if (reverse==true){
		return 	value > categories[0] ? scheme.list[4] :
				value > categories[1] ? scheme.list[3] :
				value > categories[2] ? scheme.list[2] :
				value > categories[3] ? scheme.list[1] :
									 	scheme.list[0];
	} else {
		return 	value > categories[0] ? scheme.list[0] :
				value > categories[1] ? scheme.list[1] :
				value > categories[2] ? scheme.list[2] :
				value > categories[3] ? scheme.list[3] :
									 	scheme.list[4];
	}

}

function style(feature) {
	return {
		weight: 2,
		opacity: 1,
		color: 'white',
		dashArray: '3',
		fillOpacity: 0.7,
		fillColor: getColor(feature.properties[property], color_scheme, categories, reverse_scheme)
	};
}

function highlightFeature(e) {
	var layer = e.target;

	layer.setStyle({
		weight: 5,
		color: '#666',
		dashArray: '',
		fillOpacity: 0.7
	});

	if (!L.Browser.ie && !L.Browser.opera) {
		layer.bringToFront();
	}

	info.update(layer.feature.properties);
}

var geojson;

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

geojson = L.geoJson(statesData, {
	style: style,
	onEachFeature: onEachFeature
}).addTo(map);

map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census Bureau</a>');


var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

	var div = L.DomUtil.create('div', 'info legend'),
		grades = [],
		labels = [],
		from, to;
		for (var index = categories.length-1; index > -1; index--){
			grades.push(categories[index]);
		}

	for (var i = 0; i < grades.length; i++) {
		from = grades[i];
		to = grades[i + 1];

		labels.push(
			'<i style="background:' + getColor(from + 0.000001, color_scheme, categories, reverse_scheme) + '"></i> ' +
			from + (to ? '&ndash;' + to : '+'));
	}

	div.innerHTML = labels.join('<br>');
	return div;
};

legend.addTo(map);
