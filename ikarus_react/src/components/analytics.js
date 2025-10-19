// frontend/src/components/AnalyticsPage.js
// First, install a charting library: npm install chart.js react-chartjs-2
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

const AnalyticsPage = () => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get(`${API_URL}/api/analytics`)
            .then(response => {
                setAnalyticsData(response.data);
            })
            .catch(err => {
                setError('Failed to load analytics data.');
                console.error(err);
            });
    }, []);

    if (error) return <p className="error">{error}</p>;
    if (!analyticsData) return <p>Loading analytics...</p>;

    const brandData = {
        labels: Object.keys(analyticsData.top_brands),
        datasets: [{
            label: '# of Products by Brand',
            data: Object.values(analyticsData.top_brands),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
        }],
    };

    const categoryData = {
        labels: Object.keys(analyticsData.top_categories),
        datasets: [{
            label: '# of Products by Category',
            data: Object.values(analyticsData.top_categories),
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
        }],
    };

    return (
        <div className="analytics-page">
            <h2>Dataset Analytics</h2>
            <div className="chart-container">
                <h3>Top Brands</h3>
                <Bar data={brandData} />
            </div>
            <div className="chart-container">
                <h3>Top Categories</h3>
                <Bar data={categoryData} />
            </div>
        </div>
    );
};

export default AnalyticsPage;