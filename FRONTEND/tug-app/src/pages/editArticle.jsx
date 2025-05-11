import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaSpinner, FaSave } from 'react-icons/fa';

const EditArticle = () => {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector(state => state.auth);
  
  const [article, setArticle] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  // Categories - should match the ones in navbar
  const categories = [
    'technology', 
    'health', 
    'business', 
    'lifestyle', 
    'travel', 
    'sports', 
    'entertainment'
  ];
  
  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);
  
  // Fetch article data
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        // Replace with your actual API call
        const response = await fetch(`/api/articles/${articleId}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch article');
        }
        
        setArticle(data);
        setTitle(data.title);
        setContent(data.content);
        setCategory(data.category);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching article:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (isLoggedIn && articleId) {
      fetchArticle();
    }
  }, [isLoggedIn, articleId]);
  
  // Mock data for development (remove in production)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && loading) {
      // Mock article data
      const mockArticle = {
        id: articleId,
        title: 'Understanding React Hooks',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.',
        category: 'technology',
        featured: false,
        createdAt: '2023-01-15'
      };
      
      setTimeout(() => {
        setArticle(mockArticle);
        setTitle(mockArticle.title);
        setContent(mockArticle.content);
        setCategory(mockArticle.category);
        setLoading(false);
      }, 500);
    }
  }, [loading, articleId]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim() || !category) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      setSaving(true);
      
      // Replace with your actual API call
      const response = await fetch(`/api/articles/${articleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          category,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update article');
      }
      
      // Navigate back to settings page after successful update
      navigate('/settings');
    } catch (err) {
      setError(err.message);
      console.error('Error updating article:', err);
    } finally {
      setSaving(false);
    }
  };
  
  const handleCancel = () => {
    navigate('/settings');
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-[80px] flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-800"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 mt-[80px]">
      <h1 className="text-2xl md:text-3xl font-bold text-amber-800 mb-6">Edit Article</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="title" className="block text-amber-800 font-medium mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Article title"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="category" className="block text-amber-800 font-medium mb-2">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-6">
          <label htmlFor="content" className="block text-amber-800 font-medium mb-2">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            rows="12"
            placeholder="Write your article content here..."
            required
          ></textarea>
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border border-amber-300 text-amber-800 rounded-md hover:bg-amber-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-amber-800 text-white rounded-md hover:bg-amber-700 flex items-center"
            disabled={saving}
          >
            {saving ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <FaSave className="mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditArticle;
