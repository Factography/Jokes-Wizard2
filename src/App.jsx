import React, { useState, useEffect } from 'react';
    import './index.css';

    function App() {
      const [joke, setJoke] = useState('Click the button to get a joke!');
      const [loading, setLoading] = useState(false);
      const [category, setCategory] = useState('Any');
      const [error, setError] = useState('');
      const [availableCategories, setAvailableCategories] = useState(['Any']);
      const [categoriesLoading, setCategoriesLoading] = useState(true);

      const allCategories = [
        'Any',
        'Programming',
        'Misc',
        'Pun',
        'Spooky',
        'Christmas',
        'Dark',
        'Dad',
        'Knock-Knock',
        'Animal',
        'Food',
        'Sports',
        'History',
        'Science'
      ];

      useEffect(() => {
        const checkCategories = async () => {
          const available = [];
          for (const cat of allCategories) {
            try {
              const response = await fetch(`https://v2.jokeapi.dev/joke/${cat}?amount=1`);
              const data = await response.json();
              if (!data.error) {
                available.push(cat);
              }
            } catch (error) {
              console.error(`Error checking category ${cat}:`, error);
            }
          }
          setAvailableCategories(available);
          setCategoriesLoading(false);
        };

        checkCategories();
      }, []);

      const fetchJoke = async () => {
        setLoading(true);
        setError('');
        try {
          const url = `https://v2.jokeapi.dev/joke/${category}?safe-mode`;
          const response = await fetch(url);
          const data = await response.json();
          
          if (data.error) {
            setError(`No jokes found in ${category} category. Try another one!`);
            setJoke('');
          } else if (data.type === 'single') {
            setJoke(data.joke);
          } else if (data.type === 'twopart') {
            setJoke(`${data.setup} ... ${data.delivery}`);
          } else {
            setError('Unexpected joke format received');
          }
        } catch (error) {
          setError('Failed to fetch joke. Please try again.');
          setJoke('');
        } finally {
          setLoading(false);
        }
      };

      return (
        <div className="container">
          <h1>Jokes Wizard 🪄</h1>
          
          <div className="joke-container">
            {loading ? (
              <div className="loading-animation">
                <div className="spinner"></div>
                <p>Summoning a joke...</p>
              </div>
            ) : error ? (
              <p className="error-text">{error}</p>
            ) : (
              <p className="joke-text">{joke}</p>
            )}
          </div>

          <div className="controls">
            {categoriesLoading ? (
              <div className="loading-animation">
                <div className="spinner"></div>
                <p>Loading categories...</p>
              </div>
            ) : (
              <>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="category-select"
                >
                  {availableCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <button 
                  onClick={fetchJoke}
                  className="magic-button"
                >
                  <span>Get Joke</span>
                  <div className="sparkles"></div>
                </button>
              </>
            )}
          </div>
        </div>
      );
    }

    export default App;
