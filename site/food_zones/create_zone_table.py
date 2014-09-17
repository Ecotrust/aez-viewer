import os
# importing pyspatialite
from pyspatialite import dbapi2 as db

food_zone_out_name = 'food_counties.geojson'
food_zone_out = './%s' % food_zone_out_name
feature_data_out_name = 'featuresData.js'
feature_data_out = './%s' % feature_data_out_name
feature_data_table = 'feature_data'
spatialite_file = 'food_counties.sqlite'
in_table = 'food_counties'
int_table_id = 'fips'
out_table = 'food_zones'
out_srid = 4326
zone_id = 'name'
perform_lookup = False
# lookup_table = 'subzone_lookup'
# lookup_subzone_id = 'GRIDCODE'
area_id = 'AG_ACRES'
pixels_id = 'acres_br_count'

measures = [
    {
        "name": 'acres',
        "prefix": 'acres_',
        "postfix": '',
        "types": ['br','fc','fn','fs','oc','vpm']
    },
    {
        "name": 'farms',
        "prefix": 'farms_',
        "postfix": '',
        "types": ['br','fc','fn','fs','oc','vpm','mt']
    },
    {
        "name": 'yield',
        "prefix": 'qnty_',
        "postfix": '',
        "types": ['fc','fs','oc','mt'] # fn and vpm only at work
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
    },
    'mt':{
        'label': 'mt_',
        'ids': ['cattle', 'chicken', 'goats', 'hogs', 'sheep']
    }
}

# creating/connecting the test_db
conn = db.connect(spatialite_file)

# creating a Cursor
cur = conn.cursor()

try:
    print 'Dropping old table...'
    cur.execute('DROP TABLE %s;' % out_table)
except:
    pass

try:
    cur.execute('DROP TABLE %s;' % feature_data_table)
except:
    pass

print 'Creating new table...'
if perform_lookup:
    query = "CREATE TABLE '%s' AS \n\
    SELECT \n\
        lookup.%s AS zone_id, \n\
        CastToMultiPolygon(Collect(TRANSFORM(master.GEOMETRY, %s))) AS GEOMETRY, \n\
        Sum(master.%s) AS area_in_acres, \n\
        Sum(master.%s) AS pixels, \n\
        Count(master.%s) AS poly_count" % (out_table, zone_id, out_srid, area_id, pixels_id, int_table_id)
else:
    query = "CREATE TABLE '%s' AS \n\
    SELECT \n\
        %s AS zone_id, \n\
        TRANSFORM(master.GEOMETRY, %s) AS GEOMETRY, \n\
        master.%s AS area_in_acres, \n\
        1 AS poly_count" % (out_table, zone_id, out_srid, area_id)

for measure in measures:
    for type in measure['types']:
        label = types[type]['label']
        for id in types[type]['ids']:
            raw_header = "%s%s%s%s" % (measure['prefix'], label, id, measure['postfix'])
            if perform_lookup:
                raw_column = "Sum(master.%s) AS %s" % (raw_header, raw_header)
                dens_column = "Sum(master.%s)/Sum(master.%s) AS %s%s%s_dens" % (raw_header, area_id, measure['prefix'], label, id)
            else:
                raw_column = "master.%s AS %s" % (raw_header, raw_header)
                dens_column = "(master.%s*1.0)/(master.%s*1.0) AS %s%s%s_dens" % (raw_header, area_id, measure['prefix'], label, id)

            query += ", \n\
    %s, \n\
    %s" % (raw_column, dens_column)

if perform_lookup:
    query += " \n\
    FROM %s AS master, %s AS lookup \n\
    WHERE master.%s = lookup.%s \n\
    GROUP BY lookup.%s;" % (in_table, lookup_table, zone_id, lookup_subzone_id, lookup_zone_id)
else:
    query += " \n\
    FROM %s as master;" % (in_table)

cur.execute(query)

print 'Adding geometry column...'
query = "SELECT RecoverGeometryColumn('%s', 'GEOMETRY', %s, 'MULTIPOLYGON');" % (out_table, out_srid)
cur.execute(query)

conn.commit()

print 'Creating featureData table'

if perform_lookup:
    query = "CREATE TABLE '%s' AS \n\
    SELECT \n\
        zone_id, \n\
        GEOMETRY, \n\
        area_in_acres, \n\
        pixels, \n\
        poly_count \n\
    FROM %s;" % (feature_data_table, out_table)
else:
    query = "CREATE TABLE '%s' AS \n\
    SELECT \n\
        zone_id, \n\
        GEOMETRY, \n\
        area_in_acres, \n\
        poly_count \n\
    FROM %s;" % (feature_data_table, out_table)

cur.execute(query)

print 'Adding geometry column...'
query = "SELECT RecoverGeometryColumn('%s', 'GEOMETRY', %s, 'MULTIPOLYGON')" % (feature_data_table, out_srid)

cur.execute(query)
conn.commit()

if os.path.isfile(feature_data_out):
    os.remove(feature_data_out)
os.system('ogr2ogr -f "GEOJSON" %s %s %s' % (feature_data_out_name, spatialite_file, feature_data_table))

query = 'DROP TABLE %s;' % feature_data_table
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

print 'Writing zone table to geojson'

if os.path.isfile(food_zone_out):
    os.remove(food_zone_out)
os.system('ogr2ogr -f "GEOJSON" %s %s %s' % (food_zone_out_name, spatialite_file, out_table))

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