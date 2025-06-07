"use client"

import { useState } from "react"
import { Eye, EyeOff } from "../components/icons"


export default function Register({ onRegister, onLoginClick }) {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)


  const handleSubmit = (e) => {
    e.preventDefault()

    // Basic validation
    if (password !== passwordConfirmation) {
      alert("Passwords don't match")
      return
    }

    // Call the onRegister function passed from props
    onRegister({ email, name, password, passwordConfirmation })
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

      {/* Right Side - Registration Form */}
      <div className="auth-right">
        <div className="auth-form-container">
          <div className="auth-logo">
            <img src="/images/taskflow-logo.png" alt="TaskFlow Logo" className="logo-image" />
            <div className="logo-text"><i>TaskFlow</i></div>
          </div>

          <h2 className="auth-form-title">Sign up to TaskFlow</h2>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                className="form-control"
                placeholder="Enter your user name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
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

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="password-input-container">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  className="form-control"
                  placeholder="Confirm your Password"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              Register
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an Account?{" "}
              <button onClick={onLoginClick} className="auth-link">
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
