import React, {useContext, useState} from 'react';
import {loginUser, registerUser} from '../api/securityApi';
import Cookies from 'js-cookie';
import {useNavigate} from 'react-router-dom';
import {ContextApp} from '../utils/Context';

const AuthForm = ({ isLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');

  const [error, setError] = useState('');
  const [errors, setErrors] = useState({email: false, password: false, code: false});

  const {getAllChats, loadChatMessages} = useContext(ContextApp);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedCode = code.trim();

    const newErrors = {
      email: !trimmedEmail,
      password: !trimmedPassword,
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      setError('Please fill in all required fields.');
      return;
    }

    setError('');
    if (isLogin) {
      try {
        const result = await loginUser(trimmedEmail, trimmedPassword);

        if (result.successful) {
          const { accessToken } = result.data;

          if (accessToken) {
            Cookies.set('accessToken', accessToken.value, {
              expires: 30,
              path: '/',
            });
          }
          navigate("/");
          getAllChats()
          loadChatMessages(null);
        } else {
          const status = result.error?.status;
          if (status === 403) {
            setError(result.error?.message || 'Login failed');
          } else if (status === 404 || status === 400) {
            setError('Email or password incorrect');
          } else {
            setError('Something went wrong...');
          }
        }
      } catch (error) {
        const status = error.response ? error.response.status : null;
        
        if (status === 400) {
          setError('Email or password incorrect');
        } else {
          setError('Something went wrong...');
        }
      }
    } else {
      try {
        const result = await registerUser(trimmedEmail, trimmedPassword, trimmedCode);
        console.log('Registration result:', result);

        if (result.successful) {
          navigate('/auth/login');
        } else {
          console.log('Registration error details:', result.error);
          setError('Invalid authorization code or email already exists');
        }
      } catch (error) {
        console.log('Registration catch error:', error);
        setError('Invalid authorization code or email already exists');
      }
    }

    setErrors({ email: false, password: false });
  };

  return (
      <form onSubmit={handleSubmit} className="flex flex-col px-8">
        {error && (
          <div className="bg-red-500 text-white p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}
        
        <div className="flex flex-col gap-1">
          {/* Email Label */}
          <label htmlFor="email" className="text-gray-700 text-sm">
            Email Address
          </label>
          <input
              id="email"
              type="email"
              value={email}
              required
              autoFocus
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@acme.com"
              className={`bg-white border ${
                  errors.email || error ? 'border-red-500' : 'border-gray-300'
              } text-gray-800 p-2.5 rounded-md text-sm w-full focus:border-blue-500 focus:outline-none mb-4`}
          />
        </div>

        <div className="flex flex-col gap-1">
          {/* Password Label */}
          <label htmlFor="password" className="text-gray-700 text-sm">
            Password
          </label>
          <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className={`bg-white border ${
                  errors.password || error ? 'border-red-500' : 'border-gray-300'
              } text-gray-800 p-2.5 rounded-md text-sm w-full focus:border-blue-500 focus:outline-none mb-2`}
          />
        </div>

        {!isLogin ? <div className="flex flex-col gap-1">
          {/* Code Label */}
          <label htmlFor="code" className="text-gray-700 text-sm">
            Code
          </label>
          <input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className={`bg-white border ${
                  errors.code || error ? 'border-red-500' : 'border-gray-300'
              } text-gray-800 p-2.5 rounded-md text-sm w-full focus:border-blue-500 focus:outline-none mb-2`}
          />
        </div> : ''}

        {/* Submit Button */}
        <button
            type="submit"
            className="mt-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-sm text-white font-bold rounded-md transition"
        >
          {isLogin ? 'Sign In' : 'Sign Up'}
        </button>
      </form>
  );
};

export default AuthForm;
