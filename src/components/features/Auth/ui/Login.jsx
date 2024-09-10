import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Melakukan request ke json-server untuk mendapatkan user
      const response = await axios.get(
        `http://localhost:3000/users?username=${username}&password=${password}`
      );

      if (response.data.length > 0) {
        const user = response.data[0];

        // Simulasi JWT dengan base64 encode bagian header, payload, dan signature
        const header = JSON.stringify({ alg: "HS256", typ: "JWT" });
        const payload = JSON.stringify({
          id: user.id,
          username: user.username,
          role: user.role,
        });

        // Base64 encoding header dan payload
        const base64Header = btoa(header);
        const base64Payload = btoa(payload);
        const fakeSignature = "fake-signature"; // Simulasi signature

        // Simpan token di cookie dalam format JWT-like
        const fakeToken = `${base64Header}.${base64Payload}.${fakeSignature}`;
        Cookies.set("token", fakeToken, { expires: 1 }); // Token berlaku 1 hari

        // Arahkan pengguna ke halaman yang sesuai berdasarkan role
        if (user.role === "admin") {
          navigate("/admin");
        } else if (user.role === "student") {
          navigate("/student");
        } else if (user.role === "headmaster") {
          navigate("/headmaster");
        } else {
          navigate("/guest");
        }
      } else {
        setError("Invalid username or password");
      }
    } catch (error) {
      setError("Something went wrong, please try again later");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleLogin}>
          {/* Username Input */}
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-3 py-2 mt-1 border text-slate-600 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div className="mb-4 relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="w-full px-3 py-2 mt-1 text-slate-600 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-5 top-6 flex items-center text-gray-600"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          {/* Submit Button */}
          <div className="mb-6">
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
