# from fastapi import APIRouter
# from app.services.valuation_utils import full_stock_analysis

# router = APIRouter()

# @router.get("/analyze/{ticker}")
# async def analyze_stock(ticker: str):
#     try:
#         data = full_stock_analysis(ticker)
#         return {"status": "success", "data": data}
#     except Exception as e:
#         return {"status": "error", "message": str(e)}

from fastapi import APIRouter
from pydantic import BaseModel
from app.services.valuation_utils import run_monte_carlo_simulation, fetch_yahoo_data, extract_metrics

router = APIRouter()

@router.get("/analyze/{ticker}")
async def analyze_stock(ticker: str):
    try:
        from app.services.valuation_utils import full_stock_analysis
        data = full_stock_analysis(ticker)
        return {"status": "success", "data": data}
    except Exception as e:
        return {"status": "error", "message": str(e)}


# NEW: accepts custom assumptions from the frontend
class AssumptionOverrides(BaseModel):
    cagr: float
    discount_rate: float
    terminal_growth: float


@router.post("/analyze/{ticker}")
async def rerun_simulation_with_overrides(ticker: str, overrides: AssumptionOverrides):
    try:
        # Fetch original data
        info, cashflow, financials = fetch_yahoo_data(ticker)
        metrics = extract_metrics(info, cashflow, financials)

        # Use user overrides
        metrics["cagr"] = overrides.cagr
        metrics["discount_rate"] = overrides.discount_rate
        metrics["terminal_growth"] = overrides.terminal_growth

        # Rerun simulation
        monte_carlo = run_monte_carlo_simulation(
            last_year_fcf=metrics['free_cash_flow'],
            growth_rate=metrics['cagr'],
            discount_rate=metrics['discount_rate'],
            terminal_growth=metrics['terminal_growth'],
            shares_outstanding=metrics['shares_outstanding'],
            current_price=metrics['current_price']
        )

        return {
            "status": "success",
            "data": {
                "ticker": ticker,
                "company_name": info.get("longName"),
                "industry": info.get("industry"),
                "metrics": metrics,
                "monte_carlo_results": monte_carlo
            }
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}