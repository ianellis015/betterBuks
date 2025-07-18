import React from 'react';

export default function Recommendation({ data }) {
    const {
        company_name,
        industry,
        metrics,
        monte_carlo_results
     } = data;

    return (
        <div>
            {/* <p>{metrics.eps}</p> */}
        </div>
    )
}