from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import register_routes

app = FastAPI(
    title="betterBuks API",
    description="API backend for betterBuks DCF and investing tools",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to betterBuks API!"}

register_routes(app)