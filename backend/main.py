from bson import ObjectId
from flask import Flask, render_template, request,jsonify
from flask_cors import (CORS)
import re
from BdManager import *
app = Flask(__name__)
CORS(app)

def returnByTeacher(teacher):
    s=[]
    for i in data:
        if i["teacher"] == teacher:
            s.append(i)
    return s
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
def returnBySubject(subject):
    s=[]
    for i in data:
        if i["subject"] == subject:
            s.append(i)
    return s
def returnByClassroom(classroom):
    s=[]
    for i in data:
        if i["classroom"] == classroom:
            s.append(i)
    return s

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
    if name=="classes":
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
    message,user=verifUser(db,email,password)
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
        if user[i]=="":
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
if __name__ == '__main__':
    db=get_db()
    data=schedules(db)
    app.run(debug=True)