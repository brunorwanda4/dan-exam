import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as jwtDecode from "jwt-decode"; 
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token); // Changed to jwtDecode
      setUser(decoded);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const login = async (username, password) => {
    try {
      const response = await api.post("/login", { username, password });
      localStorage.setItem("token", response.data.token);
      setToken(response.data.token);
    } catch (error) {
      throw (
        error.response?.data?.message ||
        "Login failed. Please check your credentials."
      );
    }
  };

  const register = async (username, password) => {
    try {
      await api.post("/register", { username, password });
      // Automatically log in after registration
      await login(username, password);
    } catch (error) {
      throw (
        error.response?.data?.message ||
        "Registration failed. Username may already be taken."
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, isAuthenticated: !!token }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
