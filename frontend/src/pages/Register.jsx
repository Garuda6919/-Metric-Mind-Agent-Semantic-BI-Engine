import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL;

      console.log("API URL:", API_URL);
      console.log("Register URL:", `${API_URL}/api/register`);

      const response = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });

      const responseText = await response.text();

      console.log("Register Status:", response.status);
      console.log("Register Response:", responseText);

      let result = {};

      try {
        result = responseText ? JSON.parse(responseText) : {};
      } catch (error) {
        throw new Error(
          `Backend returned invalid response: ${responseText.substring(0, 200)}`
        );
      }

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || `Registration failed (${response.status})`
        );
      }

      alert("Registration successful! 🎉");

      navigate("/");
    } catch (error) {
      console.error("Registration Error:", error);

      alert(
        `Registration Error: ${
          error.message || "Unable to connect to backend"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Create Account</h1>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => navigate("/")}
          disabled={loading}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}

export default Register;