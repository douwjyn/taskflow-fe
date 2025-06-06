"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Upload, UserPlus, X } from "../components/icons"
import FileUploadModal from "../components/FileUploadModal"
import FileViewModal from "../components/FileViewModal"

export default function TeamDashboard({
  team,
  onBackToTeams,
  currentUser,
  onAddMember,
  onAssignTask,
  onFileUpload,
  onFileView,
  formatDate,
  handleToggleTaskCompletion
}) {
  // State for tasks
  const [cancelFile, setCancelFile] = useState(false)
  const [tasks, setTasks] = useState([])

  // Update tasks when team changes
  useEffect(() => {
    if (team && team.tasks) {
      // Map team tasks to include assignee information
      const teamTasks = team.tasks.map((task) => {
        console.log("task", task)
        const assignee = team.members.find((member) => member.id === task.users[0].id) || {
          initials: "TM",
          name: "Team Member",
        }

        return {
          id: task.id,
          title: task.title,
          dueDate: formatDate(task.due_date) || formatDate(team.due_date),
          completed: task.status == "Completed",
          assignee: (assignee.name ? assignee.name.substring(0, 2).toUpperCase() : "NU"),
          assigneeName: assignee.name,
          assigneeId: assignee.id,
          submission: task.submission || null,
          submitted_date: task.submitted_date || null,
        }
      })

      setTasks(teamTasks)
    }
  }, [team, cancelFile])

  // State for modals
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [showAddMemberModal, setShowAddMemberModal] = useState(false)
  const [showFileUploadModal, setShowFileUploadModal] = useState(false)
  const [showFileViewModal, setShowFileViewModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)

  // State for form inputs
  const [selectedMember, setSelectedMember] = useState("")
  const [selectedMemberId, setSelectedMemberId] = useState("")
  const [taskTitle, setTaskTitle] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [newMemberName, setNewMemberName] = useState("")

  // Check if current user is the team leader
  const isTeamLeader = team && team.leader.id === currentUser.id

  // Function to toggle task completion status
  const toggleTaskCompletion = async(taskId) => {
    const teamId = team.id
    handleToggleTaskCompletion(teamId, taskId, !tasks.find((task) => task.id === taskId).completed)
    // In a real app, you would also update this in the parent component/database
    // const updatedTasks = await handleToggleTaskCompletion(teamId, taskId, !tasks.find((task) => task.id === taskId).completed)
    // setTasks(updatedTasks)
    // console.log("Updated tasks:", updatedTasks)

    // const updatedTasks = tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task))
  }

  // Function to handle assign task form submission
  const handleAssignTaskSubmit = (e) => {
    e.preventDefault()

    // Find the selected member to get their information
    const member = team.members.find((m) => m.id === selectedMemberId)

    // Create task data
    const taskData = {
      title: taskTitle,
      due_date: dueDate,
      user_id: selectedMemberId,
      assigneeName: member ? member.name : "",
    }

    // Call the parent component's function to assign the task
    onAssignTask(taskData)

    // Reset form and close modal
    setSelectedMember("")
    setSelectedMemberId("")
    setTaskTitle("")
    setDueDate("")
    setShowAssignModal(false)
  }

  // Function to handle add member form submission
  const handleAddMemberSubmit = (e) => {
    e.preventDefault()

    // Call the parent component's function to add the member
    onAddMember(newMemberName)

    // Reset form and close modal
    setNewMemberName("")
    setShowAddMemberModal(false)
  }

  // Function to handle file upload
  const handleFileUpload = (taskId) => {
    // Find the task to get its title
    const task = tasks.find((t) => t.id === taskId)
    if (task) {
      setSelectedTask(task)
      setShowFileUploadModal(true)
    }
  }

  // Function to handle file view
  const handleFileView = (taskId) => {
    // Find the task to get its submission
    const task = tasks.find((t) => t.id === taskId)
    if (task && task.submission) {
      setSelectedTask(task)
      setShowFileViewModal(true)
    } else {
      alert("No submission available for this task.")
    }
  }

  // Function to handle file upload submission
  const handleFileUploadSubmit = (submissionData) => {
    // Update the task with the submission data
    const updatedTasks = tasks.map((task) =>
      task.id === selectedTask.id ? { ...task, submission: submissionData } : task,
    )
    setTasks(updatedTasks)

    // Call the parent component's function to update the task
    if (onFileUpload) {
      onFileUpload(selectedTask.id, submissionData)
    }

    // Close the modal
    setShowFileUploadModal(false)
  }

  

  // Function to handle cancellation of file upload
  const handleCancelUpload = async (taskId) => {
    if (window.confirm("Are you sure you want to remove your submission? This action cannot be undone.")) {
      const response = await fetch(`http://localhost:8000/api/upload/${taskId}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        console.error("Failed to remove submission:", response.statusText)
        return
      }

      // Update the local tasks state
      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, submission: null, submitted_date: null } : task
      )
      setTasks(updatedTasks)
      console.log("updated:", updatedTasks)

      // Call the parent component's function to update the task if needed
      if (onFileUpload) {
        onFileUpload(taskId, null)
      }
    }
  }

  // If no team is selected, show a message
  if (!team) {
    return <div>No team selected</div>
  }

  return (
    <div className="team-dashboard">
      <div className="dashboard-header">
        <button className="btn-back" onClick={onBackToTeams}>
          <ArrowLeft className="back-icon" />
          Back to Teams
        </button>
      </div>

      <h2 className="team-title">{team.name}</h2>

      {/* Current Tasks Section */}
      <div className="tasks-section">
        <div className="section-header">
          <h3 className="section-title">Current Tasks</h3>
          {isTeamLeader && (
            <div className="leader-actions">
              <button className="btn btn-primary" onClick={() => setShowAddMemberModal(true)}>
                <UserPlus className="btn-icon" />
                Add Member
              </button>
              <button className="btn btn-primary" onClick={() => setShowAssignModal(true)}>
                Assign Task
              </button>
            </div>
          )}
        </div>

        <div className="tasks-list">
          {tasks.length === 0 ? (
            <div className="no-tasks">No tasks assigned yet.</div>
          ) : (
            tasks.map((task) => {
              const isAssignedToCurrentUser = task.assigneeId === currentUser.id

              return (
                <div className="task-item" key={task.id}>
                  <div className="task-info">
                    <h4 className="task-title">{task.title}</h4>
                    <p className="task-date">Due: {task.dueDate}</p>
                    {!isTeamLeader && <p className="task-assignee">Assigned to: {task.assigneeName}</p>}
                    {task.submission && (
                      <div className="submission-indicator">
                        <span className="submission-badge">
                          {task.submission.type === "file" ? "File Uploaded" : "Google Docs Link"}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="task-actions">
                    {isAssignedToCurrentUser && !task.submission && (
                      <button className="btn btn-upload" onClick={() => handleFileUpload(task.id)}>
                        <Upload className="upload-icon" />
                        Upload
                      </button>
                    )}

                    {isAssignedToCurrentUser && task.submission && (
                      <button className="btn btn-cancel-upload" onClick={() => handleCancelUpload(task.id)}>
                        <X className="cancel-icon" />
                        Cancel Upload
                      </button>
                    )}

                    {isTeamLeader && task.submission && (
                      <button className="btn btn-view" onClick={() => handleFileView(task.id)}>
                        View File
                      </button>
                    )}
                    {isTeamLeader && (
                      <button className="btn btn-done" onClick={() => toggleTaskCompletion(task.id)}>
                        {task.completed ? "Mark as Incomplete" : "Mark as Done"}
                      </button>
                    )}

                    <span className={`task-status ${task.completed ? "status-complete" : "status-progress"}`}>
                      {task.completed ? "Complete" : "In Progress"}
                    </span>

                    <div className="task-avatar">
                      <div className="avatar-content">{task.assignee}</div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Team Members Section */}
      <div className="team-members-section">
        <h3 className="section-title">Team Members</h3>
        <div className="team-members-list">
          {team.members.map((member) => (
            <div className={`member-card ${member.id === currentUser.id ? "current-user-card" : ""}`} key={member.id}>
              <div className="member-avatar">
                <div className="avatar-content">{member.initials}</div>
              </div>
              <div className="member-info">
                <h4 className="member-name">
                  {member.name}
                  {member.id === currentUser.id && <span className="current-user-badge"> (You)</span>}
                </h4>
                <p className="member-task">{member.task}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Assign Task Modal - Only for team leader */}
      {showAssignModal && isTeamLeader && (
        <div className="modal-overlay">
          <div className="modal-content">
            <form onSubmit={handleAssignTaskSubmit}>
              <h2>Select Member</h2>
              <div className="form-group">
                <select
                  value={selectedMemberId}
                  onChange={(e) => {
                    const memberId = e.target.value
                    setSelectedMemberId(memberId)
                    const member = team.members.find((m) => m.id === memberId)
                    setSelectedMember(member ? member.name : "")
                  }}
                  required
                  className="form-control"
                >
                  <option value="" disabled>
                    Select Member
                  </option>
                  {team.members
                    .filter((member) => !member.isLeader)
                    .map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name}
                      </option>
                    ))}
                </select>
              </div>

              <h2>Task</h2>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Enter member's task"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  required
                  className="form-control"
                />
              </div>

              <h2>Due Date</h2>
              <div className="form-group">
                <input
                  type="date"
                  placeholder="Enter date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                  className="form-control"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-assign">
                  Assign Task
                </button>
              </div>
            </form>

            <button className="modal-close" onClick={() => setShowAssignModal(false)}>
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Add Member Modal - Only for team leader */}
      {showAddMemberModal && isTeamLeader && (
        <div className="modal-overlay">
          <div className="modal-content">
            <form onSubmit={handleAddMemberSubmit}>
              <h2>Add Team Member</h2>
              <div className="form-group">
                <label htmlFor="memberName">Member Name</label>
                <input
                  type="text"
                  id="memberName"
                  placeholder="Enter member's name"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  required
                  className="form-control"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-assign">
                  Add Member
                </button>
              </div>
            </form>

            <button className="modal-close" onClick={() => setShowAddMemberModal(false)}>
              &times;
            </button>
          </div>
        </div>
      )}

      {/* File Upload Modal */}
      {showFileUploadModal && selectedTask && (
        <FileUploadModal
          onClose={() => setShowFileUploadModal(false)}
          onSubmit={handleFileUploadSubmit}
          taskId={selectedTask.id}
          taskTitle={selectedTask.title}
        />
      )}
      {/* File View Modal */}
      {showFileViewModal && selectedTask && selectedTask.submission && (
        <FileViewModal
          onClose={() => setShowFileViewModal(false)}
          submission={selectedTask.submission}
          submitted_date={formatDate(selectedTask.submitted_date)}
          task_id={selectedTask.id}
          taskTitle={selectedTask.title}
        />
      )}
    </div>
  )
}
