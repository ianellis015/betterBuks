import React from 'react';
import { useParams } from 'react-router-dom';

export default function Analysis() {
    const { ticker } = useParams();

    return (
        <div>
            <h1>Analysis for {ticker}</h1>
        </div>
    )
}