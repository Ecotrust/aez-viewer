
# coding: utf-8

# # Calculting "Super-subzones"
# 
# The fundamental unit of analysis for the food production data is the **subzone**. These can aggregate up to zones and regions for some analytical purposes but, since zones can cross county lines, we may introduce novel crops to different regions as a result. Still there is a need for some aggregation as the subzones are mostly just tiny little inclusion polygons, a remnant from earlier analyses. Additionally there is substaintial performance benefit to reducing the number of features.
# 
# This notebook outlines the process of creating **supersubzones** which aggregate the small subzones into their larger neighbors.

# In[1]:

import pandas as pd
import sqlite3
import numpy as np

con = sqlite3.connect("food_zones_all.sqlite")
df = pd.read_sql("""

    SELECT isozone as subzone, subzone_lookup_iso_maj3_27 as zone, acres_fn_sum_f_area as acres, acres_fn_count as pixels
    FROM food_zones_all
    ORDER BY subzone_lookup_iso_maj3_27
    
""", con)
df.head()


# In[2]:

# Convert some types
df[['subzone', u'zone', u'pixels']] = df[['subzone', u'zone', u'pixels']].astype(int)
df[[u'acres']] = df[[u'acres']].astype(int)


# In[3]:

subzones = df.shape[0]
subzones


# There are plenty of single pixel subzones that we should be able to get rid of. Let's take a look at the distribition of pixel counts for each subzone

# In[4]:

df.hist(column="pixels", bins=40)


# As expected, the majority of cells are very tiny. Let's look at some thresholds to see how far we might reduce the number of rows

# In[5]:

for i in range(2, 30, 2):
    n = df[df.pixels >= i].shape[0]
    print("Threshold {} pixels => {} rows ... a {:0.2f} x reduction".format(i, n, subzones/float(n)))


# Let's pick an arbitrary threshold and explore how we might get rid of these pesky tiny polygons.
# 
# At this point let's assume that redoing the spatial data to eliminate the inclusions is not an option. The only remaining option is to aggregate the smaller subzones up to our "super-subzones" and create multipolygon geometries. But which zones should be grouped together?
# 
# It seems like breaking the zone membership is not an option; we have to aggregate within the 176 defined zones. 
# 
# The tiny subzones need to be aggregated to the **nearest subzone above our size threshold**.
# 
# So we start by creating a new column `supersubzone` and populating it with the subzone id *only* if over the size threshold.

# In[6]:

threshold = 6
df["supersubzone"] = np.nan
df.ix[df.pixels >= threshold, 'supersubzone'] = df.subzone
df[df.zone==1]


# For the remaining tiny polygons, we have to determine which subzone to pair them with. It has to be nearby (we can use the `subzone` id as a proxy for distance based on how we know they were defined) and it has to be in the same zone.
# 
# The easiest way might be to loop through the zones etc

# In[7]:

big = df[pd.notnull(df.supersubzone)]
tiny = df[pd.isnull(df.supersubzone)]

for zone in df.zone.unique():
    ztiny = tiny[tiny.zone == zone]
    zbig = big[big.zone == zone]
    for subzone in ztiny.subzone:
        # Find nearest subzone in zbig
        nearest = int(zbig.ix[(zbig.subzone - subzone).abs().argmin()].subzone)
        # print subzone, "nearest is", nearest
        
        # assign nearest as supersubzone in original dataframe
        df.ix[df.subzone == subzone, 'supersubzone'] = nearest

df[df.zone==1]


# You can see that our the subzones that comprise zone 1 are now reduced to far fewer supersubzones

# In[8]:

print df[df.zone==1].subzone.unique().shape[0]
print df[df.zone==1].supersubzone.unique().shape[0]


# In[9]:

# And overall
print df.subzone.unique().shape[0]
print df.supersubzone.unique().shape[0]


# Finally, we can output the completed dataframe to a csv for use in the data processing scripts

# In[10]:

df[[u'supersubzone']] = df[[u'supersubzone']].astype(int)
df.to_csv("lookup_supersubzones.csv", columns=['subzone','zone','supersubzone'], index_label='index')

