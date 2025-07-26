import React from 'react';
import metricIcon from '../assets/metric-icon.svg';
import styles from './FinancialHealth.module.css';
export default function FinancialHeath({ data }) {

    const {
        metrics,
        monte_carlo_results
     } = data;

    const formatCashFlow = (value) => {
        if (!value) return "N/A";
        if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
        if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
        if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
        return `$${value.toLocaleString()}`;
    }

    return (
        <div className={styles.financialHealthContainer}>
            <div className={styles.financialHealthHeader}>
                <h1 className={styles.header}>
                    <img src={metricIcon} className={styles.metricIcon} />
                    Key Financial health
                </h1>
                <p className={styles.subheading}>Simplified metrics that matter for long-term value</p>
            </div>
            <div className={styles.metricContainer}>
                <div className={styles.freeCashFlowContainer}>
                    <h2>Free Cash Flow</h2>
                    <p>{formatCashFlow(metrics.free_cash_flow)}</p>
                </div>
                <div className={styles.metricsContainer}>
                    <div className={styles.epsContainer}>
                        <h2>Earnings per Share</h2>
                        <p>{metrics.eps}</p>
                    </div>
                    <div className={styles.peRatioContainer}>
                        <h2>Price to Earnings ratio (PE)</h2>
                        <p>{metrics.pe_ratio.toFixed(2)}</p>
                    </div>
                    <div className={styles.pegRatioContainer}>
                        <h2>P/E to Growth Ratio</h2>
                        <p>{metrics.peg_ratio.toFixed(2)}</p>
                    </div>
                <div className={styles.DebtToEquityContainer}>
                        <h2>Debt to Equity</h2>
                        <p>{metrics.debt_to_equity.toFixed(2)}</p>
                    </div>
                    <div className={styles.evEbitdaContainer}>
                        <h2>EV/EBITDA</h2>
                        <p>{metrics.ev_ebitda.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}