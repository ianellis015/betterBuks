import React from 'react';
import styles from './UserMetric.module.css';

export default function UserMetrics() {
    return (
        <div className={styles.userMetricsContainer}>
            <div className={styles.metric}></div>
            <div className={styles.metric}></div>
            <div className={styles.metric}></div>
        </div>
    )
}