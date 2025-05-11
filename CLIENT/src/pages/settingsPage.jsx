import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaEdit, FaTrash, FaSpinner, FaSave } from "react-icons/fa";
import axios from "axios";
import Switch from "react-switch"; // Optional, if you're using react-switch

const SettingsPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [updatedArticles, setUpdatedArticles] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const navigate = useNavigate();
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  const fetchArticles = async () => {
    try {
      if (!user?.email) return;

      setLoading(true);
      setError(null);

      const response = await axios.post(
        "http://localhost:8000/api/articles/user-by-email",
        { email: user.email },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Check if response is valid and contains articles
      if (response.data && response.data.articles) {
        setArticles(response.data.articles);
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to fetch articles"
      );
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn && user?.email) {
      fetchArticles();
    }
  }, [isLoggedIn, user]);

  const handleEditArticle = (articleId) => {
    navigate(`/edit/${articleId}`);
  };

  const handleDeleteArticle = async (article) => {
    if (!window.confirm("Are you sure you want to delete this article?")) {
      return;
    }

    try {
      setDeletingId(article._id);

      const response = await axios.delete(
        `http://localhost:8000/api/articles/${article._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        setArticles(articles.filter((item) => item._id !== article._id));
        setSuccess("Article deleted successfully");

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete article");

      // Clear error message after 3 seconds
      setTimeout(() => setError(null), 3000);
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleFeatured = (id, newStatus) => {
    // Update local state first for immediate UI feedback
    setArticles((prevArticles) =>
      prevArticles.map((article) =>
        article._id === id ? { ...article, featured: newStatus } : article
      )
    );

    // Track the updated articles
    setUpdatedArticles((prev) => {
      // Find the article object
      const article = articles.find((article) => article._id === id);

      if (!article) return prev;

      // Create updated article with new featured status
      const updatedArticle = {
        _id: article._id,
        featured: newStatus,
      };

      // Remove any existing entry for this article and add the new one
      const filtered = prev.filter((a) => a._id !== id);
      return [...filtered, updatedArticle];
    });
  };

  const handleSaveChanges = async () => {
    if (updatedArticles.length === 0) {
      setError("No changes to save");
      setTimeout(() => setError(null), 3000);
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      // Send PUT requests to update each article's featured status
      const savePromises = updatedArticles.map((article) =>
        axios.put(
          `http://localhost:8000/api/articles/${article._id}`,
          { featured: article.featured },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
      );

      await Promise.all(savePromises);

      // Refresh articles from server to ensure they match backend state
      await fetchArticles();

      // Clear the updated articles list since changes are saved
      setUpdatedArticles([]);
      setSuccess("Changes saved successfully");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save changes");

      // Clear error message after 3 seconds
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-[80px] bg-gradient-to-b from-amber-50 to-white shadow-lg rounded-lg">
      <h1 className="text-3xl md:text-4xl font-extrabold text-amber-900 mb-8 text-center">
        Settings
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          {success}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-900"></div>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold text-amber-800 mb-6">
            My Articles
          </h2>
          {articles.length === 0 ? (
            <p className="text-gray-600 text-center">
              You haven't written any articles yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-amber-200 rounded-lg shadow-md">
                <thead>
                  <tr className="bg-amber-100">
                    <th className="py-4 px-6 text-left text-sm font-semibold text-amber-900">
                      Title
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-amber-900">
                      Category
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-amber-900">
                      Date
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-amber-900">
                      Featured
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-amber-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((article) => (
                    <tr
                      key={article._id}
                      className="border-t border-amber-100 hover:bg-amber-50"
                    >
                      <td className="py-4 px-6 text-sm text-gray-800">
                        {article.heading}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-800">
                        {article.category}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-800">
                        {new Date(article.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-800">
                        <Switch
                          checked={article.featured || false}
                          onChange={() =>
                            handleToggleFeatured(article._id, !article.featured)
                          }
                          offColor="#cccccc"
                          onColor="#10b981"
                          handleDiameter={20}
                          height={25}
                          width={50}
                          uncheckedIcon={false}
                          checkedIcon={false}
                        />
                      </td>
                      <td className="py-4 px-6 text-sm">
                        <div className="flex space-x-4">
                          <button
                            onClick={() => handleEditArticle(article._id)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit article"
                          >
                            <FaEdit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteArticle(article)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete article"
                            disabled={deletingId === article._id}
                          >
                            {deletingId === article._id ? (
                              <FaSpinner className="animate-spin" size={18} />
                            ) : (
                              <FaTrash size={18} />
                            )}
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
      <div className="flex justify-end mt-6">
        <button
          onClick={handleSaveChanges}
          className="bg-amber-600 text-white px-6 py-2 rounded hover:bg-amber-700 flex items-center space-x-2 disabled:opacity-50"
          disabled={isSaving || updatedArticles.length === 0}
        >
          {isSaving ? <FaSpinner className="animate-spin" /> : <FaSave />}
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
