"use client"

import { useState } from "react"
import { Moon, Sun, Upload, X } from "./icons"

export default function SettingsModal({ currentUser, onClose, darkMode: initialDarkMode = false, updateUserSettings }) {
  const [name, setName] = useState(currentUser.name || "")
  const [email, setEmail] = useState(currentUser.email || "")
  const [username, setUsername] = useState(currentUser.username || "")
  const [profilePic, setProfilePic] = useState(currentUser.profilePic || "")
  const [previewPic, setPreviewPic] = useState(currentUser.profilePic || "")
  const [darkMode, setDarkMode] = useState(initialDarkMode)

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0]
    setProfilePic(file)
    if (file) {
      // In a real app, you would upload this file to a server
      // For now, we'll just create a local URL for preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewPic(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Create updated user object
    const updatedUser = {
      email,
      username,
      profilePic: profilePic,
    }

    // Call the updateUserSettings function from props
    if (typeof updateUserSettings === "function") {
      updateUserSettings(updatedUser, darkMode)
    }

    // In a real app, you would send this data to your backend
    alert("Settings saved!")
    onClose()
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content settings-modal">
        <div className="modal-header">
          <h2 className="modal-title">Settings</h2>
          <button className="modal-close" onClick={onClose}>
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="settings-form">
          <div className="profile-pic-section">
            <div className="profile-pic-container">
              {previewPic ? (
                <img src={previewPic || "/placeholder.svg"} alt="  " className="profile-pic-preview" />
              ) : (
                <div className="profile-pic-placeholder">{currentUser.initials}</div>
              )}
              <label htmlFor="profile-pic-upload" className="profile-pic-upload-label">
                <Upload className="upload-icon" />
                <span>Change Photo</span>
              </label>
              <input
                type="file"
                id="profile-pic-upload"
                accept="image/*"
                onChange={handleProfilePicChange}
                className="profile-pic-upload"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          {/* <div className="form-group theme-toggle-container">
            <label>Theme</label>
            <div className="theme-toggle">
              <span className={`theme-option ${!darkMode ? "active" : ""}`}>
                <Sun className="theme-icon" />
                Light
              </span>
              <button type="button" className={`toggle-switch ${darkMode ? "active" : ""}`} onClick={toggleDarkMode}>
                <span className="toggle-slider"></span>
              </button>
              <span className={`theme-option ${darkMode ? "active" : ""}`}>
                <Moon className="theme-icon" />
                Dark
              </span>
            </div>
          </div> */}

          <div className="form-actions">
            <button type="submit" className="btn btn-save">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
