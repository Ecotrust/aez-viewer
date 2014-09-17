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
			debugger;
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
			"br09": {
				"name": "Raspberries, Black"
			},
			"br10": {
				"name": "Raspberries, Red"
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
			"fc06": {
				"name": "Cotton, All",
				"qty": "Bales"
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
			"fc14": {
				"name": "Mustard Seed",
				"qty": "Pounds"
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
			"fc18": {
				"name": "Pima Cotton",
				"qty": "Bales"
			},
			"fc19": {
				"name": "Popcorn",
				"qty": "Pounds, shelled"
			},
			"fc20": {
				"name": "Proso Millet",
				"qty": "Bushels"
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
			"fc30": {
				"name": "Sunflower Seed, Nonoil Varieties",
				"qty": "Pounds"
			},
			"fc31": {
				"name": "Sunflower Seed, Oil Varieties",
				"qty": "Pounds"
			},
			"fc32": {
				"name": "Triticale",
				"qty": "Bushels"
			},
			"fc33": {
				"name": "Upland Cotton",
				"qty": "Bales"
			},
			"fc34": {
				"name": "Wheat for Grain, All",
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
			"fs03": {
				"name": "All Haylage/Silage/Greenchop",
				"qty": "Tons, Green"
			},
			"fs04": {
				"name": "Bentgrass Seed",
				"qty": "Pounds"
			},
			"fs05": {
				"name": "Bermuda Grass Seed",
				"qty": "Pounds"
			},
			"fs06": {
				"name": "Birdsfoot Trefoil Seed",
				"qty": "Pounds"
			},
			"fs07": {
				"name": "Bromegrass Seed",
				"qty": "Pounds"
			},
			"fs08": {
				"name": "Corn for Silage/Greenchop",
				"qty": "Tons"
			},
			"fs09": {
				"name": "Crimson Clover Seed",
				"qty": "Pounds"
			},
			"fs10": {
				"name": "Fescue Seed",
				"qty": "Pounds"
			},
			"fs11": {
				"name": "Field and Grass Seed Crops, All",
				"qty": null
			},
			"fs12": {
				"name": "Forage Land for All Hay/Haylage/Silage/Greenchop",
				"qty": "Tons, Dry Equivalent"
			},
			"fs13": {
				"name": "Hay: All Hay including Alfalfa/Tame/Small Grain/Wild",
				"qty": "Tons, Dry Equivalent"
			},
			"fs14": {
				"name": "Haylage/Greenchop from Alfalfa/Mixtures",
				"qty": "Tons, Green"
			},
			"fs15": {
				"name": "Kentucky Bluegrass Seed",
				"qty": "Pounds"
			},
			"fs16": {
				"name": "Orchardgrass Seed",
				"qty": "Pounds"
			},
			"fs17": {
				"name": "Ladino Clover Seed",
				"qty": "Pounds"
			},
			"fs18": {
				"name": "Other Field and Grass Seed Crops",
				"qty": "Pounds"
			},
			"fs19": {
				"name": "Other Haylage, Grass Silage, and Greenchop",
				"qty": "Tons, Green"
			},
			"fs20": {
				"name": "Other Tame Hay",
				"qty": "Tons, Dry"
			},
			"fs21": {
				"name": "Red Clover Seed",
				"qty": "Pounds"
			},
			"fs22": {
				"name": "Ryegrass Seed",
				"qty": "Pounds"
			},
			"fs23": {
				"name": "Small Grain Hay",
				"qty": "Tons, Dry"
			},
			"fs24": {
				"name": "Sorghum for Silage or Greenchop",
				"qty": "Tons"
			},
			"fs25": {
				"name": "Sudangrass Seed",
				"qty": "Pounds"
			},
			"fs26": {
				"name": "Timothy Seed",
				"qty": "Pounds"
			},
			"fs27": {
				"name": "Vetch Seed",
				"qty": "Pounds"
			},
			"fs28": {
				"name": "Wheatgrass Seed",
				"qty": "Pounds"
			},
			"fs29": {
				"name": "White Clover Seed",
				"qty": "Pounds"
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
			"fn09": {
				"name": "Citrus Fruit, All"
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
			"fn23": {
				"name": "Noncitrus, All"
			},
			"fn24": {
				"name": "Nuts, All"
			},
			"fn25": {
				"name": "Olives"
			},
			"fn26": {
				"name": "Oranges, All"
			},
			"fn27": {
				"name": "Other Citrus Fruit"
			},
			"fn28": {
				"name": "Other Noncitrus Fruit"
			},
			"fn29": {
				"name": "Other Nuts"
			},
			"fn30": {
				"name": "Other Oranges"
			},
			"fn31": {
				"name": "Papayas"
			},
			"fn32": {
				"name": "Passion Fruit"
			},
			"fn33": {
				"name": "Peaches, All"
			},
			"fn34": {
				"name": "Peaches, Clingstone"
			},
			"fn35": {
				"name": "Peaches, Freestone"
			},
			"fn36": {
				"name": "Pears, All"
			},
			"fn37": {
				"name": "Pears, Bartlett"
			},
			"fn38": {
				"name": "Pears, Other"
			},
			"fn39": {
				"name": "Pecans, All"
			},
			"fn40": {
				"name": "Pecans, Improved"
			},
			"fn41": {
				"name": "Pecans, Native and Seedling"
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
			"fn45": {
				"name": "Plums and Prunes"
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
			"fn51": {
				"name": "Valencia Oranges"
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
			"oc01": {
				"name": "Crambe",
				"qty": "Pounds"
			},
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
			},
			"oc07": {
				"name": "Mint for Oil, Peppermint",
				"qty": "Pounds of Oil"
			},
			"oc08": {
				"name": "Mint for Oil, Spearmint",
				"qty": "Pounds of Oil"
			},
			"oc09": {
				"name": "Other Crops",
				"qty": null
			},
			"oc10": {
				"name": "Sesame",
				"qty": "Pounds"
			},
			"oc11": {
				"name": "Sweet Corn for Seed",
				"qty": "Pounds"
			},
			"oc12": {
				"name": "Taro",
				"qty": "Pounds"
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
			"vp08": {
				"name": "Cabbage, Chinese"
			},
			"vp09": {
				"name": "Cabbage, Head"
			},
			"vp10": {
				"name": "Cabbage, Mustard"
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
			"vp28": {
				"name": "Lettuce, Head"
			},
			"vp29": {
				"name": "Lettuce, Leaf"
			},
			"vp30": {
				"name": "Lettuce, Romaine"
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
			"vp47": {
				"name": "Squash, Summer"
			},
			"vp48": {
				"name": "Squash, Winter"
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
	},
	"mt": {
		"name": "Livestock",
		"option_attributes": ["name", "qty"],
		"options": {
			"cattle": {
				"name": "Cattle",
				"qty": "Head"
			},
			"chicken": {
				"name": "Chicken",
				"qty": "Head"
			},
			"goats": {
				"name": "Goats",
				"qty": "Head"
			},
			"hogs": {
				"name": "Hogs",
				"qty": "Head"
			},
			"sheep": {
				"name": "Sheep",
				"qty": "Head"
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
				label = 'Farms Per Acre';
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
			break;
		case 'farms':
			return false;
			break;
		case 'yield':
			return true;
			break;
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
		"name": "% of Area"
	},
	"farms": {
		"name": "Farms Per Acre"
	},
	"yield": {
		"name": "Yield Per Acre"
	}
}

var popUpDescriptions = {
	"acres": {
		'density': {
			"name": "% area producing this"
		},
		'count': {
			"name": "Total acres"
		}
	},
	"farms": {
		'density': {
			"name": "Farms per acre that produce this"
		},
		'count': {
			"name": "Total farms"
		}
	},
	"yield": {
		'density': {
			"name": "Yield per acre"
		},
		'count': {
			"name": "Total yield"
		}
	}
}

function getMeasures(property) {
	var available_measures = measures;
	for (m_key in measures){
		available_measures[m_key]['available'] = ($.inArray(property.type + '_' + property.code, files[m_key].options) != -1);
	}
	return available_measures;
}

function getTypes(property){
	var available_types = {};
	for (type_key in types){
		var type = types[type_key];
		available_types[type_key] = types[type_key];
		for (opt_key in type.options){
			available_types[type_key].options[opt_key]['available'] = ($.inArray(type_key + '_' + opt_key, files[property.measure].options) != -1);
		}
	}
	return available_types;
}

var defaultPrimaryUnit = 'density';
var defaultSecondaryUnit = 'count';

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
	return properties[key];

}