import React from 'react';
import Search from '../Components/Search.jsx';
import UserMetrics from '../Components/UserMetrics.jsx';
import RecentAnalyses from '../Components/RecentAnalyses.jsx';
import MoreInfo from '../Components/MoreInfo.jsx';
import styles from './Dashboard.module.css';

export default function Dashboard() {
    return (
        <div className={styles.dashContainer}>
            <h1>BetterBuks</h1>
            <p>Simplified DCF analysis for smarter investing. Get professional-grade insights without the complexity.</p>
            <Search />
            <UserMetrics />
            <RecentAnalyses />
            <MoreInfo />
        </div>
    )
}