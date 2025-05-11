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

  // Fetch posts from the API
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:8000/api/posts")
      .then((res) => {
        setPosts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts. Please try again later.");
        setLoading(false);
        
        // Fallback data for development/testing
        setPosts([
          { id: 1, title: "Sample Post 1", body: "This is a sample post description for testing the slider component." },
          { id: 2, title: "Sample Post 2", body: "Another sample post to demonstrate how multiple cards look in the slider." },
          { id: 3, title: "Sample Post 3", body: "Third sample post with some longer content to see how the card handles more text in the description area." },
          { id: 4, title: "Sample Post 4", body: "Fourth sample post showing that we can scroll through multiple items in this carousel." },
          { id: 5, title: "Sample Post 5", body: "Fifth sample post to ensure we have enough items to demonstrate scrolling with arrows." }
        ]);
      });
  }, []);

  // Responsive settings for the slider
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
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          dots: true
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          dots: true
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          dots: true,
          centerMode: true,
          centerPadding: '20px'
        },
      },
    ],
  };

  if (loading && posts.length === 0) {
    return (
      <div className="w-full mt-4 sm:mt-6 md:mt-10 bg-amber-50 py-4 sm:py-6 md:py-8 px-3 sm:px-4 rounded-lg text-center">
        <p className="text-amber-800 text-sm sm:text-base">Loading posts...</p>
      </div>
    );
  }

  if (error && posts.length === 0) {
    return (
      <div className="w-full mt-4 sm:mt-6 md:mt-10 bg-red-50 py-4 sm:py-6 md:py-8 px-3 sm:px-4 rounded-lg text-center">
        <p className="text-red-600 text-sm sm:text-base">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full mt-4 sm:mt-6 md:mt-10 bg-amber-50 py-4 sm:py-6 md:py-8 px-3 sm:px-6 md:px-12 rounded-lg custom-slider">
      <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 md:mb-6 text-amber-800 text-center">Featured Posts</h2>
      
      {/* Slider component */}
      <div className="mx-0 sm:mx-3 md:mx-6">
        <Slider {...settings}>
          {posts.map((post) => (
            <div key={post.id} className="px-2 sm:px-3 h-56 sm:h-60 md:h-64">
              <Card 
                title={post.title} 
                description={post.body} 
                id={post.id} 
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default PostSlider;
