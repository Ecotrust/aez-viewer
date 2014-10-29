/*jshint multistr: true */
var data_dir = './food_zones/Data';
var UID_key = 'zone_id';
var total_key = 'total';
var required_total_keys = [
	'area_in_acres',
	'ag_acres',
	'irrig_acre'
];
var perspective_text = ' in Oregon';
var original_category_codes = ['br','fc','fn','fs','oc','vpm'];
var legend_data = {};

setAdditionalLegendData();

function setAdditionalLegendData() {
	legend_data = {
		'name': 'Infrastructure'
	};
}

function getAjaxLocation(measure, type, code, unit, format){
	var measure_dir;
	switch(measure) {
		case 'acres':
			measure_dir = 'acres';
			break;
		case 'farms':
			measure_dir = 'farms';
			break;
		case 'yield':
			measure_dir = 'qnty';
			break;
		default:
			measure_dir = measure;
	}
	if (measure_dir == 'total') {
		return data_dir + '/totals.json';
	}
	var file_name = getFileKey([type,code].join('_'));
	return data_dir + '/' + measure_dir + '/' + file_name + '.' + format;
}

var featureData = zoneData;
var acresData = zoneData;
var farmsData = zoneData;
var yieldData = zoneData;

var dataMap = {
	"acres": {
		"data": acresData,
		"mapping": {
			"type": types
		}
	},
	"farms": {
		"data": farmsData,
		"mapping": {
			"type": types
		}
	},
	"yield": {
		"data": yieldData,
		"mapping": {
			"type": types
		}
	}
};

var units = {
	"density": {
		"name":"Density",
		"value":"density",
		"label":"Per Acre"
	},
	"count": {
		"name": "Count",
		"value": "count",
		"label": "units"
	}
};

function getLabel(property){
	var label = capFirstLetter(property.measure);
	if (property.unit == 'density') {
		switch(property.measure){
			case 'acres':
				label = '% Area';
				break;
			case 'farms':
				label = 'Farms Per Mile<sup>2</sup>';
				break;
			case 'yield':
				label = 'Yield';
				break;
			default:
				if (property.unit) {
					label = property.unit.label;
				}
		}
	} else if (property.unit == 'count') {
		switch(property.measure){
			case 'acres':
				label = 'Acres';
				break;
			case 'farms':
				label = 'Farms';
				break;
			case 'yield':
				label = 'Production';
				break;
			default:
				if (property.unit) {
					label = property.unit.label;
				}
		}
	}
	return label;
}

function showQuantity(meas) {
	switch(meas){
		case 'acres':
			return false;
		case 'farms':
			return false;
		case 'yield':
			return true;
		default:
			return false;
	}
}

function getUnits(property) {
	//Units are the same regardless of selection
	return units;
}

var measures = {
	"acres": {
		"name": "Acres"
	},
	"farms": {
		"name": "Farms"
	},
	"yield": {
		"name": "Production"
	}
};

var popUpDescriptions = {
	"acres": {
		'density': {
			"name": "% ag land reprented by this product"
		},
		'count': {
			"name": "Total acres of this product"
		}
	},
	"farms": {
		'density': {
			"name": "Farms per Mi<sup>2</sup> that produce this product"
		},
		'count': {
			"name": "Number of farms producing this product"
		}
	},
	"yield": {
		'density': {
			"name": "Yield"
		},
		'count': {
			"name": ""
		}
	}
};

function getFileKey(m_key) {
	var key_prefix;
	var key_code = m_key.split("_")[1];
	if (key_code){
		if (original_category_codes.indexOf(key_code.substr(0,2)) < 0){
			if (key_code.substr(0,2) == 'vp') {
				key_prefix = 'vpm';
			} else {
				key_prefix = 'mt';
			}
		} else {
			key_prefix = key_code.substr(0,2);
		}
		file_key = [key_prefix, key_code].join('_');
	} else {
		file_key = m_key;
	}
	return file_key;
}

function getNewCategory(old_cat){
	var new_cats = Object.keys(types);
	for (var i = 0; i < new_cats.length; i++) {
		var opts = Object.keys(types[new_cats[i]]['options']);
		if (opts.indexOf(old_cat) >= 0) {
			return new_cats[i];
		}
	}
}

function getMeasures(property) {
	var available_measures = measures;
	for (var m_key in measures) {
		var file_key = getFileKey(m_key);
		available_measures[m_key]['available'] = ($.inArray(getFileKey(property.type + '_' + property.code), files[file_key].options) != -1);
	}
	return available_measures;
}

function getTypes(property){
	var available_types = {};
	var type_key, opt_key;
	for (type_key in types){
		var type = types[type_key];
		available_types[type_key] = types[type_key];
		for (opt_key in type.options){
			available_types[type_key].options[opt_key]['available'] = ($.inArray(getFileKey(type_key + '_' + opt_key), files[property.measure].options) != -1);
		}
	}
	return available_types;
}

var defaultPrimaryUnit = 'count';
var defaultSecondaryUnit = 'density';

function encodeLayer(measure, type, code, unit) {
	var key = getFileKey([type, code].join('_'));
	if (unit == 'density' || unit == 'dens') {
		if (measure == 'acres') {
			return "acres_" + key + "_dens";
		}
		if (measure == 'farms') {
			return "farms_" + key + "_dens";
		}
		if (measure == 'yield') {
			return "qnty_" + key + "_dens";
		}
		return 0;
	} else {
		if (measure == 'acres') {
			return "acres_" + key;
		}
		if (measure == 'farms') {
			return "farms_" + key;
		}
		if (measure == 'yield') {
			return "qnty_" + key;
		}
		return 0;
	}
}

function parseLayer(layername) {
	var parts = layername.split("_");
	var ret_val = 0;
	var translated_category = getNewCategory(parts[2]);
	if (parts[0] == "acres"){
		ret_val = {
			"measure": 'acres',
			"type": translated_category,
			"code": parts[2]
		};
	}
	if (parts[0] == "farms"){
		ret_val = {
			"measure": 'farms',
			"type": translated_category,
			"code": parts[2]
		};
	}
	if (parts[0] == "qnty"){
		ret_val = {
			"measure": 'yield',
			"type": translated_category,
			"code": parts[2]
		};
	}
	if (ret_val !== 0) {
		if (parts.slice(-1)[0] == 'dens') {
			ret_val['unit'] = 'density';
		} else {
			ret_val['unit'] = 'count';
		}
		ret_val['label'] = false;
	}
	return ret_val;
}

function getDefaultLayer() {
	var measure = "yield";
	var type = "LivestockPoultry";
	var code = "chicken";
	var unit = defaultPrimaryUnit;

	return {"measure": measure, "type": type, "code": code, "unit": unit};
}

function getQuanity(measure, type, code) {
	if (measure == 'yield') {
		return dataMap[measure]['mapping']['type'][type]['options'][code]['qty'];
	}
	return '';
}

function getDisplayValue(properties, key) {
	var key_parts = key.split('_');
	if (key_parts[0] == 'acres' && key_parts[3] == 'dens') {	//We display "percentages", not density values for this.
		return 100*properties[key];
	}
	if (key_parts[0] == 'farms' && key_parts[3] == 'dens') {		//We display "farms per sq. mile" not acre.
		return 640*properties[key];
	}
	return properties[key];
}

function legendTooltipUnits(measure, type, code){
	unit = '';
	if (defaultPrimaryUnit == 'density') {
		switch(measure) {
			case 'acres':
				unit = '%';
				break;
			case 'farms':
				unit = ' farms/sq.mi';
				break;
			case 'yield':
				unit = ' ' + types[type]['options'][code]['qty'];
				break;
			default:
				unit='';
				alert('Unknown unit.');
		}
	} else if (defaultPrimaryUnit == 'count') {
		switch(measure) {
			case 'acres':
				unit = ' acres';
				break;
			case 'farms':
				unit = ' farms';
				break;
			case 'yield':
				unit = ' ' + types[type]['options'][code]['qty'];
				break;
			default:
				unit='';
				alert('Unknown unit.');
		}
	}
	return unit;
}

function getPerspective(prefix, prop_name, type, unit, measure, postfix) {
	var ret_string = prefix + prop_name + ' ' + getLabel({'unit': unit, 'measure': measure}).toLowerCase() + postfix;
	if (type == 'mt') {
		if (measure == 'farms') {
			ret_string = prefix + "farms raising this animal" + postfix;
		} else if (measure == 'yield') {
			ret_string = prefix + prop_name + postfix;
		}
	}
	return ret_string;
}

function licensePointStyle(fillColor) {
	return {
		radius: 5,
		fillColor: fillColor,
		weight: 1,
		opacity: 1,
		fillOpacity: 1,
		zindex: 1999
	};
}

function grainWarehouseStyle(feature) {
	var color = '#F00';
	appendToLegend('Grain Warehouse', color);
	return licensePointStyle(color);
}

function custMobileSlaughterStyle(feature) {
	var color = '#0F0';
	appendToLegend('Custom Mobile Slaughter', color);
	return licensePointStyle(color);
}

function custStatSlaughterStyle(feature) {
	var color = '#00F';
	appendToLegend('Custom Stationary Slaughter', color);
	return licensePointStyle(color);
}

function custMeatProcessorStyle(feature) {
	var color = '#FF0';
	appendToLegend('Custom Meat Processor', color);
	return licensePointStyle(color);
}

function nonSlaughterProcessorStyle(feature) {
	var color = '#F0F';
	appendToLegend('Non-Slaughtering Processor', color);
	return licensePointStyle(color);
}

function slaughterhouseStyle(feature) {
	var color = '#0FF';
	appendToLegend('Slaughterhouse', color);
	return licensePointStyle(color);
}

function poultrySlaughterhouseStyle(feature) {
	var color = '#0FF';
	appendToLegend('Poultry Slaughterhouse', color);
	return licensePointStyle(color);
}

function foodStorageWarehouseStyle(feature) {
	var color = '#FFF';
	appendToLegend('Food Storage Warehouse', color);
	return licensePointStyle(color);
}

function refrigeratedLockerStyle(feature) {
	var color = '#000';
	appendToLegend('Refrigerated Locker Plant', color);
	return licensePointStyle(color);
}

function coldStorageStyle(feature) {
	var color = '#888';
	appendToLegend('Cold Storage', color);
	return licensePointStyle(color);
}

function onEachLicensePointFeature(feature, layer) {
	layer.on({
		click: licensePointClicked
	});
}

function licensePointClicked(e) {
	var props = e.target.feature.properties;
	var type = props.Type;
	var name = props.Name;
	var loc1 = props.LocAdd1;
	var loc2 = props.LocAdd2;
	var city = props.LocCity;
	var state = props.LocState;
	var zip = props.LocZip;
	var popupHtml = '<h3>' + type + '</h3>\
	<h4>' + name + '</h4>\
	' + loc1 + (loc2===null?"":'<br/>' + loc2) + '<br />\
	' + city + ', ' + state + '<br />\
	' + zip;
	e.target.bindPopup(popupHtml).openPopup();
}

function loadAdditionalLayers(property, callback) {

	var basemap = {'Base Map': esri};
	var overlays = {'Counties': geojson};

	Stamen_TonerLines = L.tileLayer('http://{s}.tile.stamen.com/toner-lines/{z}/{x}/{y}.png', {
		attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
		subdomains: 'abcd',
		minZoom: 0,
		maxZoom: 20
	}).addTo(map);

	overlays['Roads'] = Stamen_TonerLines;

	if (property.type == 'SmallGrainsandRotationCrops') {
		grain_warehouse_overlay = L.geoJson(grain_warehouses, {
			style: grainWarehouseStyle,
			pointToLayer: function (feature, latlng) {
				return L.circleMarker(latlng, grainWarehouseStyle);
			},
			onEachFeature: onEachLicensePointFeature
		}).addTo(map);

		overlays['Grain Warehouses'] = grain_warehouse_overlay;
	}

	if (property.type == 'LivestockPoultry' && property.code != "chicken") {
		custom_mobile_slaughter_overlay = L.geoJson(custom_mobile_slaughterers, {
			style: custMobileSlaughterStyle,
			pointToLayer: function (feature, latlng) {
				return L.circleMarker(latlng, custMobileSlaughterStyle);
			},
			onEachFeature: onEachLicensePointFeature
		}).addTo(map);

		overlays['Custom Mobile Slaughter'] = custom_mobile_slaughter_overlay;

		custom_stat_slaughter_overlay = L.geoJson(custom_stat_slaughterers, {
			style: custStatSlaughterStyle,
			pointToLayer: function (feature, latlng) {
				return L.circleMarker(latlng, custStatSlaughterStyle);
			},
			onEachFeature: onEachLicensePointFeature
		}).addTo(map);

		overlays['Custom Stationary Slaughter'] = custom_stat_slaughter_overlay;

		custom_meat_processor_overlay = L.geoJson(custom_meat_processors, {
			style: custMeatProcessorStyle,
			pointToLayer: function (feature, latlng) {
				return L.circleMarker(latlng, custMeatProcessorStyle);
			},
			onEachFeature: onEachLicensePointFeature
		}).addTo(map);

		overlays['Custom Meat Processor'] = custom_meat_processor_overlay;

		non_slaughter_processor_overlay = L.geoJson(non_slaughtering_processors, {
			style: nonSlaughterProcessorStyle,
			pointToLayer: function (feature, latlng) {
				return L.circleMarker(latlng, nonSlaughterProcessorStyle);
			},
			onEachFeature: onEachLicensePointFeature
		}).addTo(map);

		overlays['Non-Slaughtering Processor'] = non_slaughter_processor_overlay;

		slaughterhouse_overlay = L.geoJson(slaughterhouses, {
			style: slaughterhouseStyle,
			pointToLayer: function (feature, latlng) {
				return L.circleMarker(latlng, slaughterhouseStyle);
			},
			onEachFeature: onEachLicensePointFeature
		}).addTo(map);

		overlays['Slaughterhouse'] = slaughterhouse_overlay;
	}

	if (property.code == "chicken") {
		poultry_slaughter_overlay = L.geoJson(poultry_rabbit_slaughterers, {
			style: poultrySlaughterhouseStyle,
			pointToLayer: function (feature, latlng) {
				return L.circleMarker(latlng, poultrySlaughterhouseStyle);
			},
			onEachFeature: onEachLicensePointFeature
		}).addTo(map);

		overlays['Poultry Slaughter'] = poultry_slaughter_overlay;
	}

	food_storage_warehouse_overlay = L.geoJson(food_storage_clean, {
		style: foodStorageWarehouseStyle,
		pointToLayer: function (feature, latlng) {
			return L.circleMarker(latlng, foodStorageWarehouseStyle);
		},
		onEachFeature: onEachLicensePointFeature
	}).addTo(map);

	overlays['Food Storage Warehouse'] = food_storage_warehouse_overlay;

	refrigerated_locker_overlay = L.geoJson(refrigerated_lockers, {
		style: refrigeratedLockerStyle,
		pointToLayer: function (feature, latlng) {
			return L.circleMarker(latlng, refrigeratedLockerStyle);
		},
		onEachFeature: onEachLicensePointFeature
	}).addTo(map);

	overlays['Refrigerated Locker Plant'] = refrigerated_locker_overlay;

	cold_storage_overlay = L.geoJson(cold_storage, {
		style: coldStorageStyle,
		pointToLayer: function (feature, latlng) {
			return L.circleMarker(latlng, coldStorageStyle);
		},
		onEachFeature: onEachLicensePointFeature
	}).addTo(map);

	overlays['Cold Storage'] = cold_storage_overlay;


	layer_switcher = L.control.layers(basemap, overlays);

	layer_switcher.setPosition("topleft");

	layer_switcher.addTo(map);

    callback();
}

function appendToLegend(label, color) {
	legend_data[label] = color;
}

function addAdditionalLegends(property){
	var keys = Object.keys(legend_data);
	if (keys.length > 1) {
		var row2 = L.DomUtil.create('div', 'row legend-row');
		var span2 = L.DomUtil.create('div', 'col-md-12');
		var div2 = L.DomUtil.create('div', 'info legend pointlegend');
		div2.innerHTML = '<h4>' + legend_data.name + '</h4>';
		for (var i = 1; i < keys.length; i++) {
			div2.innerHTML += '<i style="background: ' + legend_data[keys[i]] + '; border: solid 1px">&nbsp;&nbsp;&nbsp;&nbsp;</i> ' + keys[i] + '<br />';
		}
		span2.appendChild(div2);
		row2.appendChild(span2);
		$('#filter-container').append(row2);
	}

}