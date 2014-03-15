var data_dir = 'food_zones/Data';
var UID_key = 'IsoZone';

function getUnitDir(measure, unit) {
	if (unit == 'dens') {
		return 'dens';
	} else {
		if (measure == 'acres'){
			return 'ac';
		} else if (measure == 'farms') {
			return 'Fm';
		} else if (measure == 'yield') {
			return 'Qt';
		} else {
			alert('getUnitDir - measure: ' + measure + '; unit: ' + unit);
			return false;
		}
	}
}

function getAjaxLocation(measure, type, code, unit, format){
	var measure_dir;
	switch(measure) {
		case 'acres':
			measure_dir = 'Acres';
			break;
		case 'farms':
			measure_dir = 'Farms';
			break;
		case 'yield':
			measure_dir = 'Qnty';
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
			"BR01": {
				"name": "Blackberries & Dewberries"
			},
			"BR02": {
				"name": "Blueberries, Tame"
			},
			"BR03": {
				"name": "Boysenberries"
			},
			"BR04": {
				"name": "Cranberries"
			},
			"BR05": {
				"name": "Currants"
			},
			"BR06": {
				"name": "Loganberries"
			},
			"BR07": {
				"name": "Other Berries"
			},
			"BR08": {
				"name": "Raspberries, All"
			},
			"BR09": {
				"name": "Raspberries, Black"
			},
			"BR10": {
				"name": "Raspberries, Red"
			},
			"BR11": {
				"name": "Strawberries"
			}
		}
	},
	"fc": {
		"name": "Field Crops",
		"option_attributes": ["name", "qty"],
		"options": {
			"FC01": {
				"name": "Austrian Winter Peas",
				"qty": "CWT"
			},
			"FC02": {
				"name": "Barley for Grain",
				"qty": "Bushels"
			},
			"FC03": {
				"name": "Buckwheat",
				"qty": "Bushels"
			},
			"FC04": {
				"name": "Canola",
				"qty": "Pounds"
			},
			"FC05": {
				"name": "Corn for Grain",
				"qty": "Bushels"
			},
			"FC06": {
				"name": "Cotton, All",
				"qty": "Bales"
			},
			"FC07": {
				"name": "Dry Edible Beans, Excluding Limas",
				"qty": "CWT"
			},
			"FC08": {
				"name": "Dry Edible Peas",
				"qty": "CWT"
			},
			"FC09": {
				"name": "Dry Lima Beans",
				"qty": "CWT"
			},
			"FC10": {
				"name": "Durum Wheat for Grain",
				"qty": "Bushels"
			},
			"FC11": {
				"name": "Emmer and Spelt",
				"qty": "Bushels"
			},
			"FC12": {
				"name": "Flaxseed",
				"qty": "Bushels"
			},
			"FC13": {
				"name": "Lentils",
				"qty": "CWT"
			},
			"FC14": {
				"name": "Mustard Seed",
				"qty": "Pounds"
			},
			"FC15": {
				"name": "Oats for Grain",
				"qty": "Bushels"
			},
			"FC16": {
				"name": "Other Spring Wheat for Grain",
				"qty": "Bushels"
			},
			"FC17": {
				"name": "Peanuts for Nuts",
				"qty": "Pounds"
			},
			"FC18": {
				"name": "Pima Cotton",
				"qty": "Bales"
			},
			"FC19": {
				"name": "Popcorn",
				"qty": "Pounds, shelled"
			},
			"FC20": {
				"name": "Proso Millet",
				"qty": "Bushels"
			},
			"FC21": {
				"name": "Rapeseed",
				"qty": "Pounds"
			},
			"FC22": {
				"name": "Rice",
				"qty": "CWT"
			},
			"FC23": {
				"name": "Rye for Grain",
				"qty": "Bushels"
			},
			"FC24": {
				"name": "Safflower",
				"qty": "Pounds"
			},
			"FC25": {
				"name": "Sorghum for Grain",
				"qty": "Bushels"
			},
			"FC26": {
				"name": "Soybeans for Beans",
				"qty": "Bushels"
			},
			"FC27": {
				"name": "Sugarbeets for Seed",
				"qty": "Pounds"
			},
			"FC28": {
				"name": "Sugarbeets for Sugar",
				"qty": "Tons"
			},
			"FC29": {
				"name": "Sunflower Seed, All",
				"qty": "Pounds"
			},
			"FC30": {
				"name": "Sunflower Seed, Nonoil Varieties",
				"qty": "Pounds"
			},
			"FC31": {
				"name": "Sunflower Seed, Oil Varieties",
				"qty": "Pounds"
			},
			"FC32": {
				"name": "Triticale",
				"qty": "Bushels"
			},
			"FC33": {
				"name": "Upland Cotton",
				"qty": "Bales"
			},
			"FC34": {
				"name": "Wheat for Grain, All",
				"qty": "Bushels"
			},
			"FC35": {
				"name": "Wild Rice",
				"qty": "CWT"
			},
			"FC36": {
				"name": "Winter Wheat for Grain",
				"qty": "Bushels"
			}
		}
	},
	"fs": {
		"name": "Field Seeds",
		"option_attributes": ["name", "qty"],
		"options": {
			"FS01": {
				"name": "Alfalfa Hay",
				"qty": "Tons, Dry"
			},
			"FS02": {
				"name": "Alfalfa Seed",
				"qty": "Pounds"
			},
			"FS03": {
				"name": "All Haylage/Silage/Greenchop",
				"qty": "Tons, Green"
			},
			"FS04": {
				"name": "Bentgrass Seed",
				"qty": "Pounds"
			},
			"FS05": {
				"name": "Bermuda Grass Seed",
				"qty": "Pounds"
			},
			"FS06": {
				"name": "Birdsfoot Trefoil Seed",
				"qty": "Pounds"
			},
			"FS07": {
				"name": "Bromegrass Seed",
				"qty": "Pounds"
			},
			"FS08": {
				"name": "Corn for Silage/Greenchop",
				"qty": "Tons"
			},
			"FS09": {
				"name": "Crimson Clover Seed",
				"qty": "Pounds"
			},
			"FS10": {
				"name": "Fescue Seed",
				"qty": "Pounds"
			},
			"FS11": {
				"name": "Field and Grass Seed Crops, All",
				"qty": null
			},
			"FS12": {
				"name": "Forage Land for All Hay/Haylage/Silage/Greenchop",
				"qty": "Tons, Dry Equivalent"
			},
			"FS13": {
				"name": "Hay: All Hay including Alfalfa/Tame/Small Grain/Wild",
				"qty": "Tons, Dry Equivalent"
			},
			"FS14": {
				"name": "Haylage/Greenchop from Alfalfa/Mixtures",
				"qty": "Tons, Green"
			},
			"FS15": {
				"name": "Kentucky Bluegrass Seed",
				"qty": "Pounds"
			},
			"FS16": {
				"name": "Orchardgrass Seed",
				"qty": "Pounds"
			},
			"FS17": {
				"name": "Ladino Clover Seed",
				"qty": "Pounds"
			},
			"FS18": {
				"name": "Other Field and Grass Seed Crops",
				"qty": "Pounds"
			},
			"FS19": {
				"name": "Other Haylage, Grass Silage, and Greenchop",
				"qty": "Tons, Green"
			},
			"FS20": {
				"name": "Other Tame Hay",
				"qty": "Tons, Dry"
			},
			"FS21": {
				"name": "Red Clover Seed",
				"qty": "Pounds"
			},
			"FS22": {
				"name": "Ryegrass Seed",
				"qty": "Pounds"
			},
			"FS23": {
				"name": "Small Grain Hay",
				"qty": "Tons, Dry"
			},
			"FS24": {
				"name": "Sorghum for Silage or Greenchop",
				"qty": "Tons"
			},
			"FS25": {
				"name": "Sudangrass Seed",
				"qty": "Pounds"
			},
			"FS26": {
				"name": "Timothy Seed",
				"qty": "Pounds"
			},
			"FS27": {
				"name": "Vetch Seed",
				"qty": "Pounds"
			},
			"FS28": {
				"name": "Wheatgrass Seed",
				"qty": "Pounds"
			},
			"FS29": {
				"name": "White Clover Seed",
				"qty": "Pounds"
			},
			"FS30": {
				"name": "Wild Hay",
				"qty": "Tons, Dry"
			}
		}
	},
	"fn": {
		"name": "Fruits & Nuts",
		"option_attributes": ["name"],
		"options": {
			"FN01": {
				"name": "Almonds"
			},
			"FN02": {
				"name": "Apples"
			},
			"FN03": {
				"name": "Apricots"
			},
			"FN04": {
				"name": "Avocados"
			},
			"FN05": {
				"name": "Bananas"
			},
			"FN06": {
				"name": "Cherries, Sweet"
			},
			"FN07": {
				"name": "Cherries, Tart"
			},
			"FN08": {
				"name": "Chestnuts"
			},
			"FN09": {
				"name": "Citrus Fruit, All"
			},
			"FN10": {
				"name": "Dates"
			},
			"FN11": {
				"name": "Figs"
			},
			"FN12": {
				"name": "Grapefruit"
			},
			"FN13": {
				"name": "Grapes"
			},
			"FN14": {
				"name": "Guavas"
			},
			"FN15": {
				"name": "Hazelnuts (Filberts)"
			},
			"FN16": {
				"name": "Kiwifruit"
			},
			"FN17": {
				"name": "Kumquats"
			},
			"FN18": {
				"name": "Lemons"
			},
			"FN19": {
				"name": "Limes"
			},
			"FN20": {
				"name": "Macadamia Nuts"
			},
			"FN21": {
				"name": "Mangoes"
			},
			"FN22": {
				"name": "Nectarines"
			},
			"FN23": {
				"name": "Noncitrus, All"
			},
			"FN24": {
				"name": "Nuts, All"
			},
			"FN25": {
				"name": "Olives"
			},
			"FN26": {
				"name": "Oranges, All"
			},
			"FN27": {
				"name": "Other Citrus Fruit"
			},
			"FN28": {
				"name": "Other Noncitrus Fruit"
			},
			"FN29": {
				"name": "Other Nuts"
			},
			"FN30": {
				"name": "Other Oranges"
			},
			"FN31": {
				"name": "Papayas"
			},
			"FN32": {
				"name": "Passion Fruit"
			},
			"FN33": {
				"name": "Peaches, All"
			},
			"FN34": {
				"name": "Peaches, Clingstone"
			},
			"FN35": {
				"name": "Peaches, Freestone"
			},
			"FN36": {
				"name": "Pears, All"
			},
			"FN37": {
				"name": "Pears, Bartlett"
			},
			"FN38": {
				"name": "Pears, Other"
			},
			"FN39": {
				"name": "Pecans, All"
			},
			"FN40": {
				"name": "Pecans, Improved"
			},
			"FN41": {
				"name": "Pecans, Native and Seedling"
			},
			"FN42": {
				"name": "Persimmons"
			},
			"FN43": {
				"name": "Pistachios"
			},
			"FN44": {
				"name": "Plums"
			},
			"FN45": {
				"name": "Plums and Prunes"
			},
			"FN46": {
				"name": "Pluots"
			},
			"FN47": {
				"name": "Pomegranates"
			},
			"FN48": {
				"name": "Prunes"
			},
			"FN49": {
				"name": "Tangelos"
			},
			"FN50": {
				"name": "Tangerines"
			},
			"FN51": {
				"name": "Valencia Oranges"
			},
			"FN52": {
				"name": "Walnuts, English",
				"qty": ""
			}
		}
	},
	"oc": {
		"name": "Other Crops",
		"option_attributes": ["name", "qty"],
		"options": {
			"OC01": {
				"name": "Crambe",
				"qty": "Pounds"
			},
			"OC02": {
				"name": "Dill for Oil",
				"qty": "Pounds"
			},
			"OC03": {
				"name": "Herbs, Dried",
				"qty": "Pounds"
			},
			"OC04": {
				"name": "Hops",
				"qty": "Pounds"
			},
			"OC05": {
				"name": "Jojoba Harvested",
				"qty": "Pounds"
			},
			"OC06": {
				"name": "Mint for Oil, All",
				"qty": "Pounds of Oil"
			},
			"OC07": {
				"name": "Mint for Oil, Peppermint",
				"qty": "Pounds of Oil"
			},
			"OC08": {
				"name": "Mint for Oil, Spearmint",
				"qty": "Pounds of Oil"
			},
			"OC09": {
				"name": "Other Crops",
				"qty": null
			},
			"OC10": {
				"name": "Sesame",
				"qty": "Pounds"
			},
			"OC11": {
				"name": "Sweet Corn for Seed",
				"qty": "Pounds"
			},
			"OC12": {
				"name": "Taro",
				"qty": "Pounds"
			}
		}
	},
	"vpm": {
		"name": "Vegetables, Potatoes, & Mellons",
		"option_attributes": ["name"],
		"options": {
			"VP01": {
				"name": "Artichokes, Excluding Jerusalem"
			},
			"VP02": {
				"name": "Asparagus"
			},
			"VP03": {
				"name": "Beans, Green Lima"
			},
			"VP04": {
				"name": "Beans, Snap"
			},
			"VP05": {
				"name": "Beets"
			},
			"VP06": {
				"name": "Broccoli"
			},
			"VP07": {
				"name": "Brussels Sprouts"
			},
			"VP08": {
				"name": "Cabbage, Chinese"
			},
			"VP09": {
				"name": "Cabbage, Head"
			},
			"VP10": {
				"name": "Cabbage, Mustard"
			},
			"VP11": {
				"name": "Cantaloupes"
			},
			"VP12": {
				"name": "Carrots"
			},
			"VP13": {
				"name": "Cauliflower"
			},
			"VP14": {
				"name": "Celery"
			},
			"VP15": {
				"name": "Chicory"
			},
			"VP16": {
				"name": "Collards"
			},
			"VP17": {
				"name": "Cucumbers and Pickles"
			},
			"VP18": {
				"name": "Daikon"
			},
			"VP19": {
				"name": "Eggplant"
			},
			"VP20": {
				"name": "Escarole and Endive"
			},
			"VP21": {
				"name": "Garlic"
			},
			"VP22": {
				"name": "Ginseng"
			},
			"VP23": {
				"name": "Herbs, Fresh Cut"
			},
			"VP24": {
				"name": "Honeydew Melons"
			},
			"VP25": {
				"name": "Horseradish"
			},
			"VP26": {
				"name": "Kale"
			},
			"VP27": {
				"name": "Lettuce, All"
			},
			"VP28": {
				"name": "Lettuce, Head"
			},
			"VP29": {
				"name": "Lettuce, Leaf"
			},
			"VP30": {
				"name": "Lettuce, Romaine"
			},
			"VP31": {
				"name": "Mustard Greens"
			},
			"VP32": {
				"name": "Okra"
			},
			"VP33": {
				"name": "Onions, Dry"
			},
			"VP34": {
				"name": "Onions, Green"
			},
			"VP35": {
				"name": "Parsley"
			},
			"VP36": {
				"name": "Peas, Chinese (Sugar and Snow)"
			},
			"VP37": {
				"name": "Peas, Green (Excluding Southern)"
			},
			"VP38": {
				"name": "Peas, Green Southern Blackeyed/Crowder/Etc"
			},
			"VP39": {
				"name": "Peppers Other than Bell (Including Chile)"
			},
			"VP40": {
				"name": "Peppers, Bell (Excluding Pimientos)"
			},
			"VP41": {
				"name": "Potatoes"
			},
			"VP42": {
				"name": "Pumpkins"
			},
			"VP43": {
				"name": "Radishes"
			},
			"VP44": {
				"name": "Rhubarb"
			},
			"VP45": {
				"name": "Spinach"
			},
			"VP46": {
				"name": "Squash, All"
			},
			"VP47": {
				"name": "Squash, Summer"
			},
			"VP48": {
				"name": "Squash, Winter"
			},
			"VP49": {
				"name": "Sweet Corn"
			},
			"VP50": {
				"name": "Sweet Potatoes"
			},
			"VP51": {
				"name": "Tomatoes in the Open"
			},
			"VP52": {
				"name": "Turnip Greens"
			},
			"VP53": {
				"name": "Turnips"
			},
			"VP54": {
				"name": "Vegetables, Other"
			},
			"VP55": {
				"name": "Watercress"
			},
			"VP56": {
				"name": "Watermelons"
			}
		}
	}
};

var files = {
	"acres": {
		"options": [
			"br_BR01",
			"fc_FC08",
			"fc_FC34",
			"fn_FN22",
			"fn_FN46",
			"fs_FS13",
			"oc_OC07",
			"vpm_VP12",
			"vpm_VP40",
			"br_BR02",
			"fc_FC09",
			"fc_FC35",
			"fn_FN23",
			"fn_FN47",
			"fs_FS14",
			"oc_OC08",
			"vpm_VP13",
			"vpm_VP41",
			"br_BR03",
			"fc_FC10",
			"fc_FC36",
			"fn_FN24",
			"fn_FN48",
			"fs_FS15",
			"oc_OC09",
			"vpm_VP14",
			"vpm_VP42",
			"br_BR04",
			"fc_FC13",
			"fc_Sum",
			"fn_FN25",
			"fn_FN49",
			"fs_FS16",
			"oc_OC11",
			"vpm_VP17",
			"vpm_VP44",
			"br_BR08",
			"fc_FC14",
			"fc_VALUE",
			"fn_FN26",
			"fn_FN50",
			"fs_FS18",
			"oc_Sum",
			"vpm_VP19",
			"vpm_VP45",
			"br_BR09",
			"fc_FC15",
			"fn_COUNT",
			"fn_FN28",
			"fn_FN51",
			"fs_FS19",
			"oc_VALUE",
			"vpm_VP20",
			"vpm_VP46",
			"br_BR10",
			"fc_FC16",
			"fn_FN01",
			"fn_FN30",
			"fn_FN52",
			"fs_FS20",
			"vpm_COUNT",
			"vpm_VP21",
			"vpm_VP47",
			"br_BR11",
			"fc_FC18",
			"fn_FN02",
			"fn_FN33",
			"fn_Sum",
			"fs_FS21",
			"vpm_Sum",
			"vpm_VP23",
			"vpm_VP48",
			"br_COUNT",
			"fc_FC21",
			"fn_FN03",
			"fn_FN34",
			"fn_VALUE",
			"fs_FS22",
			"vpm_VALUE",
			"vpm_VP24",
			"vpm_VP49",
			"br_Sum",
			"fc_FC22",
			"fn_FN04",
			"fn_FN35",
			"fs_COUNT",
			"fs_FS23",
			"vpm_VP01",
			"vpm_VP27",
			"vpm_VP51",
			"br_VALUE",
			"fc_FC24",
			"fn_FN06",
			"fn_FN36",
			"fs_FS01",
			"fs_FS24",
			"vpm_VP02",
			"vpm_VP28",
			"vpm_VP54",
			"fc_COUNT",
			"fc_FC25",
			"fn_FN09",
			"fn_FN37",
			"fs_FS02",
			"fs_FS27",
			"vpm_VP03",
			"vpm_VP29",
			"vpm_VP56",
			"fc_FC01",
			"fc_FC27",
			"fn_FN10",
			"fn_FN38",
			"fs_FS03",
			"fs_FS28",
			"vpm_VP04",
			"vpm_VP30",
			"fc_FC02",
			"fc_FC28",
			"fn_FN11",
			"fn_FN39",
			"fs_FS04",
			"fs_FS30",
			"vpm_VP05",
			"vpm_VP33",
			"fc_FC03",
			"fc_FC29",
			"fn_FN12",
			"fn_FN40",
			"fs_FS08",
			"fs_Sum",
			"vpm_VP06",
			"vpm_VP34",
			"fc_FC04",
			"fc_FC30",
			"fn_FN13",
			"fn_FN42",
			"fs_FS09",
			"fs_VALUE",
			"vpm_VP07",
			"vpm_VP35",
			"fc_FC05",
			"fc_FC31",
			"fn_FN15",
			"fn_FN43",
			"fs_FS10",
			"oc_COUNT",
			"vpm_VP08",
			"vpm_VP36",
			"fc_FC06",
			"fc_FC32",
			"fn_FN16",
			"fn_FN44",
			"fs_FS11",
			"oc_OC04",
			"vpm_VP09",
			"vpm_VP37",
			"fc_FC07",
			"fc_FC33",
			"fn_FN18",
			"fn_FN45",
			"fs_FS12",
			"oc_OC06",
			"vpm_VP11",
			"vpm_VP39"
		]
	},
	"farms": {
		"options": [
			"br_BR01",
			"fc_FC08",
			"fc_FC34",
			"fn_FN22",
			"fn_FN46",
			"fs_FS13",
			"oc_OC07",
			"vpm_VP12",
			"vpm_VP40",
			"br_BR02",
			"fc_FC09",
			"fc_FC35",
			"fn_FN23",
			"fn_FN47",
			"fs_FS14",
			"oc_OC08",
			"vpm_VP13",
			"vpm_VP41",
			"br_BR03",
			"fc_FC10",
			"fc_FC36",
			"fn_FN24",
			"fn_FN48",
			"fs_FS15",
			"oc_OC09",
			"vpm_VP14",
			"vpm_VP42",
			"br_BR04",
			"fc_FC13",
			"fc_Sum",
			"fn_FN25",
			"fn_FN49",
			"fs_FS16",
			"oc_OC11",
			"vpm_VP17",
			"vpm_VP44",
			"br_BR08",
			"fc_FC14",
			"fc_VALUE",
			"fn_FN26",
			"fn_FN50",
			"fs_FS18",
			"oc_Sum",
			"vpm_VP19",
			"vpm_VP45",
			"br_BR09",
			"fc_FC15",
			"fn_COUNT",
			"fn_FN28",
			"fn_FN51",
			"fs_FS19",
			"oc_VALUE",
			"vpm_VP20",
			"vpm_VP46",
			"br_BR10",
			"fc_FC16",
			"fn_FN01",
			"fn_FN30",
			"fn_FN52",
			"fs_FS20",
			"vpm_COUNT",
			"vpm_VP21",
			"vpm_VP47",
			"br_BR11",
			"fc_FC18",
			"fn_FN02",
			"fn_FN33",
			"fn_Sum",
			"fs_FS21",
			"vpm_Sum",
			"vpm_VP23",
			"vpm_VP48",
			"br_COUNT",
			"fc_FC21",
			"fn_FN03",
			"fn_FN34",
			"fn_VALUE",
			"fs_FS22",
			"vpm_VALUE",
			"vpm_VP24",
			"vpm_VP49",
			"br_Sum",
			"fc_FC22",
			"fn_FN04",
			"fn_FN35",
			"fs_COUNT",
			"fs_FS23",
			"vpm_VP01",
			"vpm_VP27",
			"vpm_VP51",
			"br_VALUE",
			"fc_FC24",
			"fn_FN06",
			"fn_FN36",
			"fs_FS01",
			"fs_FS24",
			"vpm_VP02",
			"vpm_VP28",
			"vpm_VP54",
			"fc_COUNT",
			"fc_FC25",
			"fn_FN09",
			"fn_FN37",
			"fs_FS02",
			"fs_FS27",
			"vpm_VP03",
			"vpm_VP29",
			"vpm_VP56",
			"fc_FC01",
			"fc_FC27",
			"fn_FN10",
			"fn_FN38",
			"fs_FS03",
			"fs_FS28",
			"vpm_VP04",
			"vpm_VP30",
			"fc_FC02",
			"fc_FC28",
			"fn_FN11",
			"fn_FN39",
			"fs_FS04",
			"fs_FS30",
			"vpm_VP05",
			"vpm_VP33",
			"fc_FC03",
			"fc_FC29",
			"fn_FN12",
			"fn_FN40",
			"fs_FS08",
			"fs_Sum",
			"vpm_VP06",
			"vpm_VP34",
			"fc_FC04",
			"fc_FC30",
			"fn_FN13",
			"fn_FN42",
			"fs_FS09",
			"fs_VALUE",
			"vpm_VP07",
			"vpm_VP35",
			"fc_FC05",
			"fc_FC31",
			"fn_FN15",
			"fn_FN43",
			"fs_FS10",
			"oc_COUNT",
			"vpm_VP08",
			"vpm_VP36",
			"fc_FC06",
			"fc_FC32",
			"fn_FN16",
			"fn_FN44",
			"fs_FS11",
			"oc_OC04",
			"vpm_VP09",
			"vpm_VP37",
			"fc_FC07",
			"fc_FC33",
			"fn_FN18",
			"fn_FN45",
			"fs_FS12",
			"oc_OC06",
			"vpm_VP11",
			"vpm_VP39"
		]
	},
	"yield": {
		"options": [
			"fc_COUNT",
			"fc_FC08",
			"fc_FC21",
			"fc_FC31",
			"fs_COUNT",
			"fs_FS11",
			"fs_FS20",
			"fs_Sum",
			"oc_OC11",
			"fc_FC01",
			"fc_FC09",
			"fc_FC22",
			"fc_FC32",
			"fs_FS01",
			"fs_FS12",
			"fs_FS21",
			"fs_VALUE",
			"oc_Sum",
			"fc_FC02",
			"fc_FC10",
			"fc_FC24",
			"fc_FC33",
			"fs_FS02",
			"fs_FS13",
			"fs_FS22",
			"oc_COUNT",
			"oc_VALUE",
			"fc_FC03",
			"fc_FC13",
			"fc_FC25",
			"fc_FC34",
			"fs_FS03",
			"fs_FS14",
			"fs_FS23",
			"oc_OC04",
			"fc_FC04",
			"fc_FC14",
			"fc_FC27",
			"fc_FC35",
			"fs_FS04",
			"fs_FS15",
			"fs_FS24",
			"oc_OC06",
			"fc_FC05",
			"fc_FC15",
			"fc_FC28",
			"fc_FC36",
			"fs_FS08",
			"fs_FS16",
			"fs_FS27",
			"oc_OC07",
			"fc_FC06",
			"fc_FC16",
			"fc_FC29",
			"fc_Sum",
			"fs_FS09",
			"fs_FS18",
			"fs_FS28",
			"oc_OC08",
			"fc_FC07",
			"fc_FC18",
			"fc_FC30",
			"fc_VALUE",
			"fs_FS10",
			"fs_FS19",
			"fs_FS30",
			"oc_OC09"
		]
	}
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
	"yield":{
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
		"label":"%"
	},
	"count": {
		"name":"Count",
		"value":"count",
		"label": false
	}
};

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
		"name": "Yield"
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

// var primaryLabel = 'density';
var defaultPrimaryUnit = 'density';
// var secondaryLabel = 'count';
var defaultSecondaryUnit = 'count';

function encodeLayer(measure, type, code, unit) {
	if (unit == 'density' || unit == 'dens') {
		if (measure == 'acres') {
			return "Acres_" + type + "_" + code + "_dens";
		}
		if (measure == 'farms') {
			return "Farms_" + type + "_" + code + "_dens";
		}
		if (measure == 'yield') {
			return "Qnty_" + type + "_" + code + "_dens";
		}
		return 0;
	} else {
		if (measure == 'acres') {
			return "Acres_" + type + "_" + code + "_Z_ac";
		}
		if (measure == 'farms') {
			return "Farms_" + type + "_" + code + "_Z_Fm";
		}
		if (measure == 'yield') {
			return "Qnty_" + type + "_" + code + "_Z_Qt";
		}
		return 0;
	}
}

function parseLayer(layername) {
	var parts = layername.split("_");
	var ret_val = 0;
	if (parts[0] == "Acres"){
		ret_val = {
			"measure": 'acres',
			"type": parts[1],
			"code": parts[2]
		};
	}
	if (parts[0] == "Farms"){
		ret_val = {
			"measure": 'farms',
			"type": parts[1],
			"code": parts[2]
		};
	}
	if (parts[0] == "Qnty"){
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
		if (parts[0] == "Qnty" && types[ret_val.type].options[ret_val.code].hasOwnProperty('qty')) {
			ret_val['label'] = types[ret_val.type].options[ret_val.code].qty;
		} else {
			ret_val['label'] = false;
		}
	}
	return ret_val;
}

function getDefaultLayer() {
	// var measure = Object.keys(dataMap)[0];
	var measure = "acres";
	// var type = Object.keys(dataMap[measure].mapping.type)[0];
	var type = "fc";
	// var code = Object.keys(dataMap[measure].mapping.type[type].options)[0];
	var code = "FC01";
	var unit = defaultPrimaryUnit;

	return {"measure": measure, "type": type, "code": code, "unit": unit};
}

