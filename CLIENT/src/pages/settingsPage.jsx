import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaEdit, FaTrash, FaSpinner } from "react-icons/fa";
import axios from "axios"; 

const SettingsPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const navigate = useNavigate();
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  // Fetch user's articles
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        if (!user?.email) return;

        setLoading(true);
        setError(null);

        const response = await fetch(
          "http://localhost:8000/api/articles/user-by-email",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: user.email }),
          }
        );

        const responseText = await response.text();

        if (!response.ok) {
          const errorData = responseText ? JSON.parse(responseText) : {};
          throw new Error(
            errorData.message || `HTTP error! status: ${response.status}`
          );
        }

        const data = responseText ? JSON.parse(responseText) : {};
        setArticles(data.articles || []);
      } catch (err) {
        setError(err.message);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn && user?.email) {
      fetchArticles();
    }
  }, [isLoggedIn, user]);

  // Handle edit article
  const handleEditArticle = (articleId) => {
    navigate(`/edit/${articleId}`);
  };

  // Handle delete article by ID
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
        // Remove the deleted article from state
        setArticles(articles.filter((item) => item._id !== article._id));
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete article");
    } finally {
      setDeletingId(null);
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
                      <td className="py-4 px-6 text-sm">
                        <div className="flex space-x-4">
                          <button
                            onClick={() => handleEditArticle(article._id)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit article"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteArticle(article)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete article"
                            disabled={deletingId === article._id}
                          >
                            {deletingId === article._id ? (
                              <FaSpinner className="animate-spin" />
                            ) : (
                              <FaTrash />
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
    </div>
  );
};

export default SettingsPage;