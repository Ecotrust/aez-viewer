import os, csv
# importing pyspatialite
from pyspatialite import dbapi2 as db
from dbfpy.dbf import Dbf as dbf        #http://sourceforge.net/projects/dbfpy/files/dbfpy/

crop_files = []
dbf_location = "./input/"
measures = ["Acres", "Farms", "Qnty"]
crop_types = ["br", "fc", "fn", "fs", "oc", "vpm"]
shapefile = "iso_02272014"
db_file = "food_zones_all.sqlite"      #TODO - Remove "test"
lookup_file = "Subzone_lookup.csv"
lookup_table = 'subzone_lookup'
lookup_dict = {}
lookup_ignore_column = 1
table_name = "food_zones_all"
zone_details = {}
zone_header = 'ISOZONE'
area_header = 'SUM_F_AREA'
pixels_header = 'COUNT'
headers = []
data_type_map = {
    'N': 'INTEGER',
    'F': 'REAL'
}

print 'Drop existing db if exists'
if os.path.isfile(db_file):
    os.remove(db_file)

print 'Read shapefile into Spatialite table'
os.system('ogr2ogr -f "SQLite" %s %s%s.shp -nln %s -gt 1024 -dsco SPATIALITE=YES' % (db_file, dbf_location, shapefile, table_name))   #Can this be done with pyspatialite?

print 'consolidating input files'
for measure in measures:
    print "%s" % measure
    for crop_type in crop_types:
        print "    %s" % crop_type
        if os.path.isfile('%s%s_%s.dbf' % (dbf_location, measure, crop_type)):
            data = dbf('%s%s_%s.dbf' % (dbf_location, measure, crop_type))
            headers +=  ["%s_%s_%s" % (measure, crop_type, str(x)) for x in data.fieldDefs]
            for rec in data:
                zone_id = str(rec[zone_header])
                if not zone_details.has_key(zone_id):
                    zone_details[zone_id] = {}
                for header in data.fieldNames:
                    full_header = "%s_%s_%s" % (measure, crop_type, header)
                    if zone_details[zone_id].has_key(full_header):
                        if not zone_details[zone_id][full_header] == rec[header]:
                            print 'ERROR: values do not match - %s: %s | %s' % (full_header, zone_details[zone_id][full_header], rec[header])
                            continue
                    zone_details[zone_id][full_header] = rec[header]

print 'Connecting to DB'
conn = db.connect(db_file)
cur = conn.cursor()

print 'Write lookup table'
with open('%s%s' % (dbf_location, lookup_file), 'rb') as csvfile:
    reader = csv.reader(csvfile, delimiter=',', quotechar='|')
    lookup_headers = reader.next()
    del lookup_headers[lookup_ignore_column]
    cur.execute('CREATE TABLE %s (%s);' % (lookup_table, ', '.join(lookup_headers)))
    for row in reader:
        del row[lookup_ignore_column]
        cur.execute('INSERT INTO %s (%s) VALUES (%s)' % (lookup_table, ', '.join(lookup_headers), ', '.join(row)))
    conn.commit()

print 'Adding columns to master table'
query = 'ALTER TABLE %s ADD COLUMN' % table_name
for header in headers:
    label = header.split()[0]
    col_type = data_type_map[header.split()[1]]
    col_query = "%s %s %s;" % (query, label, col_type)
    cur.execute(col_query.lower())

print 'Updating master table'
for zone_id in zone_details.keys():
    zone = zone_details[zone_id]
    query = 'UPDATE %s SET' % table_name
    for header in [str(x).split()[0] for x in headers]:
        query += " %s = %s," % (header.lower, zone[header])
    query = query [:-1] # remove final comma
    query += ' WHERE %s = %s;' % (zone_header, zone_id)
    print '%s updated' % zone_id

conn.commit()
conn.close()

print 'Complete'

quit()

