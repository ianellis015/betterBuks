import yfinance as yf
import numpy as np

# Seed ensures your Monte Carlo results are consistent during development/testing
np.random.seed(42)


def full_stock_analysis(ticker: str):
    """
    Main analysis function:
    - Fetches data from Yahoo Finance
    - Extracts important financial metrics
    - Runs Monte Carlo simulation
    - Returns structured analysis result
    """
    info, cashflow, financials = fetch_yahoo_data(ticker)
    metrics = extract_metrics(info, cashflow, financials)

    # Run Monte Carlo simulation using extracted metrics
    monte_carlo = run_monte_carlo_simulation(
        last_year_fcf=metrics['free_cash_flow'],
        growth_rate=metrics['cagr'],
        discount_rate=metrics['discount_rate'],
        terminal_growth=metrics['terminal_growth'],
        shares_outstanding=metrics['shares_outstanding'],
        current_price=metrics['current_price']
    )

    # Final structured result
    return {
        "ticker": ticker,
        "company_name": info.get("longName"),
        "industry": info.get("industry"),
        "metrics": metrics,
        "monte_carlo_results": monte_carlo
    }


def fetch_yahoo_data(ticker):
    """
    Fetch raw financial data using yfinance
    Returns:
        - info: General stock metadata (price, market cap, etc.)
        - cashflow: Cash flow statement dataframe
        - financials: Income statement dataframe
    """
    t = yf.Ticker(ticker)
    info = t.info
    cashflow = t.cashflow
    financials = t.financials
    return info, cashflow, financials


def extract_metrics(info, cashflow, financials):
    """
    Extracts key valuation metrics and safely handles missing data.
    """
    # Safely extract cash flow
    def safe_get_cashflow(metric):
        try:
            return cashflow.loc[metric].iloc[0]
        except Exception:
            return None

    # Safely extract financial statement values
    def safe_get_financials(metric, year_idx):
        try:
            return financials.loc[metric].iloc[year_idx]
        except Exception:
            return None

    # Gather metrics
    market_cap = info.get('marketCap')
    free_cash_flow = safe_get_cashflow('Free Cash Flow')
    cagr = calculate_cagr(financials)

    eps = info.get("trailingEps")
    pe_ratio = info.get("trailingPE")

    # Correct PEG = PE / EPS growth rate (forward estimate)
    try:
        forward_eps = info.get("forwardEps")
        if forward_eps and eps and eps != 0:
            eps_growth = (forward_eps - eps) / abs(eps)
            peg_ratio = pe_ratio / (eps_growth * 100) if eps_growth != 0 else None
        else:
            peg_ratio = None
    except Exception:
        peg_ratio = None

    return {
        "current_price": info.get("currentPrice"),
        "market_cap": market_cap,
        "free_cash_flow": free_cash_flow,
        "cagr": cagr,
        "beta": info.get("beta"),
        "discount_rate": 0.10,  # You can later replace this with CAPM-based calculation
        "terminal_growth": 0.025,
        "shares_outstanding": info.get("sharesOutstanding"),
        "eps": eps,
        "pe_ratio": pe_ratio,
        "peg_ratio": peg_ratio,
        "debt_to_equity": info.get("debtToEquity"),
        "ev/ebitda": info.get("enterpriseToEbitda")
    }


def calculate_cagr(financials):
    """
    Calculates 3-year Compound Annual Growth Rate (CAGR) of revenue.
    Returns None if data is incomplete.
    """
    try:
        revenue_latest = financials.loc["Total Revenue"].iloc[0]
        revenue_3y_ago = financials.loc["Total Revenue"].iloc[3]
        if revenue_latest and revenue_3y_ago and revenue_3y_ago != 0:
            return ((revenue_latest / revenue_3y_ago) ** (1 / 3)) - 1
        return None
    except Exception:
        return None


def run_monte_carlo_simulation(last_year_fcf, growth_rate, discount_rate, terminal_growth, shares_outstanding, current_price):
    """
    Runs a Monte Carlo Discounted Cash Flow (DCF) simulation.
    Returns key statistical percentiles and averages for intrinsic value.
    """
    # Guard clause if essential data is missing
    if not all([last_year_fcf, growth_rate, discount_rate, shares_outstanding]):
        return {"error": "Insufficient data for simulation"}

    num_simulations = 10000
    years = 5
    results = []

    for _ in range(num_simulations):
        # Randomly vary growth and discount rates for realism
        sampled_growth = np.random.normal(growth_rate, 0.02)
        sampled_discount = np.random.normal(discount_rate, 0.01)

        fcf = last_year_fcf
        discounted_fcfs = 0

        # Discount projected cash flows over next 5 years
        for year in range(1, years + 1):
            fcf *= (1 + sampled_growth)
            discounted_fcfs += fcf / (1 + sampled_discount) ** year

        # Gordon Growth Model for terminal value after 5 years
        terminal_value = (fcf * (1 + terminal_growth)) / max(sampled_discount - terminal_growth, 0.01)
        discounted_terminal_value = terminal_value / (1 + sampled_discount) ** years

        intrinsic_value = discounted_fcfs + discounted_terminal_value
        per_share_value = intrinsic_value / shares_outstanding
        results.append(per_share_value)

    results = np.array(results)
    mean_intrinsic_value = results.mean()
    projected_return = ((mean_intrinsic_value - current_price) / current_price) * 100

    percentile_5 = float(np.percentile(results, 5))
    percentile_95 = float(np.percentile(results, 95))
    confidence_interval = percentile_95 - percentile_5
    
    return {
        "mean_intrinsic_value": float(mean_intrinsic_value),
        "median_intrinsic_value": float(np.median(results)),
        "percentile_5": percentile_5,
        "percentile_95": percentile_95,
        "projected_return_percent": float(projected_return),
        "confidence_interval": confidence_interval
    }