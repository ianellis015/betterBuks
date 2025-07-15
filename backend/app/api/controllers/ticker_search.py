from fastapi import APIRouter, Query
import httpx

router = APIRouter()

@router.get("/search-ticker")
async def search_ticker(query: str = Query(..., min_length=1)):
    url = f"https://query2.finance.yahoo.com/v1/finance/search?q={query}"
    headers = {"User-Agent": "Mozilla/5.0"}  # 👈 Pretend you're a browser
    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers)
    if response.status_code != 200:
        print(f"Failed with status {response.status_code}, body: {response.text}")
        return {"error": "Failed to fetch data"}
    data = response.json()
    results = [
        {"symbol": item["symbol"], "name": item.get("shortname", "")}
        for item in data.get("quotes", [])
    ]
    return {"results": results}