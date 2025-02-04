import copy

from pymongo import MongoClient
from test import readData
client = MongoClient("mongodb://localhost:27017/")
db = client["SchcedulePrj"]
collection = [i["name"] for i in list(db["classes_list"].find({},{"_id": 0}))]
t_schedule=db["classes_schedule"]
data=readData()
times={"Lundi":[""],"Mardi":[""],"Mercredi":[""],"Jeudi":[""],"Vendredi":[""],"Samedi":[""]}
all={}
for i in collection:
    all[i]=copy.deepcopy(times)
for i in data:
    t=False
    for j in collection:
        if i["class"] in j or j in i["class"] :
            t=True
            break
    if t:
        all[j][i["day"]].append(i["time"])

for key,value in all.items():
    print(key,value)
    t_schedule.insert_one({key:value})
print(list(t_schedule.find()))