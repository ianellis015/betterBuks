import React from 'react';
import styles from './Recommendation.module.css';

export default function Recommendation({ data }) {
    const {
        company_name,
        industry,
        metrics,
        monte_carlo_results
     } = data;

     const currentPrice = metrics.current_price;
     const meanFairValue = monte_carlo_results.mean_intrinsic_value;

     let valuationStatus = { label: "N/A", styleClass: "" };
          if (currentPrice && meanFairValue) {
             if (currentPrice <= meanFairValue) {
                 valuationStatus = { label: "Buy", styleClass: styles.buyLabel };
             } else {
                 valuationStatus = { label: "Wait", styleClass: styles.waitLabel };
             }
          }

          const projectedReturn = monte_carlo_results.projected_return_percent;
          let projectedReturnLabel = { label: "N/A", styleClass: "" };
          if (projectedReturn) {
             if (projectedReturn >= 0) {
                 projectedReturnLabel = { label: "Upside Potential", styleClass: "" };
             } else {
                 projectedReturnLabel = { label: "Downside Risk", styleClass: "" };
             }
          }

    const percentile5 = monte_carlo_results.percentile_5;
    const percentile95 = monte_carlo_results.percentile_95;
    const range = percentile95 - percentile5;

    return (
        <div className={styles.recommendationContainer}>
            <div className={styles.recommendationHeader}>
                <div className={styles.leftSection}>
                    <p className={`${styles.valuationLabel} ${valuationStatus.styleClass}`}>
                        {valuationStatus.label}
                    </p>
                    <div className={styles.header}>
                        <h2>Investment Recommendation</h2>
                        <p>Based on DCF analysis</p>
                    </div>
                </div>
                <div className={styles.projectedReturn}>
                    <span
                        className={`${styles.projectedReturnPercent} ${
                            projectedReturn >= 0 ? styles.positiveReturn : styles.negativeReturn}`}
                    >
                        {projectedReturn.toFixed(2)}%
                    </span>
                    <p className={styles.projectedReturnTag}>{projectedReturnLabel.label}</p>
                </div>
            </div>
            <div className={styles.volatilityRangeContainer}>
                <div className={styles.volatilityRangeHeader}>
                    <h2>Volatility Range</h2>
                    <p>Shows how much the stock’s intrinsic value could swing based on future performance.</p>
                </div>
                <div className={styles.ranges}>
                    <p className={styles.rangeNumbers}>${monte_carlo_results.percentile_5.toFixed(2)} - ${monte_carlo_results.percentile_95.toFixed(2)}</p>
                    <p className={styles.rangeNumbersDescription}>Expected to stay between this range in most scenarios (90% probability)</p>
                </div>
                <div className={styles.rangeContainer}>
                    <div className={styles.rangeBar}>
                    </div>
                    <div className={styles.rangeLabels}>
                        <span>${percentile5.toFixed(2)}</span>
                        <span>Mean: ${meanFairValue.toFixed(2)}</span>
                        <span>${percentile95.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}