import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './StockOverview.module.css';

export default function StockOverview({ ticker, data }) {
    if (!data) return <p>Loading...</p>;
    const {
        company_name,
        industry,
        metrics,
        monte_carlo_results
     } = data;

    const formatMarketCap = (value) => {
        if (!value) return "N/A";
        if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
        if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
        if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
        return `$${value.toLocaleString()}`;
    };

     const currentPrice = metrics.current_price;
     const meanFairValue = monte_carlo_results.mean_intrinsic_value;

     let valuationStatus = { label: "N/A", styleClass: "" };
     if (currentPrice && meanFairValue) {
        if (currentPrice < meanFairValue) {
            valuationStatus = { label: "Undervalued", styleClass: styles.undervalued };
        } else if (currentPrice > meanFairValue) {
            valuationStatus = { label: "Overvalued", styleClass: styles.overvalued };
        } else {
            valuationStatus = { label: "Fair", styleClass: styles.fair };
        }
     }
    return (
        <div className={styles.stockOverviewContainer}>
            <div className={styles.headingContainer}>
            <h2>{company_name}</h2>
            <p className={styles.marketCap}>{formatMarketCap(metrics.market_cap)} Market Cap</p>
            </div>
            <p>{ticker} • {industry}</p>
            <div className={styles.keyMetrics}>
                <p><strong>Current Price</strong><span className={styles.currentPrice}>${metrics.current_price?.toFixed(2) || "N/A"}</span></p>
                <p><strong>Mean Fair Value</strong><span className={styles.meanFairValue}>${monte_carlo_results.mean_intrinsic_value?.toFixed(2) || "N/A"}</span></p>
                <p>
                  <strong>Valuation Status:</strong>
                  <span className={`${styles.valuationStatus} ${valuationStatus.styleClass}`}>
                    {valuationStatus.label}
                  </span>
                </p>
            </div>
        </div>
    )
}