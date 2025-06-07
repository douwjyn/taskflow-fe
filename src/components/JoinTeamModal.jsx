"use client"

import { useState } from "react"
import { X } from "./icons"

export default function JoinTeamModal({ onClose, onSubmit }) {
  const [teamCode, setTeamCode] = useState("")
  const [nickname, setNickname] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      teamCode,
      nickname,
    })
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content join-team-modal">
        <h2 className="modal-title">Join Team</h2>
        <button className="modal-close" onClick={onClose}>
            <X />
          </button>
        <p className="modal-subtitle">Set up your team with members and roles</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="teamCode">Team Code</label>
            <input
              type="text"
              id="teamCode"
              placeholder="Enter team code"
              value={teamCode}
              onChange={(e) => setTeamCode(e.target.value)}
              required
              className="form-control"
            />
          </div>

          <div className="modal-actions">
            <button type="submit" className="btn btn-join">
              Join
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
