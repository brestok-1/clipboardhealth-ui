import api from "../api/index"
import Cookies from 'js-cookie';

const apiRequest = async ({ method, url, data, params, headers = {} }) => {
  try {
    const token = Cookies.get('accessToken');
    if (!token) return { data: null, statusCode: 401 };

    const response = await api.request({
      method,
      url,
      data,
      params,
      headers: {
        Authorization: `Bearer ${token}`,
        ...headers,
      },
    });

    return { data: response.data.data, statusCode: response.status };
  } catch (error) {
    console.error('API Error:', error);
    const status = error?.response?.status ?? null;
    if (status === 403) {
      Cookies.remove('accessToken');
      window.location.href = '/login';
    }
    return { data: null, statusCode: status };
  }
};

export default apiRequest;
