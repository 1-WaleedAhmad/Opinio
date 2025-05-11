import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  const handleSubscribe = (e) => {
    e.preventDefault();
    // Implement subscription logic here
    console.log("Email subscribed:", e.target.email.value);
    // Reset form or show success message
    e.target.reset();
  };

  return (
    <footer className="bg-amber-800 w-screen text-gray-200 pt-6 sm:pt-8 md:pt-10 pb-4 sm:pb-5 md:pb-6 mt-8 sm:mt-12 md:mt-20">
      {/* Main Footer Content */}
      <div className="container mx-auto px-3 sm:px-4 md:px-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {/* About Section */}
          <div className="mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 md:mb-4 text-white">TUG</h2>
            <p className="text-xs sm:text-sm md:text-base text-amber-100 mb-3 sm:mb-4 border-amber-600">
              Exploring ideas that matter through thoughtful discourse and analysis.
              Join our community of curious minds.
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              <a href="#" className="text-amber-100 hover:text-white transition-colors">
                <FaFacebook size={16} className="sm:text-lg md:text-xl" />
              </a>
              <a href="#" className="text-amber-100 hover:text-white transition-colors">
                <FaTwitter size={16} className="sm:text-lg md:text-xl" />
              </a>
              <a href="#" className="text-amber-100 hover:text-white transition-colors">
                <FaInstagram size={16} className="sm:text-lg md:text-xl" />
              </a>
              <a href="#" className="text-amber-100 hover:text-white transition-colors">
                <FaLinkedin size={16} className="sm:text-lg md:text-xl" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3 md:mb-4 text-white">Quick Links</h3>
            {/* Uncomment when you have these routes */}
            {/* <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm md:text-base">
              <li>
                <Link to="/" className="text-amber-100 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-amber-100 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/articles" className="text-amber-100 hover:text-white transition-colors">
                  Articles
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-amber-100 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul> */}
          </div>
          
          {/* Topics */}
          <div className="mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3 md:mb-4 text-white">Topics</h3>
            {/* Uncomment when you have these routes */}
            {/* <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm md:text-base">
              <li>
                <Link to="/philosophy" className="text-amber-100 hover:text-white transition-colors">
                  Philosophy
                </Link>
              </li>
              <li>
                <Link to="/technology" className="text-amber-100 hover:text-white transition-colors">
                  Technology
                </Link>
              </li>
              <li>
                <Link to="/culture" className="text-amber-100 hover:text-white transition-colors">
                  Culture
                </Link>
              </li>
              <li>
                <Link to="/science" className="text-amber-100 hover:text-white transition-colors">
                  Science
                </Link>
              </li>
              <li>
                <Link to="/health" className="text-amber-100 hover:text-white transition-colors">
                  Health
                </Link>
              </li>
            </ul> */}
          </div>
          
          {/* Newsletter Subscription */}
          <div className="mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3 md:mb-4 text-white">Subscribe</h3>
            <p className="text-xs sm:text-sm md:text-base text-amber-100 mb-2 sm:mb-3 md:mb-4">
              Stay updated with our latest articles and insights.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col">
              <div className="flex mb-2 gap-1 sm:gap-2">
                <input
                  type="email"
                  name="email"
                  placeholder="Your email address"
                  className="p-1.5 sm:p-2 rounded-l bg-amber-700 text-white text-xs sm:text-sm md:text-base placeholder-amber-300 border border-amber-600 focus:outline-none focus:border-amber-500 w-full"
                  required
                />
                <button
                  type="submit"
                  className="bg-amber-900 hover:bg-amber-950 text-amber-300 py-1.5 sm:py-2 px-2 sm:px-3 md:px-4 rounded-r transition-colors flex items-center cursor-pointer text-xs sm:text-sm md:text-base"
                >
                  <FaEnvelope className="mr-1 sm:mr-2 text-xs sm:text-sm" />
                  Join
                </button>
              </div>
              <p className="text-xxs sm:text-xs text-amber-200">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          </div>
        </div>
      </div>
      
      {/* Bottom Footer */}
      <div className="border-t border-amber-700 mt-4 sm:mt-6 md:mt-8 pt-3 sm:pt-4 md:pt-6">
        <div className="container mx-auto px-3 sm:px-4 md:px-5 flex flex-col md:flex-row justify-between items-center">
          <p className="text-amber-200 text-xxs sm:text-xs md:text-sm mb-2 md:mb-0 text-center md:text-left">
            &copy; {new Date().getFullYear()} TUG. All rights reserved.
          </p>
          <div className="flex space-x-3 sm:space-x-4 md:space-x-6 text-center">
            {/* Uncomment when you have these routes */}
            {/* <Link to="/privacy" className="text-amber-200 hover:text-white text-xxs sm:text-xs md:text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-amber-200 hover:text-white text-xxs sm:text-xs md:text-sm transition-colors">
              Terms of Service
            </Link>
            <Link to="/cookies" className="text-amber-200 hover:text-white text-xxs sm:text-xs md:text-sm transition-colors">
              Cookie Policy
            </Link> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
