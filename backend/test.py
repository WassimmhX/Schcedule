import pandas as pd
import numpy as np
import os

from pymongo import MongoClient

times=["08:30 - 10:00","10:15 - 11:45","12:00 - 13:30","13:00 - 14:30","14:45 - 16:15","16:30 - 18:00"]
days=["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"]
def readData():
    execls = "backend/excels/"
    for file in os.listdir(execls):
        df = pd.read_excel(execls + file, header=None)
    df = df.values
    data = []
    for i in range(2, len(df), 3):
        for j in range(1, len(df[i])):
            if j % 7 == 0:
                continue
            if df[i + 1][j] is np.nan or df[i][j] is np.nan:
                continue
            case = {}
            case["room"] = df[i][0]
            case["day"] = df[0][((j // 7) * 7) + 1]
            case["class"] = df[i][j]
            case["teacher"] = df[i + 1][j]
            case["subject"] = df[i + 2][j]
            if case["class"].find("|")!=-1:
                case["time"]=case["class"][case["class"].index("|")+1:]
                case["class"]=case["class"][:case["class"].index("|")]
            else:
                case["time"] = df[1][j]
            data.append(case)
    print("read data completed")
    return data
def returnByStudent(name):
    data = readData()
    s=[]
    for i in data:
        if i["class"] == name:
            s.append(i)
    emp=np.full((10,10),"")
    for i in s:
        cell=i["class"]+i["teacher"]+i["subject"]
        emp[days.index(i["day"])][times.index(i["time"])]=cell
    print("function completed")
    return s
def allTeachers():
    teachers=[]
    data=readData()
    for i in data:
        teachers.append(i["teacher"])
    return teachers
test={"id":"1","name":5}
print(test)
print(test.pop("id"))
print(test)
client = MongoClient("mongodb://localhost:27017/")
db = client["Schedules"]
data=readData()
db["schedules"].drop()
db["schedules"].insert_many(data)
db["rooms_list"].drop()
table=db["rooms_list"]
rooms=set()
for i in data:
    rooms.add(i["room"])

table.insert_many([{"name":i} for i in rooms])
db["teachers_list"].drop()
table=db["teachers_list"]
teachers=set()
for i in data:
    teachers.add(i["teacher"])
table.insert_many([{"name":i} for i in teachers])
table=db["teachers_list"]
teachers=table.find()
for i,user in enumerate(teachers):
    table.update_one({"_id":user["_id"]},{"$set":{"email":"teacher"+str(i+1)+"@gmail.com"}})
db["classes_list"].drop()
table=db["classes_list"]
classes=set()
for i in data:
    t=False
    print("class::::",i["class"])
    for j in classes:
        print("j:",j)
        if i["class"] in j or j in i["class"]:
            print(1)
            if len(i["class"])<len(j):
                classes.remove(j)
                classes.add(i["class"])
            t=True
            break
    if not t:
        classes.add(i["class"])
print(classes)
table.insert_many([{"name":i} for i in classes])
import copy

collection = [i["name"] for i in list(db["classes_list"].find({},{"_id": 0}))]
db["classes_schedule"].drop()
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
    t_schedule.insert_one({"name":key,"schedule":value})