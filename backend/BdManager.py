from pymongo import MongoClient
import pandas as pd
import os
import numpy as np
import bcrypt

def get_db():
    client = MongoClient("mongodb://localhost:27017/")
    db = client["SchcedulePrj"]
    return db
def schedules(db,id=False):
    if id :
        return list(db["schedules"].find())
    else:
        return list(db["schedules"].find({},{"_id":0}))

def teachers_list(db,id=False):
    if id :
        return list(db["teachers_list"].find())
    else:
        return list(db["teachers_list"].find({},{"_id":0}))
def teachers_schedule(db,id=False):
    if id :
        return list(db["teachers_schedule"].find())
    else:
        return list(db["teachers_schedule"].find({},{"_id":0}))
def add_teacher(db,teacher):
    return addToTable(db["teachers_list"],teacher)

def classes_list(db,id=False):
    if id :
        return list(db["classes_list"].find())
    else:
        return list(db["classes_list"].find({},{"_id":0}))
def classes_schedule(db,id=False):
    if id :
        return list(db["classes_schedule"].find())
    else:
        return list(db["classes_schedule"].find({},{"_id":0}))
def add_class(db,cl):
    return addToTable(db["classes_list"],cl)

def rooms_list(db,id=False):
    if id :
        return list(db["rooms_list"].find())
    else:
        return list(db["rooms_list"].find({},{"_id":0}))
def rooms_schedule(db,id=False):
    if id :
        return list(db["rooms_schedule"].find())
    else:
        return list(db["rooms_schedule"].find({},{"_id":0}))
def add_room(db,room):
    return addToTable(db["rooms_list"],room)

def users_list(db,id=False):
    if id :
        return list(db["users"].find())
    else:
        return list(db["users"].find({},{"_id":0}))
def add_user(db,user):
    users=db["users"]
    if exists(users,"email",user["email"]):
        return False,"Email already exists"
    user["password"]=hash_password(user["password"])
    users.insert_one(user)
    return True,"success"
def verifUser(db,email,password):
    users=db["users"]
    user=users.find_one({"email":email},{'_id':0})
    if not user:
        return "email does not exist",None
    if verify_password(user["password"],password):
        user.pop("password")
        return "user is correct",user
    else:
        return "wrong password",None

def addToTable(table,row):
    try:
        table.insert_one(row)
        return True
    except:
        return False
def exists(table,attribute,value):
    row=table.find_one({attribute: value})
    if row:
        return True
    else:
        return False

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
def hash_password(password):
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode(), salt)

def verify_password(stored_password, provided_password):
    return bcrypt.checkpw(provided_password.encode('utf-8'), stored_password)
