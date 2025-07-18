import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import StockOverview from '../Components/StockOverview.jsx';
import Recommendation from '../Components/Recommendation.jsx';

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
        <div>
            <h1>Stock Analysis</h1>
            <p>Simplified DCF analysis for smarter investing</p>
            <StockOverview ticker={ticker} data={data} />
            <Recommendation data={data} />
        </div>
    );
}