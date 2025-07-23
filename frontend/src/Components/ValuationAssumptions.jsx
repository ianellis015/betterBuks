import React from 'react';
import calculatorIcon from '../assets/calculator-icon.svg';
import styles from './ValuationAssumptions.module.css';

export default function ValuationAssumptions({ data }) {

    const {
        metrics,
        monte_carlo_results
    } = data;

    const convertToPercentage = (value) => {
        return (value * 100).toFixed(1) + '%';
    }

    return ( 
    <div className={styles.valAssumptionsContainer}>
        <div className={styles.valAssumptionsHeader}>
            <h1 className={styles.header}>
                <img src={calculatorIcon} className={styles.calculatorIcon} />
                Valuation Assumptions
            </h1>
            <p className={styles.subheading}>Key inputs used in our DCF Calculation</p>
        </div>
        <div className={styles.variableContainer}>
            <h2>Growth Rate</h2>
            <p>{convertToPercentage(metrics.cagr)}</p>
        </div>
        <div className={styles.variableContainer}>
            <h2>Terminal Growth</h2>
            <p>{convertToPercentage(metrics.terminal_growth)}</p>
        </div>
        <div className={styles.variableContainer}>
            <h2>Disount Rate</h2>
            <p>{convertToPercentage(metrics.discount_rate)}</p>
        </div>
        <div className={styles.adjustButtonContainer}>
            <button className={styles.adjustButton}>Adjust Assumptions</button>
        </div>
    </div>
    )
}