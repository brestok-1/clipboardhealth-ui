import axios from 'axios';

const api = axios.create({
    baseURL: 'https://app.bundyonsol.xyz',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  });

export default api;
