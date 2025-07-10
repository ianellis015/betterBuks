from fastapi import FastAPI
from app.api.routes import register_routes

app = FastAPI(
    title="betterBuks API",
    description="API backend for betterBuks DCF and investing tools",
    version="0.1.0"
)

@app.get("/")
async def root():
    return {"message": "Welcome to betterBuks API!"}

register_routes(app)