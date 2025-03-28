import {Route, Routes} from 'react-router-dom';
import Home from './Page/Home';
import {useEffect} from "react";
import Cookies from "js-cookie";

function App() {

    async function refreshToken() {
        const response = await fetch('http://127.0.0.1:8000/v1/admin/services/login', {
            method: 'POST',
            body: JSON.stringify({
                "email": "maksim.shymanouski@clipboardhealth.com",
                "password": "123456789"
            }),
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
        });

        if (response.ok) {
            const data = await response.json();
            Cookies.set('accessToken', data.text);
            return data.text;
        } else {
            console.error('Refresh token failed');
        }
    }

    async function refreshChat() {
        const response = await fetch('https://brestok-cbh-test.hf.space/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
        });
        if (response.ok) {
            const data = await response.json();
            Cookies.set('chatId', data.data.id);
            return data.text;
        } else {
            console.error('Refresh token failed');
        }
    }


    const useTokenRefresh = () => {
        refreshToken()
        refreshChat()
        useEffect(() => {
            const intervalId = setInterval(async () => {
                await refreshToken()
                await refreshChat()
            }, 50 * 60 * 1000);
            return () => clearInterval(intervalId);
        }, []);
    };

    useTokenRefresh();
  return (

      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
 
  );
}

export default App;
