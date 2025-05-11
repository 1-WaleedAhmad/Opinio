import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../redux/authActions';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector(state => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      username,
      email: email.toLowerCase(),
      password,
    };

    const result = await dispatch(registerUser(userData));

    if (result.success) {
      navigate('/');
    } else {
      console.error(result.error);
    }
  };

  return (
    <div className="max-w-xs sm:max-w-sm md:max-w-md mx-auto mt-6 sm:mt-8 md:mt-10 p-4 sm:p-5 md:p-6 bg-amber-50 rounded-lg shadow-md">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-amber-800 text-center">Register</h2>

      {error && (
        <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-red-100 text-red-700 rounded text-sm sm:text-base">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3 sm:mb-4">
          <label className="block text-amber-800 mb-1 sm:mb-2 text-sm sm:text-base" htmlFor="username">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 text-sm sm:text-base border border-amber-300 rounded focus:outline-none focus:border-amber-500 text-black"
            required
          />
        </div>

        <div className="mb-3 sm:mb-4">
          <label className="block text-amber-800 mb-1 sm:mb-2 text-sm sm:text-base" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 text-sm sm:text-base border border-amber-300 rounded focus:outline-none focus:border-amber-500 text-black"
            required
          />
        </div>

        <div className="mb-4 sm:mb-6">
          <label className="block text-amber-800 mb-1 sm:mb-2 text-sm sm:text-base" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 text-sm sm:text-base border border-amber-300 rounded focus:outline-none focus:border-amber-500 text-black"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-800 text-amber-800 py-2 px-4 rounded hover:bg-amber-700 transition-colors disabled:bg-amber-400 text-sm sm:text-base"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;
