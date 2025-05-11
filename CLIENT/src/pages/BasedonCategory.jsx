import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Card from '../components/card';

const BasedOnCategory = () => {
  const [articles, setArticles] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { category } = useParams(); // Get category from URL params

  useEffect(() => {
    // Reset state when category changes
    setLoading(true);
    setError(null);
    setVisibleCount(6);
    
    // Fetch articles from API filtered by category
    axios
      .get(`http://localhost:8000/api/posts/category/${category}`)
      .then((res) => {
        setArticles(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(`Error fetching articles for category ${category}:`, err);
        setError(`Failed to load articles for ${category}`);
        setLoading(false);
        
        // Fallback data for development/testing
        const fallbackArticles = Array(15).fill().map((_, i) => ({
          id: i + 1,
          title: `${category} Article ${i + 1}`,
          excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris.',
          body: 'Full article content would go here...',
          category: category
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
      <div className="container mx-auto px-3 sm:px-4 my-4 sm:my-6 md:my-8 lg:my-12 bg-amber-50 py-4 sm:py-6 md:py-8 lg:py-10 rounded-lg text-center">
        <p className="text-amber-800 text-xs sm:text-sm md:text-base">Loading articles...</p>
      </div>
    );
  }

  if (error && articles.length === 0) {
    return (
      <div className="container mx-auto px-3 sm:px-4 my-4 sm:my-6 md:my-8 lg:my-12 bg-red-50 py-4 sm:py-6 md:py-8 lg:py-10 rounded-lg text-center">
        <p className="text-red-600 text-xs sm:text-sm md:text-base">{error}</p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="container mx-auto px-3 sm:px-4 my-4 sm:my-6 md:my-8 lg:my-12 bg-amber-50 py-4 sm:py-6 md:py-8 lg:py-10 rounded-lg text-center">
        <p className="text-amber-800 text-xs sm:text-sm md:text-base">No articles found in the {category} category.</p>
      </div>
    );
  }

  // Calculate if there are more articles to load
  const hasMore = visibleCount < articles.length;

  return (
    <div className="container mx-auto px-3 sm:px-4 my-4 sm:my-6 md:my-8 lg:my-12 bg-amber-50 py-4 sm:py-6 md:py-8 lg:py-10 rounded-lg">
      <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-center font-bold mb-3 sm:mb-4 md:mb-5 lg:mb-6 text-amber-800">
        {category.charAt(0).toUpperCase() + category.slice(1)} Articles
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        {articles.slice(0, visibleCount).map((article) => (
          <Card 
            key={article.id}
            id={article.id}
            title={article.title}
            description={article.excerpt || article.body.substring(0, 150)}
            photo={article.photo}
          />
        ))}
      </div>
      
      {hasMore && (
        <div className="flex justify-center items-center">
          <button 
            onClick={handleLoadMore}
            className="mt-3 sm:mt-4 md:mt-5 lg:mt-6 bg-amber-800 text-white hover:bg-amber-700 font-bold py-1.5 sm:py-2 md:py-2.5 px-3 sm:px-4 md:px-5 text-xs sm:text-sm md:text-base rounded transition-colors"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default BasedOnCategory;
