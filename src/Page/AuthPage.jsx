import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import axios from 'axios';

const AuthPage = () => {
  const [loading, setLoading] = useState(false);
  const [googleError, setGoogleError] = useState('');

  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setGoogleError('');
    try {
      const response = await axios.get('/google/login');
      const url = response?.data?.data?.text;
      if (url) {
        window.location.href = url;
      } else {
        setGoogleError('Failed to get Google login URL.');
      }
    } catch (err) {
      setGoogleError('Failed to start Google login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Welcome</h1>
        <p className="text-lg text-gray-500 mb-8 text-center">Sign in to your account with Google</p>
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="flex items-center justify-center gap-3 w-full py-3 px-6 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition text-gray-700 font-semibold shadow-md text-lg disabled:opacity-60 mb-4"
        >
          <FcGoogle size={28} />
          <span>{loading ? 'Redirecting...' : 'Continue with Google'}</span>
        </button>
        {googleError && (
          <div className="bg-red-500 text-white p-3 rounded-md mb-2 text-center w-full text-base">{googleError}</div>
        )}
        <div className="mt-8 text-gray-400 text-xs text-center w-full">
          © {new Date().getFullYear()} Clipboard Health. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
