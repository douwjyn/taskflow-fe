"use client"

import { useState } from "react"
import { Search, Trash } from "../components/icons"
export default function TeamSelection({ teams, onManageTeam, onCreateTeam, onJoinTeam, onDeleteTeam, currentUser, formatDate }) {
  // State for search query
  const [searchQuery, setSearchQuery] = useState("")

  // Filter teams based on search query
  const filteredTeams = teams.filter((team) => team.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="team-selection">
      <h2 className="page-title">Select Your Team</h2>

      {/* Search and Action Buttons */}
      <div className="search-and-actions">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search teams..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="search-icon" />
        </div>
        <div className="action-buttons">
          <button className="btn btn-primary" onClick={onCreateTeam}>
            Create New Team
          </button>
          <button className="btn btn-success" onClick={onJoinTeam}>
            Join Team
          </button>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="teams-grid">
        {filteredTeams.length === 0 ? (
          <div className="no-teams-message">
            <p>You don't have any teams yet.</p>
            <p>Create a new team to get started!</p>
            <button className="btn btn-primary mt-4" onClick={onCreateTeam}>
              Create New Team
            </button>
          </div>
        ) : (
          filteredTeams.map((team) => {
            const isUserMember = team.members.some((member) => member.id === currentUser.id)

            return (
              <div className={`team-card ${isUserMember ? "user-member-team" : ""}`} key={team.id}>
                <div className="team-card-header">
                  <h3 className="team-name">{team.name}</h3>
                  {team.leaderId === currentUser.id && (
                    <button
                      className="btn-delete"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (window.confirm(`Are you sure you want to delete ${team.name}?`)) {
                          onDeleteTeam(team.id)
                        }
                      }}
                    >
                      <Trash className="delete-icon" />
                    </button>
                  )}
                </div>
                <p className="team-info">Leader: {team.leader.name}</p>
                <p className="team-info">Members: {team.members.length}</p>
                <p className="team-info">Due {formatDate(team.due_date)}</p>
                {isUserMember && <p className="team-member-status">You are a member</p>}
                <button className="btn btn-manage" onClick={() => onManageTeam(team)}>
                  Manage Team
                </button>

                {/* Task Indicators */}
                <div className="task-indicators">
                  {team.tasks?.map((task) => (
                    <div
                      key={task.id}
                      className={`task-indicator ${task.status == "Completed" ? "completed" : "in-progress"}`}
                      title={`${task.title}: ${task.status == "Completed" ? "Complete" : "In Progress"}`}
                    ></div>
                  ))}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
