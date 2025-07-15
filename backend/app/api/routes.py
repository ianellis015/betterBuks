from fastapi import FastAPI
from app.api.controllers import healthcheck
from app.api.controllers import ticker_search

def register_routes(app: FastAPI):
    app.include_router(healthcheck.router, prefix="/api")
    app.include_router(ticker_search.router, prefix="/api")
    # app.include_router(dcf.router, prefix="/api")  # next
    # app.include_router(ai.router, prefix="/api")   # future