import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const ArticlePage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Article ID from params:", id); // Debug log
    setLoading(true);
    
    // Try to fetch the article data
    axios
      .get(`http://localhost:8000/api/posts/${id}`)
      .then((res) => {
        console.log("API response:", res.data); // Debug log
        setArticle(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching article:", err);
        setError("Failed to load article. Please try again later.");
        setLoading(false);
        
        // Always use fallback data for now to ensure something displays
        const fallbackArticle = {
          id: id || 1,
          title: "Sample Article Title",
          author: {
            id: 101,
            name: "John Doe"
          },
          image: "https://via.placeholder.com/600x400",
          content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus. Mauris iaculis porttitor posuere. Praesent id metus massa, ut blandit odio. Proin quis tortor orci. Etiam at risus et justo dignissim congue. Donec congue lacinia dui, a porttitor lectus condimentum laoreet. Nunc eu ullamcorper orci. Quisque eget odio ac lectus vestibulum faucibus eget in metus. In pellentesque faucibus vestibulum. Nulla at nulla justo, eget luctus tortor. Nulla facilisi. Duis aliquet egestas purus in blandit. Curabitur vulputate, ligula lacinia scelerisque tempor, lacus lacus ornare ante, ac egestas est urna sit amet arcu. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos."
        };
        console.log("Using fallback data:", fallbackArticle); // Debug log
        setArticle(fallbackArticle);
      });
  }, [id]);

  // Add debug rendering to see what's happening
  console.log("Current state:", { loading, error, article });

  if (loading && !article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="w-full bg-amber-50 py-8 px-4 rounded-lg text-center">
          <p className="text-amber-800">Loading article {id}...</p>
        </div>
      </div>
    );
  }

  if (error && !article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="w-full bg-red-50 py-8 px-4 rounded-lg text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  // Safety check to ensure article exists before rendering
  if (!article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="w-full bg-red-50 py-8 px-4 rounded-lg text-center">
          <p className="text-red-600">Article not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Top section with title, author and image */}
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        {/* Left side - Title and author */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold text-amber-800 mb-4">{article.title}</h1>
          <p className="text-gray-700">
            By{" "}
            <Link 
              to={`/author/${article.author?.id || 'unknown'}`} 
              className="text-amber-600 hover:text-amber-800 hover:underline"
            >
              {article.author?.name || 'Unknown Author'}
            </Link>
          </p>
        </div>
        
        {/* Right side - Article image */}
        <div className="md:w-1/2">
          <img 
            src={article.image || "https://via.placeholder.com/600x400"} 
            alt={article.title} 
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>
      </div>
      
      {/* Article content */}
      <div className="mt-8">
        <div className="prose prose-amber max-w-none text-center">
          {(article.content || "No content available").split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4 text-gray-800">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
      
      {/* Subscription CTA */}
      <div className="mt-16 text-center">
        <Link to="/subscribe" className="inline-block">
          <p className="text-amber-700 text-lg font-medium hover:text-amber-900 underline">
            If you enjoyed this, you can subscribe
          </p>
        </Link>
      </div>
    </div>
  );
};

export default ArticlePage;
