import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

const SocialAuthHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get('accessToken');
    if (accessToken) {
      Cookies.set('accessToken', accessToken, { expires: 30, path: '/' });
      navigate('/', { replace: true });
    } else {
      navigate('/auth/login', { replace: true, state: { socialError: true } });
    }
  }, [location, navigate]);

  return null;
};

export default SocialAuthHandler; 