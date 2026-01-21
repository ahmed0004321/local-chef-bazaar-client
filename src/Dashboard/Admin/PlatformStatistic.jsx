import React from 'react';
import MiniHero from './PlatformStatisticComponents/MiniHero';
import CountUsers from './PlatformStatisticComponents/CountUsers';
import OrderPending from './PlatformStatisticComponents/OrderPending';
import DashboardMetrics from './PlatformStatisticComponents/DashboardMetrics';

const PlatformStatistic = () => {
    return (
        <div>
            <MiniHero></MiniHero>
            <CountUsers></CountUsers>
            <OrderPending></OrderPending>
            <DashboardMetrics></DashboardMetrics>
        </div>
    );
};

export default PlatformStatistic;