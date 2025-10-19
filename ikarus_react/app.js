// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RecommendationPage from './components/RecommendationPage';
import AnalyticsPage from './components/AnalyticsPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <Link to="/">Recommendations</Link>
          <Link to="/analytics">Analytics</Link>
        </nav>
        <main>
          <Routes>
            <Route path="/" element={<RecommendationPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;