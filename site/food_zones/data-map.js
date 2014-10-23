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

function loadAdditionalLayers(property, callback) {

	if (property.code == 'chicken') {
		facilities = L.geoJson(facilities_layer, {
			style: facilitiesStyle,
			pointToLayer: function (feature, latlng) {
				return L.circleMarker(latlng, facilitiesStyle);
			},
			onEachFeature: onEachFacilityFeature
		}).addTo(map);
	}

    callback();
}

function addAdditionalLegends(property){
	if (property.code == 'chicken'){
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

}