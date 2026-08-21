import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      const response = await fetch(
        "https://metricmind-agentic-semantic-bi-engine.onrender.com/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        alert(result.message || "Invalid email or password");
        return;
      }

      // Save logged-in customer
      localStorage.setItem(
        "customer",
        JSON.stringify(result.customer)
      );

      alert("Login successful! 🎉");

      navigate("/dashboard");
    } catch (error) {
      console.error("Login Error:", error);
      alert("Unable to connect to backend");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>📊 MetricMind</h1>
        <p>Agentic Semantic BI Engine</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">
            Login
          </button>
        </form>

        <button
          type="button"
          onClick={() => navigate("/register")}
        >
          New Customer? Register
        </button>
      </div>
    </div>
  );
}

export default Login;