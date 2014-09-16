import os, csv
# importing pyspatialite
from pyspatialite import dbapi2 as db
from dbfpy.dbf import Dbf as dbf        #http://sourceforge.net/projects/dbfpy/files/dbfpy/

crop_files = []
dbf_location = "./input/"
measures = ["Acres", "Farms", "Qnty"]
measure_name_dict = {
    "Acres": "_AC",
    "Farms": "_FA",
    "Qnty": "_QN"
}
crop_types = ["br", "fc", "fn", "fs", "oc", "vpm", "mt"]
crop_type_dict = {
    "br": "TBLBR",
    "fc": "TBLFC",
    "fn": "TBLFN",
    "fs": "TBLFS",
    "oc": "TBLOC",
    "vpm": "TBLVPM",
    "mt": "TBLMT"
}
shapefile = "OR_Cnty_Join"
db_file = "food_counties.sqlite"
# lookup_file = "region_subzone_crosswalk.csv"
# lookup_table = 'subzone_lookup'
# lookup_ignore_column = False    #naming a column 'index' breaks this code
# lookup_zone_column = 'region'
table_name = "food_counties"
zone_details = {}
zone_header = 'FIPS'
area_header = 'SUM_F_AREA'
pixels_header = 'COUNT'
headers = []
data_type_map = {
    'C': 'VARCHAR',
    'N': 'INTEGER',
    'F': 'REAL'
}

# print 'Drop existing db if exists'
# if os.path.isfile(db_file):
#     os.remove(db_file)

# print 'Read shapefile into Spatialite table'
# os.system(
#     'ogr2ogr -f "SQLite" %s %s%s.shp -nln %s -gt 1024 -dsco SPATIALITE=YES' 
#     % (
#         db_file, 
#         dbf_location, 
#         shapefile, 
#         table_name
#     )
# )   #Can this be done with pyspatialite?

# TODO: get area ag in place from TBLFARMS.DBF

print 'consolidating input files'
for measure in measures:
    print "%s" % measure
    for crop_type in crop_types:
        dbf_file = '%s%s%s.dbf' % (dbf_location, crop_type_dict[crop_type], measure_name_dict[measure])
        if not os.path.isfile(dbf_file):
            dbf_file = '%s%s%s.DBF' % (dbf_location, crop_type_dict[crop_type], measure_name_dict[measure])
        if os.path.isfile(dbf_file):
            print "    %s" % crop_type
            data = dbf(dbf_file)
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

# print 'Write lookup table'
# with open('%s%s' % (dbf_location, lookup_file), 'rb') as csvfile:
#     reader = csv.reader(csvfile, delimiter=',', quotechar='|')
#     lookup_headers = reader.next()
#     zoneIdColumnIndex = lookup_headers.index(lookup_zone_column)
#     if lookup_ignore_column:
#         del lookup_headers[lookup_ignore_column]
#     query = 'CREATE TABLE %s (%s);' % (lookup_table, ', '.join(lookup_headers))
#     cur.execute(query)
#     for row in reader:
#         if row[zoneIdColumnIndex] != '':
#             if lookup_ignore_column:
#                 del row[lookup_ignore_column]
#             for (counter, val) in enumerate(row):
#                 if val == '':
#                     row[counter] = 'NULL'
#                 try:
#                     float(val)
#                 except ValueError:
#                     row[counter] = "\'%s\'" % val
#             query = 'INSERT INTO %s (%s) VALUES (%s)' % (lookup_table, ', '.join(lookup_headers), ', '.join(row))
#             cur.execute(query)
#     conn.commit()

# ------------------------------------

# print 'Adding columns to master table'
# query = 'ALTER TABLE %s ADD COLUMN' % table_name
# for header in headers:
#     if header.split()[1] != 'C':
#         label = header.split()[0]
#         col_type = data_type_map[header.split()[1]]
#         col_query = "%s %s %s;" % (query, label.lower(), col_type)
#         cur.execute(col_query.lower())

print 'Updating master table'
probs = True
for zone_id in zone_details.keys():
    zone = zone_details[zone_id]
    query = 'UPDATE %s SET' % table_name
    for header in [str(x).split()[0] for x in headers]:
        try:
            float(zone[header])
            query += " %s = %s," % (header.lower(), zone[header])
        except ValueError:
            query != " %s = \"%s\"," % (header.lower(), zone[header])
    query = query [:-1] # remove final comma
    query += ' WHERE %s = %s;' % (zone_header, str(int(float(zone_id)))) # given string of float need string of int
    cur.execute(query)

conn.commit()
conn.close()

print 'Complete'
quit()

