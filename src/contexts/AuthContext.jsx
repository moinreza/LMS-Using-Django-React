import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { getToken, setAuthToken, logout as utilsLogout } from "../utils/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const checkUserLoggedIn = async () => {
    try {
      const token = getToken();
      if (token) {
        const res = await axios.get(
          "https://lms-backend-xpwc.onrender.com/api/profile/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(res.data);
      }
    } catch (err) {
      console.error(err);
      utilsLogout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post(
        "https://lms-backend-xpwc.onrender.com/api/auth/login/",
        { email, password }
      );
      setAuthToken(res.data.token);
      setUser(res.data.user);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const logout = () => {
    utilsLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
