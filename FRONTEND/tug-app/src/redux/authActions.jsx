import { loginStart, loginSuccess, loginFailure, logout } from './authSlice';
import axios from 'axios';

// Async action for login
export const loginUser = (credentials) => async (dispatch) => {
  try {
    dispatch(loginStart());
    
    // Replace with your actual API endpoint
    const response = await axios.post('http://localhost:8000/api/login', credentials);
    
    const { user, token } = response.data;
    
    // Store token in localStorage for persistence
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    dispatch(loginSuccess({ user, token }));
    return { success: true };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Login failed';
    dispatch(loginFailure(errorMessage));
    return { success: false, error: errorMessage };
  }
};

// Action for logout
export const logoutUser = () => (dispatch) => {
  // Remove token from localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  dispatch(logout());
};

// Check if user is already logged in (from localStorage)
export const checkAuthState = () => (dispatch) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (token && user) {
    try {
      const userData = JSON.parse(user);
      dispatch(loginSuccess({ 
        user: userData,
        token 
      }));
    } catch (error) {
      // If there's an error parsing the user data, clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
};
