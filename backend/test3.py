from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["SchcedulePrj"]
connection=db["schedules"]
schedules=list(connection.find({},{"_id":0}))
print(schedules)
classes=[]
for i in schedules:
    classes.append(i["class"])
classes=list(set(classes))
true_classes=[]
for i in classes:
    true_classes.append({"name": i})
print(true_classes)
db["classes_list"].insert_many(true_classes)