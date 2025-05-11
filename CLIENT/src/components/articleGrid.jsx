import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ArticleGrid = ({ category }) => {
  const [articles, setArticles] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch articles from API
    setLoading(true);
    
    // If category is provided, fetch articles for that category
    const apiUrl = category 
      ? `http://localhost:8000/api/posts/category/${category}`
      : 'http://localhost:8000/api/posts';
      
    axios
      .get(apiUrl)
      .then((res) => {
        setArticles(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching articles:', err);
        setError('Failed to load articles');
        setLoading(false);
        
        // Fallback data for development/testing
        const fallbackArticles = Array(20).fill().map((_, i) => ({
          id: i + 1,
          title: `Sample Article ${i + 1}`,
          excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus rhoncus felis sed magna tristique.',
          body: 'Full article content would go here...',
          category: category || 'general'
        }));
        setArticles(fallbackArticles);
      });
  }, [category]);

  const handleLoadMore = () => {
    // Load 3 more articles on mobile, 6 on larger screens
    const increment = window.innerWidth < 640 ? 3 : 6;
    setVisibleCount(prevCount => prevCount + increment);
  };

  if (loading && articles.length === 0) {
    return (
      <div className="container mx-auto px-3 sm:px-4 my-4 sm:my-6 md:my-8 bg-amber-50 py-4 sm:py-6 md:py-8 rounded-lg text-center">
        <p className="text-amber-800 text-xs sm:text-sm md:text-base">Loading articles...</p>
      </div>
    );
  }

  if (error && articles.length === 0) {
    return (
      <div className="container mx-auto px-3 sm:px-4 my-4 sm:my-6 md:my-8 bg-red-50 py-4 sm:py-6 md:py-8 rounded-lg text-center">
        <p className="text-red-600 text-xs sm:text-sm md:text-base">{error}</p>
      </div>
    );
  }

  // Calculate if there are more articles to load
  const hasMore = visibleCount < articles.length;

  return (
    <div className="container mx-auto px-3 sm:px-4 my-4 sm:my-6 md:my-8 bg-amber-50 py-4 sm:py-6 md:py-8 rounded-lg">
      <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-center font-bold mb-3 sm:mb-4 md:mb-6 text-amber-800">More from our side</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        {articles.slice(0, visibleCount).map((article, i) => (
          <div key={article.id} className="bg-white p-3 sm:p-4 md:p-5 lg:p-6 rounded-lg shadow-md">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1.5 sm:mb-2 md:mb-3 text-amber-800 line-clamp-2">{article.title}</h3>
            <p className="text-xs sm:text-sm md:text-base text-gray-700 mb-2 sm:mb-3 md:mb-4 line-clamp-3">
              {article.excerpt}
            </p>
            <Link to={`/article/${article.id}`}>
              <button className="text-xs sm:text-sm md:text-base text-amber-800 font-medium hover:text-amber-600">
                Read More →
              </button>
            </Link>
          </div>
        ))}
      </div>
      
      {hasMore && (
        <div className="flex justify-center items-center">
          <button 
            onClick={handleLoadMore}
            className="mt-3 sm:mt-4 md:mt-6 bg-amber-800 text-white hover:bg-amber-700 font-bold py-1.5 sm:py-2 md:py-2.5 px-3 sm:px-4 md:px-5 text-xs sm:text-sm md:text-base rounded transition-colors"
          >
            View More
          </button>
        </div>
      )}
    </div>
  );
};

export default ArticleGrid;
