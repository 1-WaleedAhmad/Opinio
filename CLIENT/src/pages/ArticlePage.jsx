import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Calendar,
  Clock,
  User,
  Tag,
  ChevronLeft,
  Share2,
  ThumbsUp,
} from "lucide-react";

const getImageUrl = (imagePath) => {
  if (!imagePath) return "https://via.placeholder.com/800x400?text=No+Image"; // Fallback image
  return imagePath.startsWith("http")
    ? imagePath
    : `http://localhost:8000/${imagePath}`; // Convert relative path to full URL
};

const ArticlePage = () => {
  const { id } = useParams(); // Get article ID from URL params

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [relatedArticles, setRelatedArticles] = useState([]);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8000/api/articles/${id}`
        ); // Fetch article data
        setArticle(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching article:", err); // Log detailed error information
        if (err.response && err.response.status === 404) {
          setError("The requested article was not found.");
        } else {
          setError("Failed to fetch article data. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const toggleLike = () => {
    setLiked(!liked);
  };

  const renderLoadingState = () => (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-amber-50 p-6 rounded-lg shadow-md">
          <div className="animate-pulse">
            <div className="h-8 bg-amber-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-amber-100 rounded w-1/2 mb-6"></div>
            <div className="h-64 bg-amber-100 rounded mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-amber-100 rounded"></div>
              <div className="h-4 bg-amber-100 rounded"></div>
              <div className="h-4 bg-amber-100 rounded"></div>
              <div className="h-4 bg-amber-100 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderErrorState = () => (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-red-50 p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-red-700 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-red-600 mb-4">{error}</p>
        </div>
      </div>
    </div>
  );

  if (loading) return renderLoadingState();
  if (error) return renderErrorState();
  if (!article) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="max-w-3xl mx-auto bg-red-50 p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-700 mb-4">
            Article Not Found
          </h2>
          <p className="text-[rgb(255,241,173)] mb-6">
            The article you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(article.createdAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <div className="bg-amber-50 min-h-screen pb-12">
      <div className="w-full h-64 md:h-96 bg-amber-800 relative overflow-hidden">
        <img
          src={article.image}
          alt={article.heading}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-amber-900 to-transparent opacity-70"></div>
      </div>

      <div className="container mx-auto px-4">
        {/* <div className="max-w-3xl mx-auto -mt-8 mb-6 relative z-10">
          <div className="bg-white shadow-md rounded-lg p-4 flex items-center text-sm">
            <span className="text-gray-600 truncate">{article.heading}</span>
          </div>
        </div> */}

        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {article.heading}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600">
              <div className="flex items-center">
                <User size={16} className="mr-1 text-amber-600" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar size={16} className="mr-1 text-amber-600" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center">
                <Clock size={16} className="mr-1 text-amber-600" />
                <span>
                  {new Date(article.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center">
                <Tag size={16} className="mr-1 text-amber-600" />
                <span className="capitalize">
                  {article.category || "uncategorized"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
              <button
                onClick={toggleLike}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition ${
                  liked
                    ? "bg-amber-100 text-amber-700"
                    : "bg-gray-100 text-gray-600 hover:bg-amber-50 hover:text-amber-600"
                }`}
              >
                <ThumbsUp size={16} className={liked ? "fill-amber-500" : ""} />
                {liked ? "Liked" : "Like"}
              </button>
            </div>

            <div className="prose prose-amber max-w-none">
              {(article.content || "").split("\n").map((paragraph, index) => (
                <p
                  key={index}
                  className={`mb-4 text-gray-700 leading-relaxed ${
                    index === 0 ? "text-lg font-medium" : ""
                  }`}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;
