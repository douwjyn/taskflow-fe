"use client"

import { useState } from "react"
import { X } from "./icons"

export default function CreateTeamModal({ onClose, onSubmit }) {
  const [name, setName] = useState("")
  const [numberOfMembers, setNumberOfMembers] = useState("")
  const [dueDate, setDueDate] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      name,
      numberOfMembers,
      dueDate,
    })
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content create-team-modal">
        <div className="modal-header">
          <h2 className="modal-title-c">Create Team</h2>
          <button className="modal-close" onClick={onClose}>
            <X />
          </button>
        </div>
        <p className="modal-subtitle-c">Set up your team with members and roles</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="teamName">Team Name</label>
            <input
              type="text"
              id="teamName"
              placeholder="Enter team name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">Due Date</label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
              className="form-control"
            />
          </div>

          <div className="modal-actions">
            <button type="submit" className="btn btn-submit">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
