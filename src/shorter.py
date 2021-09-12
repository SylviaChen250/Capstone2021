import json

with open('meldata.json','r') as f:
    new_dict = json.loads(f.readline())
new_dict['features'] = new_dict['features'][:40]
new_dict['numberMatched'] = 40
new_dict['numberReturned'] = 40
new_dict['totalFeatures'] = 40
# new_dict = new_dict[:20]
with open('smallData.json','w') as f2:
    json.dump(new_dict,f2)