import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import axios from "axios";
import Card from "./card";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./SliderStyles.css"; // Import custom styles for the slider

const PostSlider = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:8000/api/featured-posts");
        // The API already returns only featured posts, so no need to filter
        setPosts(res.data);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 1, arrows: false, dots: true },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          arrows: false,
          dots: true,
          centerMode: true,
          centerPadding: "20px",
        },
      },
    ],
  };

  if (loading) {
    return (
      <div className="w-full mt-4 bg-amber-50 py-6 px-4 rounded-lg text-center">
        <p className="text-amber-800 text-sm">Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full mt-4 bg-red-50 py-6 px-4 rounded-lg text-center">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="w-full mt-4 bg-yellow-50 py-6 px-4 rounded-lg text-center">
        <p className="text-yellow-700 text-sm">No featured posts available.</p>
      </div>
    );
  }

  return (
    <div className="w-full mt-4 bg-amber-50 py-6 px-6 md:px-12 rounded-lg custom-slider">
      <h2 className="text-2xl font-bold mb-4 text-amber-800 text-center">Featured Posts</h2>
      <Slider {...settings}>
        {posts.map((post) => (
          <div key={post._id} className="px-2 h-60 md:h-64">
            <Card 
              title={post.heading} 
              description={post.content} 
              photo={post.image}
              id={post._id}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default PostSlider;