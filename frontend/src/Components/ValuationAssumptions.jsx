// ValuationAssumptions.jsx
import React from 'react';
import axios from 'axios';
import calculatorIcon from '../assets/calculator-icon.svg';
import styles from './ValuationAssumptions.module.css';

export default function ValuationAssumptions({ data, setData }) {
  const { metrics } = data ?? {};

  const [isEditing, setIsEditing] = React.useState(false);

  // Initialize safely (handles first render before data arrives)
  const [editableMetrics, setEditableMetrics] = React.useState(() => ({
    cagr: metrics?.cagr ?? 0,
    terminal_growth: metrics?.terminal_growth ?? 0,
    discount_rate: metrics?.discount_rate ?? 0,
  }));

  // 🔁 Re-sync local state whenever you navigate to a new ticker (or metrics change)
  React.useEffect(() => {
    if (!data?.metrics) return;
    setEditableMetrics({
      cagr: data.metrics.cagr,
      terminal_growth: data.metrics.terminal_growth,
      discount_rate: data.metrics.discount_rate,
    });
    setIsEditing(false); // exit edit mode on symbol change
  }, [data?.ticker]); 

  const convertToPercentage = (value) => {
    if (value === undefined || value === null) return '';
    return (value * 100).toFixed(1) + '%';
  };

  const rerunSimulation = async () => {
    try {
      const res = await axios.post(`http://127.0.0.1:8000/api/analyze/${data.ticker}`, {
        cagr: editableMetrics.cagr,
        terminal_growth: editableMetrics.terminal_growth,
        discount_rate: editableMetrics.discount_rate,
      });
      setData(res.data.data); // parent data updates; effect above re-syncs local state
    } catch (err) {
      console.error('Failed to rerun simulation', err);
    }
  };

  const renderSlider = (label, key) => (
    <div className={styles.variableContainer} key={key}>
      <h2>{label}</h2>
      <input
        type="range"
        min={-100}
        max={100}
        value={
          Number.isFinite(editableMetrics[key]) ? editableMetrics[key] * 100 : 0
        }
        onChange={(e) =>
          setEditableMetrics((prev) => ({
            ...prev,
            [key]: parseFloat(e.target.value) / 100,
          }))
        }
        className={styles.slider}
      />
      <p>{convertToPercentage(editableMetrics[key])}</p>
    </div>
  );

  // Guard early if data isn’t ready yet (prevents undefined access during first render)
  if (!data?.metrics) return null;

  return (
    <div className={styles.valAssumptionsContainer}>
      <div className={styles.valAssumptionsHeader}>
        <h1 className={styles.header}>
          <img src={calculatorIcon} className={styles.calculatorIcon} />
          Valuation Assumptions
        </h1>
        <p className={styles.subheading}>Key inputs used in our DCF Calculation</p>
      </div>

      {isEditing ? (
        <>
          {renderSlider('Growth Rate', 'cagr')}
          {renderSlider('Terminal Growth', 'terminal_growth')}
          {renderSlider('Discount Rate', 'discount_rate')}
        </>
      ) : (
        <>
          <div className={styles.variableContainer}>
            <h2>Growth Rate</h2>
            <p>{convertToPercentage(editableMetrics.cagr)}</p>
          </div>
          <div className={styles.variableContainer}>
            <h2>Terminal Growth</h2>
            <p>{convertToPercentage(editableMetrics.terminal_growth)}</p>
          </div>
          <div className={styles.variableContainer}>
            <h2>Discount Rate</h2>
            <p>{convertToPercentage(editableMetrics.discount_rate)}</p>
          </div>
        </>
      )}

      <div className={styles.adjustButtonContainer}>
        <button
          className={styles.adjustButton}
          onClick={() => {
            if (isEditing) rerunSimulation();
            setIsEditing(!isEditing);
          }}
        >
          {isEditing ? 'Apply Changes' : 'Adjust Assumptions'}
        </button>
      </div>
    </div>
  );
}