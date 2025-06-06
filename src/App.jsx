"use client"

import { useState, useEffect } from "react"
import "./App.css"

// Component imports 
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import TeamSelection from "./pages/TeamSelection"
import TeamDashboard from "./pages/TeamDashBoard"
import CreateTeamModal from "./components/CreateTeamModal"
import JoinTeamModal from "./components/JoinTeamModal"
import NavBar from "./components/NavBar"

// Other imports
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

function App() {
  // State to track which view to show
  const [currentView, setCurrentView] = useState("login") // "login", "register", "dashboard", "teamSelection", "teamDashboard"
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("user-info") ? true : false)
  const [darkMode, setDarkMode] = useState(false)

  // State to track the selected team
  const [selectedTeam, setSelectedTeam] = useState(null)

  // State for modals
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)




  // State for notifications (personal alerts like invites, file uploads, etc.)
  // BACKEND INTEGRATION: Replace with API call to fetch user notifications
  const [notifications, setNotifications] = useState([])

  // State for recent activities (team-wide updates)
  // BACKEND INTEGRATION: Replace with API call to fetch recent activities
  const [recentActivities, setRecentActivities] = useState([])

  // State for recent updates (team progress)
  // BACKEND INTEGRATION: Replace with API call to fetch team progress updates
  const [recentUpdates, setRecentUpdates] = useState([])

  // State for teams
  // BACKEND INTEGRATION: Replace with API call to fetch user's teams
  const [teams, setTeams] = useState([])

  // Mock current user (in a real app, this would come from authentication)
  // BACKEND INTEGRATION: Replace with actual user data from authentication
  const [currentUser, setCurrentUser] = useState({
    id: "",
    name: "",
    email: "",
    initials: "",
  })

  // Get user
  useEffect(() => {
    // Check if user info is stored in localStorage


  }, [])

  // Apply dark mode class to body only when authenticated (not on login/register)
  useEffect(() => {

    if (isAuthenticated) {
      fetchInitialData()
      const userInfo = JSON.parse(localStorage.getItem("user-info")) || null
      if (userInfo && userInfo.user) {
        const user = {
          id: userInfo.user.id,
          username: userInfo.user.name || userInfo.user.name || "User",
          email: userInfo.user.email || "",
          profilePic: userInfo.user.profile_picture || "",
          initials:
            (userInfo.user.name
              ? userInfo.user.name.substring(0, 2).toUpperCase()
              : userInfo.user.name
                ? userInfo.user.name.substring(0, 2).toUpperCase()
                : "NU"),
        }

        setCurrentUser(user)
      }


      setCurrentView("dashboard")
    } else if (isAuthenticated && darkMode) {
      document.body.classList.add("dark-mode")
    } else {
      document.body.classList.remove("dark-mode")
    }
  }, [darkMode, isAuthenticated])

  // Function to remove a notification
  // BACKEND INTEGRATION: Add API call to delete notification
  const removeNotification = (notificationId) => {
    // API call would go here: deleteNotification(notificationId)
    setNotifications(notifications.filter((notification) => notification.id !== notificationId))
  }

  // Handle navigation between views
  const handleNavigate = (view) => {
    setCurrentView(view)
  }

  // Handle login with proper error handling
  const handleLogin = async (credentials) => {
    try {
      console.log("Attempting login with:", credentials)

      // Make API call to the Laravel backend
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: credentials.username,
          password: credentials.password,
        }),
      })

      // Parse the response data
      const data = await response.json()
      console.log("Login response:", data)

      // Check if the response contains an error message
      // if (data.error || data.message === "Email or password is not matched") {
      //   throw new Error(data.error || data.message || "Invalid credentials")
      // }
      if (data.errors) {
        throw new Error(data.message)
      }

      // Set user data from the response
      let userData = null
      if (data.user) {
        userData = data.user
      } else if (data.data && data.data.user) {
        userData = data.data.user
      } else {
        throw new Error(data.error || data.message || "User data not found")
        // If no user data is found, use the data object itself
        // userData = data
      }
      const user = {
        id: userData.id || "user1",
        username: userData.name || userData.name || "User",
        email: userData.email || "",
        profilePic: userData.profile_picture || "",
        initials:
          (userData.name
            ? userData.name.substring(0, 2).toUpperCase()
            : userData.name
              ? userData.name.substring(0, 2).toUpperCase()
              : "NU"),
      }
      localStorage.setItem("user-info", JSON.stringify(data))
      console.log("Setting user data:", user)
      setCurrentUser(user)
      setIsAuthenticated(true)
      setCurrentView("dashboard")

      // After login, fetch initial data
      fetchInitialData()
    } catch (error) {
      console.error("Login error:", error)
      // Show the error message to the user
      withReactContent(Swal).fire({
        icon: "error",
        title: "Login Failed",
        text: error || "An error occurred during login.",
      })
    }
  }

  // Simulate fetching initial data after login
  // BACKEND INTEGRATION: Replace with actual API calls
  const fetchInitialData = () => {
    // These would be separate API calls in a real app
    fetchUserTeams()
    fetchNotifications()
    fetchRecentActivities()
    fetchRecentUpdates()

  }


  // BACKEND INTEGRATION: Replace with API call
  const fetchUserTeams = async () => {
    // API call would go here: const teamsData = await fetchTeams(currentUser.id)
    // console.log("Fetching teams for user:", currentUser.id)
    const user = JSON.parse(localStorage.getItem("user-info"))
    const response = await fetch(`http://localhost:8000/api/team-list/${user.user.id}`)
    const teamsData = await response.json()
    console.log("Fetched teams:", teamsData.teams)
    setTeams(teamsData.teams)


    return teamsData.teams

  }

  const fetchAllTeams = async () => {
    const response = await fetch("http://localhost:8000/api/all-teams")
    const teamsData = await response.json()
    console.log("Fetched all teams:", teamsData.teams)
    return teamsData.teams
  }


  // BACKEND INTEGRATION: Replace with API call
  const fetchNotifications = async () => {
    // const response = await fetch(`http://localhost:8000/api/user-notifications/${currentUser.id}`)
    // const notificationsData = await response.json()
    // console.log("Fetched notifications:", notificationsData)
    // setNotifications(notificationsData)
    setNotifications([])
  }

  // BACKEND INTEGRATION: Replace with API call
  const fetchRecentActivities = async () => {
    // console.log("id:", currentUser.id)
    const user = JSON.parse(localStorage.getItem("user-info"))
    const response = await fetch(`http://localhost:8000/api/user-team-activities/${user.user.id}`)
    const activitiesData = await response.json()
    console.log("Fetched activities:", activitiesData.activities)
    setRecentActivities(activitiesData.activities)
  }

  // BACKEND INTEGRATION: Replace with API call
  const fetchRecentUpdates = () => {
    // API call would go here: const updatesData = await fetchTeamUpdates()
    setRecentUpdates([])

  }

  // Handle registration
  // BACKEND INTEGRATION: Replace with actual user registration
  const handleRegister = async (userData) => {
    try {
      // API call to the Laravel backend
      const response = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: userData.email,
          name: userData.name,
          password: userData.password,
          password_confirmation: userData.passwordConfirmation
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Registration error:", errorData)
        throw new Error(errorData.message || "Registration failed")
      }

      const data = await response.json()
      console.log("Registration successful:", data)

      // Store the token in localStorage
      localStorage.setItem("user-info", JSON.stringify(data))

      // Set user data from the response - handle different response structures
      const responseUserData = data.user || data
      const user = {
        id: responseUserData.id || Date.now().toString(), // Fallback ID if not provided
        username: responseUserData.name || responseUserData.name || "User",
        email: responseUserData.email || "",
        initials:
          (responseUserData.name ? responseUserData.name.substring(0, 2).toUpperCase() : "NU"),
      }

      setCurrentUser(user)
      setIsAuthenticated(true)
      setCurrentView("dashboard")


      // After registration, fetch initial data
      fetchInitialData()
    } catch (error) {
      console.error("Registration error:", error)
      // You might want to show an error message to the user here
      alert(error.message || "Registration failed. Please try again.")
    }
  }

  // Function to handle team selection
  const handleManageTeam = (team) => {
    setSelectedTeam(team)
    setCurrentView("teamDashboard")
  }

  // Function to go back to team selection
  const handleBackToTeams = () => {
    setCurrentView("teamSelection")
  }

  // Function to go to teams from dashboard
  const handleGoToTeams = () => {
    setCurrentView("teamSelection")
  }

  // Function to toggle dark mode
  const toggleDarkMode = (isDark) => {
    setDarkMode(isDark)
  }

  // Function to create a new team
  // BACKEND INTEGRATION: Add API call to create team
  const handleCreateTeam = async (teamData) => {
    try {
      // console.log(teamData)
      // console.log(currentUser)
      const user = localStorage.getItem("user-info")
      const userInfo = JSON.parse(user)
      console.log("Current user:", userInfo)
      // API call would go here: const newTeam = await createTeam({ ...teamData, leaderId: currentUser.id })
      const response = await fetch("http://localhost:8000/api/team-store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...teamData,
          leader_id: userInfo.user.id,
          due_date: teamData.dueDate ? new Date(teamData.dueDate).toISOString() : null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Team creation error:", errorData)
        throw new Error(errorData.message || "Team creation failed")
      }



      const data = await response.json()
      console.log("Team created successfully:", data)

      fetchUserTeams()

      withReactContent(Swal).fire({
        icon: "success",
        title: "Team Created",
        text: `Successfully created team: ${teamData.name}`,
      })

      // Add the leader to the members array
      // const teamMembers = [
      //   {
      //     id: currentUser.id,
      //     name: currentUser.name,
      //     initials: currentUser.initials,
      //     task: "Team Leader",
      //     isLeader: true,
      //   },
      // ]

      // const newTeam = {
      //   id: Date.now().toString(), // Use a timestamp as temporary ID
      //   name: teamData.teamName,
      //   leader: currentUser.name,
      //   leaderId: currentUser.id,
      //   members: teamMembers,
      //   dueDate: formatDate(teamData.dueDate) || "Not set",
      //   tasks: [],
      //   progress: 0, // No tasks yet
      // }



      // setTeams([...teams, newTeam])

      // Add a new activity for team creation
      // const newActivity = {
      //   id: Date.now().toString(),
      //   team: teamData.teamName,
      //   message: "Team created",
      //   timeAgo: "Just now",
      // }
      // setRecentActivities([newActivity, ...recentActivities])

      setShowCreateModal(false)


    } catch (error) {
      console.error("Team creation error:", error)
      withReactContent(Swal).fire({
        icon: "error",
        title: "Team Creation Failed",
        text: error.message || "An error occurred during team creation.",
      })

    }


  }

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return ""

    const date = new Date(dateString)
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]

    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
  }

  function timeAgo(dateString) {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now - date) / 1000)

    if (seconds < 60) return "just now"
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`
    const weeks = Math.floor(days / 7)
    if (weeks < 4) return `${weeks} week${weeks > 1 ? "s" : ""} ago`
    const months = Math.floor(days / 30)
    if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`
    const years = Math.floor(days / 365)
    return `${years} year${years > 1 ? "s" : ""} ago`
  }

  // Function to join a team
  // BACKEND INTEGRATION: Add API call to join team
  const handleJoinTeam = async (joinData) => {
    try {
      const user = JSON.parse(localStorage.getItem("user-info"))
      const teams = await fetchAllTeams()

      // API call would go here: const result = await joinTeam(joinData.teamName, currentUser.id, joinData.nickname)

      // Find the team by name/code
      // const teamToJoin = teams.find((team) => team.name.toLowerCase() === joinData.teamName.toLowerCase())

      const teamToJoin = teams.find((team) => team.name.toLowerCase() === joinData.teamName.toLowerCase())
      console.log(teamToJoin)

      if (!teamToJoin) {
        throw new Error(`Team not found: ${joinData.teamName}`)
      }

      const isAlreadyMember = teamToJoin.members.some((member) => member.id === user.user.id)
      const isLeader = teamToJoin.leader_id === user.user.id

      if (isAlreadyMember) {
        return withReactContent(Swal).fire({
          icon: "info",
          title: "Already a Member",
          text: `You are already a member of team: ${joinData.teamName}`,
        })
      } else if (isLeader) {
        return withReactContent(Swal).fire({
          icon: "info",
          title: "Already a Member",
          text: `You are already the leader of team: ${joinData.teamName}`,
        })
      }

      const response = await fetch(`http://localhost:8000/api/team-join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          team_name: joinData.teamName,
          user_id: user.user.id,
          // nickname: joinData.nickname,
        }),
      })

      const data = await response.json()
      console.log(data)

      if (data.errors) {
        throw new Error(data.message || "Failed to join team")
      }

      // const newActivity = {
      //   id: Date.now().toString(),
      //   team: teamToJoin.id,
      //   message: `${currentUser.name} joined the team`,
      //   timeAgo: "Just now" ,
      // }

      // const activityResponse = await fetch(`http://localhost:8000/api/activity/${teamToJoin.id}`, {
      //   method: "GET",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Accept: "application/json",
      //   },
      // })

      const newActivity = data.activity
      setRecentActivities(newActivity)

      withReactContent(Swal).fire({
        icon: "success",
        title: "Team Joined",
        text: `Successfully joined team: ${joinData.teamName}`,
      })

      // if (teamToJoin) {
      //   // Check if user is already a member
      //   const isAlreadyMember = teamToJoin.members.some((member) => member.id === currentUser.id)

      //   if (!isAlreadyMember) {
      //     // Add current user to the team
      //     const updatedTeams = teams.map((team) => {
      //       if (team.id === teamToJoin.id) {
      //         return {
      //           ...team,
      //           members: [
      //             ...team.members,
      //             {
      //               id: currentUser.id,
      //               name: joinData.nickname || currentUser.name,
      //               initials: currentUser.initials,
      //               task: "Not assigned",
      //               isLeader: false,
      //             },
      //           ],
      //         }
      //       }
      //       return team
      //     })

      //     setTeams(updatedTeams)

      // Add a new activity for joining a team
      // const newActivity = {
      //   id: Date.now().toString(),
      //   team: teamToJoin.name,
      //   message: `${currentUser.name} joined the team`,
      //   timeAgo: "Just now",
      // }
      // setRecentActivities([newActivity, ...recentActivities])

      //     alert(`Successfully joined team: ${joinData.teamName}`)
      //   } else {
      //     alert(`You are already a member of team: ${joinData.teamName}`)
      //   }
      // } else {
      //   alert(`Team not found: ${joinData.teamName}`)
      // }
      setShowJoinModal(false)
      let newTeams = await fetchUserTeams()
      setTeams(newTeams)
    } catch (error) {
      console.error("Error joining team:", error)
      withReactContent(Swal).fire({
        icon: "error",
        title: "Join Team Failed",
        text: error.message || "An error occurred while trying to join the team.",
      })
    }

  }

  // Function to delete a team
  // BACKEND INTEGRATION: Add API call to delete team
  const handleDeleteTeam = (teamId) => {
    // API call would go here: await deleteTeam(teamId)

    const teamToDelete = teams.find((team) => team.id === teamId)
    setTeams(teams.filter((team) => team.id !== teamId))

    if (teamToDelete) {
      // Add a new activity for team deletion
      const newActivity = {
        id: Date.now().toString(),
        team: teamToDelete.name,
        message: "Team deleted",
        timeAgo: "Just now",
      }
      setRecentActivities([newActivity, ...recentActivities])
    }

    if (selectedTeam && selectedTeam.id === teamId) {
      setCurrentView("teamSelection")
    }
  }

  // Function to add a member to a team
  // BACKEND INTEGRATION: Add API call to add team member
  const handleAddMember = (teamId, memberName) => {
    // API call would go here: await addTeamMember(teamId, memberName)

    setTeams(
      teams.map((team) => {
        if (team.id === teamId) {
          // Create a new member object
          const nameParts = memberName.split(" ")
          const initials = nameParts
            .map((part) => part[0])
            .join("")
            .toUpperCase()
          const newMember = {
            id: `member-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: memberName,
            initials: initials,
            task: "Not assigned",
            isLeader: false,
          }

          // Return updated team with new member
          return {
            ...team,
            members: [...team.members, newMember],
          }
        }
        return team
      }),
    )

    // Add a notification for the new member
    const team = teams.find((t) => t.id === teamId)
    if (team) {
      const newNotification = {
        id: Date.now().toString(),
        type: "invite",
        team: team.name,
        message: `${memberName} has been invited to the team`,
        timeAgo: "Just now",
      }
      setNotifications([newNotification, ...notifications])

      // Add an activity for adding a member
      const newActivity = {
        id: (Date.now() + 1).toString(),
        team: team.name,
        message: `${memberName} was invited to the team`,
        timeAgo: "Just now",
      }
      setRecentActivities([newActivity, ...recentActivities])
    }

    // Update the selected team if it's the one being modified
    if (selectedTeam && selectedTeam.id === teamId) {
      const updatedTeam = teams.find((team) => team.id === teamId)
      if (updatedTeam) {
        setSelectedTeam(updatedTeam)
      }
    }
  }

  // Function to assign a task to a team member
  // BACKEND INTEGRATION: Add API call to assign task
  const handleAssignTask = async (teamId, taskData) => {
    console.log(taskData)
    // API call would go here: await assignTask(teamId, taskData)
    const response = await fetch(`http://localhost:8000/api/task-assign`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        team_id: teamId,
        title: taskData.title,
        due_date: taskData.due_date ? new Date(taskData.due_date).toISOString() : null,
        user_id: taskData.user_id,
      }),
    })
    const data = await response.json()
    console.log("Task assigned successfully:", data)

    // API call would go here: await assignTask(teamId, taskData)

    // setTeams(
    //   teams.map((team) => {
    //     if (team.id === teamId) {
    //       // Create a new task
    //       const newTask = {
    //         id: `task-${Date.now()}`,
    //         title: taskData.title,
    //         dueDate: taskData.dueDate,
    //         completed: false,
    //         assigneeId: taskData.assigneeId,
    //       }

    //       // Update the member's task
    //       const updatedMembers = team.members.map((member) => {
    //         if (member.id === taskData.assigneeId) {
    //           return {
    //             ...member,
    //             task: taskData.title,
    //           }
    //         }
    //         return member
    //       })

    //       // Calculate new progress
    //       const updatedTasks = [...team.tasks, newTask]
    //       const completedTasks = updatedTasks.filter((task) => task.completed).length
    //       const totalTasks = updatedTasks.length
    //       const newProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    //       // Return updated team
    //       return {
    //         ...team,
    //         tasks: updatedTasks,
    //         members: updatedMembers,
    //         progress: newProgress,
    //       }
    //     }
    //     return team
    //   }),
    // )

    // // Add an activity for task assignment
    // const team = teams.find((t) => t.id === teamId)
    // const assignee = team?.members.find((m) => m.id === taskData.assigneeId)

    // if (team && assignee) {
    //   const newActivity = {
    //     id: Date.now().toString(),
    //     team: team.name,
    //     chapter: taskData.title,
    //     message: `Task assigned to ${assignee.name}`,
    //     timeAgo: "Just now",
    //   }
    //   setRecentActivities([newActivity, ...recentActivities])

    //   // Update the team progress in recent updates
    //   updateTeamProgress(team.id, team.name)
    // }

    // // Update the selected team if it's the one being modified
    // if (selectedTeam && selectedTeam.id === teamId) {
    //   const updatedTeam = teams.find((team) => team.id === teamId)
    //   if (updatedTeam) {
    //     setSelectedTeam(updatedTeam)
    //   }
    // }
  }

  // Function to handle file upload for a task
  // BACKEND INTEGRATION: Add API call to upload file
  const handleFileUpload = async (teamId, taskId, submissionData) => {
    // API call would go here: await uploadTaskSubmission(teamId, taskId, submissionData)
    console.log("submission: ", submissionData)
    console.log("id: ", teamId)

    const formData = new FormData()
    formData.append("task_id", taskId)
    formData.append("team_id", teamId)
    formData.append("user_id", currentUser.id)
    formData.append("submission", submissionData.file)

    const response = await fetch(`http://localhost:8000/api/upload`, {
      method: "POST",
      body: formData,
      headers: {
        "Accept": "application/json",
      },
    })
    const data = await response.json()
    console.log("File upload response:", data)

    if (data.response === "success") {
      // Show success message
      withReactContent(Swal).fire({
        icon: "success",
        title: "File Uploaded",
        text: "Your file has been uploaded successfully.",
      })
    }

    // setTeams(
    //   teams.map((team) => {
    //     if (team.id === teamId) {
    //       // Update the task with the submission data
    //       const updatedTasks = team.tasks.map((task) =>
    //         task.id === taskId ? { ...task, submission: submissionData } : task,
    //       )

    //       // Add a notification about the file upload
    //       const task = team.tasks.find((t) => t.id === taskId)
    //       const member = team.members.find((m) => m.id === currentUser.id)

    //       if (task && member) {
    //         const newNotification = {
    //           id: Date.now().toString(),
    //           type: "upload",
    //           team: team.name,
    //           message: `${member.name} uploaded a ${submissionData.type === "file" ? "file" : "link"} for ${task.title}`,
    //           timeAgo: "Just now",
    //         }

    //         setNotifications([newNotification, ...notifications])

    //         // Add an activity for file upload
    //         const newActivity = {
    //           id: (Date.now() + 1).toString(),
    //           team: team.name,
    //           chapter: task.title,
    //           message: `${member.name} uploaded a submission`,
    //           timeAgo: "Just now",
    //         }
    //         setRecentActivities([newActivity, ...recentActivities])
    //       }

    //       return {
    //         ...team,
    //         tasks: updatedTasks,
    //       }
    //     }
    //     return team
    //   }),
    // )

    // // Update the selected team if it's the one being modified
    // if (selectedTeam && selectedTeam.id === teamId) {
    //   const updatedTeam = teams.find((team) => team.id === teamId)
    //   if (updatedTeam) {
    //     setSelectedTeam(updatedTeam)
    //   }
    // }
  }

  // Function to toggle task completion status
  // BACKEND INTEGRATION: Add API call to update task status
  const handleToggleTaskCompletion = async (teamId, taskId, completed) => {
    // API call would go here: await updateTaskStatus(teamId, taskId, completed)
    console.log(`Toggling task ${taskId} completion to ${completed} for team ${teamId}`)

    const response = await fetch(`http://localhost:8000/api/task-update/${taskId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        // team_id: teamId,
        task: taskId,
        // completed: completed,
      }),
    })
    const data = await response.json()
    console.log("Task status update response:", data)
    withReactContent(Swal).fire({
      icon: "success",
      title: "Task Status Updated",
      text: `Task has been marked as ${completed ? "complete" : "incomplete"}.`,
    })
    // console.log(d)

    // Update the teams state with the new task status
    const user = JSON.parse(localStorage.getItem("user-info"))
    const _response = await fetch(`http://localhost:8000/api/team-list/${user.user.id}`)
    const teamsData = await _response.json()
    console.log("Fetched teams:", teamsData.teams)
    setTeams(teamsData.teams)


    // Update the selected team if it's the one being modified
    if (selectedTeam && selectedTeam.id === teamId) {
      const updatedTeam = teamsData.teams.find((team) => team.id === teamId)
      if (updatedTeam) {
        setSelectedTeam(updatedTeam)
      }
    }

    // Update the team progress in recent updates
    // const team = updatedTeams.find((t) => t.id === teamId)
    // if (team) {
    //   // Ensure we update the team progress in recent updates
    //   updateTeamProgress(teamId, team.name)

    //   // Add an activity for task status change
    //   const task = team.tasks.find((t) => t.id === taskId)
    //   if (task) {
    //     const newActivity = {
    //       id: Date.now().toString(),
    //       team: team.name,
    //       chapter: task.title,
    //       message: `Task marked as ${completed ? "complete" : "incomplete"}`,
    //       timeAgo: "Just now",
    //     }
    //     setRecentActivities([newActivity, ...recentActivities.slice(0, 3)])
    //   }
    // }

  }

  // Function to update team progress in recent updates
  const updateTeamProgress = (teamId, teamName) => {
    const team = teams.find((t) => t.id === teamId)
    if (!team) return

    // Calculate completed and total tasks
    const completedTasks = team.tasks.filter((task) => task.completed).length
    const totalTasks = team.tasks.length

    // Find if this team already has an update
    const existingUpdateIndex = recentUpdates.findIndex((update) => update.team === teamName)

    if (existingUpdateIndex !== -1) {
      // Update existing entry
      const updatedRecentUpdates = [...recentUpdates]
      updatedRecentUpdates[existingUpdateIndex] = {
        ...updatedRecentUpdates[existingUpdateIndex],
        progress: team.progress,
        completedTasks: completedTasks,
        totalTasks: totalTasks,
      }
      setRecentUpdates(updatedRecentUpdates)
    } else {
      // Add new entry and limit to 9 items
      const newUpdate = {
        id: Date.now().toString(),
        team: teamName,
        chapter: "Overall Progress",
        progress: team.progress,
        completedTasks: completedTasks,
        totalTasks: totalTasks,
      }
      setRecentUpdates([newUpdate, ...recentUpdates.slice(0, 8)])
    }
  }

  // Function to update user settings
  // BACKEND INTEGRATION: Add API call to update user settings
  const updateUserSettings = async (updatedUser, isDarkMode) => {
    // API call would go here: await updateUserProfile(currentUser.id, updatedUser)
    const formData = new FormData()
    formData.append("profile_picture", updatedUser.profilePic)
    const response = await fetch(`http://localhost:8000/api/settings/${currentUser.id}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData
    })

    const user_response = await fetch(`http://localhost:8000/api/user/${currentUser.id}`)
    const updatedUserData = await user_response.json()

    // const user = {
    //   name: updatedUserData.name,
    //   email: updatedUserData.email,
    //   profilePic: updatedUserData.profile_picture || "",
    //   initials: updatedUserData.name
    //     ? updatedUserData.name.substring(0, 2).toUpperCase()
    //     : "NU",
    // }
    const userInfo = JSON.parse(localStorage.getItem("user-info") || "{}")

    // Merge the updated user fields
    const updatedUserInfo = {
      ...userInfo,
      user: {
        ...updatedUserData, // your new user data from backend
      },
    }

    localStorage.setItem("user-info", JSON.stringify(updatedUserInfo))
    const user = {
      username: updatedUserData.name || "User",
      email: updatedUserData.email || "",
      profilePic: updatedUserData.profile_picture || "",
      initials:
        (updatedUserData.name
          ? updatedUserData.name.substring(0, 2).toUpperCase()
          : "NU"),
    }

    setCurrentUser({ ...currentUser, ...user })
    setDarkMode(isDarkMode)
  }

  // Get user's teams
  const getUserTeams = () => {
    // return teams 
    return teams.filter((team) => team.members.some((member) => member.id === currentUser.id))
  }

  // Render the appropriate view
  const renderView = () => {
    switch (currentView) {
      case "login":
        return <Login onLogin={handleLogin} onRegisterClick={() => setCurrentView("register")} />
      case "register":
        return <Register onRegister={handleRegister} onLoginClick={() => setCurrentView("login")} />
      case "dashboard":
        return (
          <Dashboard
            onGoToTeams={handleGoToTeams}
            notifications={notifications}
            onRemoveNotification={removeNotification}
            recentActivities={recentActivities}
            recentUpdates={recentUpdates}
            currentUser={currentUser}
            onNavigate={handleNavigate}
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
            updateUserSettings={updateUserSettings}
            userTeams={getUserTeams()}
            onManageTeam={handleManageTeam}
            teams={teams}
            formatDate={formatDate}
            timeAgo={timeAgo}
          />
        )
      case "teamSelection":
        return (
          <>
            <NavBar
              currentUser={currentUser}
              currentPage="teamSelection"
              onNavigate={handleNavigate}
              notifications={notifications}
              onRemoveNotification={removeNotification}
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
              updateUserSettings={updateUserSettings}
            />

            <div className="main-content">
              <TeamSelection
                teams={teams}
                onManageTeam={handleManageTeam}
                onCreateTeam={() => setShowCreateModal(true)}
                onJoinTeam={() => setShowJoinModal(true)}
                onDeleteTeam={handleDeleteTeam}
                currentUser={currentUser}
                formatDate={formatDate}
              />
            </div>
          </>
        )
      case "teamDashboard":
        return (
          <>
            <NavBar
              currentUser={currentUser}
              currentPage="teamDashboard"
              onNavigate={handleNavigate}
              notifications={notifications}
              onRemoveNotification={removeNotification}
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
              updateUserSettings={updateUserSettings}
            />
            <div className="main-content">
              <TeamDashboard
                team={selectedTeam}
                onBackToTeams={handleBackToTeams}
                currentUser={currentUser}
                onAddMember={(memberName) => handleAddMember(selectedTeam.id, memberName)}
                onAssignTask={(taskData) => handleAssignTask(selectedTeam.id, taskData)}
                onFileUpload={(taskId, submissionData) => handleFileUpload(selectedTeam.id, taskId, submissionData)}
                formatDate={formatDate}
                onToggleTaskCompletion={(taskId, completed) =>
                  handleToggleTaskCompletion(selectedTeam.id, taskId, completed)
                }
                handleToggleTaskCompletion={handleToggleTaskCompletion}
              />
            </div>
          </>
        )
      default:
        return <Login onLogin={handleLogin} onRegisterClick={() => setCurrentView("register")} />
    }
  }

  return (
    <div className={`task-flow ${isAuthenticated && darkMode ? "dark-mode" : ""}`}>
      {renderView()}

      {/* Create Team Modal */}
      {showCreateModal && <CreateTeamModal onClose={() => setShowCreateModal(false)} onSubmit={handleCreateTeam} />}

      {/* Join Team Modal */}
      {showJoinModal && <JoinTeamModal onClose={() => setShowJoinModal(false)} onSubmit={handleJoinTeam} />}
    </div>
  )
}

export default App
