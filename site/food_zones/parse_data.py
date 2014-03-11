import json, os

data_dir = 'Data'
measurements = ['Acres', 'Farms', 'Qnty']
units = ['ac', 'Fm', 'Qt', 'dens']
# parsed_code_start_index = 1     ## [measure]_[type]_[typecode]_[(?)z_][unit]
# parsed_code_end_index = 2       ## code = type + '_' + typecode
uid_prop = 'IsoZone'

json_data = open('food_zones_all.geojson')
data = json.load(json_data)

for measure in measurements:
    if not os.path.exists(data_dir + '/' + measure):
        os.makedirs(data_dir + '/' + measure)
    for unit in units:
        if not os.path.exists(data_dir + '/' + measure + '/' + unit):
            os.makedirs(data_dir + '/' + measure + '/' + unit)

codes = {}
for feature in data['features']:
    uid = feature['properties'][uid_prop]
    for prop_key in feature['properties']:
        parsed_prop = prop_key.split("_")
        measurement = parsed_prop[0]
        prop_unit = parsed_prop[-1]
        if measurement in measurements:
            if prop_unit in units:
                if not measurement in codes.keys():
                    codes[measurement] = {}
                if not prop_unit in codes[measurement].keys():
                    codes[measurement][prop_unit] = {}
                if not prop_key in codes[measurement][prop_unit].keys():
                    codes[measurement][prop_unit][prop_key] = {}
                codes[measurement][prop_unit][prop_key][str(uid)] = feature['properties'][prop_key]

for measure in codes.keys():
    for prop in codes[measure].keys():
        for code in codes[measure][prop].keys():
            file = open(data_dir + '/' + measure + '/' + prop + '/' + code + '.json', 'w+')
            file.write(str(codes[measure][prop][code]));
            file.close()
