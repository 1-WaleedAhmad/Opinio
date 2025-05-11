import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaEdit, FaStar, FaRegStar, FaTrash } from 'react-icons/fa';

const SettingsPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('myArticles');
  const [featuredArticles, setFeaturedArticles] = useState([]);
  
  const navigate = useNavigate();
  const { isLoggedIn, user } = useSelector(state => state.auth);
  
  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);
  
  // Fetch user's articles
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        // Replace with your actual API call
        const response = await fetch('/api/articles/user');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch articles');
        }
        
        setArticles(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching articles:', err);
      } finally {
        setLoading(false);
      }
    };
    
    const fetchFeaturedArticles = async () => {
      try {
        // Replace with your actual API call
        const response = await fetch('/api/articles/featured');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch featured articles');
        }
        
        setFeaturedArticles(data);
      } catch (err) {
        console.error('Error fetching featured articles:', err);
      }
    };
    
    if (isLoggedIn) {
      fetchArticles();
      fetchFeaturedArticles();
    }
  }, [isLoggedIn]);
  
  // Handle edit article
  const handleEditArticle = (articleId) => {
    navigate(`/edit/${articleId}`);
  };
  
  // Handle delete article
  const handleDeleteArticle = async (articleId) => {
    if (window.confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      try {
        // Replace with your actual API call
        const response = await fetch(`/api/articles/${articleId}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Failed to delete article');
        }
        
        // Remove the deleted article from the state
        setArticles(articles.filter(article => article.id !== articleId));
      } catch (err) {
        setError(err.message);
        console.error('Error deleting article:', err);
      }
    }
  };
  
  // Handle toggle featured status
  const handleToggleFeatured = async (articleId, isFeatured) => {
    try {
      // Replace with your actual API call
      const response = await fetch(`/api/articles/${articleId}/featured`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ featured: !isFeatured }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update featured status');
      }
      
      // Update the featured status in the state
      if (isFeatured) {
        setFeaturedArticles(featuredArticles.filter(article => article.id !== articleId));
      } else {
        const articleToFeature = articles.find(article => article.id === articleId);
        if (articleToFeature) {
          setFeaturedArticles([...featuredArticles, { ...articleToFeature, featured: true }]);
        }
      }
      
      // Update the article in the articles list
      setArticles(articles.map(article => 
        article.id === articleId 
          ? { ...article, featured: !isFeatured } 
          : article
      ));
    } catch (err) {
      setError(err.message);
      console.error('Error updating featured status:', err);
    }
  };
  
  // Mock data for development (remove in production)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && loading) {
      // Mock articles data
      const mockArticles = [
        { id: 1, title: 'Understanding React Hooks', content: 'Lorem ipsum...', featured: false, createdAt: '2023-01-15' },
        { id: 2, title: 'Advanced CSS Techniques', content: 'Lorem ipsum...', featured: true, createdAt: '2023-02-20' },
        { id: 3, title: 'JavaScript Best Practices', content: 'Lorem ipsum...', featured: false, createdAt: '2023-03-10' },
      ];
      
      setArticles(mockArticles);
      setFeaturedArticles(mockArticles.filter(article => article.featured));
      setLoading(false);
    }
  }, [loading]);
  
  return (
    <div className="container mx-auto px-4 py-8 mt-[80px]">
      <h1 className="text-2xl md:text-3xl font-bold text-amber-800 mb-6">Settings</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Tabs */}
      <div className="border-b border-amber-200 mb-6">
        <div className="flex flex-wrap -mb-px">
          <button
            className={`inline-block p-4 border-b-2 rounded-t-lg ${
              activeTab === 'myArticles'
                ? 'text-amber-800 border-amber-800'
                : 'border-transparent hover:text-amber-600 hover:border-amber-300'
            }`}
            onClick={() => setActiveTab('myArticles')}
          >
            My Articles
          </button>
          <button
            className={`inline-block p-4 border-b-2 rounded-t-lg ${
              activeTab === 'featuredArticles'
                ? 'text-amber-800 border-amber-800'
                : 'border-transparent hover:text-amber-600 hover:border-amber-300'
            }`}
            onClick={() => setActiveTab('featuredArticles')}
          >
            Featured Articles
          </button>
        </div>
      </div>
      
      {/* Content based on active tab */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-800"></div>
        </div>
      ) : (
        <>
          {activeTab === 'myArticles' && (
            <div>
              <h2 className="text-xl font-semibold text-amber-700 mb-4">My Articles</h2>
              {articles.length === 0 ? (
                <p className="text-gray-600">You haven't written any articles yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-amber-200 rounded-lg">
                    <thead>
                      <tr className="bg-amber-100">
                        <th className="py-3 px-4 text-left text-sm font-semibold text-amber-800">Title</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-amber-800">Date</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-amber-800">Featured</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-amber-800">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {articles.map((article) => (
                        <tr key={article.id} className="border-t border-amber-100 hover:bg-amber-50">
                          <td className="py-3 px-4 text-sm">{article.title}</td>
                          <td className="py-3 px-4 text-sm">{new Date(article.createdAt).toLocaleDateString()}</td>
                          <td className="py-3 px-4 text-sm">
                            <button 
                              onClick={() => handleToggleFeatured(article.id, article.featured)}
                              className="text-amber-600 hover:text-amber-800"
                              title={article.featured ? "Remove from featured" : "Add to featured"}
                            >
                              {article.featured ? <FaStar /> : <FaRegStar />}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-sm">
                            <div className="flex space-x-3">
                              <button 
                                onClick={() => handleEditArticle(article.id)}
                                className="text-blue-600 hover:text-blue-800"
                                title="Edit article"
                              >
                                <FaEdit />
                              </button>
                              <button 
                                onClick={() => handleDeleteArticle(article.id)}
                                className="text-red-600 hover:text-red-800"
                                title="Delete article"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'featuredArticles' && (
            <div>
              <h2 className="text-xl font-semibold text-amber-700 mb-4">Featured Articles</h2>
              {featuredArticles.length === 0 ? (
                <p className="text-gray-600">No articles are currently featured.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-amber-200 rounded-lg">
                    <thead>
                      <tr className="bg-amber-100">
                        <th className="py-3 px-4 text-left text-sm font-semibold text-amber-800">Title</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-amber-800">Date</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-amber-800">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {featuredArticles.map((article) => (
                        <tr key={article.id} className="border-t border-amber-100 hover:bg-amber-50">
                          <td className="py-3 px-4 text-sm">{article.title}</td>
                          <td className="py-3 px-4 text-sm">{new Date(article.createdAt).toLocaleDateString()}</td>
                          <td className="py-3 px-4 text-sm">
                            <div className="flex space-x-3">
                              <button 
                                onClick={() => handleToggleFeatured(article.id, true)}
                                className="text-amber-600 hover:text-amber-800"
                                title="Remove from featured"
                              >
                                <FaStar />
                              </button>
                              <button 
                                onClick={() => handleEditArticle(article.id)}
                                className="text-blue-600 hover:text-blue-800"
                                title="Edit article"
                              >
                                <FaEdit />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SettingsPage;
