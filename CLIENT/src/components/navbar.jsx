import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { FaSearch, FaBars, FaPen, FaTimes, FaCog } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../redux/authActions';
import React from 'react';

const Navbar = ({ isMenuOpen, setIsMenuOpen }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showCategoryMenu, setShowCategoryMenu] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [showSearchInput, setShowSearchInput] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const menuRef = useRef(null);
    const logoutConfirmRef = useRef(null);
    const searchInputRef = useRef(null);
    
    // Example categories - you might fetch these from an API
    const categories = [
      'technology', 
      'health', 
      'business', 
      'lifestyle', 
      'travel', 
      'sports', 
      'entertainment'
    ];
    
    // Get auth state from Redux
    const { isLoggedIn, user } = useSelector(state => state.auth);
    
    const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen);
    };
    
    const toggleCategoryMenu = () => {
      setShowCategoryMenu(!showCategoryMenu);
    };
    
    const toggleSearchInput = () => {
      setShowSearchInput(!showSearchInput);
    };
    
    const handleSearch = (e) => {
      e.preventDefault();
      console.log("Searching for:", searchQuery);
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearchInput(false);
    };
    
    const handleLogoutClick = () => {
      setShowLogoutConfirm(true);
    };
    
    const confirmLogout = () => {
      dispatch(logoutUser());
      setShowLogoutConfirm(false);
      navigate('/');
    };
    
    const cancelLogout = () => {
      setShowLogoutConfirm(false);
    };
    
    const handleLoginClick = () => {
      navigate('/login');
    };
    const handleRegister = () => {
      navigate('Register');
    }
    const handleWriteClick = () => {
      navigate('/write');
    };
    
    const handleSettingsClick = () => {
      navigate('/settings');
    };
    
    const handleCategoryClick = (category) => {
      navigate(`/category/${category}`);
      setShowCategoryMenu(false);
      setIsMenuOpen(false);
    };
    
    // Close menus when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
          setShowCategoryMenu(false);
        }
        
        if (logoutConfirmRef.current && !logoutConfirmRef.current.contains(event.target)) {
          setShowLogoutConfirm(false);
        }
        
        if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
          setShowSearchInput(false);
        }
      };
      
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);
    
    // Define button style as a string to ensure consistency
    const buttonStyle = "inline-block bg-amber-800 hover:bg-amber-700 border-2 border-amber-300 text-black font-semibold rounded-3xl py-1 px-2 sm:px-3 cursor-pointer";
    
    return (
      <>
        <div className="bg-amber-800 h-[60px] sm:h-[70px] md:h-[80px] w-full fixed top-0 left-0 z-50 flex justify-between items-center text-gray-200 px-2 sm:px-3 md:px-5">
          {/* Left section with search and menu icons */}
          <div className="flex flex-row items-center bg-amber-800 gap-2 sm:gap-3">
            <div
              className="bg-amber-800 border-0 p-0 appearance-none cursor-pointer focus:outline-none"
              onClick={toggleSearchInput}
            >
              <FaSearch className="text-black text-xl sm:text-2xl hover:text-gray-500 transition-colors"/>
            </div>
            <div 
              className="bg-amber-800 border-0 p-0 appearance-none cursor-pointer focus:outline-none relative"
              onClick={toggleCategoryMenu}
              ref={menuRef}
            >
              <FaBars className="text-black text-xl sm:text-2xl hover:text-gray-500 transition-colors"/>
              
              {/* Category dropdown menu */}
              {showCategoryMenu && (
                <div className="absolute top-8 sm:top-10 left-0 bg-white shadow-lg rounded-md w-36 sm:w-48 py-2 z-50">
                  <h3 className="px-3 sm:px-4 py-2 text-amber-800 text-xs sm:text-sm font-semibold border-b">Categories</h3>
                  {categories.map((category) => (
                    <div 
                      key={category}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 text-amber-800 text-xs sm:text-sm hover:bg-amber-100 cursor-pointer"
                      onClick={() => handleCategoryClick(category)}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Center logo */}
          <Link to="/" className="flex items-center no-underline">
            <h1 className="text-white text-lg sm:text-xl md:text-2xl font-bold hover:text-gray-300 transition-colors">TUG</h1>
          </Link>
          
          {/* Right section with buttons */}
          <div className="flex items-center gap-2">
              {isLoggedIn ? (
                <>
                  <div
                    onClick={handleSettingsClick}
                    className="bg-amber-800 border-0 p-0 appearance-none cursor-pointer focus:outline-none"
                  >
                    <FaCog className="text-black text-xl sm:text-2xl hover:text-gray-500 transition-colors"/>
                  </div>
                  <div
                    onClick={handleWriteClick}
                    className={buttonStyle + " flex items-center justify-center"}
                  >
                    <FaPen className="inline-block mr-1 text-xs" /> 
                    <span className="hidden sm:inline-block">Write</span>
                  </div>
                  <div
                    onClick={handleLogoutClick}
                    className={buttonStyle}
                  >
                    Logout
                  </div>
                </>
              ) : (
                <>
                  <div className={buttonStyle + " hidden sm:inline-block"}
                      onClick={handleRegister}>
                    Register
                  </div>
                  <div
                    onClick={handleLoginClick}
                    className={buttonStyle}
                  >
                    Login
                  </div>
                </>
              )}
          </div>
        </div>
        
        {/* Search Input Dropdown */}
        {showSearchInput && (
          <div 
            ref={searchInputRef}
            className="fixed top-[60px] sm:top-[70px] md:top-[80px] left-0 w-full bg-amber-800 p-3 z-40 shadow-md"
          >
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, author, or category..."
                className="flex-grow p-2 rounded-l-md border-0 focus:ring-2 focus:ring-amber-500 text-sm sm:text-base"
                autoFocus
              />
              <button 
                type="submit"
                className="bg-amber-900 ml-3 text-amber-800 p-2 rounded-r-md hover:bg-amber-950"
              >
                <FaSearch />
              </button>
            </form>
            
            {/* Popular searches */}
            <div className="mt-2 pb-1">
              <div className="text-xs text-amber-200 mb-1">Popular Searches:</div>
              <div className="flex flex-wrap gap-2">
                {['technology', 'health', 'business', 'travel'].map(term => (
                  <div 
                    key={term}
                    className="bg-amber-700 text-white px-3 py-1 rounded-full text-xs cursor-pointer hover:bg-amber-600 transition-colors"
                    onClick={() => {
                      setSearchQuery(term);
                      navigate(`/search?q=${encodeURIComponent(term)}`);
                      setShowSearchInput(false);
                    }}
                  >
                    {term}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="fixed top-[60px] sm:top-[70px] md:top-[80px] left-0 w-full h-screen bg-amber-800 bg-opacity-95 z-40 overflow-y-auto">
            <div className="container mx-auto px-4 py-6">
              <div className="flex justify-end mb-4">
                <FaTimes 
                  className="text-white text-2xl cursor-pointer"
                  onClick={toggleMenu}
                />
              </div>
              
              <div className="text-white mb-8">
                <h2 className="text-xl font-bold mb-4 border-b border-amber-700 pb-2">Categories</h2>
                <div className="grid grid-cols-2 gap-4">
                  {categories.map((category) => (
                    <div 
                      key={category}
                      className="py-2 text-sm hover:text-amber-300 cursor-pointer"
                      onClick={() => handleCategoryClick(category)}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="text-white mb-8">
                <h2 className="text-xl font-bold mb-4 border-b border-amber-700 pb-2">Quick Links</h2>
                <div className="flex flex-col space-y-3">
                  <Link to="/" className="py-2 text-sm hover:text-amber-300" onClick={() => setIsMenuOpen(false)}>
                    Home
                  </Link>
                  {isLoggedIn ? (
                    <>
                      <Link to="/profile" className="py-2 text-sm hover:text-amber-300" onClick={() => setIsMenuOpen(false)}>
                        My Profile
                      </Link>
                      <Link to="/write" className="py-2 text-sm hover:text-amber-300" onClick={() => setIsMenuOpen(false)}>
                        Write Article
                      </Link>
                      <Link to="/settings" className="py-2 text-sm hover:text-amber-300" onClick={() => setIsMenuOpen(false)}>
                        Settings
                      </Link>
                      <div 
                        className="py-2 text-sm hover:text-amber-300 cursor-pointer"
                        onClick={() => {
                          setIsMenuOpen(false);
                          handleLogoutClick();
                        }}
                      >
                        Logout
                      </div>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="py-2 text-sm hover:text-amber-300" onClick={() => setIsMenuOpen(false)}>
                        Login
                      </Link>
                      <Link to="/register" className="py-2 text-sm hover:text-amber-300" onClick={() => setIsMenuOpen(false)}>
                        Register
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Logout Confirmation Modal */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div 
              ref={logoutConfirmRef}
              className="bg-white rounded-lg p-4 sm:p-6 max-w-xs sm:max-w-sm w-full mx-auto shadow-xl"
            >
              <h3 className="text-lg sm:text-xl font-semibold text-amber-800 mb-3 sm:mb-4">Confirm Logout</h3>
              <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6">Are you sure you want to log out?</p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelLogout}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 border border-amber-300 text-amber-800 text-xs sm:text-sm rounded hover:bg-amber-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-amber-800 text-white text-xs sm:text-sm rounded hover:bg-amber-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
};

export default Navbar;
