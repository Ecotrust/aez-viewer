import os
# importing pyspatialite
from pyspatialite import dbapi2 as db

food_zone_out_name = 'food_zones.geojson'
food_zone_out = './%s' % food_zone_out_name
feature_data_out_name = 'featuresData.js'
feature_data_out = './%s' % feature_data_out_name

# creating/connecting the test_db
conn = db.connect('food_zones_all.sqlite')

# creating a Cursor
cur = conn.cursor()

try:
    print 'Dropping old table...'
    cur.execute('DROP TABLE food_zones;')
except:
    pass

try:
    cur.execute('DROP TABLE feature_data;')
except:
    pass

measures = [
    {
        "name": 'acres',
        "prefix": 'acres_',
        "postfix": '_z_ac',
        "types": ['br','fc','fn','fs','oc','vpm']
    },
    {
        "name": 'farms',
        "prefix": 'farms_',
        "postfix": '_z_fm',
        "types": ['br','fc','fn','fs','oc','vpm']
    },
    {
        "name": 'yield',
        "prefix": 'qnty_',
        "postfix": '_z_qt',
        "types": ['fc','fn','fs','oc','vpm']
    }
]

types = {
    'br': {
        'label': 'br_br',
        'ids': ['01','02','03','04','05','06','07','08','09','10','11']
    },
    'fc': {
        'label': 'fc_fc',
        'ids': ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36']
    },
    'fn': {
        'label': 'fn_fn',
        'ids': ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','25','26','28','29','30','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52']
    },
    'fs': {
        'label': 'fs_fs',
        'ids': ['01','02','03','04','05','07','08','09','10','11','14','15','16','20','21','22','23','24','25','27','29','30']
    },
    'oc': {
        'label': 'oc_oc',
        'ids': ['02','03','04','05','06','07','08']
    },
    'vpm': {
        'label': 'vpm_vp',
        'ids': ['01','02','03','04','05','06','07','08','09','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56']
    }
}

print 'Creating new table...'
query = "CREATE TABLE 'food_zones' AS \n\
SELECT \n\
    subzone_lookup_iso_maj3_27 AS zone_id, \n\
    CastToMultiPolygon(Collect(GEOMETRY)) AS GEOMETRY, \n\
    Sum(acres_fc_sum_f_area) AS area_in_acres, \n\
    Sum(acres_br_count) AS pixels, \n\
    Count(id) AS poly_count"

for measure in measures:
    for type in measure['types']:
        label = types[type]['label']
        for id in types[type]['ids']:
            raw_header = "%s%s%s%s" % (measure['prefix'], label, id, measure['postfix'])
            raw_column = "Sum(%s) AS %s" % (raw_header, raw_header)
            dens_column = "Sum(%s)/Sum(acres_fc_sum_f_area) AS %s%s%s_dens" % (raw_header, measure['prefix'], label, id)
            query += ", \n\
    %s, \n\
    %s" % (raw_column, dens_column)

query += " \n\
FROM food_zones_all \n\
GROUP BY subzone_lookup_iso_maj3_27;"

cur.execute(query)

print 'Adding geometry column...'
query = "SELECT RecoverGeometryColumn('food_zones', 'GEOMETRY', 4326, 'MULTIPOLYGON')"
cur.execute(query)

conn.commit()

print 'Creating featureData table'

query = "CREATE TABLE 'feature_data' AS \n\
SELECT \n\
    zone_id, \n\
    GEOMETRY, \n\
    area_in_acres, \n\
    pixels, \n\
    poly_count \n\
FROM food_zones;"

cur.execute(query)

print 'Adding geometry column...'
query = "SELECT RecoverGeometryColumn('feature_data', 'GEOMETRY', 4326, 'MULTIPOLYGON')"

cur.execute(query)
conn.commit()

if os.path.isfile(feature_data_out):
    os.remove(feature_data_out)
os.system('ogr2ogr -f "GEOJSON" %s food_zones_all.sqlite feature_data' % feature_data_out_name)

query = 'DROP TABLE feature_data;'
cur.execute(query)
conn.commit()

feature_data_assignment = 'var zoneData = '
with open(feature_data_out, 'r+') as f:
    old = f.read()
    f.seek(0)
    f.write(feature_data_assignment + old + ";")
f.close()

conn.close()

print 'Creating new table complete\n\n\n'

print 'Writing food zone table to geojson'

if os.path.isfile(food_zone_out):
    os.remove(food_zone_out)
os.system('ogr2ogr -f "GEOJSON" %s food_zones_all.sqlite food_zones' % food_zone_out_name)

print 'Creating custom settings...'

content = 'var files = {\n'
for measure in measures:
    content += '    "%s": {\n\
        "options": [\n' % measure['name']
    for type in measure['types']:
        for id in types[type]['ids']:
            content += '            "%s%s",\n' % (types[type]['label'], id)
    content += '        ]\n\
    },\n'
content += '}'

file = open('data-map-gen.js', 'w+')
file.write(content)
file.close()

print 'Complete.'
quit()