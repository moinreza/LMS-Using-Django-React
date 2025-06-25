import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      getUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const getUser = async () => {
    try {
      const { data } = await axios.get('https://lms-backend-xpwc.onrender.com/api/auth/user/');
      setUser(data);
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const { data } = await axios.post('https://lms-backend-xpwc.onrender.com/api/auth/login/', {
      email,
      password
    });
    localStorage.setItem('token', data.token);
    setToken(data.token);
  };

  const register = async (name, email, password) => {
    const { data } = await axios.post('https://lms-backend-xpwc.onrender.com/api/auth/register/', {
      name,
      email,
      password
    });
    localStorage.setItem('token', data.token);
    setToken(data.token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);