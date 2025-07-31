// Version: 1.0

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LoginForm = ({ registerPath, resetPath }) => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Helper to get CSRF token from cookies (frappe usually sets csrf_token or csrftoken)
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append("usr", emailOrUsername);
      formData.append("pwd", password);

      const csrfToken = getCookie("csrf_token") || getCookie("csrftoken") || "";

      const res = await fetch("http://127.0.0.1:8000/api/method/login", {
        method: "POST",
        body: formData,
        credentials: "include", // include cookies for session & CSRF token
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-Frappe-CSRF-Token": csrfToken,
        },
      });

      const text = await res.text();

      if (!res.ok) {
        setError("Login failed. Please check your credentials and try again.");
        setLoading(false);
        return;
      }

      const data = JSON.parse(text);

      if (!data.exc) {
        // Login successful — redirect to homepage
        navigate("/");
      } else {
        setError(data.message || "Invalid username or password");
      }
    } catch (err) {
      setError("Network error during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="fs-20 fw-bolder mb-4">Login</h2>
      <h4 className="fs-13 fw-bold mb-2">Login to your account</h4>
      <p className="fs-12 fw-medium text-muted">
        Thank you for getting back <strong>Nelel</strong> web applications, let's access the best recommendation for you.
      </p>

      <form onSubmit={handleSubmit} className="w-100 mt-4 pt-2" noValidate>
        <div className="mb-4">
          <input
            type="email"
            className="form-control"
            placeholder="Email or Username"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            required
            autoComplete="username"
          />
        </div>

        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        <div className="d-flex align-items-center justify-content-between">
          <div>
            <div className="custom-control custom-checkbox">
              <input type="checkbox" className="custom-control-input" id="rememberMe" />
              <label className="custom-control-label c-pointer" htmlFor="rememberMe">
                Remember Me
              </label>
            </div>
          </div>
          <div>
            <Link to={resetPath} className="fs-11 text-primary">
              Forget password?
            </Link>
          </div>
        </div>

        {error && <div className="alert alert-danger mt-3">{error}</div>}

        <div className="mt-5">
          <button type="submit" className="btn btn-lg btn-primary w-100" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>

      <div className="w-100 mt-5 text-center mx-auto">
        <div className="mb-4 border-bottom position-relative">
          <span className="small py-1 px-3 text-uppercase text-muted bg-white position-absolute translate-middle">or</span>
        </div>
        <div className="d-flex align-items-center justify-content-center gap-2">
          {/* Add your social login buttons here if needed */}
        </div>
      </div>

      <div className="mt-5 text-muted">
        <span> Don't have an account?</span>
        <Link to={registerPath} className="fw-bold">
          {" "}
          Create an Account
        </Link>
      </div>
    </>
  );
};

export default LoginForm;



