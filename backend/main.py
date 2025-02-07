from bson import ObjectId
from flask import Flask, render_template, request,jsonify
from flask_cors import (CORS)
import re
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
@app.route('/returnByRooms', methods=['POST'])
def returnByClassroom(classroom):
    s = []
    request_data = request.get_json()
    if not request_data or "name" not in request_data:
        return jsonify({"error": "Missing 'name' parameter"}), 400  # Return 400 if missing
    room = request_data["name"]
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
    if name=="students":
        print("function completed")
        return jsonify({"message": allClasses()}), 200

@app.route("/testLogin", methods=['POST'])
def testLogin():
    request_data = request.get_json()
    print(request_data)
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
    for i in user.keys():
        if user[i]=="" and i!="mySchedule":
            return jsonify({"error":i+" is empty!!"}), 400
    if not re.match(r'^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', user["email"]):
        return jsonify({"error": "Invalid email"}), 400
    if len(user["phoneNumber"])!=8:
        return jsonify({"error": "Invalid phoneNumber"}), 400
    if not re.match(r"^[a-zA-Z\s'-]+$",user["name"]):
        return jsonify({"error": "Invalid name"}), 400
    if len(user["password"].strip())<4:
        return jsonify({"error": "Password should be more then 4 characters"}), 400
    state,message=add_user(db,user)
    if state:
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
@app.route("/editData", methods=["POST"])
def editData():
    request_data = request.get_json()
    if not request_data and "name" not in request_data:
        return jsonify({"error": "Missing 'name' parameter"}), 400
    if not "data" in request_data:
        return jsonify({"error": "Missing 'data' parameter"}), 400
    name = request_data["name"]
    data = request_data["data"]
    message={"error":"error occured"}
    responseType=400
    if name=="user":
        message,responseType=updateUser(db,data)
    if name=="teacher":
        message,responseType=updateTeacher(db,data)
    return jsonify(message),responseType
@app.route("/deleteData", methods=["POST"])
def deleteData():
    request_data = request.get_json()
    if not request_data or "name" not in request_data or "key" not in request_data:
        return jsonify({"error": "Missing 'data' parameter"}), 400
    key = request_data["key"]
    name = request_data["name"]
    if name=="user":
        message=deleteUser(db,key)
    elif name=="teacher":
        message=deleteTeacher(db,key)
    elif name=="room":
        message=deleteRoom(db,key)
    return jsonify({"message":message}), 200

if __name__ == '__main__':
    db=get_db()
    data=schedules(db)
    app.run(debug=True)