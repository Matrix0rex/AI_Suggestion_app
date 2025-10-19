import { useState } from 'react';

// All CSS styles are now included directly in the component file.
const GlobalStyles = () => (
  <style>{`
    /* --- General App Styling --- */
    #root {
      max-width: 1280px;
      margin: 0 auto;
      padding: 2rem;
      text-align: center;
      font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
    }

    .app-container {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .app-header h1 {
      font-size: 2.5em;
      line-height: 1.1;
      margin-bottom: 0.5rem;
      color: #cbb2ff;
    }

    .app-header p {
      font-size: 1.2rem;
      color: #a7a7a7;
    }

    /* --- Search Section --- */
    .search-container {
      margin-bottom: 2rem;
    }

    .search-container form {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
    }

    .search-input {
      width: 100%;
      max-width: 500px;
      padding: 0.8rem 1rem;
      border-radius: 8px;
      border: 1px solid #555;
      background-color: #2a2a2a;
      color: #f9f9f9;
      font-size: 1rem;
      transition: border-color 0.2s;
    }

    .search-input:focus {
      outline: none;
      border-color: #646cff;
    }

    .search-button {
      padding: 0.8rem 1.5rem;
      border-radius: 8px;
      border: 1px solid transparent;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      background-color: #1a1a1a;
      transition: background-color 0.2s, border-color 0.2s;
    }

    .search-button:hover {
      border-color: #646cff;
      background-color: #2a2a2a;
    }

    .search-button:disabled {
      cursor: not-allowed;
      opacity: 0.7;
    }

    /* --- Results Section --- */
    .results-container {
      text-align: left;
    }

    .placeholder-text {
      color: #777;
      font-style: italic;
      text-align: center;
    }

    .error-message {
      color: #ff6b6b;
      text-align: center;
      font-weight: bold;
    }

    .results-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .product-card {
      background-color: #1e1e1e;
      padding: 1.5rem;
      border-radius: 8px;
      border: 1px solid #333;
      transition: transform 0.2s ease-in-out, box-shadow 0.2s;
    }

    .product-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }

    .product-card h3 {
      margin-top: 0;
      color: #cbb2ff;
      border-bottom: 1px solid #444;
      padding-bottom: 0.5rem;
      margin-bottom: 1rem;
    }

    .product-card p {
      margin: 0.5rem 0;
      line-height: 1.5;
    }

    .original-desc {
      color: #ccc;
      font-size: 0.9rem;
    }

    .generated-desc {
      color: #fff;
      font-style: italic;
      background-color: rgba(255, 255, 255, 0.05);
      padding: 0.75rem;
      border-radius: 4px;
    }

    .product-score {
      margin-top: 1rem;
      font-size: 0.8rem;
      color: #888;
      text-align: right;
    }
  `}</style>
);


function App() {
  // State to hold the user's search query
  const [query, setQuery] = useState('');
  // State to store the results from the backend
  const [results, setResults] = useState([]);
  // State to manage loading status
  const [isLoading, setIsLoading] = useState(false);
  // State for any potential errors
  const [error, setError] = useState(null);

  // --- HANDLER FUNCTIONS ---
  const handleSearch = async (event) => {
    event.preventDefault(); // Prevent the form from reloading the page
    if (!query.trim()) return; // Don't search if the query is empty

    setIsLoading(true);
    setError(null);
    setResults([]);

    try {
      
      const response = await fetch('http://127.0.0.1:8000/api/recommend', {
        method: 'POST', // Specify the method is POST
        headers: {
          'Content-Type': 'application/json', // Tell the server we're sending JSON
        },
        // Send the data in the request body, matching the backend's expected format
        body: JSON.stringify({ prompt: query }),
      });
      
      if (!response.ok) {
        throw new Error('Something went wrong. Please try again.');
      }

      const data = await response.json();
      // The backend returns an object like { recommendations: [...] }
      setResults(data.recommendations || []); 

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- RENDER LOGIC ---
  return (
    <div className="app-container">
      <GlobalStyles />
      <header className="app-header">
        <h1>Ikarus 3D Project</h1>
        <p>AI-Powered Product Discovery</p>
      </header>

      <main>
        <div className="search-container">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Describe the product you're looking for..."
              className="search-input"
            />
            <button type="submit" className="search-button" disabled={isLoading}>
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        <div className="results-container">
          {error && <p className="error-message">{error}</p>}
          
          {results.length > 0 && (
            <div className="results-grid">
              {results.map((product) => (
                <div key={product.id} className="product-card">
                  <h3>{product.metadata?.title || 'No Title'}</h3>
                  <p className="original-desc">
                    <strong>Categories:</strong> {product.metadata?.categories || 'N/A'}
                  </p>
                  <p className="generated-desc">
                    <strong>Suggestion:</strong> {product.generated_description}
                  </p>
                  <div className="product-score">
                    Similarity Score: {product.score.toFixed(4)}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {!isLoading && !error && results.length === 0 && (
             <p className="placeholder-text">Enter a search term to find and generate product ideas.</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;