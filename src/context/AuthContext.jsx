// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // On mount: check current login status
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/method/frappe.auth.get_logged_user", {
          credentials: "include",
        });
        const data = await res.json();

        if (data.message && data.message !== "Guest") {
          setUser({ username: data.message });
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Error checking login:", err);
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, []);

  // use login function at your Login Page
  const login = async (email, password) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/method/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ usr: email, pwd: password }),
      });

      if (response.ok) {
        const whoRes = await fetch("http://127.0.0.1:8000/api/method/frappe.auth.get_logged_user", {
          credentials: "include",
        });
        const who = await whoRes.json();

        setUser({ username: who.message });
        setIsAuthenticated(true);
        navigate("/");
      } else {
        const err = await response.json();
        throw new Error(err.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error.message);
      throw error;
    }
  };

  // trigger logout function when user click logout button
  const logout = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/method/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Logout response:", data);

        localStorage.clear();
        sessionStorage.clear();

        // Confirm logout
        const res = await fetch("http://127.0.0.1:8000/api/method/frappe.auth.get_logged_user", {
          credentials: "include",
        });
        const check = await res.json();
        console.log("After logout, user is:", check.message);

        setUser(null);
        setIsAuthenticated(false);
        navigate("/login");
      } else {
        const errorData = await response.json();
        console.error("Logout failed:", errorData);
      }
    } catch (error) {
      console.error("Network error during logout", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
