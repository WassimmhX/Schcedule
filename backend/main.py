import pandas as pd
import os
from flask import Flask, render_template, request,jsonify
from flask_cors import (CORS)
import numpy as np
app = Flask(__name__)
CORS(app)
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
            case = {}
            case["room"] = df[i][0]
            case["day"] = df[0][((j // 7) * 7) + 1]
            case["time"] = df[1][j]
            case["class"] = df[i][j]
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
    data = readData()
    s=[]
    request_data = request.get_json()
    if not request_data or "class" not in request_data:
        return jsonify({"error": "Missing 'class' parameter"}), 400  # Return 400 if missing
    students = request_data["class"]
    for i in data:
        print(students,type(i["class"]))
        if type(i["class"])!=float and   (i["class"] in students or students in i["class"]):
            s.append(i)
    print("function completed")
    return jsonify({"message": s}), 200

def returnBySubject(data,subject):
    s=[]
    for i in data:
        if i["subject"] == subject:
            s.append(i)
    return s
def returnByClass(data,classroom):
    s=[]
    for i in data:
        if i["classroom"] == classroom:
            s.append(i)
    return s
if __name__ == '__main__':
    app.run(debug=True)