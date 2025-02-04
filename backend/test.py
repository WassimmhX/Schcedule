import pandas as pd
import numpy as np
import os
times=["08:30 - 10:00","10:15 - 11:45","12:00 - 13:30","13:00 - 14:30","14:45 - 16:15","16:30 - 18:00"]
days=["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"]
def readData():
    execls = "excels/"
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
                print(case["class"])
                case["class"]=case["class"][:case["class"].index("|")]
                print(case)
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
print(allTeachers())