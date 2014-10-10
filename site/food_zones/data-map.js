var data_dir = './food_zones/Data';
var UID_key = 'zone_id';

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
			alert(measure);
	}
	return data_dir + '/' + measure_dir + '/' + type + '_' + code + '.' + format;
}

var types = {
	"br": {
		"name": "Berries",
		"option_attributes": ["name"],
		"options": {
			"br01": {
				"name": "Blackberries & Dewberries"
			},
			"br02": {
				"name": "Blueberries, Tame"
			},
			"br03": {
				"name": "Boysenberries"
			},
			"br04": {
				"name": "Cranberries"
			},
			"br05": {
				"name": "Currants"
			},
			"br06": {
				"name": "Loganberries"
			},
			"br07": {
				"name": "Other Berries"
			},
			"br08": {
				"name": "Raspberries, All"
			},
			"br11": {
				"name": "Strawberries"
			}
		}
	},
	"fc": {
		"name": "Field Crops",
		"option_attributes": ["name", "qty"],
		"options": {
			"fc01": {
				"name": "Austrian Winter Peas",
				"qty": "CWT"
			},
			"fc02": {
				"name": "Barley for Grain",
				"qty": "Bushels"
			},
			"fc03": {
				"name": "Buckwheat",
				"qty": "Bushels"
			},
			"fc04": {
				"name": "Canola",
				"qty": "Pounds"
			},
			"fc05": {
				"name": "Corn for Grain",
				"qty": "Bushels"
			},
			"fc07": {
				"name": "Dry Edible Beans, Excluding Limas",
				"qty": "CWT"
			},
			"fc08": {
				"name": "Dry Edible Peas",
				"qty": "CWT"
			},
			"fc09": {
				"name": "Dry Lima Beans",
				"qty": "CWT"
			},
			"fc10": {
				"name": "Durum Wheat for Grain",
				"qty": "Bushels"
			},
			"fc11": {
				"name": "Emmer and Spelt",
				"qty": "Bushels"
			},
			"fc12": {
				"name": "Flaxseed",
				"qty": "Bushels"
			},
			"fc13": {
				"name": "Lentils",
				"qty": "CWT"
			},
			"fc15": {
				"name": "Oats for Grain",
				"qty": "Bushels"
			},
			"fc16": {
				"name": "Other Spring Wheat for Grain",
				"qty": "Bushels"
			},
			"fc17": {
				"name": "Peanuts for Nuts",
				"qty": "Pounds"
			},
			"fc21": {
				"name": "Rapeseed",
				"qty": "Pounds"
			},
			"fc22": {
				"name": "Rice",
				"qty": "CWT"
			},
			"fc23": {
				"name": "Rye for Grain",
				"qty": "Bushels"
			},
			"fc24": {
				"name": "Safflower",
				"qty": "Pounds"
			},
			"fc25": {
				"name": "Sorghum for Grain",
				"qty": "Bushels"
			},
			"fc26": {
				"name": "Soybeans for Beans",
				"qty": "Bushels"
			},
			"fc27": {
				"name": "Sugarbeets for Seed",
				"qty": "Pounds"
			},
			"fc28": {
				"name": "Sugarbeets for Sugar",
				"qty": "Tons"
			},
			"fc29": {
				"name": "Sunflower Seed, All",
				"qty": "Pounds"
			},
			"fc32": {
				"name": "Triticale",
				"qty": "Bushels"
			},
			"fc35": {
				"name": "Wild Rice",
				"qty": "CWT"
			},
			"fc36": {
				"name": "Winter Wheat for Grain",
				"qty": "Bushels"
			}
		}
	},
	"fs": {
		"name": "Field Seeds",
		"option_attributes": ["name", "qty"],
		"options": {
			"fs01": {
				"name": "Alfalfa Hay",
				"qty": "Tons, Dry"
			},
			"fs02": {
				"name": "Alfalfa Seed",
				"qty": "Pounds"
			},
			"fs08": {
				"name": "Corn for Silage/Greenchop",
				"qty": "Tons"
			},
			"fs11": {
				"name": "Field and Grass Seed Crops, All",
				"qty": null
			},
			"fs14": {
				"name": "Haylage/Greenchop from Alfalfa/Mixtures",
				"qty": "Tons, Green"
			},
			"fs24": {
				"name": "Sorghum for Silage or Greenchop",
				"qty": "Tons"
			},
			"fs30": {
				"name": "Wild Hay",
				"qty": "Tons, Dry"
			}
		}
	},
	"fn": {
		"name": "Fruits & Nuts",
		"option_attributes": ["name"],
		"options": {
			"fn01": {
				"name": "Almonds"
			},
			"fn02": {
				"name": "Apples"
			},
			"fn03": {
				"name": "Apricots"
			},
			"fn04": {
				"name": "Avocados"
			},
			"fn05": {
				"name": "Bananas"
			},
			"fn06": {
				"name": "Cherries, Sweet"
			},
			"fn07": {
				"name": "Cherries, Tart"
			},
			"fn08": {
				"name": "Chestnuts"
			},
			"fn10": {
				"name": "Dates"
			},
			"fn11": {
				"name": "Figs"
			},
			"fn12": {
				"name": "Grapefruit"
			},
			"fn13": {
				"name": "Grapes"
			},
			"fn14": {
				"name": "Guavas"
			},
			"fn15": {
				"name": "Hazelnuts (Filberts)"
			},
			"fn16": {
				"name": "Kiwifruit"
			},
			"fn17": {
				"name": "Kumquats"
			},
			"fn18": {
				"name": "Lemons"
			},
			"fn19": {
				"name": "Limes"
			},
			"fn20": {
				"name": "Macadamia Nuts"
			},
			"fn21": {
				"name": "Mangoes"
			},
			"fn22": {
				"name": "Nectarines"
			},
			"fn25": {
				"name": "Olives"
			},
			"fn26": {
				"name": "Oranges, All"
			},
			"fn32": {
				"name": "Passion Fruit"
			},
			"fn33": {
				"name": "Peaches, All"
			},
			"fn36": {
				"name": "Pears, All"
			},
			"fn39": {
				"name": "Pecans, All"
			},
			"fn42": {
				"name": "Persimmons"
			},
			"fn43": {
				"name": "Pistachios"
			},
			"fn44": {
				"name": "Plums"
			},
			"fn46": {
				"name": "Pluots"
			},
			"fn47": {
				"name": "Pomegranates"
			},
			"fn48": {
				"name": "Prunes"
			},
			"fn49": {
				"name": "Tangelos"
			},
			"fn50": {
				"name": "Tangerines"
			},
			"fn52": {
				"name": "Walnuts, English",
				"qty": ""
			}
		}
	},
	"oc": {
		"name": "Other Crops",
		"option_attributes": ["name", "qty"],
		"options": {
			"oc02": {
				"name": "Dill for Oil",
				"qty": "Pounds"
			},
			"oc03": {
				"name": "Herbs, Dried",
				"qty": "Pounds"
			},
			"oc04": {
				"name": "Hops",
				"qty": "Pounds"
			},
			"oc05": {
				"name": "Jojoba Harvested",
				"qty": "Pounds"
			},
			"oc06": {
				"name": "Mint for Oil, All",
				"qty": "Pounds of Oil"
			}
		}
	},
	"vpm": {
		"name": "Vegetables, Potatoes, & Mellons",
		"option_attributes": ["name"],
		"options": {
			"vp01": {
				"name": "Artichokes, Excluding Jerusalem"
			},
			"vp02": {
				"name": "Asparagus"
			},
			"vp03": {
				"name": "Beans, Green Lima"
			},
			"vp04": {
				"name": "Beans, Snap"
			},
			"vp05": {
				"name": "Beets"
			},
			"vp06": {
				"name": "Broccoli"
			},
			"vp07": {
				"name": "Brussels Sprouts"
			},
			"vp09": {
				"name": "Cabbage, Head"
			},
			"vp11": {
				"name": "Cantaloupes"
			},
			"vp12": {
				"name": "Carrots"
			},
			"vp13": {
				"name": "Cauliflower"
			},
			"vp14": {
				"name": "Celery"
			},
			"vp15": {
				"name": "Chicory"
			},
			"vp16": {
				"name": "Collards"
			},
			"vp17": {
				"name": "Cucumbers and Pickles"
			},
			"vp18": {
				"name": "Daikon"
			},
			"vp19": {
				"name": "Eggplant"
			},
			"vp20": {
				"name": "Escarole and Endive"
			},
			"vp21": {
				"name": "Garlic"
			},
			"vp22": {
				"name": "Ginseng"
			},
			"vp23": {
				"name": "Herbs, Fresh Cut"
			},
			"vp24": {
				"name": "Honeydew Melons"
			},
			"vp25": {
				"name": "Horseradish"
			},
			"vp26": {
				"name": "Kale"
			},
			"vp27": {
				"name": "Lettuce, All"
			},
			"vp31": {
				"name": "Mustard Greens"
			},
			"vp32": {
				"name": "Okra"
			},
			"vp33": {
				"name": "Onions, Dry"
			},
			"vp34": {
				"name": "Onions, Green"
			},
			"vp35": {
				"name": "Parsley"
			},
			"vp36": {
				"name": "Peas, Chinese (Sugar and Snow)"
			},
			"vp37": {
				"name": "Peas, Green (Excluding Southern)"
			},
			"vp38": {
				"name": "Peas, Green Southern Blackeyed/Crowder/Etc"
			},
			"vp39": {
				"name": "Peppers Other than Bell (Including Chile)"
			},
			"vp40": {
				"name": "Peppers, Bell (Excluding Pimientos)"
			},
			"vp41": {
				"name": "Potatoes"
			},
			"vp42": {
				"name": "Pumpkins"
			},
			"vp43": {
				"name": "Radishes"
			},
			"vp44": {
				"name": "Rhubarb"
			},
			"vp45": {
				"name": "Spinach"
			},
			"vp46": {
				"name": "Squash, All"
			},
			"vp49": {
				"name": "Sweet Corn"
			},
			"vp50": {
				"name": "Sweet Potatoes"
			},
			"vp51": {
				"name": "Tomatoes in the Open"
			},
			"vp52": {
				"name": "Turnip Greens"
			},
			"vp53": {
				"name": "Turnips"
			},
			"vp54": {
				"name": "Vegetables, Other"
			},
			"vp55": {
				"name": "Watercress"
			},
			"vp56": {
				"name": "Watermelons"
			}
		}
	}
};

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
			"name": "% area planted in this crop"
		},
		'count': {
			"name": "Total acres of this crop"
		}
	},
	"farms": {
		'density': {
			"name": "Farms per Mi<sup>2</sup> that grow this crop"
		},
		'count': {
			"name": "Total farms"
		}
	},
	"yield": {
		'density': {
			"name": "Units per acre"
		},
		'count': {
			"name": "Total production"
		}
	}
};

function getMeasures(property) {
	var available_measures = measures;
	var m_key;
	for (m_key in measures) {
		available_measures[m_key]['available'] = ($.inArray(property.type + '_' + property.code, files[m_key].options) != -1);
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
			available_types[type_key].options[opt_key]['available'] = ($.inArray(type_key + '_' + opt_key, files[property.measure].options) != -1);
		}
	}
	return available_types;
}

var defaultPrimaryUnit = 'count';
var defaultSecondaryUnit = 'density';

function encodeLayer(measure, type, code, unit) {
	if (unit == 'density' || unit == 'dens') {
		if (measure == 'acres') {
			return "acres_" + type + "_" + code + "_dens";
		}
		if (measure == 'farms') {
			return "farms_" + type + "_" + code + "_dens";
		}
		if (measure == 'yield') {
			return "qnty_" + type + "_" + code + "_dens";
		}
		return 0;
	} else {
		if (measure == 'acres') {
			return "acres_" + type + "_" + code + "_z_ac";
		}
		if (measure == 'farms') {
			return "farms_" + type + "_" + code + "_z_fm";
		}
		if (measure = 'yield') {
			return "qnty_" + type + "_" + code + "_z_qt";
		}
		return 0;
	}
}

function parseLayer(layername) {
	var parts = layername.split("_");
	var ret_val = 0;
	if (parts[0] == "acres"){
		ret_val = {
			"measure": 'acres',
			"type": parts[1],
			"code": parts[2]
		};
	}
	if (parts[0] == "farms"){
		ret_val = {
			"measure": 'farms',
			"type": parts[1],
			"code": parts[2]
		};
	}
	if (parts[0] == "qnty"){
		ret_val = {
			"measure": 'yield',
			"type": parts[1],
			"code": parts[2]
		};
	}
	if (ret_val != 0) {
		if (parts.length < 5) {
			ret_val['unit'] = defaultPrimaryUnit;
		} else {
			ret_val['unit'] = defaultSecondaryUnit;
		}
		ret_val['label'] = false;
	}
	return ret_val;
}

function getDefaultLayer() {
	var measure = "acres";
	var type = "fc";
	var code = "fc01";
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