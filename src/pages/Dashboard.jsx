"use client"
import { useState, useEffect } from "react"
import NavBar from "../components/NavBar"
import TasksModal from "../components/TasksModal"
import { Calendar, CheckCircle, Clock, Users } from "../components/icons"



export default function Dashboard({
  onGoToTeams,
  notifications,
  onRemoveNotification,
  recentActivities,
  recentUpdates,
  currentUser,
  onNavigate,
  darkMode,
  toggleDarkMode,
  updateUserSettings,
  userTeams,
  onManageTeam,
  teams,
  timeAgo,
  formatDate
}) {
  const [modalContent, setModalContent] = useState(null)
  const [completedTasksCount, setCompletedTasksCount] = useState(0)
  const [pendingTasksCount, setPendingTasksCount] = useState(0)
  const [activeTeamsCount, setActiveTeamsCount] = useState(0)
  const [upcomingDeadlinesCount, setUpcomingDeadlinesCount] = useState(0)
  const [allTasks, setAllTasks] = useState([]);
  const getAllTasks = async () => {
    const response = await fetch(`http://localhost:8000/api/tasks/${currentUser.id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()
    const { teams, tasks } = data

    const teamByTaskId = {}
    teams.forEach(team => {
      (team.tasks || []).forEach(task => {
        teamByTaskId[task.id] = team
      })
    })

    const _allTasks = (tasks || []).map(task => {
      const team = teamByTaskId[task.id]
      // If task.users is an array, take the first user as assignee
      const assignee = Array.isArray(task.users) && task.users.length > 0 ? task.users[0] : null

      return {
        id: task.id,
        title: task.title,
        team: team ? team.name : "Unknown Team",
        due_date: task.due_date || (team ? team.due_date : null),
        assignee: assignee ? assignee.name : "Unassigned",
        status: task.status
      }
    })
    return _allTasks
  }
  // Handle stat card clicks
  const handleActiveTeamsClick = () => {
    const userTeamsList = teams
      .filter((team) => team.members.some((member) => member.id === currentUser.id))
      .map((team) => ({
        title: team.name,
        team: `Leader: ${team.leader.name}`,
        due_date
          : team.due_date,
      }))


    setModalContent({
      title: "Your Active Teams",
      items: userTeamsList,
    })
  }

  const handleCompletedTasksClick = async () => {
    const response = await fetch(`http://localhost:8000/api/tasks/complete/${currentUser.id}`, {
      headers: { "Content-Type": "application/json" }
    });

    const completedTasks = await response.json();
    setModalContent({
      title: "Completed Tasks",
      items: completedTasks.completed_tasks,
    });

  }

  const handlePendingTasksClick = async () => {
    const response = await fetch(`http://localhost:8000/api/tasks/pending/${currentUser.id}`, {
      headers: { "Content-Type": "application/json" }
    });

    const pendingTasks = await response.json();
    setModalContent({
      title: "Pending Tasks",
      items: pendingTasks.pending_tasks,
    });
  }

  const handleUpcomingDeadlinesClick = async () => {
    // Get all tasks with due dates
    const tasksWithDeadlines = (await getAllTasks()).filter((task) => task.due_date)

    // Sort by due date (assuming due dates are in a format that can be compared)
    const sortedTasks = tasksWithDeadlines.sort((a, b) => {
      const dateA = new Date(a.due_date)
      const dateB = new Date(b.due_date)
      return dateA - dateB
    })


    setModalContent({
      title: "Upcoming Deadlines",
      items: sortedTasks,
    })
  }

  const closeModal = () => {
    setModalContent(null)
  }

  // Get counts for stat cards
  const userTeamsCount = teams.filter((team) => team.members.some((member) => member.id === currentUser.id)).length
 useEffect(() => {
    const fetchTaskCounts = async () => {
      if (!currentUser.id) return
      const response = await fetch(`http://localhost:8000/api/tasks/${currentUser.id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      const data = await response.json()
      const tasks = data.tasks || []
      setActiveTeamsCount(teams && teams.filter((team) => team.members.some((member) => member.id === currentUser.id)).length)
      setCompletedTasksCount(tasks.filter((task) => task.status === "Completed").length)
      setPendingTasksCount(tasks.filter((task) => task.status === "Pending").length)
      setUpcomingDeadlinesCount(tasks.filter((task) => task.due_date).length)
    }
    fetchTaskCounts()
  }, [currentUser.id])

  return (
    <div className="dashboard-container">
      <NavBar
        currentUser={currentUser}
        currentPage="dashboard"
        onNavigate={onNavigate}
        notifications={notifications}
        onRemoveNotification={onRemoveNotification}
        darkMode={darkMode}
        updateUserSettings={updateUserSettings}
      />

      <main className="dashboard-content">
        <div className="dashboard-full-width">
          {/* Welcome Section with Stats */}
          <div className="welcome-section">
            <div className="welcome-header">
              <div>
                <h1 className="dashboard-title">Welcome back, {currentUser.username}!</h1>
                <p className="dashboard-subtitle">Here's what's happening with your teams</p>
              </div>
              <div className="dashboard-actions">
                <button className="btn btn-primary btn-large" onClick={onGoToTeams}>
                  Go to Teams
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-cards">
              <div className="stat-card clickable" onClick={handleActiveTeamsClick}>
                <div className="stat-icon">
                  <Users />
                </div>
                <div className="stat-content">
                  <h3 className="stat-value">{userTeamsCount}</h3>
                  <p className="stat-label">Active Teams</p>
                </div>
              </div>

              <div className="stat-card clickable" onClick={handleCompletedTasksClick}>
                <div className="stat-icon">
                  <CheckCircle />
                </div>
                <div className="stat-content">
                  <h3 className="stat-value">{completedTasksCount}</h3>
                  <p className="stat-label">Completed Tasks</p>
                </div>
              </div>

              <div className="stat-card clickable" onClick={handlePendingTasksClick}>
                <div className="stat-icon">
                  <Clock />
                </div>
                <div className="stat-content">
                  <h3 className="stat-value">{pendingTasksCount}</h3>
                  <p className="stat-label">Pending Tasks</p>
                </div>
              </div>

              <div className="stat-card clickable" onClick={handleUpcomingDeadlinesClick}>
                <div className="stat-icon">
                  <Calendar />
                </div>
                <div className="stat-content">
                  <h3 className="stat-value">{upcomingDeadlinesCount}</h3>
                  <p className="stat-label">Upcoming Deadlines</p>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard sections */}
          <div className="dashboard-sections">
            {/* Recent Updates Section */}
            <div className="recent-updates-section">
              <h2 className="section-title">Recent Team Updates</h2>
              {recentUpdates.length === 0 ? (
                <div className="no-updates">No recent team updates</div>
              ) : (
                <div className="updates-grid">
                  {recentUpdates.slice(0, 9).map((update) => (
                    <div className="update-card" key={update.id}>
                      <div className="update-header">
                        <h3 className="update-team">{update.team_name}</h3>
                        <p className="update-chapter">{update.chapter}</p>
                      </div>
                      <div className="progress-container">
                        <div className="progress-bar" style={{ width: `${update.progress}%` }}></div>
                      </div>

                      {/* Task indicators similar to TaskHub */}
                      <div className="task-indicators">
                        {update.total_tasks > 0 ? (
                          Array.from({ length: update.total_tasks }).map((_, index) => (
                            <div
                              key={index}
                              className={`task-indicator ${index < update.completed_tasks ? "completed" : "in-progress"}`}
                            ></div>
                          ))
                        ) : (
                          <div className="no-tasks-indicator">No tasks</div>
                        )}
                      </div>

                      <div className="task-completion-text">
                        {update.completed_tasks || 0}/{update.total_tasks || 0} tasks complete
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Activity Section */}
            <div className="recent-activity-section">
              <h2 className="section-title">Recent Activity</h2>
              {recentActivities.length === 0 ? (
                <div className="no-activities">No recent activities</div>
              ) : (
                <div className="activity-list">
                  {recentActivities.slice(0, 4).map((activity) => (
                    <div className="activity-item" key={activity.id}>
                      <div className="activity-content">
                        <div>
                          <div className="activity-team">{activity.subject?.name || ''}</div>
                          <div className="activity-details">
                            {/* {activity.chapter && <span className="activity-chapter">{activity.chapter || 'Chapter: '}</span>} */}
                            {activity.description && <span className="activity-message">{activity.description}.</span>}
                          </div>
                        </div>
                        <div className="activity-time">{timeAgo(activity.created_at)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modal for displaying tasks or teams */}
      {modalContent && <TasksModal title={modalContent.title} items={modalContent.items} onClose={closeModal} formatDate={formatDate} />}
    </div>
  )
}
