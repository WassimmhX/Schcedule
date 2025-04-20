import shutil, os, json, asyncio
from datetime import datetime
from fastapi import FastAPI, Request, UploadFile, File
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import BaseModel, EmailStr
from backend.BdManager import *

from backend.ai.agentV2 import AIAgent
from dotenv import load_dotenv
load_dotenv()
# App & Mail config
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Set to your frontend origin if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

conf = ConnectionConfig(
    MAIL_USERNAME=os.environ["MAIL_USERNAME"],
    MAIL_PASSWORD=os.environ["MAIL_PASSWORD"],
    MAIL_FROM=os.environ["MAIL_FROM"],
    MAIL_PORT=587,
    MAIL_SERVER='smtp.gmail.com',
    MAIL_STARTTLS=True,       # use this instead of MAIL_TLS
    MAIL_SSL_TLS=False,       # use this instead of MAIL_SSL
    USE_CREDENTIALS=True
)

fm = FastMail(conf)

# Init DB & Data
db = get_db()
data = schedules(db)

# --------------------------- MODELS ---------------------------
class EmailResetRequest(BaseModel):
    email: EmailStr
    href: str

class ResetPasswordRequest(BaseModel):
    token: str
    password: str

# --------------------------- ROUTES ---------------------------

@app.get("/chat")
async def chat(message: str):
    user_message = message

    async def event_stream():
        queue = asyncio.Queue()
        agent = AIAgent(queue=queue)
        async for item in agent.generate_response(user_message):
            yield f"data: {json.dumps(item)}\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")


@app.post("/testLogin")
async def test_login(request: Request):
    data = await request.json()
    email = data.get("email")
    password = data.get("password")
    if not email or not password:
        return JSONResponse({"error": "Missing 'email' or 'password'"}, status_code=400)

    message, user = verifLogin(db, email, password)
    return JSONResponse({"message": user} if user else {"error": message}, status_code=200 if user else 400)


@app.post("/testSignUp")
async def test_signup(request: Request):
    data = await request.json()
    user = data.get("user")
    if not user:
        return JSONResponse({"error": "Missing 'user'"}, status_code=400)
    message, status = add_user(db, user)
    if status == 200:
        user.pop("password", None)
        user.pop("_id", None)
        return JSONResponse(user)
    return JSONResponse({"error": message}, status_code=400)


@app.post("/getMySchedule")
async def get_my_schedule(request: Request):
    data = await request.json()
    email = data.get("email")
    if not email:
        return JSONResponse({"error": "Missing 'email'"}, status_code=400)
    schedule = getUserAttribute(db, email, "mySchedule")
    return JSONResponse({"schedule": schedule})


@app.post("/updateUserSchedule")
async def update_user_schedule(request: Request):
    data = await request.json()
    email = data.get("email")
    schedule = data.get("schedule")
    if not email or not schedule:
        return JSONResponse({"error": "Missing 'email' or 'schedule'"}, status_code=400)
    update_MySchedule(db, email, schedule)
    return JSONResponse({"message": "User schedule updated successfully"})


@app.post("/getData")
async def get_data(request: Request):
    data = await request.json()
    name = data.get("name")
    if name == "teachers":
        return JSONResponse({"message": allTeachers()})
    elif name == "classes":
        return JSONResponse({"message": allClasses()})
    elif name == "rooms":
        return JSONResponse({"message": allRooms()})
    elif name == "users":
        return JSONResponse({"message": allUsers()})
    return JSONResponse({"error": "not supported"}, status_code=400)


@app.post("/returnByTeacher")
async def return_by_teacher(request: Request):
    body = await request.json()
    teacher = body.get("class")
    if not teacher:
        return JSONResponse({"error": "Missing 'class'"}, status_code=400)
    results = [i for i in data if i["teacher"].strip() == teacher.strip()]
    return JSONResponse({"message": results})


@app.post("/returnByClass")
async def return_by_class(request: Request):
    body = await request.json()
    students = body.get("class")
    if not students:
        return JSONResponse({"error": "Missing 'class'"}, status_code=400)
    results = [i for i in data if isinstance(i["class"], str) and (i["class"].strip() in students or students.strip() in i["class"].strip())]
    return JSONResponse({"message": results})


@app.post("/returnByRoom")
async def return_by_room(request: Request):
    body = await request.json()
    room = body.get("class")
    if not room:
        return JSONResponse({"error": "Missing 'class'"}, status_code=400)
    results = [i for i in data if i["room"].strip() == room.strip()]
    return JSONResponse({"message": results})


@app.post("/addData")
async def add_data(request: Request):
    body = await request.json()
    name = body.get("name")
    data_ = body.get("data")
    if not name or not data_:
        return JSONResponse({"error": "Missing data or name"}, status_code=400)

    handlers = {
        "teachers": add_teacher,
        "rooms": add_room,
        "users": add_user,
        "classes": add_class,
        "schedule": lambda db, data: add_session(db, data, data_)
    }

    if name in handlers:
        message, status = handlers[name](db, data_)
        return JSONResponse({"message": message} if status == 200 else {"error": message}, status_code=status)

    return JSONResponse({"error": "adding is not supported"}, status_code=400)


@app.post("/changeSchedules")
async def change_schedules(file: UploadFile = File(...)):
    data_path = "data/"
    shutil.rmtree(data_path, ignore_errors=True)
    os.makedirs(data_path, exist_ok=True)
    file_path = os.path.join(data_path, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    message, status = readData(db, data_path)
    return JSONResponse({"message": message}, status_code=status)


@app.post("/forgot-password")
async def forgot_password(body: EmailResetRequest):
    success, token = initiate_password_reset(db, body.email)
    if not success:
        return JSONResponse({"error": token}, status_code=400)

    reset_link = f"http://{body.href}/reset-password?token={token}"
    message = MessageSchema(
        subject="Password Reset Request",
        recipients=[body.email],
        body=f"Reset your password using this link:\n{reset_link}",
        subtype="plain"
    )
    try:
        await fm.send_message(message)
        return JSONResponse({"message": "Reset link sent successfully"})
    except Exception as e:
        return JSONResponse({"error": f"Failed to send email: {str(e)}"}, status_code=500)


@app.post("/reset-password")
async def reset_password(body: ResetPasswordRequest):
    if len(body.password.strip()) < 6:
        return JSONResponse({"error": "Password is too short"}, status_code=400)
    state, message = reset_password_with_token(db, body.token, body.password)
    return JSONResponse({"message": message} if state else {"error": message}, status_code=200 if state else 400)


@app.post("/notifyUsers")
async def notify_users(request: Request):
    body = await request.json()
    schedule_name = body.get("scheduleName")
    changed_by = body.get("changedBy")
    if not schedule_name or not changed_by:
        return JSONResponse({"error": "Missing parameters"}, status_code=400)

    users = get_users_by_schedule(db, schedule_name)
    if not users:
        return JSONResponse({"message": "No users to notify"})

    count = 0
    for user in users:
        try:
            message = MessageSchema(
                subject=f"Schedule Update: {schedule_name}",
                recipients=[user["email"]],
                body=f"The schedule '{schedule_name}' has been updated by {changed_by}.",
                subtype="plain"
            )
            await fm.send_message(message)
            count += 1
        except Exception as e:
            print(f"Email failed to {user['email']}: {str(e)}")

    return JSONResponse({"message": f"Notified {count} users"})


# --------------------------- HELPERS ---------------------------
def allTeachers():
    return teachers_list(db)

def allClasses():
    return classes_list(db)

def allRooms():
    return rooms_list(db)

def allUsers():
    return users_list(db)