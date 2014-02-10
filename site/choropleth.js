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

function getCategories(range){
	// return [1000,200,100,40,0];
	return [3.9,2.9,1.9,0.9,0];
}

var data=statesData;
// var property="density";
var property="val";
var color_scheme="reds";
var range=getRange(data,property);
var categories=getCategories(range);
var reverse_scheme=false;

// get color depending on population density value
function getColor(value, scheme, categories, reverse) {

	var schemes = {
		//Darkest to most pale
		"reds":['#DE0A09', '#FA3A3E', '#F56B69', '#FAAFAC', '#FFD1CF' ],
		"oranges":['#DE520A', "#FA7836", "#F58B55", "#FAAC83", "#FFD1BA"],
		"yellows":["#DED404", "#FAF13D", "#F5EE5C", "#FAF68A", "#FFFCC1"],
		"greens":["#0E5404", "#2A851E", "#5ED64C", "#87E077", "#C4FFBA"],
		"ltblues":["#065438", "#218561", "#51D6A5", "#7DE0BA", "#C1FFE7"],
		"blues":["#030654", "#1B1F85", "#484ED6", "#747AE0", "#B6BAFF"],
		"purples":["#380354", "#5E1385", "#A03AD6", "#B465E0", "#DFA5FF"],
		"pinks":["#540542", "#850F68", "#D635B2", "#E05FC7", "#FF9FEB"],

		//dark to lighter color
		"red_yellow":['#800026', '#BD0026', '#FC4E2A', '#FEB24C', '#FFEDA0' ],
		"blue_yellow":['#1506FF', '#53A2B8', '#93FFB5', '#B6D65D', '#FFE083' ],

		//polar saturation
		"blue_red":["#0000FF", "#7A42D6", "#F7DEFF", "#FF59D5", "#FF000D"],
		"green_blue":["#12FF08", "#3BD689", "#D5FDFF", "#51A0FF", "#0E03FF"],
		"yellow_blue":["#FFE009", "#74D62C", "#C4FFE0", "#3FC9FF", "#1A0EFF"],
		"red_green":["#FF0007", "#D66F33", "#FFEFCC", "#FFF747", "#4FFF16"]
	};

	if (reverse==true){
		return 	value > categories[0] ? schemes[scheme][4] :
				value > categories[1] ? schemes[scheme][3] :
				value > categories[2] ? schemes[scheme][2] :
				value > categories[3] ? schemes[scheme][1] :
									 	schemes[scheme][0];
	} else {
		return 	value > categories[0] ? schemes[scheme][0] :
				value > categories[1] ? schemes[scheme][1] :
				value > categories[2] ? schemes[scheme][2] :
				value > categories[3] ? schemes[scheme][3] :
									 	schemes[scheme][4];
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
