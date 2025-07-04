import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"

// Add console log to help debug
console.log("Mounting React app...")

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

console.log("React app mounted")
