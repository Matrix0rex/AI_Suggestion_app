// frontend/src/components/RecommendationPage.js
import React, { useState } from 'react';
import axios from 'axios';
import './RecommendationPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

const RecommendationPage = () => {
  const [prompt, setPrompt] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    console.log("1. handleSubmit function was called!");
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setRecommendations([]);

    try {
        console.log("2. About to send POST request with prompt:", prompt);
      const response = await axios.post(`${API_URL}/api/recommend`, { prompt });
      setRecommendations(response.data.recommendations);
    } catch (err) {
      setError('Failed to fetch recommendations. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="recommendation-page">
      <h1>AI Furniture Recommender</h1>
      <p>Describe the furniture you're looking for (e.g., "a modern wooden coffee table for a small apartment").</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Get Recommendations'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      <div className="results">
        {recommendations.map((item) => (
          <div key={item.id} className="product-card">
            <img src={item.metadata.image} alt={item.metadata.title} />
            <div className="product-info">
              <h3>{item.metadata.title}</h3>
              <p className="price">Price: ${item.metadata.price}</p>
              <p className="generated-desc">
                <strong>✨ AI Description:</strong> {item.generated_description}
              </p>
              <p className="score">Similarity Score: {item.score.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationPage;