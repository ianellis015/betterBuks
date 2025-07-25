import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import StockOverview from '../Components/StockOverview.jsx';
import Recommendation from '../Components/Recommendation.jsx';
import FinancialHealth from '../Components/FinancialHealth.jsx';
import ValuationAssumptions from '../Components/ValuationAssumptions.jsx';
import styles from './Analysis.module.css';

export default function Analysis() {
    const { ticker } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`http://127.0.0.1:8000/api/analyze/${ticker}`);
                setData(res.data.data);
            } catch (err) {
                setError("Failed to fetch stock data.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [ticker]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className={styles.analysisBody}>
            <h1>Stock Analysis</h1>
            <p>Simplified DCF analysis for smarter investing</p>
            <StockOverview ticker={ticker} data={data} />
            <Recommendation data={data} />
            <div className={styles.metricContainer}>
                <FinancialHealth data={data} />
                <ValuationAssumptions data={data} setData={setData} />
            </div>
        </div>
    );
}