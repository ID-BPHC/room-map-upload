from pymongo import MongoClient
import os

# MongoDB connection URI from environment variables
MONGO_URI = "mongodb://127.0.0.1:27017"

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client['ID-dev']
roomsCollection = db['rooms']

def update_rooms(rooms):
    try:
        for room in rooms:
            num_filter = {"number": room["number"]}
            update_op = {
                "$set": {
                    "lectureCapacity": room["lectureCapacity"],
                    "examCapacity": room["examCapacity"],
                    "type": room["type"],
                    "fixedClasses": room["fixedClasses"]
                }
            }
            roomsCollection.update_one(num_filter, update_op, upsert=True)
    except Exception as e:
        raise Exception(f"Failed to update database: {str(e)}")
