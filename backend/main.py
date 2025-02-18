import shutil
from flask import Flask, request,jsonify
from flask_cors import (CORS)
from BdManager import *

from flask_mail import Mail, Message
import secrets
from datetime import datetime, timedelta



app = Flask(__name__)
mail = Mail(app)
CORS(app)
@app.route('/returnByTeacher', methods=['POST'])
def returnByTeacher():
    s = []
    request_data = request.get_json()
    if not request_data or "class" not in request_data:
        return jsonify({"error": "Missing 'class' parameter"}), 400  # Return 400 if missing
    teacher = request_data["class"]
    for i in data:
        if i["teacher"].strip()==teacher.strip():
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
        if type(i["class"])!=float and   (i["class"].strip() in students or students.strip() in i["class"].strip()):
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
    for i in data:
        if i["room"].strip() == room.strip():
            s.append(i)
    print("function completed")
    return jsonify({"message": s}), 200
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
    data_=request_data["data"]
    name=request_data["name"]
    if name=="teachers":
        message,status=add_teacher(db,data_)
    elif name=="rooms":
        message,status=add_room(db,data_)
    elif name=="users":
        message,status=add_user(db,data_)
    elif name=="classes":
        message,status=add_class(db,data_)
    elif name=="schedule":
        message,status= add_session(db, data, data_)
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
@app.route("/changeSchedules", methods=["POST"])
def changeSchedules():
    if 'file' not in request.files:
        return jsonify({"error", 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"errot":'No selected file'}), 400
    if file:
        data_path = "data/"
        shutil.rmtree(data_path)
        os.makedirs(data_path)
        file_path=os.path.join(data_path, file.filename)
        file.save(file_path)
        message,status=readData(db,data_path)
        print(message)
        print(f"File saved to {file_path}")
        return jsonify({"message":'File uploaded and saved successfully'}), 200
    else:
        return jsonify({"errot":'No selected file'}), 400
@app.route("/updateSession",methods=["POST"])
def updateSession():
    request_data = request.get_json()
    if not request_data or "event" not in request_data or "change" not in request_data or "role" not in request_data or "resize" not in request_data:
        return jsonify({"error": "Missing parameter"}), 400
    role=request_data["role"]
    if role!="admin":
        return jsonify({"error":"Permission denied"}), 400
    change=request_data["change"]
    event = request_data["event"]
    event["id"] = (event["id"].split("-"))[-3] + "-" + (event["id"].split("-"))[-2]
    if change=="time":
        resize=request_data["resize"]
        if len(event["id"])!=13:
            event["id"]=time_config(event["id"])
        if len(event["time"])!=13:
            event["time"]=time_config(event["time"])
        message,state= edit_session_time(db, data, event, resize == "true")
        if state==400:
            return jsonify({"error":message}),state
        return jsonify({"message":message}),200
    elif change=="infos":
        event.pop("id")
        print(event)
        message,state=edit_session_infos(db,data,event)
        if state==400:
            return jsonify({"error":message}),state
        else:
            return jsonify({"message":message}),200
    else:
        return jsonify({"error":"not supported"}), 400
@app.route("/deleteSession",methods=["POST"])
def deleteSession():
    request_data = request.get_json()
    if not request_data or not "session" in request_data or not "role" in request_data:
        return jsonify({"error": "Missing parameter"}), 400
    role=request_data["role"]
    if role!="admin":
        return jsonify({"error":"Permission denied"}), 400
    session=request_data["session"]
    message,state= delete_session(db, data, session)
    if state==400:
        return jsonify({"error":message}),state
    else:
        return jsonify({"message":message}),200



# Configure Flask-Mail
app.config['MAIL_SERVER'] = 'university.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'ahmedmtawahg@gmail.com'  # Replace with your email
app.config['MAIL_PASSWORD'] = 'azerty1230'     # Replace with your app password
mail = Mail(app)

# Add these new routes to your existing main.py
@app.route('/api/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')
    
    if not email:
        return jsonify({"error": "Email is required"}), 400
    
    db = get_db()
    success, result = initiate_password_reset(db, email)
    
    if not success:
        return jsonify({"error": result}), 400
    
    # Send reset email
    reset_link = f"http://localhost:3000/reset-password?token={result}"
    
    try:
        msg = Message(
            'Password Reset Request',
            sender=app.config['MAIL_USERNAME'],
            recipients=[email]
        )
        msg.body = f'''To reset your password, visit the following link:
{reset_link}

If you did not make this request, please ignore this email.
'''
        mail.send(msg)
        return jsonify({"message": "Reset link sent successfully"}), 200
    except Exception as e:
        print(e)
        return jsonify({"error": "Failed to send reset email"}), 500



def allTeachers():
    return teachers_list(db)
def allClasses():
    return classes_list(db)
def allRooms():
    return rooms_list(db)
def allUsers():
    return users_list(db)
if __name__ == '__main__':
    days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"]
    db=get_db()
    if "reset_tokens" not in db.list_collection_names():
        db.create_collection("reset_tokens")
        db.reset_tokens.create_index("expires_at", expireAfterSeconds=3600)  # Automatically delete after 1 hour
    data=schedules(db)
    app.run(debug=True)