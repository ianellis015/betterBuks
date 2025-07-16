from fastapi import APIRouter
from app.services.valuation_utils import full_stock_analysis

router = APIRouter()

@router.get("/analyze/{ticker}")
async def analyze_stock(ticker: str):
    try:
        data = full_stock_analysis(ticker)
        return {"status": "success", "data": data}
    except Exception as e:
        return {"status": "error", "message": str(e)}