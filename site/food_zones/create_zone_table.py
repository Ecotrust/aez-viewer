# importing pyspatialite
from pyspatialite import dbapi2 as db

# creating/connecting the test_db
conn = db.connect('food_zones_all.sqlite')

# creating a Cursor
cur = conn.cursor()

try:
    print 'Dropping old table...'
    cur.execute('DROP TABLE food_zones;')
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

columns = ["GEOMETRY", 'id', 'area_in_acres', 'count', 'acres_br_br01_z_ac', 'acres_br_br02_z_ac', 'acres_br_br03_z_ac', 'acres_br_br04_z_ac', 'acres_br_br05_z_ac', 'acres_br_br06_z_ac', 'acres_br_br07_z_ac', 'acres_br_br08_z_ac', 'acres_br_br09_z_ac', 'acres_br_br10_z_ac', 'acres_br_br11_z_ac', 'acres_br_br01_dens', 'acres_br_br02_dens', 'acres_br_br03_dens', 'acres_br_br04_dens', 'acres_br_br05_dens', 'acres_br_br06_dens', 'acres_br_br07_dens', 'acres_br_br08_dens', 'acres_br_br09_dens', 'acres_br_br10_dens', 'acres_br_br11_dens', 'acres_fc_fc01_z_ac', 'acres_fc_fc02_z_ac', 'acres_fc_fc03_z_ac', 'acres_fc_fc04_z_ac', 'acres_fc_fc05_z_ac', 'acres_fc_fc06_z_ac', 'acres_fc_fc07_z_ac', 'acres_fc_fc08_z_ac', 'acres_fc_fc09_z_ac', 'acres_fc_fc10_z_ac', 'acres_fc_fc11_z_ac', 'acres_fc_fc12_z_ac', 'acres_fc_fc13_z_ac', 'acres_fc_fc14_z_ac', 'acres_fc_fc15_z_ac', 'acres_fc_fc16_z_ac', 'acres_fc_fc17_z_ac', 'acres_fc_fc18_z_ac', 'acres_fc_fc19_z_ac', 'acres_fc_fc20_z_ac', 'acres_fc_fc21_z_ac', 'acres_fc_fc22_z_ac', 'acres_fc_fc23_z_ac', 'acres_fc_fc24_z_ac', 'acres_fc_fc25_z_ac', 'acres_fc_fc26_z_ac', 'acres_fc_fc27_z_ac', 'acres_fc_fc28_z_ac', 'acres_fc_fc29_z_ac', 'acres_fc_fc30_z_ac', 'acres_fc_fc31_z_ac', 'acres_fc_fc32_z_ac', 'acres_fc_fc33_z_ac', 'acres_fc_fc34_z_ac', 'acres_fc_fc35_z_ac', 'acres_fc_fc36_z_ac', 'acres_fc_fc01_dens', 'acres_fc_fc02_dens', 'acres_fc_fc03_dens', 'acres_fc_fc04_dens', 'acres_fc_fc05_dens', 'acres_fc_fc06_dens', 'acres_fc_fc07_dens', 'acres_fc_fc08_dens', 'acres_fc_fc09_dens', 'acres_fc_fc10_dens', 'acres_fc_fc11_dens', 'acres_fc_fc12_dens', 'acres_fc_fc13_dens', 'acres_fc_fc14_dens', 'acres_fc_fc15_dens', 'acres_fc_fc16_dens', 'acres_fc_fc17_dens', 'acres_fc_fc18_dens', 'acres_fc_fc19_dens', 'acres_fc_fc20_dens', 'acres_fc_fc21_dens', 'acres_fc_fc22_dens', 'acres_fc_fc23_dens', 'acres_fc_fc24_dens', 'acres_fc_fc25_dens', 'acres_fc_fc26_dens', 'acres_fc_fc27_dens', 'acres_fc_fc28_dens', 'acres_fc_fc29_dens', 'acres_fc_fc30_dens', 'acres_fc_fc31_dens', 'acres_fc_fc32_dens', 'acres_fc_fc33_dens', 'acres_fc_fc34_dens', 'acres_fc_fc35_dens', 'acres_fc_fc36_dens', 'acres_fn_fn01_z_ac', 'acres_fn_fn02_z_ac', 'acres_fn_fn03_z_ac', 'acres_fn_fn04_z_ac', 'acres_fn_fn05_z_ac', 'acres_fn_fn06_z_ac', 'acres_fn_fn07_z_ac', 'acres_fn_fn08_z_ac', 'acres_fn_fn09_z_ac', 'acres_fn_fn10_z_ac', 'acres_fn_fn11_z_ac', 'acres_fn_fn12_z_ac', 'acres_fn_fn13_z_ac', 'acres_fn_fn14_z_ac', 'acres_fn_fn15_z_ac', 'acres_fn_fn16_z_ac', 'acres_fn_fn17_z_ac', 'acres_fn_fn18_z_ac', 'acres_fn_fn19_z_ac', 'acres_fn_fn20_z_ac', 'acres_fn_fn21_z_ac', 'acres_fn_fn22_z_ac', 'acres_fn_fn25_z_ac', 'acres_fn_fn26_z_ac', 'acres_fn_fn28_z_ac', 'acres_fn_fn29_z_ac', 'acres_fn_fn30_z_ac', 'acres_fn_fn32_z_ac', 'acres_fn_fn33_z_ac', 'acres_fn_fn34_z_ac', 'acres_fn_fn35_z_ac', 'acres_fn_fn36_z_ac', 'acres_fn_fn37_z_ac', 'acres_fn_fn38_z_ac', 'acres_fn_fn39_z_ac', 'acres_fn_fn40_z_ac', 'acres_fn_fn41_z_ac', 'acres_fn_fn42_z_ac', 'acres_fn_fn43_z_ac', 'acres_fn_fn44_z_ac', 'acres_fn_fn45_z_ac', 'acres_fn_fn46_z_ac', 'acres_fn_fn47_z_ac', 'acres_fn_fn48_z_ac', 'acres_fn_fn49_z_ac', 'acres_fn_fn50_z_ac', 'acres_fn_fn51_z_ac', 'acres_fn_fn52_z_ac', 'acres_fn_fn01_dens', 'acres_fn_fn02_dens', 'acres_fn_fn03_dens', 'acres_fn_fn04_dens', 'acres_fn_fn05_dens', 'acres_fn_fn06_dens', 'acres_fn_fn07_dens', 'acres_fn_fn08_dens', 'acres_fn_fn09_dens', 'acres_fn_fn10_dens', 'acres_fn_fn11_dens', 'acres_fn_fn12_dens', 'acres_fn_fn13_dens', 'acres_fn_fn14_dens', 'acres_fn_fn15_dens', 'acres_fn_fn16_dens', 'acres_fn_fn17_dens', 'acres_fn_fn18_dens', 'acres_fn_fn19_dens', 'acres_fn_fn20_dens', 'acres_fn_fn21_dens', 'acres_fn_fn22_dens', 'acres_fn_fn25_dens', 'acres_fn_fn26_dens', 'acres_fn_fn28_dens', 'acres_fn_fn29_dens', 'acres_fn_fn30_dens', 'acres_fn_fn32_dens', 'acres_fn_fn33_dens', 'acres_fn_fn34_dens', 'acres_fn_fn35_dens', 'acres_fn_fn36_dens', 'acres_fn_fn37_dens', 'acres_fn_fn38_dens', 'acres_fn_fn39_dens', 'acres_fn_fn40_dens', 'acres_fn_fn41_dens', 'acres_fn_fn42_dens', 'acres_fn_fn43_dens', 'acres_fn_fn44_dens', 'acres_fn_fn45_dens', 'acres_fn_fn46_dens', 'acres_fn_fn47_dens', 'acres_fn_fn48_dens', 'acres_fn_fn49_dens', 'acres_fn_fn50_dens', 'acres_fn_fn51_dens', 'acres_fn_fn52_dens', 'acres_fs_fs01_z_ac', 'acres_fs_fs02_z_ac', 'acres_fs_fs03_z_ac', 'acres_fs_fs04_z_ac', 'acres_fs_fs05_z_ac', 'acres_fs_fs07_z_ac', 'acres_fs_fs08_z_ac', 'acres_fs_fs09_z_ac', 'acres_fs_fs10_z_ac', 'acres_fs_fs11_z_ac', 'acres_fs_fs14_z_ac', 'acres_fs_fs15_z_ac', 'acres_fs_fs16_z_ac', 'acres_fs_fs20_z_ac', 'acres_fs_fs21_z_ac', 'acres_fs_fs22_z_ac', 'acres_fs_fs23_z_ac', 'acres_fs_fs24_z_ac', 'acres_fs_fs25_z_ac', 'acres_fs_fs27_z_ac', 'acres_fs_fs29_z_ac', 'acres_fs_fs30_z_ac', 'acres_fs_fs01_dens', 'acres_fs_fs02_dens', 'acres_fs_fs03_dens', 'acres_fs_fs04_dens', 'acres_fs_fs05_dens', 'acres_fs_fs07_dens', 'acres_fs_fs08_dens', 'acres_fs_fs09_dens', 'acres_fs_fs10_dens', 'acres_fs_fs11_dens', 'acres_fs_fs14_dens', 'acres_fs_fs15_dens', 'acres_fs_fs16_dens', 'acres_fs_fs20_dens', 'acres_fs_fs21_dens', 'acres_fs_fs22_dens', 'acres_fs_fs23_dens', 'acres_fs_fs24_dens', 'acres_fs_fs25_dens', 'acres_fs_fs27_dens', 'acres_fs_fs29_dens', 'acres_fs_fs30_dens', 'acres_oc_oc02_z_qt', 'acres_oc_oc03_z_qt', 'acres_oc_oc04_z_qt', 'acres_oc_oc05_z_qt', 'acres_oc_oc06_z_qt', 'acres_oc_oc07_z_qt', 'acres_oc_oc08_z_qt', 'acres_oc_oc02_z_ac', 'acres_oc_oc03_z_ac', 'acres_oc_oc04_z_ac', 'acres_oc_oc05_z_ac', 'acres_oc_oc06_z_ac', 'acres_oc_oc07_z_ac', 'acres_oc_oc08_z_ac', 'acres_oc_oc02_dens', 'acres_oc_oc03_dens', 'acres_oc_oc04_dens', 'acres_oc_oc05_dens', 'acres_oc_oc06_dens', 'acres_oc_oc07_dens', 'acres_oc_oc08_dens', 'acres_vpm_vp01_z_ac', 'acres_vpm_vp02_z_ac', 'acres_vpm_vp03_z_ac', 'acres_vpm_vp04_z_ac', 'acres_vpm_vp05_z_ac', 'acres_vpm_vp06_z_ac', 'acres_vpm_vp07_z_ac', 'acres_vpm_vp08_z_ac', 'acres_vpm_vp09_z_ac', 'acres_vpm_vp11_z_ac', 'acres_vpm_vp12_z_ac', 'acres_vpm_vp13_z_ac', 'acres_vpm_vp14_z_ac', 'acres_vpm_vp15_z_ac', 'acres_vpm_vp16_z_ac', 'acres_vpm_vp17_z_ac', 'acres_vpm_vp18_z_ac', 'acres_vpm_vp19_z_ac', 'acres_vpm_vp20_z_ac', 'acres_vpm_vp21_z_ac', 'acres_vpm_vp22_z_ac', 'acres_vpm_vp23_z_ac', 'acres_vpm_vp24_z_ac', 'acres_vpm_vp25_z_ac', 'acres_vpm_vp26_z_ac', 'acres_vpm_vp27_z_ac', 'acres_vpm_vp28_z_ac', 'acres_vpm_vp29_z_ac', 'acres_vpm_vp30_z_ac', 'acres_vpm_vp31_z_ac', 'acres_vpm_vp32_z_ac', 'acres_vpm_vp33_z_ac', 'acres_vpm_vp34_z_ac', 'acres_vpm_vp35_z_ac', 'acres_vpm_vp36_z_ac', 'acres_vpm_vp37_z_ac', 'acres_vpm_vp38_z_ac', 'acres_vpm_vp39_z_ac', 'acres_vpm_vp40_z_ac', 'acres_vpm_vp41_z_ac', 'acres_vpm_vp42_z_ac', 'acres_vpm_vp43_z_ac', 'acres_vpm_vp44_z_ac', 'acres_vpm_vp45_z_ac', 'acres_vpm_vp46_z_ac', 'acres_vpm_vp47_z_ac', 'acres_vpm_vp48_z_ac', 'acres_vpm_vp49_z_ac', 'acres_vpm_vp50_z_ac', 'acres_vpm_vp51_z_ac', 'acres_vpm_vp52_z_ac', 'acres_vpm_vp53_z_ac', 'acres_vpm_vp54_z_ac', 'acres_vpm_vp55_z_ac', 'acres_vpm_vp56_z_ac', 'acres_vpm_vp01_dens', 'acres_vpm_vp02_dens', 'acres_vpm_vp03_dens', 'acres_vpm_vp04_dens', 'acres_vpm_vp05_dens', 'acres_vpm_vp06_dens', 'acres_vpm_vp07_dens', 'acres_vpm_vp08_dens', 'acres_vpm_vp09_dens', 'acres_vpm_vp11_dens', 'acres_vpm_vp12_dens', 'acres_vpm_vp13_dens', 'acres_vpm_vp14_dens', 'acres_vpm_vp15_dens', 'acres_vpm_vp16_dens', 'acres_vpm_vp17_dens', 'acres_vpm_vp18_dens', 'acres_vpm_vp19_dens', 'acres_vpm_vp20_dens', 'acres_vpm_vp21_dens', 'acres_vpm_vp22_dens', 'acres_vpm_vp23_dens', 'acres_vpm_vp24_dens', 'acres_vpm_vp25_dens', 'acres_vpm_vp26_dens', 'acres_vpm_vp27_dens', 'acres_vpm_vp28_dens', 'acres_vpm_vp29_dens', 'acres_vpm_vp30_dens', 'acres_vpm_vp31_dens', 'acres_vpm_vp32_dens', 'acres_vpm_vp33_dens', 'acres_vpm_vp34_dens', 'acres_vpm_vp35_dens', 'acres_vpm_vp36_dens', 'acres_vpm_vp37_dens', 'acres_vpm_vp38_dens', 'acres_vpm_vp39_dens', 'acres_vpm_vp40_dens', 'acres_vpm_vp41_dens', 'acres_vpm_vp42_dens', 'acres_vpm_vp43_dens', 'acres_vpm_vp44_dens', 'acres_vpm_vp45_dens', 'acres_vpm_vp46_dens', 'acres_vpm_vp47_dens', 'acres_vpm_vp48_dens', 'acres_vpm_vp49_dens', 'acres_vpm_vp50_dens', 'acres_vpm_vp51_dens', 'acres_vpm_vp52_dens', 'acres_vpm_vp53_dens', 'acres_vpm_vp54_dens', 'acres_vpm_vp55_dens', 'acres_vpm_vp56_dens', 'farms_br_br01_z_fm', 'farms_br_br02_z_fm', 'farms_br_br03_z_fm', 'farms_br_br04_z_fm', 'farms_br_br05_z_fm', 'farms_br_br06_z_fm', 'farms_br_br07_z_fm', 'farms_br_br08_z_fm', 'farms_br_br09_z_fm', 'farms_br_br10_z_fm', 'farms_br_br11_z_fm', 'farms_br_br01_dens', 'farms_br_br02_dens', 'farms_br_br03_dens', 'farms_br_br04_dens', 'farms_br_br05_dens', 'farms_br_br06_dens', 'farms_br_br07_dens', 'farms_br_br08_dens', 'farms_br_br09_dens', 'farms_br_br10_dens', 'farms_br_br11_dens', 'farms_fc_fc01_z_fm', 'farms_fc_fc02_z_fm', 'farms_fc_fc03_z_fm', 'farms_fc_fc04_z_fm', 'farms_fc_fc05_z_fm', 'farms_fc_fc06_z_fm', 'farms_fc_fc07_z_fm', 'farms_fc_fc08_z_fm', 'farms_fc_fc09_z_fm', 'farms_fc_fc10_z_fm', 'farms_fc_fc11_z_fm', 'farms_fc_fc12_z_fm', 'farms_fc_fc13_z_fm', 'farms_fc_fc14_z_fm', 'farms_fc_fc15_z_fm', 'farms_fc_fc16_z_fm', 'farms_fc_fc17_z_fm', 'farms_fc_fc18_z_fm', 'farms_fc_fc19_z_fm', 'farms_fc_fc20_z_fm', 'farms_fc_fc21_z_fm', 'farms_fc_fc22_z_fm', 'farms_fc_fc23_z_fm', 'farms_fc_fc24_z_fm', 'farms_fc_fc25_z_fm', 'farms_fc_fc26_z_fm', 'farms_fc_fc27_z_fm', 'farms_fc_fc28_z_fm', 'farms_fc_fc29_z_fm', 'farms_fc_fc30_z_fm', 'farms_fc_fc31_z_fm', 'farms_fc_fc32_z_fm', 'farms_fc_fc33_z_fm', 'farms_fc_fc34_z_fm', 'farms_fc_fc35_z_fm', 'farms_fc_fc36_z_fm', 'farms_fc_fc01_dens', 'farms_fc_fc02_dens', 'farms_fc_fc03_dens', 'farms_fc_fc04_dens', 'farms_fc_fc05_dens', 'farms_fc_fc06_dens', 'farms_fc_fc07_dens', 'farms_fc_fc08_dens', 'farms_fc_fc09_dens', 'farms_fc_fc10_dens', 'farms_fc_fc11_dens', 'farms_fc_fc12_dens', 'farms_fc_fc13_dens', 'farms_fc_fc14_dens', 'farms_fc_fc15_dens', 'farms_fc_fc16_dens', 'farms_fc_fc17_dens', 'farms_fc_fc18_dens', 'farms_fc_fc19_dens', 'farms_fc_fc20_dens', 'farms_fc_fc21_dens', 'farms_fc_fc22_dens', 'farms_fc_fc23_dens', 'farms_fc_fc24_dens', 'farms_fc_fc25_dens', 'farms_fc_fc26_dens', 'farms_fc_fc27_dens', 'farms_fc_fc28_dens', 'farms_fc_fc29_dens', 'farms_fc_fc30_dens', 'farms_fc_fc31_dens', 'farms_fc_fc32_dens', 'farms_fc_fc33_dens', 'farms_fc_fc34_dens', 'farms_fc_fc35_dens', 'farms_fc_fc36_dens', 'farms_fn_fn01_z_fm', 'farms_fn_fn02_z_fm', 'farms_fn_fn03_z_fm', 'farms_fn_fn04_z_fm', 'farms_fn_fn05_z_fm', 'farms_fn_fn06_z_fm', 'farms_fn_fn07_z_fm', 'farms_fn_fn08_z_fm', 'farms_fn_fn09_z_fm', 'farms_fn_fn10_z_fm', 'farms_fn_fn11_z_fm', 'farms_fn_fn12_z_fm', 'farms_fn_fn13_z_fm', 'farms_fn_fn14_z_fm', 'farms_fn_fn15_z_fm', 'farms_fn_fn16_z_fm', 'farms_fn_fn17_z_fm', 'farms_fn_fn18_z_fm', 'farms_fn_fn19_z_fm', 'farms_fn_fn20_z_fm', 'farms_fn_fn21_z_fm', 'farms_fn_fn22_z_fm', 'farms_fn_fn25_z_fm', 'farms_fn_fn26_z_fm', 'farms_fn_fn28_z_fm', 'farms_fn_fn29_z_fm', 'farms_fn_fn30_z_fm', 'farms_fn_fn32_z_fm', 'farms_fn_fn33_z_fm', 'farms_fn_fn34_z_fm', 'farms_fn_fn35_z_fm', 'farms_fn_fn36_z_fm', 'farms_fn_fn37_z_fm', 'farms_fn_fn38_z_fm', 'farms_fn_fn39_z_fm', 'farms_fn_fn40_z_fm', 'farms_fn_fn41_z_fm', 'farms_fn_fn42_z_fm', 'farms_fn_fn43_z_fm', 'farms_fn_fn44_z_fm', 'farms_fn_fn45_z_fm', 'farms_fn_fn46_z_fm', 'farms_fn_fn47_z_fm', 'farms_fn_fn48_z_fm', 'farms_fn_fn49_z_fm', 'farms_fn_fn50_z_fm', 'farms_fn_fn51_z_fm', 'farms_fn_fn52_z_fm', 'farms_fn_fn01_dens', 'farms_fn_fn02_dens', 'farms_fn_fn03_dens', 'farms_fn_fn04_dens', 'farms_fn_fn05_dens', 'farms_fn_fn06_dens', 'farms_fn_fn07_dens', 'farms_fn_fn08_dens', 'farms_fn_fn09_dens', 'farms_fn_fn10_dens', 'farms_fn_fn11_dens', 'farms_fn_fn12_dens', 'farms_fn_fn13_dens', 'farms_fn_fn14_dens', 'farms_fn_fn15_dens', 'farms_fn_fn16_dens', 'farms_fn_fn17_dens', 'farms_fn_fn18_dens', 'farms_fn_fn19_dens', 'farms_fn_fn20_dens', 'farms_fn_fn21_dens', 'farms_fn_fn22_dens', 'farms_fn_fn25_dens', 'farms_fn_fn26_dens', 'farms_fn_fn28_dens', 'farms_fn_fn29_dens', 'farms_fn_fn30_dens', 'farms_fn_fn32_dens', 'farms_fn_fn33_dens', 'farms_fn_fn34_dens', 'farms_fn_fn35_dens', 'farms_fn_fn36_dens', 'farms_fn_fn37_dens', 'farms_fn_fn38_dens', 'farms_fn_fn39_dens', 'farms_fn_fn40_dens', 'farms_fn_fn41_dens', 'farms_fn_fn42_dens', 'farms_fn_fn43_dens', 'farms_fn_fn44_dens', 'farms_fn_fn45_dens', 'farms_fn_fn46_dens', 'farms_fn_fn47_dens', 'farms_fn_fn48_dens', 'farms_fn_fn49_dens', 'farms_fn_fn50_dens', 'farms_fn_fn51_dens', 'farms_fn_fn52_dens', 'farms_fs_fs01_z_fm', 'farms_fs_fs02_z_fm', 'farms_fs_fs03_z_fm', 'farms_fs_fs04_z_fm', 'farms_fs_fs05_z_fm', 'farms_fs_fs07_z_fm', 'farms_fs_fs08_z_fm', 'farms_fs_fs09_z_fm', 'farms_fs_fs10_z_fm', 'farms_fs_fs11_z_fm', 'farms_fs_fs14_z_fm', 'farms_fs_fs15_z_fm', 'farms_fs_fs16_z_fm', 'farms_fs_fs20_z_fm', 'farms_fs_fs21_z_fm', 'farms_fs_fs22_z_fm', 'farms_fs_fs23_z_fm', 'farms_fs_fs24_z_fm', 'farms_fs_fs25_z_fm', 'farms_fs_fs27_z_fm', 'farms_fs_fs29_z_fm', 'farms_fs_fs30_z_fm', 'farms_fs_fs01_dens', 'farms_fs_fs02_dens', 'farms_fs_fs03_dens', 'farms_fs_fs04_dens', 'farms_fs_fs05_dens', 'farms_fs_fs07_dens', 'farms_fs_fs08_dens', 'farms_fs_fs09_dens', 'farms_fs_fs10_dens', 'farms_fs_fs11_dens', 'farms_fs_fs14_dens', 'farms_fs_fs15_dens', 'farms_fs_fs16_dens', 'farms_fs_fs20_dens', 'farms_fs_fs21_dens', 'farms_fs_fs22_dens', 'farms_fs_fs23_dens', 'farms_fs_fs24_dens', 'farms_fs_fs25_dens', 'farms_fs_fs27_dens', 'farms_fs_fs29_dens', 'farms_fs_fs30_dens', 'farms_oc_oc02_z_fm', 'farms_oc_oc03_z_fm', 'farms_oc_oc04_z_fm', 'farms_oc_oc05_z_fm', 'farms_oc_oc06_z_fm', 'farms_oc_oc07_z_fm', 'farms_oc_oc08_z_fm', 'farms_oc_oc02_dens', 'farms_oc_oc03_dens', 'farms_oc_oc04_dens', 'farms_oc_oc05_dens', 'farms_oc_oc06_dens', 'farms_oc_oc07_dens', 'farms_oc_oc08_dens', 'farms_vpm_vp01_z_fm', 'farms_vpm_vp02_z_fm', 'farms_vpm_vp03_z_fm', 'farms_vpm_vp04_z_fm', 'farms_vpm_vp05_z_fm', 'farms_vpm_vp06_z_fm', 'farms_vpm_vp07_z_fm', 'farms_vpm_vp08_z_fm', 'farms_vpm_vp09_z_fm', 'farms_vpm_vp11_z_fm', 'farms_vpm_vp12_z_fm', 'farms_vpm_vp13_z_fm', 'farms_vpm_vp14_z_fm', 'farms_vpm_vp15_z_fm', 'farms_vpm_vp16_z_fm', 'farms_vpm_vp17_z_fm', 'farms_vpm_vp18_z_fm', 'farms_vpm_vp19_z_fm', 'farms_vpm_vp20_z_fm', 'farms_vpm_vp21_z_fm', 'farms_vpm_vp22_z_fm', 'farms_vpm_vp23_z_fm', 'farms_vpm_vp24_z_fm', 'farms_vpm_vp25_z_fm', 'farms_vpm_vp26_z_fm', 'farms_vpm_vp27_z_fm', 'farms_vpm_vp28_z_fm', 'farms_vpm_vp29_z_fm', 'farms_vpm_vp30_z_fm', 'farms_vpm_vp31_z_fm', 'farms_vpm_vp32_z_fm', 'farms_vpm_vp33_z_fm', 'farms_vpm_vp34_z_fm', 'farms_vpm_vp35_z_fm', 'farms_vpm_vp36_z_fm', 'farms_vpm_vp37_z_fm', 'farms_vpm_vp38_z_fm', 'farms_vpm_vp39_z_fm', 'farms_vpm_vp40_z_fm', 'farms_vpm_vp41_z_fm', 'farms_vpm_vp42_z_fm', 'farms_vpm_vp43_z_fm', 'farms_vpm_vp44_z_fm', 'farms_vpm_vp45_z_fm', 'farms_vpm_vp46_z_fm', 'farms_vpm_vp47_z_fm', 'farms_vpm_vp48_z_fm', 'farms_vpm_vp49_z_fm', 'farms_vpm_vp50_z_fm', 'farms_vpm_vp51_z_fm', 'farms_vpm_vp52_z_fm', 'farms_vpm_vp53_z_fm', 'farms_vpm_vp54_z_fm', 'farms_vpm_vp55_z_fm', 'farms_vpm_vp56_z_fm', 'farms_vpm_vp01_dens', 'farms_vpm_vp02_dens', 'farms_vpm_vp03_dens', 'farms_vpm_vp04_dens', 'farms_vpm_vp05_dens', 'farms_vpm_vp06_dens', 'farms_vpm_vp07_dens', 'farms_vpm_vp08_dens', 'farms_vpm_vp09_dens', 'farms_vpm_vp11_dens', 'farms_vpm_vp12_dens', 'farms_vpm_vp13_dens', 'farms_vpm_vp14_dens', 'farms_vpm_vp15_dens', 'farms_vpm_vp16_dens', 'farms_vpm_vp17_dens', 'farms_vpm_vp18_dens', 'farms_vpm_vp19_dens', 'farms_vpm_vp20_dens', 'farms_vpm_vp21_dens', 'farms_vpm_vp22_dens', 'farms_vpm_vp23_dens', 'farms_vpm_vp24_dens', 'farms_vpm_vp25_dens', 'farms_vpm_vp26_dens', 'farms_vpm_vp27_dens', 'farms_vpm_vp28_dens', 'farms_vpm_vp29_dens', 'farms_vpm_vp30_dens', 'farms_vpm_vp31_dens', 'farms_vpm_vp32_dens', 'farms_vpm_vp33_dens', 'farms_vpm_vp34_dens', 'farms_vpm_vp35_dens', 'farms_vpm_vp36_dens', 'farms_vpm_vp37_dens', 'farms_vpm_vp38_dens', 'farms_vpm_vp39_dens', 'farms_vpm_vp40_dens', 'farms_vpm_vp41_dens', 'farms_vpm_vp42_dens', 'farms_vpm_vp43_dens', 'farms_vpm_vp44_dens', 'farms_vpm_vp45_dens', 'farms_vpm_vp46_dens', 'farms_vpm_vp47_dens', 'farms_vpm_vp48_dens', 'farms_vpm_vp49_dens', 'farms_vpm_vp50_dens', 'farms_vpm_vp51_dens', 'farms_vpm_vp52_dens', 'farms_vpm_vp53_dens', 'farms_vpm_vp54_dens', 'farms_vpm_vp55_dens', 'farms_vpm_vp56_dens', 'qnty_fc_fc01_z_qt', 'qnty_fc_fc02_z_qt', 'qnty_fc_fc03_z_qt', 'qnty_fc_fc04_z_qt', 'qnty_fc_fc05_z_qt', 'qnty_fc_fc06_z_qt', 'qnty_fc_fc07_z_qt', 'qnty_fc_fc08_z_qt', 'qnty_fc_fc09_z_qt', 'qnty_fc_fc10_z_qt', 'qnty_fc_fc11_z_qt', 'qnty_fc_fc12_z_qt', 'qnty_fc_fc13_z_qt', 'qnty_fc_fc14_z_qt', 'qnty_fc_fc15_z_qt', 'qnty_fc_fc16_z_qt', 'qnty_fc_fc17_z_qt', 'qnty_fc_fc18_z_qt', 'qnty_fc_fc19_z_qt', 'qnty_fc_fc20_z_qt', 'qnty_fc_fc21_z_qt', 'qnty_fc_fc22_z_qt', 'qnty_fc_fc23_z_qt', 'qnty_fc_fc24_z_qt', 'qnty_fc_fc25_z_qt', 'qnty_fc_fc26_z_qt', 'qnty_fc_fc27_z_qt', 'qnty_fc_fc28_z_qt', 'qnty_fc_fc29_z_qt', 'qnty_fc_fc30_z_qt', 'qnty_fc_fc31_z_qt', 'qnty_fc_fc32_z_qt', 'qnty_fc_fc33_z_qt', 'qnty_fc_fc34_z_qt', 'qnty_fc_fc35_z_qt', 'qnty_fc_fc36_z_qt', 'qnty_fc_fc01_dens', 'qnty_fc_fc02_dens', 'qnty_fc_fc03_dens', 'qnty_fc_fc04_dens', 'qnty_fc_fc05_dens', 'qnty_fc_fc06_dens', 'qnty_fc_fc07_dens', 'qnty_fc_fc08_dens', 'qnty_fc_fc09_dens', 'qnty_fc_fc10_dens', 'qnty_fc_fc11_dens', 'qnty_fc_fc12_dens', 'qnty_fc_fc13_dens', 'qnty_fc_fc14_dens', 'qnty_fc_fc15_dens', 'qnty_fc_fc16_dens', 'qnty_fc_fc17_dens', 'qnty_fc_fc18_dens', 'qnty_fc_fc19_dens', 'qnty_fc_fc20_dens', 'qnty_fc_fc21_dens', 'qnty_fc_fc22_dens', 'qnty_fc_fc23_dens', 'qnty_fc_fc24_dens', 'qnty_fc_fc25_dens', 'qnty_fc_fc26_dens', 'qnty_fc_fc27_dens', 'qnty_fc_fc28_dens', 'qnty_fc_fc29_dens', 'qnty_fc_fc30_dens', 'qnty_fc_fc31_dens', 'qnty_fc_fc32_dens', 'qnty_fc_fc33_dens', 'qnty_fc_fc34_dens', 'qnty_fc_fc35_dens', 'qnty_fc_fc36_dens', 'qnty_fn_fn01_z_qt', 'qnty_fn_fn02_z_qt', 'qnty_fn_fn03_z_qt', 'qnty_fn_fn04_z_qt', 'qnty_fn_fn05_z_qt', 'qnty_fn_fn06_z_qt', 'qnty_fn_fn07_z_qt', 'qnty_fn_fn08_z_qt', 'qnty_fn_fn09_z_qt', 'qnty_fn_fn10_z_qt', 'qnty_fn_fn11_z_qt', 'qnty_fn_fn12_z_qt', 'qnty_fn_fn13_z_qt', 'qnty_fn_fn14_z_qt', 'qnty_fn_fn15_z_qt', 'qnty_fn_fn16_z_qt', 'qnty_fn_fn17_z_qt', 'qnty_fn_fn18_z_qt', 'qnty_fn_fn19_z_qt', 'qnty_fn_fn20_z_qt', 'qnty_fn_fn21_z_qt', 'qnty_fn_fn22_z_qt', 'qnty_fn_fn25_z_qt', 'qnty_fn_fn26_z_qt', 'qnty_fn_fn28_z_qt', 'qnty_fn_fn29_z_qt', 'qnty_fn_fn30_z_qt', 'qnty_fn_fn32_z_qt', 'qnty_fn_fn33_z_qt', 'qnty_fn_fn34_z_qt', 'qnty_fn_fn35_z_qt', 'qnty_fn_fn36_z_qt', 'qnty_fn_fn37_z_qt', 'qnty_fn_fn38_z_qt', 'qnty_fn_fn39_z_qt', 'qnty_fn_fn40_z_qt', 'qnty_fn_fn41_z_qt', 'qnty_fn_fn42_z_qt', 'qnty_fn_fn43_z_qt', 'qnty_fn_fn44_z_qt', 'qnty_fn_fn45_z_qt', 'qnty_fn_fn46_z_qt', 'qnty_fn_fn47_z_qt', 'qnty_fn_fn48_z_qt', 'qnty_fn_fn49_z_qt', 'qnty_fn_fn50_z_qt', 'qnty_fn_fn51_z_qt', 'qnty_fn_fn52_z_qt', 'qnty_fn_fn01_dens', 'qnty_fn_fn02_dens', 'qnty_fn_fn03_dens', 'qnty_fn_fn04_dens', 'qnty_fn_fn05_dens', 'qnty_fn_fn06_dens', 'qnty_fn_fn07_dens', 'qnty_fn_fn08_dens', 'qnty_fn_fn09_dens', 'qnty_fn_fn10_dens', 'qnty_fn_fn11_dens', 'qnty_fn_fn12_dens', 'qnty_fn_fn13_dens', 'qnty_fn_fn14_dens', 'qnty_fn_fn15_dens', 'qnty_fn_fn16_dens', 'qnty_fn_fn17_dens', 'qnty_fn_fn18_dens', 'qnty_fn_fn19_dens', 'qnty_fn_fn20_dens', 'qnty_fn_fn21_dens', 'qnty_fn_fn22_dens', 'qnty_fn_fn25_dens', 'qnty_fn_fn26_dens', 'qnty_fn_fn28_dens', 'qnty_fn_fn29_dens', 'qnty_fn_fn30_dens', 'qnty_fn_fn32_dens', 'qnty_fn_fn33_dens', 'qnty_fn_fn34_dens', 'qnty_fn_fn35_dens', 'qnty_fn_fn36_dens', 'qnty_fn_fn37_dens', 'qnty_fn_fn38_dens', 'qnty_fn_fn39_dens', 'qnty_fn_fn40_dens', 'qnty_fn_fn41_dens', 'qnty_fn_fn42_dens', 'qnty_fn_fn43_dens', 'qnty_fn_fn44_dens', 'qnty_fn_fn45_dens', 'qnty_fn_fn46_dens', 'qnty_fn_fn47_dens', 'qnty_fn_fn48_dens', 'qnty_fn_fn49_dens', 'qnty_fn_fn50_dens', 'qnty_fn_fn51_dens', 'qnty_fn_fn52_dens', 'qnty_fs_fs01_z_qt', 'qnty_fs_fs02_z_qt', 'qnty_fs_fs03_z_qt', 'qnty_fs_fs04_z_qt', 'qnty_fs_fs05_z_qt', 'qnty_fs_fs07_z_qt', 'qnty_fs_fs08_z_qt', 'qnty_fs_fs09_z_qt', 'qnty_fs_fs10_z_qt', 'qnty_fs_fs11_z_qt', 'qnty_fs_fs14_z_qt', 'qnty_fs_fs15_z_qt', 'qnty_fs_fs16_z_qt', 'qnty_fs_fs20_z_qt', 'qnty_fs_fs21_z_qt', 'qnty_fs_fs22_z_qt', 'qnty_fs_fs23_z_qt', 'qnty_fs_fs24_z_qt', 'qnty_fs_fs25_z_qt', 'qnty_fs_fs27_z_qt', 'qnty_fs_fs29_z_qt', 'qnty_fs_fs30_z_qt', 'qnty_fs_fs01_dens', 'qnty_fs_fs02_dens', 'qnty_fs_fs03_dens', 'qnty_fs_fs04_dens', 'qnty_fs_fs05_dens', 'qnty_fs_fs07_dens', 'qnty_fs_fs08_dens', 'qnty_fs_fs09_dens', 'qnty_fs_fs10_dens', 'qnty_fs_fs11_dens', 'qnty_fs_fs14_dens', 'qnty_fs_fs15_dens', 'qnty_fs_fs16_dens', 'qnty_fs_fs20_dens', 'qnty_fs_fs21_dens', 'qnty_fs_fs22_dens', 'qnty_fs_fs23_dens', 'qnty_fs_fs24_dens', 'qnty_fs_fs25_dens', 'qnty_fs_fs27_dens', 'qnty_fs_fs29_dens', 'qnty_fs_fs30_dens', 'qnty_oc_oc02_z_qt', 'qnty_oc_oc03_z_qt', 'qnty_oc_oc04_z_qt', 'qnty_oc_oc05_z_qt', 'qnty_oc_oc06_z_qt', 'qnty_oc_oc07_z_qt', 'qnty_oc_oc08_z_qt', 'qnty_oc_oc02_dens', 'qnty_oc_oc03_dens', 'qnty_oc_oc04_dens', 'qnty_oc_oc05_dens', 'qnty_oc_oc06_dens', 'qnty_oc_oc07_dens', 'qnty_oc_oc08_dens', 'qnty_vpm_vp01_z_qt', 'qnty_vpm_vp02_z_qt', 'qnty_vpm_vp03_z_qt', 'qnty_vpm_vp04_z_qt', 'qnty_vpm_vp05_z_qt', 'qnty_vpm_vp06_z_qt', 'qnty_vpm_vp07_z_qt', 'qnty_vpm_vp08_z_qt', 'qnty_vpm_vp09_z_qt', 'qnty_vpm_vp11_z_qt', 'qnty_vpm_vp12_z_qt', 'qnty_vpm_vp13_z_qt', 'qnty_vpm_vp14_z_qt', 'qnty_vpm_vp15_z_qt', 'qnty_vpm_vp16_z_qt', 'qnty_vpm_vp17_z_qt', 'qnty_vpm_vp18_z_qt', 'qnty_vpm_vp19_z_qt', 'qnty_vpm_vp20_z_qt', 'qnty_vpm_vp21_z_qt', 'qnty_vpm_vp22_z_qt', 'qnty_vpm_vp23_z_qt', 'qnty_vpm_vp24_z_qt', 'qnty_vpm_vp25_z_qt', 'qnty_vpm_vp26_z_qt', 'qnty_vpm_vp27_z_qt', 'qnty_vpm_vp28_z_qt', 'qnty_vpm_vp29_z_qt', 'qnty_vpm_vp30_z_qt', 'qnty_vpm_vp31_z_qt', 'qnty_vpm_vp32_z_qt', 'qnty_vpm_vp33_z_qt', 'qnty_vpm_vp34_z_qt', 'qnty_vpm_vp35_z_qt', 'qnty_vpm_vp36_z_qt', 'qnty_vpm_vp37_z_qt', 'qnty_vpm_vp38_z_qt', 'qnty_vpm_vp39_z_qt', 'qnty_vpm_vp40_z_qt', 'qnty_vpm_vp41_z_qt', 'qnty_vpm_vp42_z_qt', 'qnty_vpm_vp43_z_qt', 'qnty_vpm_vp44_z_qt', 'qnty_vpm_vp45_z_qt', 'qnty_vpm_vp46_z_qt', 'qnty_vpm_vp47_z_qt', 'qnty_vpm_vp48_z_qt', 'qnty_vpm_vp49_z_qt', 'qnty_vpm_vp50_z_qt', 'qnty_vpm_vp51_z_qt', 'qnty_vpm_vp52_z_qt', 'qnty_vpm_vp53_z_qt', 'qnty_vpm_vp54_z_qt', 'qnty_vpm_vp55_z_qt', 'qnty_vpm_vp56_z_qt', 'qnty_vpm_vp01_dens', 'qnty_vpm_vp02_dens', 'qnty_vpm_vp03_dens', 'qnty_vpm_vp04_dens', 'qnty_vpm_vp05_dens', 'qnty_vpm_vp06_dens', 'qnty_vpm_vp07_dens', 'qnty_vpm_vp08_dens', 'qnty_vpm_vp09_dens', 'qnty_vpm_vp11_dens', 'qnty_vpm_vp12_dens', 'qnty_vpm_vp13_dens', 'qnty_vpm_vp14_dens', 'qnty_vpm_vp15_dens', 'qnty_vpm_vp16_dens', 'qnty_vpm_vp17_dens', 'qnty_vpm_vp18_dens', 'qnty_vpm_vp19_dens', 'qnty_vpm_vp20_dens', 'qnty_vpm_vp21_dens', 'qnty_vpm_vp22_dens', 'qnty_vpm_vp23_dens', 'qnty_vpm_vp24_dens', 'qnty_vpm_vp25_dens', 'qnty_vpm_vp26_dens', 'qnty_vpm_vp27_dens', 'qnty_vpm_vp28_dens', 'qnty_vpm_vp29_dens', 'qnty_vpm_vp30_dens', 'qnty_vpm_vp31_dens', 'qnty_vpm_vp32_dens', 'qnty_vpm_vp33_dens', 'qnty_vpm_vp34_dens', 'qnty_vpm_vp35_dens', 'qnty_vpm_vp36_dens', 'qnty_vpm_vp37_dens', 'qnty_vpm_vp38_dens', 'qnty_vpm_vp39_dens', 'qnty_vpm_vp40_dens', 'qnty_vpm_vp41_dens', 'qnty_vpm_vp42_dens', 'qnty_vpm_vp43_dens', 'qnty_vpm_vp44_dens', 'qnty_vpm_vp45_dens', 'qnty_vpm_vp46_dens', 'qnty_vpm_vp47_dens', 'qnty_vpm_vp48_dens', 'qnty_vpm_vp49_dens', 'qnty_vpm_vp50_dens', 'qnty_vpm_vp51_dens', 'qnty_vpm_vp52_dens', 'qnty_vpm_vp53_dens', 'qnty_vpm_vp54_dens', 'qnty_vpm_vp55_dens', 'qnty_vpm_vp56_dens']

col_list = []
print 'Creating new table...'
query = "CREATE TABLE 'food_zones' ('id' INTEGER PRIMARY KEY, 'area_in_acres' FLOAT, 'count' INTEGER"

for measure in measures:
    for type in measure['types']:
        label = types[type]['label']
        for id in types[type]['ids']:
            header_str = "%s%s%s%s" % (measure['prefix'], label, id, measure['postfix'])
            dens_str = "%s%s%s_dens" % (measure['prefix'], label, id)
            query += ", '%s' FLOAT, '%s' FLOAT" % (header_str, dens_str)
            col_list.append('%s%s%s%s' % (measure['prefix'], label, id, measure['postfix']));

query += ");"

cur.execute(query)

print 'Adding geometry column...'
query = "SELECT AddGeometryColumn('food_zones', 'GEOMETRY', 4326, 'MULTIPOLYGON', 'XY')"
cur.execute(query)

print 'Populating dictionary...'
zone_q = cur.execute("SELECT DISTINCT subzone_lookup_iso_maj3_27 FROM food_zones_all ORDER BY subzone_lookup_iso_maj3_27;");
zones = [];
for row in zone_q:
    zones.append(row[0])


col_list_str = ""
for col in col_list:
    col_list_str += ", Sum(%s)" % col

zone_dict = {}
for zone in zones:
    zone_dict[zone] = {}
    query = "SELECT \
        AsText(Collect(geometry)), Sum(acres_br_sum_f_area), Count(acres_br_count)%s\
    FROM food_zones_all\
    WHERE subzone_lookup_iso_maj3_27 = %s;" % (col_list_str, zone)

    zone_row = cur.execute(query)
    for row in zone_row:
        zone_dict[zone]['geometry'] = row[0]
        zone_dict[zone]['id'] = zone
        zone_dict[zone]['area_in_acres'] = row[1]
        zone_dict[zone]['count'] = row[2]
        count = 0
        for col in col_list:
            zone_dict[zone][col] = row[3+count]
            dens_col = "%sdens" % col[:-4]
            zone_dict[zone][dens_col] = zone_dict[zone][col]/zone_dict[zone]['area_in_acres']
            count += 1
        try:
            print row[3+count]
            print 'Row values mismatch!!!'
        except:
            pass

# query = 'CREATE TRIGGER "ggi_food_zones_GEOMETRY" BEFORE INSERT ON "food_zones" \
# FOR EACH ROW BEGIN \
# SELECT RAISE(ROLLBACK, \'food_zones.GEOMETRY violates Geometry constraint [geom-type or SRID not allowed]\') \
# WHERE (SELECT geometry_type FROM geometry_columns \
# WHERE Lower(f_table_name) = Lower(\'food_zones\') AND Lower(f_geometry_column) = Lower(\'GEOMETRY\') \
# AND GeometryConstraints(NEW."GEOMETRY", geometry_type, srid) = 1) IS NULL; \
# END;'

# cur.execute(query)

# query = 'CREATE TRIGGER "ggu_food_zones_GEOMETRY" BEFORE UPDATE ON "food_zones" \
# FOR EACH ROW BEGIN \
# SELECT RAISE(ROLLBACK, \'food_zones.GEOMETRY violates Geometry constraint [geom-type or SRID not allowed]\') \
# WHERE (SELECT geometry_type FROM geometry_columns \
# WHERE Lower(f_table_name) = Lower(\'food_zones\') AND Lower(f_geometry_column) = Lower(\'GEOMETRY\') \
# AND GeometryConstraints(NEW."GEOMETRY", geometry_type, srid) = 1) IS NULL; \
# END;'

# cur.execute(query)

# query = 'CREATE TRIGGER "gid_food_zones_GEOMETRY" AFTER DELETE ON "food_zones" \
# FOR EACH ROW BEGIN \
# UPDATE geometry_columns_time SET last_delete = strftime(\'%Y-%m-%dT%H:%M:%fZ\', \'now\') \
# WHERE Lower(f_table_name) = Lower(\'food_zones\') AND Lower(f_geometry_column) = Lower(\'GEOMETRY\'); \
# DELETE FROM "idx_food_zones_GEOMETRY" WHERE pkid=OLD.ROWID; \
# END;'

# cur.execute(query)

# query = 'CREATE TRIGGER "gii_food_zones_GEOMETRY" AFTER INSERT ON "food_zones" \
# FOR EACH ROW BEGIN \
# UPDATE geometry_columns_time SET last_insert = strftime(\'%Y-%m-%dT%H:%M:%fZ\', \'now\') \
# WHERE Lower(f_table_name) = Lower(\'food_zones\') AND Lower(f_geometry_column) = Lower(\'GEOMETRY\'); \
# DELETE FROM "idx_food_zones_GEOMETRY" WHERE pkid=NEW.ROWID; \
# SELECT RTreeAlign(\'idx_food_zones_GEOMETRY\', NEW.ROWID, NEW."GEOMETRY"); \
# END;'

# cur.execute(query)

# query = 'CREATE TRIGGER "giu_food_zones_GEOMETRY" AFTER UPDATE ON "food_zones" \
# FOR EACH ROW BEGIN \
# UPDATE geometry_columns_time SET last_update = strftime(\'%Y-%m-%dT%H:%M:%fZ\', \'now\') \
# WHERE Lower(f_table_name) = Lower(\'food_zones\') AND Lower(f_geometry_column) = Lower(\'GEOMETRY\'); \
# DELETE FROM "idx_food_zones_GEOMETRY" WHERE pkid=NEW.ROWID; \
# SELECT RTreeAlign(\'idx_food_zones_GEOMETRY\', NEW.ROWID, NEW."GEOMETRY"); \
# END;'

# cur.execute(query)

print 'Populating new table....'
for zone in zones:
    row = zone_dict[zone]
    columns = ""
    values = ""
    for key in row.keys():
        columns += "'%s', " % key
        if key == 'geometry':
            values += "GeomFromText('%s'), " % str(row[key])
        else:
            values += "%s, " % str(row[key])
    columns = columns[:-2]
    values = values[:-2]
    query = "INSERT INTO 'food_zones' (%s) VALUES (%s);" % (columns, values)
    # if zone == '10':
        # print query
    cur.execute(query)

conn.commit()
zone_q.close()
zone_row.close()
conn.close()
print 'Complete'
quit()