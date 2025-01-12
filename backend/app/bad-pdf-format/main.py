import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import api_router

# Initialize FastAPI app
app = FastAPI()

# CORS settings to allow frontend to interact with the backend
origins = [
    "http://localhost:3000",  # Replace with your frontend URL
    "https://td.bits-hyderabad.ac.in/roommap"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routes
app.include_router(api_router)
