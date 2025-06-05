"use client"

import { useState } from "react"
import { Eye, EyeOff } from "../components/icons"

import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"


export default function Login({ onLogin, onRegisterClick }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    try {
      onLogin({ username, password, rememberMe })
    } catch (error) {
      withReactContent(Swal).fire({
        icon: "error",
        title: "Login Failed",
        text: error.message || "An error occurred during login.",
      })
    }
  }

  return (
    <div className="auth-container">
      {/* Left Side - Background and Text */}
      <div className="auth-left">
        <div className="auth-content">
          <h1 className="auth-title">Welcome to TaskFlow!</h1>
          <p className="auth-description">
            Your all-in-one platform for seamless research collaboration. Manage tasks and track progress with your team
            all in one place.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="auth-right">
        <div className="auth-form-container">
          <div className="auth-logo">
            <img src="/images/taskflow-logo.png" alt="TaskFlow Logo" className="logo-image" />
            <div className="logo-text">TaskFlow</div>
          </div>

          <h2 className="auth-form-title">Sign in to TaskFlow</h2>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                className="form-control"
                placeholder="Enter your user name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autocomplete="username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="form-control"
                  placeholder="Enter your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autocomplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <div className="form-group-inline">
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="rememberMe">Remember me</label>
              </div>
              <a href="#" className="forgot-password">
                Forgot Password?
              </a>
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              Login
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an Account?{" "}
              <button onClick={onRegisterClick} className="auth-link">
                Register
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
