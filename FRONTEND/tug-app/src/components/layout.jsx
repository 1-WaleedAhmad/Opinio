import React, { useState } from 'react';
import Navbar from './navbar';
import Footer from './footer';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    const handleSearch = (e) => {
      e.preventDefault();
      console.log("Searching for:", searchQuery);
    };

    return (
      <div className="flex flex-col min-h-screen overflow-x-hidden">
        {/* Navbar with responsive height */}
        <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        
        {/* Menu that pushes content down - responsive height and positioning */}
        {isMenuOpen && (
          <div className="bg-amber-800 w-full h-[140px] sm:h-[160px] md:h-[200px] fixed top-[60px] sm:top-[70px] md:top-[80px] left-0 z-40">
            <div className="flex flex-col sm:flex-row h-full p-3 sm:p-4">
              {/* Left side - Topics - Full width on mobile, 2/3 on larger screens */}
              <div className="w-full sm:w-2/3 border-b sm:border-b-0 sm:border-r border-amber-700 pb-2 sm:pb-0 sm:pr-4 mb-2 sm:mb-0">
                <h2 className="text-white text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3">Topics</h2>
                <div className="flex flex-row sm:flex-col flex-wrap gap-2 sm:gap-2">
                  <Link to="/philosophy" className="text-white hover:text-gray-300 transition-colors text-xs sm:text-sm md:text-base">
                    Philosophy
                  </Link>
                  <Link to="/technology" className="text-white hover:text-gray-300 transition-colors text-xs sm:text-sm md:text-base">
                    Technology
                  </Link>
                  <Link to="/culture" className="text-white hover:text-gray-300 transition-colors text-xs sm:text-sm md:text-base">
                    Culture
                  </Link>
                </div>
              </div>
              
              {/* Right side - Search - Full width on mobile, 1/3 on larger screens */}
              <div className="w-full sm:w-1/3 sm:pl-4">
                <h2 className="text-white text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3">Search Articles</h2>
                <form onSubmit={handleSearch} className="flex flex-col">
                  <input
                    type="text"
                    placeholder="Enter keywords..."
                    className="p-2 rounded bg-amber-700 text-white text-xs sm:text-sm md:text-base placeholder-amber-300 border border-amber-600 focus:outline-none focus:border-amber-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="mt-2 bg-amber-900 hover:bg-amber-950 text-amber-300 py-1.5 sm:py-2 px-3 sm:px-4 rounded transition-colors text-xs sm:text-sm md:text-base"
                  >
                    Search
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
        
        {/* Main content with conditional margin - responsive top margin */}
        <main className={`flex-grow w-full ${isMenuOpen ? 'mt-[200px] sm:mt-[230px] md:mt-[280px]' : 'mt-[60px] sm:mt-[70px] md:mt-[80px]'}`}>
          {children}
        </main>
        
        {/* Footer wrapper - fixed width */}
        <div className="w-full">
          <Footer />
        </div>
      </div>
    );
};

export default Layout;
