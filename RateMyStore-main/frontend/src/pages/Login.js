import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!email || !password) {
            alert("Please enter both email and password.");
            return;
        }

        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", {
                email,
                password
            });

            const { token, role } = res.data;

            // Store token and role
            localStorage.setItem("token", token);
            localStorage.setItem("role", role);

            alert("✅ Login successful!");

            // Navigate based on role
            if (role === "admin") {
                navigate("/admin-dashboard");
            } else {
                navigate("/dashboard");
            }
        } catch (err) {
            console.error("❌ Login Failed:", err.response?.data || err.message);
            alert(err.response?.data?.msg || "Login failed. Please try again.");
        }
    };

    return (
        <div className="auth-container">
            <h2>🔑 Login To Your Account</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
            <p className="register-text">
                Don't have an account? <a href="/register">Register here</a>
            </p>
        </div>
    );
}

export default Login;
