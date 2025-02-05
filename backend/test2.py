import copy
import bcrypt
from pymongo import MongoClient
from test import readData
client = MongoClient("mongodb://localhost:27017/")
db = client["SchcedulePrj"]
collection=db["users"]
# def hash_password(password):
#     salt = bcrypt.gensalt()
#     return bcrypt.hashpw(password.encode(), salt)
# def verify_password(stored_password, provided_password):
#     return bcrypt.checkpw(provided_password.encode('utf-8'), stored_password)
# collection.insert_one({"name":"Admin","email":"Admin@gmail.com","password":hash_password("admin"),"phoneNumber":"12345678","role":"admin"})
# user=collection.find_one({"email":"Admin@gmail.com"})
# print(verify_password(user["password"],"admin"))
# teachers=collection.find()
# for i,user in enumerate(teachers):
#     collection.update_one({"_id":user["_id"]},{"$set":{"email":"teacher"+str(i+1)+"@gmail.com"}})
user=collection.find_one({"email":"Admin@gmail.com"},{"password":0,'_id':0})
print(user)