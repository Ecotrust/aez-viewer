import json, os, csv

data_dir = 'Data'
measurements = ['acres', 'farms', 'qnty']
# units = ['ac', 'Fm', 'Qt', 'dens']
# parsed_code_start_index = 1     ## [measure]_[type]_[typecode]_[(?)z_][unit]
# parsed_code_end_index = 2       ## code = type + '_' + typecode
uid_prop = 'zone_id'

json_data = open('food_counties.geojson')
data = json.load(json_data)

for measure in measurements:
    if not os.path.exists(data_dir + '/' + measure):
        os.makedirs(data_dir + '/' + measure)

codes = {}
count = 0
for feature in data['features']:
    uid = feature['properties'][uid_prop]
    for prop_key in feature['properties']:
        parsed_prop = prop_key.split("_")
        measurement = parsed_prop[0]
        try:
            prop_name = parsed_prop[1] + '_' + parsed_prop[2]
        except:
            prop_name = 'none'
        prop_unit = parsed_prop[-1]
        if measurement in measurements:
            if not measurement in codes.keys():
                codes[measurement] = {}
            if not prop_name in codes[measurement].keys():
                codes[measurement][prop_name] = {}
            if not uid in codes[measurement][prop_name].keys():
                codes[measurement][prop_name][uid] = {}
            codes[measurement][prop_name][uid][prop_unit] = feature['properties'][prop_key]

for measure in codes.keys():
    for code in codes[measure].keys():
        file = open(data_dir + '/' + measure + '/' + code + '.json', 'w+')
        file.write(json.dumps(codes[measure][code]));
        file.close()
    # with open(data_dir + '/' + measure + '/' + code + '.csv', 'wb') as csvfile:
    #     zonewriter = csv.writer(csvfile, delimiter=',',quotechar='|', quoting=csv.QUOTE_MINIMAL)
    #     # zonewriter.writerow(['IsoZone','Value']);
    #     for entry_key in codes[measure][code].keys():
    #         zonewriter.writerow([int(entry_key), codes[measure][code][entry_key]])