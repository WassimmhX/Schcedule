from pymongo import MongoClient
import pandas as pd
import os
import numpy as np
import bcrypt
import re
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
    teachers = db["teachers_list"]
    if exists(teachers,"email",teacher["email"]):
        return False,"Email already exists",400
    if not re.match(r'^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', teacher["email"]):
        return "invalid email",400
    if not re.match(r"^[a-zA-Z\s'-]+$",teacher["name"]):
        return "Invalid name",400
    teachers.insert_one(teacher)
    return "success", 200
def updateTeacher(db,teacher):
    if "name" not in teacher or 'email' not in teacher:
        return {"error": "Missing 'data' parameter"}, 400
    if not re.match(r'^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', teacher["email"]):
        return {"error": "Invalid email"}, 400
    if not re.match(r"^[a-zA-Z\s'-]+$", teacher["name"]):
        return {"error": "Invalid name"}, 400
    teachers=db["teachers_list"]
    if not teachers.find_one({"email":teacher["email"]}):
        return {"error": "Email does not exist"}, 400
    teachers.update_one({"email":teacher["email"]},{"$set":{"name":teacher["name"]}})
    return {"succes": "updated successfully"}, 200
def deleteTeacher(db,email):
    teachers=db["teachers_list"]
    try:
        teachers.delete_one({"email":email})
        return "deleted successfully",200
    except:
        return  "Email does not exist",400

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
def deleteClass(db,name):
    classes=db["classes_list"]
    try:
        classes.delete_one({"name":name})
        return "deleted successfully",200
    except:
        return  "Email does not exist",400

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
    rooms = db["rooms_list"]
    if exists(rooms, "name", room["name"]):
        return "Room already exists",400
    rooms.insert_one(room)
    return "success", 200
def deleteRoom(db,name):
    rooms=db["rooms_list"]
    try:
        rooms.delete_one({"name":name})
        return "deleted successfully",200
    except:
        return  "Room does not exist",400

def users_list(db,id=False):
    if id :
        return list(db["users"].find())
    else:
        return list(db["users"].find({},{"_id":0,"password":0}))
def add_user(db,user):
    users=db["users"]
    if exists(users,"email",user["email"]):
        return False,"Email already exists"

    for i in user.keys():
        if user[i]=="" and i!="mySchedule":
            return i+"is empty",400
    if not re.match(r'^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', user["email"]):
        return "invalid email",400
    if len(user["phoneNumber"])!=8:
        return "Invalid phone number",400
    if not re.match(r"^[a-zA-Z\s'-]+$",user["name"]):
        return "Invalid name",400
    if len(user["password"].strip())<4:
        return "Password must be more then 4 characters",400
    user["password"]=hash_password(user["password"])
    users.insert_one(user)
    return "success",200
def verifLogin(db,email,password):
    users=db["users"]
    user=users.find_one({"email":email},{'_id':0})
    if not user:
        return "email does not exist",None
    if verify_password(user["password"],password):
        user.pop("password")
        return "user is correct",user
    else:
        return "wrong password",None
def update_MySchedule(db,email,schedule):
    users=db["users"]
    print(email)
    users.update_one({"email":email},{"$set":{"mySchedule":schedule}})
    print(users.find_one({"email":email}))
def getUserAttribute(db,email,attribute):
    users=db["users"]
    user=users.find_one({"email":email},{'_id':0})
    return user[attribute]
def updateUser(db,user):
    if "name" not in user or 'email' not in user or "phoneNumber" not in user or "role" not in user:
        return {"error": "Missing 'data' parameter"}, 400
    if not re.match(r'^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', user["email"]):
        return {"error": "Invalid email"}, 400
    if len(user["phoneNumber"]) != 8:
        return {"error": "Invalid phoneNumber"}, 400
    if not re.match(r"^[a-zA-Z\s'-]+$", user["name"]):
        return {"error": "Invalid name"}, 400
    users=db["users"]
    oldUser=users.find_one({"email":user["email"]})
    if not oldUser:
        return {"error": "Email does not exist"}, 400
    if oldUser["role"]=="admin"!=user["role"]:
        return {"error": "You can't change the role of an admin"}, 400
    users.update_one({"email":user["email"]},{"$set":{"name":user["name"],"phoneNumber":user["phoneNumber"],"role":user["role"]}})

    return {"success":"successfully updated"}
def deleteUser(db,email):
    users=db["users"]
    try:
        users.delete_one({"email":email})
        return "deleted successfully",200
    except:
        return  "Email does not exist",400

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