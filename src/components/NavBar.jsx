"use client"

import { useState } from "react"
import { Bell, ChevronDown, LogOut, Settings, X } from "./icons"
import SettingsModal from "./SettingsModal"

export default function NavBar({
  currentUser,
  currentPage,
  onNavigate,
  notifications,
  onRemoveNotification,
  darkMode = false,
  updateUserSettings,
}) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)

  // let user= JSON.parse(localStorage.getItem('user-info'))

  // Add styling for notification items
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications)
    if (showUserDropdown) setShowUserDropdown(false)
  }

  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown)
    if (showNotifications) setShowNotifications(false)
  }

  const handleLogout = () => {
    // In a real app, this would handle the logout process
    // Redirect to login page
    localStorage.removeItem("user-info")
    onNavigate("login")
  }

  const openSettings = () => {
    setShowSettingsModal(true)
    setShowUserDropdown(false)
  }

  const handleRemoveNotification = (e, id) => {
    e.stopPropagation() // Prevent notification panel from closing
    onRemoveNotification(id)
  }
  return (
    <header className="navbar">
      <div className="navbar-left">
        <h1 className="navbar-title taskflow-brand">TaskFlow</h1>
      </div>

      <nav className="navbar-nav">
        <button
          className={`nav-link ${currentPage === "dashboard" ? "active" : ""}`}
          onClick={() => onNavigate("dashboard")}
        >
          Dashboard
        </button>
        <button
          className={`nav-link ${currentPage === "teamSelection" || currentPage === "teamDashboard" ? "active" : ""}`}
          onClick={() => onNavigate("teamSelection")}
        >
          Task Hub
        </button>
      </nav>

      <div className="navbar-right">
        <div className="notification-icon" onClick={toggleNotifications}>
          <Bell />
          <span className="notification-badge">{notifications.length}</span>
        </div>

        <div className="user-profile-dropdown">
          <button className="user-profile-button" onClick={toggleUserDropdown}>
            <div className="user-avatar">
              {currentUser.profilePic ? (
                <img
                  src={`http://localhost:8000/storage/${currentUser.profilePic}` || "https://placehold.co/80x80"}
                  alt={currentUser.name || currentUser.username}
                  className="avatar-image"
                />
              ) : (
                <span>{currentUser.initials || currentUser.username|| currentUser.name }</span>
              )}
            </div>
            <ChevronDown className="dropdown-icon" />
          </button>

          {showUserDropdown && (
            <div className="dropdown-menu">
              <div className="dropdown-header">
                <div className="dropdown-user-info">
                  <span className="dropdown-username">{currentUser.username || currentUser.name }</span>
                  <span className="dropdown-email">{currentUser.email}</span>
                </div>
              </div>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item" onClick={openSettings}>
                <Settings className="dropdown-item-icon" />
                <span>Settings</span>
              </button>
              <button className="dropdown-item" onClick={handleLogout}>
                <LogOut className="dropdown-item-icon" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Notification Popup */}
      {showNotifications && (
        <div className="notifications-popup">
          <h2 className="notifications-title">Notifications</h2>
          <div className="notifications-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">No notifications</div>
            ) : (
              notifications.map((notification) => (
                <div className="notification-item" key={notification.id}>
                  <div className="notification-content">
                    <div className="notification-team">{notification.team}</div>
                    <div className="notification-message">{notification.message}</div>
                    <div className="notification-time">{notification.timeAgo}</div>
                  </div>
                  <button
                    className="notification-clear-btn"
                    onClick={(e) => handleRemoveNotification(e, notification.id)}
                    aria-label="Clear notification"
                  >
                    <X className="notification-clear-icon" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <SettingsModal
          currentUser={currentUser}
          onClose={() => setShowSettingsModal(false)}
          darkMode={darkMode}
          updateUserSettings={updateUserSettings}
        />
      )}
    </header>
  )
}
