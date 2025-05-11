import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaUpload, FaImage, FaLink } from "react-icons/fa";
import axios from "axios";

const WritePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("Technology"); // Default category

  const navigate = useNavigate();
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  // Redirect if not logged in
  React.useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageUrl(""); // Clear URL if file is uploaded

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (e) => {
    setImageUrl(e.target.value);
    setImageFile(null); // Clear file if URL is provided
    setImagePreview(e.target.value); // Use URL as preview
  };

  const toggleUrlInput = () => {
    setShowUrlInput(!showUrlInput);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Please enter a title");
      return;
    }

    if (!content.trim()) {
      setError("Please enter some content");
      return;
    }

    if (!imageUrl) {
      setError("Please provide an image URL");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const blogData = {
        title,
        content,
        imageUrl,
        category, // Include the selected category
        email: user?.email,
      };

      const response = await axios.post(
        "http://localhost:8000/api/newBlog",
        blogData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        alert("Article published successfully!");
        navigate("/");
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.error ||
        "Failed to publish article. Please try again.";
      setError(errorMsg);
      console.error("Error:", error);
    } finally {
      setIsUploading(false);
    }
  };
  const categories = [
    "Technology",
    "Health",
    "Business",
    "Lifestyle",
    "Sports",
    "Entertainment",
  ];

  return (
    <div className="w-full max-w-6xl mx-auto mt-8 md:mt-16 lg:mt-24 p-3 sm:p-4 md:p-6 bg-amber-50 rounded-lg shadow-md">
      <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 sm:mb-10 text-amber-900 text-center">
        Create New Article
      </h2>

      {error && (
        <div className="mb-4 sm:mb-6 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Title Input */}
        <div className="mb-4 sm:mb-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter Title Here"
            className="w-full p-2 sm:p-4 text-xl sm:text-2xl font-bold border-b-2 border-amber-400 bg-white text-black focus:outline-none focus:border-amber-600 rounded-md"
          />
        </div>
        {/* Category Dropdown */}
        <div className="mb-4 sm:mb-6">
          <label
            htmlFor="category"
            className="block text-sm sm:text-base font-medium text-amber-800 mb-1"
          >
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 sm:p-3 border border-amber-400 bg-white text-black rounded-md focus:outline-none focus:border-amber-600"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Image Upload Section */}
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 border-2 border-dashed border-amber-300 rounded-lg">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
            <h3 className="text-lg sm:text-xl font-semibold text-amber-800">
              Featured Image
            </h3>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => document.getElementById("image-upload").click()}
                className="flex items-center px-2 sm:px-3 py-1 sm:py-2 bg-amber-100 text-amber-800 text-sm sm:text-base rounded hover:bg-amber-200 transition-colors border border-amber-300"
              >
                <FaUpload className="mr-1 sm:mr-2" /> Upload
              </button>
              <button
                type="button"
                onClick={toggleUrlInput}
                className="flex items-center px-2 sm:px-3 py-1 sm:py-2 bg-amber-100 text-amber-800 text-sm sm:text-base rounded hover:bg-amber-200 transition-colors border border-amber-300"
              >
                <FaLink className="mr-1 sm:mr-2" /> URL
              </button>
            </div>
          </div>

          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          {showUrlInput && (
            <div className="mb-4">
              <input
                type="url"
                value={imageUrl}
                onChange={handleImageUrlChange}
                placeholder="Enter image URL"
                className="w-full p-2 border border-amber-400 bg-white text-black rounded-md focus:outline-none focus:border-amber-600"
              />
            </div>
          )}

          {imagePreview && (
            <div className="mt-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-32 sm:max-h-48 md:max-h-64 mx-auto rounded object-contain"
                onError={() => {
                  if (imageUrl) {
                    setError("Invalid image URL. Please provide a valid URL.");
                    setImagePreview(null);
                  }
                }}
              />
            </div>
          )}

          {!imagePreview && (
            <div className="flex flex-col items-center justify-center h-24 sm:h-32 md:h-40 bg-amber-100 rounded">
              <FaImage className="text-amber-400 text-3xl sm:text-4xl md:text-5xl mb-2" />
              <p className="text-amber-600 text-sm sm:text-base">
                No image selected
              </p>
            </div>
          )}
        </div>

        {/* Article Content */}
        <div className="mb-4 sm:mb-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your article here..."
            className="w-full p-3 sm:p-4 min-h-[200px] sm:min-h-[250px] md:min-h-[300px] border border-amber-400 bg-white text-black rounded-md focus:outline-none focus:border-amber-600 resize-y"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isUploading}
          className="w-full py-2 sm:py-3 bg-amber-100 text-amber-800 text-base sm:text-lg font-semibold rounded hover:bg-amber-200 transition-colors disabled:bg-amber-50 flex items-center justify-center border border-amber-300"
        >
          {isUploading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-amber-800"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Publishing...
            </>
          ) : (
            "Publish Article"
          )}
        </button>
      </form>

      {/* Image Upload Instructions */}
      <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-amber-100 rounded-lg">
        <h3 className="text-base sm:text-lg font-semibold text-amber-800 mb-2">
          How to Add Images:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <h4 className="font-medium text-amber-700 mb-1">
              Upload from Computer:
            </h4>
            <ol className="list-decimal list-inside text-sm sm:text-base text-amber-900">
              <li>Click the "Upload" button above</li>
              <li>Select an image file from your computer</li>
              <li>The image will appear in the preview area</li>
            </ol>
          </div>
          <div>
            <h4 className="font-medium text-amber-700 mb-1">
              Use an Image URL:
            </h4>
            <ol className="list-decimal list-inside text-sm sm:text-base text-amber-900">
              <li>Click the "URL" button above</li>
              <li>
                Paste a direct link to an image (must end with .jpg, .png, etc.)
              </li>
              <li>
                The image will appear in the preview area if the URL is valid
              </li>
            </ol>
          </div>
        </div>
        <p className="mt-2 text-xs sm:text-sm text-amber-700">
          Supported formats: JPG, PNG, GIF, WebP. Maximum file size: 5MB.
        </p>
      </div>
    </div>
  );
};

export default WritePage;
