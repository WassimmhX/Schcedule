from pymongo import MongoClient
import pandas as pd
import os
import numpy as np
db={}
def get_db():
    client = MongoClient("mongodb://localhost:27017/")
    db = client["SchcedulePrj"]
    return db
def teachers_list(db):
    return db["teachers_list"]
def classes_list(db):
    return db["classes_list"]
def rooms_list(db):
    return db["rooms_list"]
def teachers_schedule(db):
    return db["teachers_schedule"]
def classes_schedule(db):
    return db["classes_schedule"]
def rooms_schedule(db):
    return db["rooms_schedule"]
def schedules(db):
    return db["schedules"]
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
            if case["class"].find("|")!=-1:
                case["time"] = case["class"][case["class"].index("|") + 1:]
                case["class"] = case["class"][:case["class"].index("|")]
            else:
                case["time"] = df[1][j]
            case["teacher"] = df[i + 1][j]
            case["subject"] = df[i + 2][j]
            data.append(case)
    print("read data completed")
    return data
def addToTable(table,row):
    try:
        table.insert_one(row)
        return True
    except:
        return False
