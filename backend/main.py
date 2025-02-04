from flask import Flask, render_template, request,jsonify
from flask_cors import (CORS)
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
if __name__ == '__main__':
    db=get_db()
    data=schedules(db)
    app.run(debug=True)