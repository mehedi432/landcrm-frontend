# Example use of AuthContext Provider

### Following example shows how to render based on auth state
```jsx
// src/pages/Dashboard.jsx
import { useAuth } from "../context/AuthContext";
import LogoutButton from "../components/LogoutButton";

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      {isAuthenticated ? (
        <p>Welcome, {user?.username}</p>
      ) : (
        <p>Not logged in</p>
      )}
      <LogoutButton />
    </div>
  );
};

export default Dashboard;
```


### Following example shows how logout button should work
```jsx
// src/components/LogoutButton.jsx
import { useAuth } from "../context/AuthContext";

const LogoutButton = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout(); // You can also await this if needed
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
```

### Following example shows how login button should work
```jsx
// src/components/LoginForm.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const LoginForm = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Email or Username"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default LoginForm;
```