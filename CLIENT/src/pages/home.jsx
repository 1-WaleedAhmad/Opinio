import React, { useState, useEffect } from 'react';
import PostSlider from '../components/slider';
import ArticleGrid from '../components/articleGrid';

const Home = ({ category, searchQuery }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadMore, setLoadMore] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // Reset pagination when search query or category changes
    setPage(1);
    setLoadMore(false);
    fetchArticles();
  }, [searchQuery, category]);

  const fetchArticles = async () => {
    setLoading(true);
    
    try {
      // This would be replaced with actual API call to fetch articles
      // based on searchQuery (author, category, title) or category
      
      // Simulating API call with timeout
      setTimeout(() => {
        // Generate mock articles based on search or category
        const mockArticles = Array(6).fill().map((_, index) => ({
          id: index + 1,
          title: searchQuery 
            ? `Article about "${searchQuery}" ${index + 1}`
            : category 
              ? `${category.charAt(0).toUpperCase() + category.slice(1)} Article ${index + 1}`
              : `Featured Article ${index + 1}`,
          excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          readTime: Math.floor(Math.random() * 10) + 3,
          author: "Author Name",
          category: category || ["Technology", "Lifestyle", "Business"][Math.floor(Math.random() * 3)]
        }));
        
        setArticles(mockArticles);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error("Error fetching articles:", error);
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    setLoadMore(true);
    setPage(prevPage => prevPage + 1);
    
    // Simulate loading more articles
    setLoading(true);
    setTimeout(() => {
      const newArticles = Array(3).fill().map((_, index) => ({
        id: articles.length + index + 1,
        title: searchQuery 
          ? `Article about "${searchQuery}" ${articles.length + index + 1}`
          : category 
            ? `${category.charAt(0).toUpperCase() + category.slice(1)} Article ${articles.length + index + 1}`
            : `Featured Article ${articles.length + index + 1}`,
        excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        readTime: Math.floor(Math.random() * 10) + 3,
        author: "Author Name",
        category: category || ["Technology", "Lifestyle", "Business"][Math.floor(Math.random() * 3)]
      }));
      
      setArticles(prevArticles => [...prevArticles, ...newArticles]);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 md:px-5 pt-12 sm:pt-16 md:pt-24">
      {/* Hero section with responsive spacing */}
      <div className="my-3 sm:my-5 md:my-8">
        <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-amber-800 text-center mb-2 sm:mb-3 md:mb-6">
          {searchQuery 
            ? `Search Results for "${searchQuery}"` 
            : category 
              ? `${category.charAt(0).toUpperCase() + category.slice(1)} Articles` 
              : 'Welcome to TUG'}
        </h1>
        
        {/* Optional: Category description with responsive text size */}
        {category && !searchQuery && (
          <p className="text-xs sm:text-sm md:text-lg text-center text-gray-600 max-w-3xl mx-auto px-2">
            Explore our collection of thought-provoking articles about {category}.
            Discover new perspectives and insights from our community of writers.
          </p>
        )}
        
        {/* Search results description */}
        {searchQuery && (
          <p className="text-xs sm:text-sm md:text-lg text-center text-gray-600 max-w-3xl mx-auto px-2">
            Showing articles matching your search for "{searchQuery}".
          </p>
        )}
      </div>
      
      {/* Featured posts slider - only show if not searching */}
      {!searchQuery && (
        <div className="mb-4 sm:mb-6 md:mb-10">
          <PostSlider />
        </div>
      )}
      
      {/* Featured Articles Section - shows search results when searching */}
      <div className="mb-6 sm:mb-8 md:mb-16">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-amber-800 mb-3 sm:mb-4 md:mb-6">
          {searchQuery 
            ? 'Search Results' 
            : category 
              ? `${category.charAt(0).toUpperCase() + category.slice(1)} Articles` 
              : 'Featured Articles'}
        </h2>
        
        {loading && page === 1 ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-800"></div>
          </div>
        ) : articles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {articles.map((article) => (
                <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="h-40 bg-amber-200"></div>
                  <div className="p-3 sm:p-4">
                    <div className="flex items-center mb-2">
                      <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                        {article.category}
                      </span>
                    </div>
                    <h3 className="font-semibold text-amber-800 mb-2">{article.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{article.excerpt}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">{article.readTime} min read</span>
                      <button className="text-amber-800 text-sm font-medium hover:text-amber-600">Read More</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Load More Button */}
            <div className="flex justify-center mt-6">
              <button 
                onClick={handleLoadMore}
                className="bg-amber-800 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded transition-colors"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
                    Loading...
                  </span>
                ) : (
                  'Load More Articles'
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No articles found. Try a different search term.</p>
          </div>
        )}
      </div>
      
      {/* Community section - only show if not searching */}
      {!searchQuery && (
        <div className="bg-amber-50 rounded-lg p-3 sm:p-5 md:p-8 mb-6 sm:mb-8 md:mb-16">
          <h2 className="text-lg sm:text-xl md:text-3xl font-bold text-amber-800 text-center mb-3 sm:mb-4 md:mb-6">
            Join Our Community
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {/* Feature boxes */}
            <div className="bg-white p-3 sm:p-4 md:p-5 rounded-lg shadow-sm">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-amber-800 mb-1 sm:mb-2">Write Articles</h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-2 sm:mb-3">
                Share your thoughts and perspectives with our growing community of readers.
              </p>
              <button className="text-amber-800 font-medium text-xs sm:text-sm md:text-base hover:text-amber-600">
                Learn More →
              </button>
            </div>
            
            <div className="bg-white p-3 sm:p-4 md:p-5 rounded-lg shadow-sm">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-amber-800 mb-1 sm:mb-2">Join Discussions</h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-2 sm:mb-3">
                Engage with other readers and writers in thoughtful conversations.
              </p>
              <button className="text-amber-800 font-medium text-xs sm:text-sm md:text-base hover:text-amber-600">
                Explore Forums →
              </button>
            </div>
            
            <div className="bg-white p-3 sm:p-4 md:p-5 rounded-lg shadow-sm sm:col-span-2 md:col-span-1">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-amber-800 mb-1 sm:mb-2">Subscribe</h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-2 sm:mb-3">
                Get the latest articles and updates delivered directly to your inbox.
              </p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="flex-1 p-1.5 sm:p-2 border border-amber-300 rounded-l text-xs sm:text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <button className="bg-amber-800 text-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-r text-xs sm:text-sm md:text-base hover:bg-amber-700">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          
          {/* Call to action button */}
          <div className="flex justify-center mt-4 sm:mt-6 md:mt-8">
            <button className="bg-amber-800 hover:bg-amber-700 text-white font-bold py-1.5 sm:py-2 md:py-3 px-3 sm:px-4 md:px-6 rounded text-xs sm:text-sm md:text-base transition-colors">
              Explore All Features
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
