import {Route, Routes, useNavigate} from 'react-router-dom';
import AuthPage from './Page/AuthPage';
import Home from './Page/Home';
import {useEffect} from "react";
import Cookies from "js-cookie";

function App() {
    const navigate = useNavigate();
    useEffect(() => {
        const token = Cookies.get('accessToken');
        if (!token) {
            navigate('/auth/login');
        }
    }, [navigate]);

  return (

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/login" element={<AuthPage />} />
        <Route path="/auth/register" element={<AuthPage />} />
      </Routes>
 
  );
}

export default App;
