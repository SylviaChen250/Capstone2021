import json
import random

with open('meldata.json','r') as f:
    new_dict = json.loads(f.readline())
new_dict['features'] = new_dict['features'][:250]
new_dict['numberMatched'] = 250
new_dict['numberReturned'] = 250
new_dict['totalFeatures'] = 250
# new_dict = new_dict[:20]
for building in new_dict['features']:
    building['material']=round(random.uniform(7,25))
with open('smallData.json','w') as f2:
    json.dump(new_dict,f2)