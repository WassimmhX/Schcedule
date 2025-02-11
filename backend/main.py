from bson import ObjectId
from flask import Flask, render_template, request,jsonify
from flask_cors import (CORS)
import re

# from streamlit import status

from BdManager import *
app = Flask(__name__)
CORS(app)
@app.route('/returnByTeacher', methods=['POST'])
def returnByTeacher():
    s = []
    request_data = request.get_json()
    if not request_data or "class" not in request_data:
        return jsonify({"error": "Missing 'class' parameter"}), 400  # Return 400 if missing
    teacher = request_data["class"]
    for i in data:
        if i["teacher"]==teacher:
            s.append(i)
    print("function completed")
    return jsonify({"message": s}), 200
@app.route('/returnByClass', methods=['POST'])
def returnByClass():
    s=[]
    request_data = request.get_json()
    if not request_data or "class" not in request_data:
        return jsonify({"error": "Missing 'class' parameter"}), 400  # Return 400 if missing
    students = request_data["class"]
    for i in data:
        if type(i["class"])!=float and   (i["class"] in students or students in i["class"]):
            s.append(i)
    print("function completed")
    return jsonify({"message": s}), 200
@app.route('/returnByRoom', methods=['POST'])
def returnByRoom():
    s = []
    request_data = request.get_json()
    if not request_data or "class" not in request_data:
        return jsonify({"error": "Missing 'class' parameter"}), 400  # Return 400 if missing
    room = request_data["class"]
    print(room)
    for i in data:
        if i["room"] == room:
            s.append(i)
    print("function completed")
    return jsonify({"message": s}), 200

def allTeachers():
    return teachers_list(db)
def allClasses():
    return classes_list(db)
def allRooms():
    return rooms_list(db)
def allUsers():
    return users_list(db)

@app.route('/getData', methods=['POST'])
def getData():
    request_data = request.get_json()
    if not request_data or "name" not in request_data:
        return jsonify({"error": "Missing 'class' parameter"}), 400  # Return 400 if missing
    name = request_data["name"]
    if name=="teachers":
        print("function completed")
        return jsonify({"message": allTeachers()}), 200
    if name=="rooms":
        print("function completed")
        return jsonify({"message": allRooms()}), 200
    if name=="classes":
        print("function completed")
        return jsonify({"message": allClasses()}), 200
    if name=="users":
        print("function completed")
        return jsonify({"message": allUsers()}), 200
    else:
        return jsonify({"error":"not supported"}), 400
@app.route("/testLogin", methods=['POST'])
def testLogin():
    request_data = request.get_json()
    if not request_data or "email" not in request_data:
        return jsonify({"error": "Missing 'email' parameter"}), 400 # Return 400 if missing
    if not request_data or "password" not in request_data:
        return jsonify({"error": "Missing 'password' parameter"}), 400  # Return 400 if missing
    email = request_data["email"]
    password = request_data["password"]
    message,user= verifLogin(db, email, password)
    if user==None:
        return jsonify({"error":message}), 400
    else:
        return jsonify({"message":user}), 200

@app.route("/testSignUp",methods=["POST"])
def testSingUp():
    request_data = request.get_json()
    if not request_data or "user" not in request_data:
        return jsonify({"error": "Missing 'user' parameter"}), 400
    user=request_data["user"]
    message,state=add_user(db,user)
    if state==200:
        user.pop("password")
        user.pop("_id")
        return jsonify(user), 200
    else:
        return jsonify({"error": message}), 400
    
def json_serializable(obj):
    if isinstance(obj, ObjectId):
        return str(obj)  # Convert ObjectId to string
    return obj

@app.route('/updateUserSchedule', methods=['POST'])
def updateUserSchedule():
    request_data = request.get_json()
    if not request_data or "schedule" not in request_data:
        return jsonify({"error": "Missing 'schedule' parameter"}), 400
    if not "email" in request_data:
        return jsonify({"error": "Missing 'email' parameter"}), 400
    schedule = request_data["schedule"]
    email=request_data["email"]
    update_MySchedule(db,email,schedule)
    return jsonify({"message": "User schedule updated successfully"}), 200
@app.route("/getMySchedule", methods=["GET"])
def getMySchedule():
    request_data = request.get_json()
    if not "email" in request_data:
        return jsonify({"error": "Missing 'email' parameter"}), 400
    email=request_data["email"]
    schedule=getUserAttribute(db,email,"mySchedule")
    return jsonify({"schedule":schedule}), 200

@app.route("/addData", methods=["POST"])
def addData():
    request_data = request.get_json()
    if not request_data or "data" not in request_data or "name" not in request_data:
        return jsonify({"error": "Missing a parameter"}), 400
    data=request_data["data"]
    name=request_data["name"]
    if name=="teachers":
        message,status=add_teacher(db,data)
    elif name=="rooms":
        message,status=add_room(db,data)
    elif name=="users":
        message,status=add_user(db,data)
    elif name=="classes":
        message,status=add_class(db,data)
    else:
        return jsonify({"error": "adding is not supported"}), 400
    if status==200:
        return jsonify({"message": message}), 200
    else:
        return jsonify({"error": message}), 400

@app.route("/updateData", methods=["POST"])
def updateData():
    request_data = request.get_json()
    if not request_data and "name" not in request_data:
        return jsonify({"error": "Missing 'name' parameter"}), 400
    if not "data" in request_data:
        return jsonify({"error": "Missing 'data' parameter"}), 400
    name = request_data["name"]
    data = request_data["data"]
    message={"error":"error occured"}
    responseType=400
    if name=="users":
        message,responseType=updateUser(db,data)
    if name=="teachers":
        print(data)
        message,responseType=updateTeacher(db,data)
    return jsonify(message),responseType
@app.route("/deleteData", methods=["POST"])
def deleteData():
    request_data = request.get_json()
    if not request_data or "name" not in request_data or "key" not in request_data:
        return jsonify({"error": "Missing 'data' parameter"}), 400
    key = request_data["key"]
    name = request_data["name"]
    if name=="users":
        message, status=deleteUser(db,key)
    elif name=="teachers":
        message, status=deleteTeacher(db,key)
    elif name=="rooms":
        message, status=deleteRoom(db,key)
    elif name=="classes":
        message, status=deleteClass(db,key)
    else:
        return  jsonify({"error":"delete is not supported"}), 400
    if status==400:
        return jsonify({"error":message}),400
    else:
        return jsonify({"message":message}), 200

@app.route("/nbData", methods=["POST"])
def nbData():
    request_data = request.get_json()
    if not request_data or "name" not in request_data:
        return jsonify({"error": "Missing 'name' parameter"}), 400
    name = request_data["name"]
    if name=="teachers":
        return jsonify({"nb":nb_teacher(db)}),200
    if name=="users":
        return jsonify({"nb":nb_user(db)}),200
    if name=="classes":
        return jsonify({"nb":nb_class(db)}),200
    if name=="rooms":
        return jsonify({"nb":nb_room(db)}),200
    else:
        return jsonify({"error":"not supported"}), 400
if __name__ == '__main__':
    db=get_db()
    data=schedules(db)
    app.run(debug=True)