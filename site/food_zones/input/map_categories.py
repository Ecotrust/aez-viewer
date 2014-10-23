import os, csv, string

input_csv = './AgCensus_FoodHub_category_crosswalk.csv'
output_js = './new_categories.js'

category_object = {}

def cleanCatName(name):
    no_nos = [' ','&','\\']
    for bad_char in no_nos:
        name = string.join(name.split(bad_char),'')
    return name
    
if os.path.isfile(input_csv):
    with open('%s' % input_csv, 'rb') as csvfile:
        data = csv.reader(csvfile, delimiter=',')
        headers = data.next()
        code_idx = headers.index('Attribute Value')
        category_idx = headers.index('Category')
        label_idx = headers.index('Product Name')
        unit_idx = headers.index('Metric')
        for index, row in enumerate(data):
            cat_name = cleanCatName(row[category_idx])
            if not category_object.has_key(cat_name):
                category_object[cat_name] = {}
                category_object[cat_name]['name'] = row[category_idx]
                category_object[cat_name]['option_attributes'] = ["name"]
                category_object[cat_name]['options'] = {}
            crop_data = {'name': row[label_idx]}
            if not row[unit_idx] == "":
                crop_data['qty'] = row[unit_idx]
                if 'qty' not in category_object[cat_name]['option_attributes']:
                    category_object[cat_name]['option_attributes'].append('qty')
            category_object[cat_name]['options'][row[code_idx].lower()] = crop_data

with open('%s' % output_js, 'wb') as outfile:
    outfile.write('var types = %s;' % str(category_object))
