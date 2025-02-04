import pandas as pd
import os
from flask import Flask, render_template, request,jsonify
from flask_cors import (CORS)
import numpy as np
app = Flask(__name__)
CORS(app)
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
def returnByTeacher(teacher):
    data = readData()
    s=[]
    for i in data:
        if i["teacher"] == teacher:
            s.append(i)
    return s
@app.route('/returnByStudent', methods=['POST'])
def returnByStudent():
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
def returnByClass(classroom):
    s=[]
    for i in data:
        if i["classroom"] == classroom:
            s.append(i)
    return s

def allTeachers():
    teachers=set()
    for i in data:
        teachers.add(i["teacher"])
    return list(teachers)
def allClasses():
    classes=set()
    for i in data:
        classes.add(i["class"])
    return list(classes)
def allSubjects():
    subjects=set()
    for i in data:
        subjects.add(i["subject"])
    return list(subjects)
def allRooms():
    rooms=set()
    for i in data:
        rooms.add(i["room"])
    return list(rooms)

@app.route('/getData', methods=['POST'])
def getData():
    request_data = request.get_json()
    if not request_data or "name" not in request_data:
        return jsonify({"error": "Missing 'class' parameter"}), 400  # Return 400 if missing
    name = request_data["name"]
    if name=="teachers":
        print("function completed")
        return jsonify({"message": allTeachers()}), 200
    if name=="subjects":
        print("function completed")
        return jsonify({"message": allSubjects()}), 200
    if name=="rooms":
        print("function completed")
        return jsonify({"message": allRooms()}), 200
    if name=="classes":
        print("function completed")
        return jsonify({"message": allClasses()}), 200
if __name__ == '__main__':
    data = readData()
    app.run(debug=True)